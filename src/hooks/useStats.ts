import { useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  increment,
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '../config/firebase'

export type StatsPeriod = '24h' | '7d' | '30d' | '365d' | 'all'

export interface SiteStats {
  pageViews: number
  uniqueVisitors: number
  lastUpdated: Date
}

export interface ContentStats {
  excursionsCount: number
  toursCount: number
  notesCount: number
}

export interface DailyStats {
  date: string
  pageViews: number
  uniqueVisitors: number
}

// Хук для трекинга просмотров страниц
export function usePageView() {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const statsRef = doc(db, 'stats', 'global')
        const dailyRef = doc(db, 'stats', `daily-${today}`)
        
        // Проверяем, был ли уже просмотр в этой сессии
        const sessionKey = `pageview-${today}`
        const hasVisited = sessionStorage.getItem(sessionKey)
        
        // Увеличиваем общий счётчик просмотров
        await setDoc(statsRef, {
          pageViews: increment(1),
          uniqueVisitors: hasVisited ? increment(0) : increment(1),
          lastUpdated: Timestamp.now()
        }, { merge: true })
        
        // Обновляем дневную статистику
        await setDoc(dailyRef, {
          date: Timestamp.fromDate(new Date(today)),
          pageViews: increment(1),
          uniqueVisitors: hasVisited ? increment(0) : increment(1)
        }, { merge: true })
        
        // Помечаем сессию
        if (!hasVisited) {
          sessionStorage.setItem(sessionKey, 'true')
        }
      } catch (error) {
        console.error('Error tracking page view:', error)
      }
    }
    
    trackPageView()
  }, [])
}

// Получить количество дней для периода
function getDaysForPeriod(period: StatsPeriod): number {
  switch (period) {
    case '24h': return 1
    case '7d': return 7
    case '30d': return 30
    case '365d': return 365
    case 'all': return 9999 // Большое число для "всё время"
  }
}

// Хук для получения статистики (для админ-панели)
export function useStats(period: StatsPeriod = '7d') {
  const [stats, setStats] = useState<SiteStats>({
    pageViews: 0,
    uniqueVisitors: 0,
    lastUpdated: new Date()
  })
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      
      try {
        const days = getDaysForPeriod(period)
        const today = new Date()
        const dailyData: DailyStats[] = []
        let totalPageViews = 0
        let totalUniqueVisitors = 0
        
        // Для "всё время" получаем глобальную статистику
        if (period === 'all') {
          const globalDoc = await getDoc(doc(db, 'stats', 'global'))
          if (globalDoc.exists()) {
            const data = globalDoc.data()
            totalPageViews = data.pageViews || 0
            totalUniqueVisitors = data.uniqueVisitors || 0
          }
        }
        
        // Получаем статистику по дням
        const daysToFetch = period === 'all' ? 30 : Math.min(days, 30) // Макс 30 дней для графика
        
        for (let i = 0; i < daysToFetch; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          
          try {
            const docRef = doc(db, 'stats', `daily-${dateStr}`)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
              const data = docSnap.data()
              const dayStats = {
                date: dateStr,
                pageViews: data.pageViews || 0,
                uniqueVisitors: data.uniqueVisitors || 0
              }
              dailyData.push(dayStats)
              
              // Считаем сумму только если не "всё время"
              if (period !== 'all' && i < days) {
                totalPageViews += dayStats.pageViews
                totalUniqueVisitors += dayStats.uniqueVisitors
              }
            } else {
              dailyData.push({
                date: dateStr,
                pageViews: 0,
                uniqueVisitors: 0
              })
            }
          } catch (error) {
            console.error(`Error fetching daily stats for ${dateStr}:`, error)
            dailyData.push({
              date: dateStr,
              pageViews: 0,
              uniqueVisitors: 0
            })
          }
        }
        
        setDailyStats(dailyData)
        setStats({
          pageViews: totalPageViews,
          uniqueVisitors: totalUniqueVisitors,
          lastUpdated: new Date()
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
      
      setLoading(false)
    }
    
    fetchStats()
  }, [period])

  return { stats, dailyStats, loading }
}

// Хук для статистики контента
export function useContentStats() {
  const [contentStats, setContentStats] = useState<ContentStats>({
    excursionsCount: 0,
    toursCount: 0,
    notesCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribers: (() => void)[] = []

    // Подписка на экскурсии
    unsubscribers.push(
      onSnapshot(collection(db, 'excursions'), (snapshot) => {
        setContentStats(prev => ({ ...prev, excursionsCount: snapshot.size }))
      })
    )

    // Подписка на туры
    unsubscribers.push(
      onSnapshot(collection(db, 'tours'), (snapshot) => {
        setContentStats(prev => ({ ...prev, toursCount: snapshot.size }))
      })
    )

    // Подписка на заметки
    unsubscribers.push(
      onSnapshot(collection(db, 'notes'), (snapshot) => {
        setContentStats(prev => ({ ...prev, notesCount: snapshot.size }))
        setLoading(false)
      })
    )

    return () => unsubscribers.forEach(unsub => unsub())
  }, [])

  return { contentStats, loading }
}
