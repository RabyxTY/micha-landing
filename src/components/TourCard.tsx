import { useState } from 'react'
import type { Tour } from '../data/tours'
import { BookingModal } from './BookingModal'

interface TourCardProps {
  tour: Tour & { photoUrl?: string; firestoreId?: string }
}

export function TourCard({ tour }: TourCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      <div className="bg-white border border-cream-200 overflow-hidden group hover:shadow-xl transition-all duration-500">
        {/* Image Header */}
        <div className={`h-48 bg-gradient-to-br ${tour.accent} relative overflow-hidden`}>
          {/* Фото если есть */}
          {tour.photoUrl && (
            <img 
              src={tour.photoUrl} 
              alt={tour.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Оверлей для текста */}
          <div className={`absolute inset-0 ${tour.photoUrl ? 'bg-gradient-to-t from-navy-900/80 via-navy-900/40 to-transparent' : ''}`} />
          {/* Буква-placeholder если нет фото */}
          {!tour.photoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-cream-100/20 font-serif text-8xl font-bold">
                {tour.city.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-cream-200/80 text-sm tracking-widest uppercase mb-1">
              {tour.city}, {tour.country}
            </p>
            <h3 className="font-serif text-2xl text-cream-50">{tour.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-charcoal-600 leading-relaxed mb-6">{tour.description}</p>
          
          <ul className="space-y-3 mb-8">
            {tour.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-charcoal-700 text-sm">
                <svg className="w-4 h-4 text-terracotta-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-6 border-t border-cream-200">
            <span className="text-charcoal-500 text-sm">{tour.format}</span>
            {tour.firestoreId ? (
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium tracking-wider uppercase transition-colors"
              >
                Записаться →
              </button>
            ) : (
              <a 
                href="#contact"
                className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium tracking-wider uppercase transition-colors"
              >
                Запросить
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно бронирования */}
      {tour.firestoreId && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          type="excursion"
          itemId={tour.firestoreId}
          itemTitle={tour.title}
        />
      )}
    </>
  )
}
