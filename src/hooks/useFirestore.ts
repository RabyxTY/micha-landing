import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../config/firebase'

// ==================== ТИПЫ ====================

export interface Excursion {
  id: string
  title: string
  description: string
  price: number // Цена в USD
  city: string // Любой город
  photoUrl?: string
  features: string[]
  duration: number // Длительность в часах
  createdAt: Date
  updatedAt: Date
}

export interface Tour {
  id: string
  title: string
  description: string
  country: string // Любая страна
  duration: number // Длительность в днях
  price: number // Цена в USD
  photoUrl?: string
  highlights: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CultureNote {
  id: string
  title: string
  content: string
  category: string
  createdAt: Date
  updatedAt: Date
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function convertDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as T
}

// ==================== ЭКСКУРСИИ ====================

export function useExcursions() {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'excursions'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => convertDoc<Excursion>(doc))
        setExcursions(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching excursions:', err)
        setError('Ошибка загрузки экскурсий')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addExcursion = async (excursion: Omit<Excursion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'excursions'), {
        ...excursion,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (err) {
      console.error('Error adding excursion:', err)
      throw new Error('Ошибка добавления экскурсии')
    }
  }

  const updateExcursion = async (id: string, excursion: Partial<Excursion>) => {
    try {
      await updateDoc(doc(db, 'excursions', id), {
        ...excursion,
        updatedAt: Timestamp.now(),
      })
    } catch (err) {
      console.error('Error updating excursion:', err)
      throw new Error('Ошибка обновления экскурсии')
    }
  }

  const deleteExcursion = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'excursions', id))
    } catch (err) {
      console.error('Error deleting excursion:', err)
      throw new Error('Ошибка удаления экскурсии')
    }
  }

  return { excursions, loading, error, addExcursion, updateExcursion, deleteExcursion }
}

// ==================== ТУРЫ ====================

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'tours'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => convertDoc<Tour>(doc))
        setTours(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching tours:', err)
        setError('Ошибка загрузки туров')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addTour = async (tour: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'tours'), {
        ...tour,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } catch (err) {
      console.error('Error adding tour:', err)
      throw new Error('Ошибка добавления тура')
    }
  }

  const updateTour = async (id: string, tour: Partial<Tour>) => {
    try {
      await updateDoc(doc(db, 'tours', id), {
        ...tour,
        updatedAt: Timestamp.now(),
      })
    } catch (err) {
      console.error('Error updating tour:', err)
      throw new Error('Ошибка обновления тура')
    }
  }

  const deleteTour = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tours', id))
    } catch (err) {
      console.error('Error deleting tour:', err)
      throw new Error('Ошибка удаления тура')
    }
  }

  return { tours, loading, error, addTour, updateTour, deleteTour }
}

// ==================== КУЛЬТУРНЫЕ ЗАМЕТКИ ====================

export function useNotes() {
  const [notes, setNotes] = useState<CultureNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => convertDoc<CultureNote>(doc))
        setNotes(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching notes:', err)
        setError('Ошибка загрузки заметок')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addNote = async (note: Omit<CultureNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'notes'), {
        ...note,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } catch (err) {
      console.error('Error adding note:', err)
      throw new Error('Ошибка добавления заметки')
    }
  }

  const updateNote = async (id: string, note: Partial<CultureNote>) => {
    try {
      await updateDoc(doc(db, 'notes', id), {
        ...note,
        updatedAt: Timestamp.now(),
      })
    } catch (err) {
      console.error('Error updating note:', err)
      throw new Error('Ошибка обновления заметки')
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id))
    } catch (err) {
      console.error('Error deleting note:', err)
      throw new Error('Ошибка удаления заметки')
    }
  }

  return { notes, loading, error, addNote, updateNote, deleteNote }
}
