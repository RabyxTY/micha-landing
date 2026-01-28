import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Excursion, Tour, CultureNote } from './useFirestore'

// Вспомогательная функция для конвертации документа
function convertDoc<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as T
}

// Хук для получения экскурсий (публичный)
export function usePublicExcursions() {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Группировка по городам
  const buenosAiresExcursions = excursions.filter(e => e.city === 'buenos-aires')
  const rioExcursions = excursions.filter(e => e.city === 'rio-de-janeiro')

  return { excursions, buenosAiresExcursions, rioExcursions, loading }
}

// Хук для получения туров (публичный)
export function usePublicTours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Группировка по странам
  const argentinaTours = tours.filter(t => t.country === 'argentina')
  const brazilTours = tours.filter(t => t.country === 'brazil')
  const peruTours = tours.filter(t => t.country === 'peru')

  return { tours, argentinaTours, brazilTours, peruTours, loading }
}

// Хук для получения заметок (публичный)
export function usePublicNotes() {
  const [notes, setNotes] = useState<CultureNote[]>([])
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { notes, loading }
}
