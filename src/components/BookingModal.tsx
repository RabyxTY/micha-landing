import { useState, useMemo } from 'react'
import { useAvailableSlots, useCreateBooking } from '../hooks/useSchedule'
import type { ScheduleSlot } from '../hooks/useSchedule'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'excursion' | 'tour'
  itemId: string
  itemTitle: string
}

export function BookingModal({ isOpen, onClose, type, itemId, itemTitle }: BookingModalProps) {
  const { slots, loading } = useAvailableSlots(type, itemId)
  const { book, isSubmitting, error } = useCreateBooking()
  
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null)
  const [name, setName] = useState('')
  const [participants, setParticipants] = useState('1')
  const [step, setStep] = useState<'calendar' | 'form' | 'success'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Группируем слоты по датам для календаря
  const slotsByDate = useMemo(() => {
    const map = new Map<string, ScheduleSlot[]>()
    slots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0]
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(slot)
    })
    return map
  }, [slots])

  // Генерация дней месяца
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Пн = 0
    
    const days: (Date | null)[] = []
    
    // Пустые ячейки в начале
    for (let i = 0; i < startPadding; i++) {
      days.push(null)
    }
    
    // Дни месяца
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }
    
    return days
  }, [currentMonth])

  const handleSelectDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    const daySlots = slotsByDate.get(dateKey)
    if (daySlots && daySlots.length === 1) {
      setSelectedSlot(daySlots[0])
      setStep('form')
    } else if (daySlots && daySlots.length > 1) {
      // Если несколько слотов в день — показываем выбор времени
      setSelectedSlot(daySlots[0])
      setStep('form')
    }
  }

  const handleSelectSlot = (slot: ScheduleSlot) => {
    setSelectedSlot(slot)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !name.trim()) return

    const result = await book(selectedSlot.id, name.trim(), parseInt(participants) || 1)
    if (result.success) {
      setStep('success')
    }
  }

  const handleClose = () => {
    setStep('calendar')
    setSelectedSlot(null)
    setName('')
    setParticipants('1')
    onClose()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  if (!isOpen) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const availableSpots = selectedSlot 
    ? selectedSlot.maxParticipants - selectedSlot.currentParticipants 
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-navy-900 border border-navy-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-navy-900 border-b border-navy-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-cream-100">Записаться</h2>
            <p className="text-cream-400 text-sm mt-1">{itemTitle}</p>
          </div>
          <button onClick={handleClose} className="p-2 text-cream-400 hover:text-cream-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-navy-700 border-t-terracotta-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && slots.length === 0 && (
            <div className="text-center py-12">
              <p className="text-cream-400 text-lg mb-2">Нет доступных дат</p>
              <p className="text-cream-500 text-sm">
                К сожалению, сейчас нет открытых записей на эту экскурсию.
                <br />Свяжитесь с нами для индивидуальной даты.
              </p>
              <a 
                href="#contact" 
                onClick={handleClose}
                className="inline-block mt-6 px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors"
              >
                Связаться
              </a>
            </div>
          )}

          {!loading && slots.length > 0 && step === 'calendar' && (
            <div>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={prevMonth}
                  className="p-2 text-cream-400 hover:text-cream-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-serif text-lg text-cream-100">
                  {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={nextMonth}
                  className="p-2 text-cream-400 hover:text-cream-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-center text-cream-500 text-xs py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }
                  
                  const dateKey = date.toISOString().split('T')[0]
                  const daySlots = slotsByDate.get(dateKey)
                  const hasSlots = daySlots && daySlots.length > 0
                  const isPast = date < today
                  const isToday = date.toDateString() === today.toDateString()
                  
                  // Общее количество свободных мест в этот день
                  const availableInDay = daySlots?.reduce((sum, s) => sum + (s.maxParticipants - s.currentParticipants), 0) || 0
                  
                  return (
                    <button
                      key={dateKey}
                      onClick={() => hasSlots && !isPast && handleSelectDate(date)}
                      disabled={!hasSlots || isPast}
                      className={`
                        aspect-square flex flex-col items-center justify-center text-sm rounded transition-all
                        ${isPast ? 'text-cream-700 cursor-not-allowed' : ''}
                        ${isToday ? 'ring-1 ring-terracotta-500' : ''}
                        ${hasSlots && !isPast 
                          ? 'bg-terracotta-600/20 text-cream-100 hover:bg-terracotta-600/40 cursor-pointer' 
                          : 'text-cream-500'
                        }
                      `}
                    >
                      <span>{date.getDate()}</span>
                      {hasSlots && !isPast && (
                        <span className="text-xs text-terracotta-400">
                          {availableInDay} мест
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Available slots list */}
              <div className="mt-6 border-t border-navy-800 pt-6">
                <h4 className="text-cream-300 text-sm mb-4">Ближайшие даты:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {slots.slice(0, 5).map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSelectSlot(slot)}
                      className="w-full p-4 bg-navy-800/50 hover:bg-navy-800 border border-navy-700 hover:border-terracotta-500/50 text-left transition-all rounded"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-cream-100">
                            {slot.date.toLocaleDateString('ru-RU', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="text-cream-400 text-sm mt-1">
                            {slot.startTime} – {slot.endTime} • {slot.meetingPoint}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-terracotta-400 text-sm">
                            {slot.maxParticipants - slot.currentParticipants} мест
                          </p>
                          <p className="text-cream-500 text-xs">
                            из {slot.maxParticipants}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'form' && selectedSlot && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected slot info */}
              <div className="bg-navy-800/50 border border-navy-700 p-4 rounded">
                <p className="text-cream-100 font-medium">
                  {selectedSlot.date.toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p className="text-cream-400 text-sm mt-1">
                  {selectedSlot.startTime} – {selectedSlot.endTime}
                </p>
                <p className="text-cream-400 text-sm">
                  📍 {selectedSlot.meetingPoint}
                </p>
                <p className="text-terracotta-400 text-sm mt-2">
                  Свободно мест: {availableSpots} из {selectedSlot.maxParticipants}
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-cream-300 text-sm mb-2">Ваше имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться?"
                  className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
                  required
                />
              </div>

              {/* Participants */}
              <div>
                <label className="block text-cream-300 text-sm mb-2">Количество человек</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setParticipants(String(Math.max(1, parseInt(participants) - 1)))}
                    className="w-12 h-12 bg-navy-800 border border-navy-700 text-cream-100 hover:border-terracotta-500 transition-colors rounded flex items-center justify-center text-xl"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={participants}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      const num = parseInt(val) || 1
                      setParticipants(String(Math.min(num, availableSpots)))
                    }}
                    className="w-20 px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 text-center focus:border-terracotta-500 focus:outline-none rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setParticipants(String(Math.min(availableSpots, parseInt(participants) + 1)))}
                    disabled={parseInt(participants) >= availableSpots}
                    className="w-12 h-12 bg-navy-800 border border-navy-700 text-cream-100 hover:border-terracotta-500 transition-colors rounded flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep('calendar')
                    setSelectedSlot(null)
                  }}
                  className="flex-1 px-6 py-3 border border-navy-700 text-cream-400 hover:text-cream-100 text-sm tracking-wider uppercase transition-colors rounded"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex-1 px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors disabled:opacity-50 rounded"
                >
                  {isSubmitting ? 'Записываем...' : 'Записаться'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-cream-100 mb-2">Вы записаны!</h3>
              <p className="text-cream-400 mb-6">
                {name}, ждём вас {selectedSlot?.date.toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'long' 
                })} в {selectedSlot?.startTime}
              </p>
              <p className="text-cream-500 text-sm mb-6">
                📍 {selectedSlot?.meetingPoint}
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors rounded"
              >
                Отлично!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
