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
  where,
  Timestamp,
} from 'firebase/firestore'
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../config/firebase'

// ==================== ТИПЫ ====================

export interface ScheduleSlot {
  id: string
  // Связь с экскурсией или туром
  type: 'excursion' | 'tour'
  itemId: string // ID экскурсии или тура
  itemTitle: string // Название для отображения
  
  // Дата и время
  date: Date
  startTime: string // "10:00"
  endTime: string // "14:00"
  
  // Место
  meetingPoint: string // Место встречи
  
  // Количество мест
  maxParticipants: number
  currentParticipants: number
  
  // Статус
  isActive: boolean
  
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  scheduleId: string
  name: string
  participantsCount: number
  createdAt: Date
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function convertScheduleDoc(doc: QueryDocumentSnapshot<DocumentData>): ScheduleSlot {
  const data = doc.data()
  return {
    id: doc.id,
    type: data.type,
    itemId: data.itemId,
    itemTitle: data.itemTitle,
    date: data.date?.toDate() || new Date(),
    startTime: data.startTime,
    endTime: data.endTime,
    meetingPoint: data.meetingPoint,
    maxParticipants: data.maxParticipants,
    currentParticipants: data.currentParticipants || 0,
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  }
}

function convertBookingDoc(doc: QueryDocumentSnapshot<DocumentData>): Booking {
  const data = doc.data()
  return {
    id: doc.id,
    scheduleId: data.scheduleId,
    name: data.name,
    participantsCount: data.participantsCount,
    createdAt: data.createdAt?.toDate() || new Date(),
  }
}

// ==================== РАСПИСАНИЕ ====================

export function useSchedule() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'schedule'), orderBy('date', 'asc'))
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => convertScheduleDoc(doc))
        setSlots(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching schedule:', err)
        setError('Ошибка загрузки расписания')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addSlot = async (slot: Omit<ScheduleSlot, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>) => {
    try {
      await addDoc(collection(db, 'schedule'), {
        ...slot,
        date: Timestamp.fromDate(slot.date),
        currentParticipants: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } catch (err) {
      console.error('Error adding schedule slot:', err)
      throw new Error('Ошибка добавления слота')
    }
  }

  const updateSlot = async (id: string, slot: Partial<ScheduleSlot>) => {
    try {
      const updateData: Record<string, unknown> = {
        ...slot,
        updatedAt: Timestamp.now(),
      }
      if (slot.date) {
        updateData.date = Timestamp.fromDate(slot.date)
      }
      await updateDoc(doc(db, 'schedule', id), updateData)
    } catch (err) {
      console.error('Error updating schedule slot:', err)
      throw new Error('Ошибка обновления слота')
    }
  }

  const deleteSlot = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schedule', id))
    } catch (err) {
      console.error('Error deleting schedule slot:', err)
      throw new Error('Ошибка удаления слота')
    }
  }

  return { slots, loading, error, addSlot, updateSlot, deleteSlot }
}

// Хук для получения доступных слотов для конкретной экскурсии/тура
export function useAvailableSlots(type: 'excursion' | 'tour', itemId: string) {
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!itemId) {
      setSlots([])
      setLoading(false)
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Простой запрос без compound index — фильтруем на клиенте
    const q = query(
      collection(db, 'schedule'),
      orderBy('date', 'asc')
    )
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Schedule snapshot:', snapshot.docs.length, 'docs')
        
        const data = snapshot.docs
          .map(doc => convertScheduleDoc(doc))
          .filter(slot => {
            // Фильтруем: по типу, по ID, активные, будущие даты, есть места
            const matches = 
              slot.type === type &&
              slot.itemId === itemId &&
              slot.isActive &&
              slot.date >= today &&
              slot.currentParticipants < slot.maxParticipants
            
            if (slot.itemId === itemId) {
              console.log('Slot for this item:', slot.date, 'active:', slot.isActive, 'matches:', matches)
            }
            
            return matches
          })
        
        console.log('Filtered slots for', itemId, ':', data.length)
        setSlots(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching available slots:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [type, itemId])

  return { slots, loading }
}

// ==================== БРОНИРОВАНИЯ ====================

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => convertBookingDoc(doc))
        setBookings(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching bookings:', err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const createBooking = async (scheduleId: string, name: string, participantsCount: number) => {
    try {
      // Получаем текущий слот
      const scheduleRef = doc(db, 'schedule', scheduleId)
      
      // Создаём бронирование
      await addDoc(collection(db, 'bookings'), {
        scheduleId,
        name,
        participantsCount,
        createdAt: Timestamp.now(),
      })
      
      // Обновляем количество участников в слоте
      const slot = slots.find(s => s.id === scheduleId)
      if (slot) {
        await updateDoc(scheduleRef, {
          currentParticipants: slot.currentParticipants + participantsCount,
          updatedAt: Timestamp.now(),
        })
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error creating booking:', err)
      return { success: false, error: 'Ошибка создания бронирования' }
    }
  }

  const deleteBooking = async (booking: Booking) => {
    try {
      // Удаляем бронирование
      await deleteDoc(doc(db, 'bookings', booking.id))
      
      // Уменьшаем количество участников в слоте
      const scheduleRef = doc(db, 'schedule', booking.scheduleId)
      const slot = slots.find(s => s.id === booking.scheduleId)
      if (slot) {
        await updateDoc(scheduleRef, {
          currentParticipants: Math.max(0, slot.currentParticipants - booking.participantsCount),
          updatedAt: Timestamp.now(),
        })
      }
    } catch (err) {
      console.error('Error deleting booking:', err)
      throw new Error('Ошибка удаления бронирования')
    }
  }

  // Получаем slots из родительского хука для использования в функциях
  const { slots } = useSchedule()

  return { bookings, loading, createBooking, deleteBooking }
}

// Хук для создания бронирования (публичный, без админских функций)
export function useCreateBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const book = async (scheduleId: string, name: string, participantsCount: number) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Создаём бронирование
      await addDoc(collection(db, 'bookings'), {
        scheduleId,
        name,
        participantsCount,
        createdAt: Timestamp.now(),
      })
      
      // Обновляем количество участников
      const scheduleRef = doc(db, 'schedule', scheduleId)
      const { increment } = await import('firebase/firestore')
      await updateDoc(scheduleRef, {
        currentParticipants: increment(participantsCount),
        updatedAt: Timestamp.now(),
      })
      
      setIsSubmitting(false)
      return { success: true }
    } catch (err) {
      console.error('Error creating booking:', err)
      setError('Не удалось создать бронирование. Попробуйте ещё раз.')
      setIsSubmitting(false)
      return { success: false }
    }
  }

  return { book, isSubmitting, error }
}
