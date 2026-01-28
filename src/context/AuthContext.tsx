import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, googleProvider, ADMIN_EMAIL } from '../config/firebase'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Проверяем, настроен ли Firebase
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
      console.log('Firebase API Key exists:', !!apiKey && apiKey !== 'YOUR_API_KEY')
      console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID)
      
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        return { 
          success: false, 
          error: 'Firebase не настроен. Создайте файл .env с ключами Firebase.' 
        }
      }

      console.log('Attempting Google Sign In...')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Sign in successful:', result.user.email)
      const userEmail = result.user.email

      if (userEmail !== ADMIN_EMAIL) {
        await signOut(auth)
        return { success: false, error: `Доступ запрещён. Email ${userEmail} не является администратором.` }
      }

      return { success: true }
    } catch (error: unknown) {
      console.error('Auth error:', error)
      
      // Обрабатываем разные типы ошибок Firebase
      const firebaseError = error as { code?: string; message?: string }
      
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Окно авторизации было закрыто.' }
      }
      if (firebaseError.code === 'auth/popup-blocked') {
        return { success: false, error: 'Браузер заблокировал всплывающее окно. Разрешите popup для этого сайта.' }
      }
      if (firebaseError.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Запрос авторизации был отменён.' }
      }
      if (firebaseError.code === 'auth/network-request-failed') {
        return { success: false, error: 'Ошибка сети. Проверьте интернет-соединение.' }
      }
      if (firebaseError.code === 'auth/invalid-api-key') {
        return { success: false, error: 'Неверный API ключ Firebase. Проверьте настройки в .env файле.' }
      }
      if (firebaseError.code === 'auth/unauthorized-domain') {
        return { success: false, error: 'Домен не авторизован в Firebase. Добавьте localhost в Firebase Console → Authentication → Settings → Authorized domains.' }
      }
      
      return { success: false, error: `Ошибка авторизации: ${firebaseError.message || 'Попробуйте ещё раз.'}` }
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
