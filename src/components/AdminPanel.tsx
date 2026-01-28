import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useExcursions, useTours, useNotes } from '../hooks/useFirestore'
import { useStats, useContentStats } from '../hooks/useStats'
import { useSchedule, useBookings } from '../hooks/useSchedule'
import type { StatsPeriod } from '../hooks/useStats'
import type { ScheduleSlot, Booking } from '../hooks/useSchedule'
import { ImageUploader } from './ImageUploader'
import type { Excursion, Tour, CultureNote } from '../hooks/useFirestore'

// Предустановленные города и страны (можно добавлять свои)
const DEFAULT_CITIES = [
  { value: 'buenos-aires', label: 'Буэнос-Айрес' },
  { value: 'rio-de-janeiro', label: 'Рио-де-Жанейро' },
  { value: 'sao-paulo', label: 'Сан-Паулу' },
  { value: 'lima', label: 'Лима' },
  { value: 'cusco', label: 'Куско' },
  { value: 'santiago', label: 'Сантьяго' },
  { value: 'montevideo', label: 'Монтевидео' },
  { value: 'bogota', label: 'Богота' },
  { value: 'cartagena', label: 'Картахена' },
  { value: 'havana', label: 'Гавана' },
]

const DEFAULT_COUNTRIES = [
  { value: 'argentina', label: 'Аргентина' },
  { value: 'brazil', label: 'Бразилия' },
  { value: 'peru', label: 'Перу' },
  { value: 'chile', label: 'Чили' },
  { value: 'uruguay', label: 'Уругвай' },
  { value: 'colombia', label: 'Колумбия' },
  { value: 'cuba', label: 'Куба' },
  { value: 'mexico', label: 'Мексика' },
  { value: 'ecuador', label: 'Эквадор' },
  { value: 'bolivia', label: 'Боливия' },
]

type ActiveTab = 'dashboard' | 'excursions' | 'tours' | 'notes' | 'schedule' | 'bookings'

export function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="bg-navy-900 border-b border-navy-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="font-serif text-xl text-cream-100">
                Михаил Дьяконов
              </a>
              <span className="text-navy-600">|</span>
              <span className="text-cream-400 text-sm">Панель управления</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-cream-400 text-sm">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-cream-400 hover:text-terracotta-400 text-sm transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-navy-900/50 border-b border-navy-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <TabButton
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Обзор
            </TabButton>
            <TabButton
              active={activeTab === 'excursions'}
              onClick={() => setActiveTab('excursions')}
            >
              Экскурсии
            </TabButton>
            <TabButton
              active={activeTab === 'tours'}
              onClick={() => setActiveTab('tours')}
            >
              Туры
            </TabButton>
            <TabButton
              active={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
            >
              Заметки
            </TabButton>
            <TabButton
              active={activeTab === 'schedule'}
              onClick={() => setActiveTab('schedule')}
            >
              📅 Расписание
            </TabButton>
            <TabButton
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            >
              📋 Записи
            </TabButton>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && <DashboardSection />}
        {activeTab === 'excursions' && <ExcursionsSection />}
        {activeTab === 'tours' && <ToursSection />}
        {activeTab === 'notes' && <NotesSection />}
        {activeTab === 'schedule' && <ScheduleSection />}
        {activeTab === 'bookings' && <BookingsSection />}
      </main>
    </div>
  )
}

// ==================== TAB BUTTON ====================

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`py-4 border-b-2 text-sm tracking-wider uppercase transition-colors ${
        active
          ? 'border-terracotta-500 text-cream-100'
          : 'border-transparent text-cream-400 hover:text-cream-200'
      }`}
    >
      {children}
    </button>
  )
}

// ==================== DASHBOARD SECTION ====================

const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: '24h', label: '24 часа' },
  { value: '7d', label: 'Неделя' },
  { value: '30d', label: 'Месяц' },
  { value: '365d', label: 'Год' },
  { value: 'all', label: 'Всё время' },
]

function DashboardSection() {
  const [period, setPeriod] = useState<StatsPeriod>('7d')
  const { stats, dailyStats, loading: statsLoading } = useStats(period)
  const { contentStats, loading: contentLoading } = useContentStats()
  const { excursions } = useExcursions()
  const { tours } = useTours()
  const { notes } = useNotes()

  // Последние добавленные элементы
  const recentItems = [
    ...excursions.map(e => ({ type: 'excursion' as const, title: e.title, date: e.createdAt, city: e.city })),
    ...tours.map(t => ({ type: 'tour' as const, title: t.title, date: t.createdAt, country: t.country })),
    ...notes.map(n => ({ type: 'note' as const, title: n.title, date: n.createdAt, category: n.category }))
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  const typeLabels = {
    excursion: 'Экскурсия',
    tour: 'Тур',
    note: 'Заметка'
  }

  const periodLabel = PERIOD_OPTIONS.find(p => p.value === period)?.label || ''

  return (
    <div className="space-y-8">
      {/* Welcome + Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-cream-100">Статистика</h2>
          <p className="text-cream-400 mt-2">Аналитика посещений и контента</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2 flex-wrap">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-4 py-2 text-sm rounded transition-all ${
                period === option.value
                  ? 'bg-terracotta-600 text-cream-50'
                  : 'bg-navy-800 text-cream-400 hover:bg-navy-700 hover:text-cream-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Просмотры"
          value={stats.pageViews}
          icon="👁"
          description={`За ${periodLabel.toLowerCase()}`}
          loading={statsLoading}
        />
        <StatCard
          title="Посетители"
          value={stats.uniqueVisitors}
          icon="👤"
          description={`Уникальных за ${periodLabel.toLowerCase()}`}
          loading={statsLoading}
        />
        <StatCard
          title="Контент"
          value={contentStats.excursionsCount + contentStats.toursCount + contentStats.notesCount}
          icon="📝"
          description="Публикаций всего"
          loading={contentLoading}
        />
        <StatCard
          title="Сегодня"
          value={dailyStats[0]?.pageViews || 0}
          icon="📈"
          description="Просмотров за сегодня"
          loading={statsLoading}
        />
      </div>

      {/* Content Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Stats */}
        <div className="bg-navy-900/50 border border-navy-800/50 p-6 rounded">
          <h3 className="font-serif text-xl text-cream-100 mb-6">Контент по категориям</h3>
          <div className="space-y-4">
            <ContentStatRow
              label="Экскурсии"
              count={contentStats.excursionsCount}
              color="bg-terracotta-500"
              maxCount={Math.max(contentStats.excursionsCount, contentStats.toursCount, contentStats.notesCount, 1)}
            />
            <ContentStatRow
              label="Туры"
              count={contentStats.toursCount}
              color="bg-emerald-500"
              maxCount={Math.max(contentStats.excursionsCount, contentStats.toursCount, contentStats.notesCount, 1)}
            />
            <ContentStatRow
              label="Заметки"
              count={contentStats.notesCount}
              color="bg-blue-500"
              maxCount={Math.max(contentStats.excursionsCount, contentStats.toursCount, contentStats.notesCount, 1)}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="bg-navy-900/50 border border-navy-800/50 p-6 rounded">
          <h3 className="font-serif text-xl text-cream-100 mb-6">
            Просмотры {period === 'all' ? '(последние 30 дней)' : `за ${periodLabel.toLowerCase()}`}
          </h3>
          {statsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-navy-700 border-t-terracotta-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex items-end justify-between h-32 gap-1">
              {dailyStats.slice(0, period === '24h' ? 1 : period === '7d' ? 7 : 14).reverse().map((day, index) => {
                const maxViews = Math.max(...dailyStats.map(d => d.pageViews), 1)
                const height = (day.pageViews / maxViews) * 100
                const date = new Date(day.date)
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full">
                      <div 
                        className="w-full bg-terracotta-500/80 rounded-t transition-all duration-300 hover:bg-terracotta-400"
                        style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-cream-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {day.pageViews} просмотров
                        <br />
                        {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <span className="text-cream-500 text-xs mt-2">
                      {period === '24h' 
                        ? 'Сегодня'
                        : date.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2)
                      }
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-navy-900/50 border border-navy-800/50 p-6 rounded">
        <h3 className="font-serif text-xl text-cream-100 mb-6">Последние публикации</h3>
        {recentItems.length > 0 ? (
          <div className="space-y-4">
            {recentItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-navy-800/50 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {item.type === 'excursion' ? '🗺' : item.type === 'tour' ? '✈️' : '📝'}
                  </span>
                  <div>
                    <p className="text-cream-100">{item.title}</p>
                    <p className="text-cream-500 text-sm">{typeLabels[item.type]}</p>
                  </div>
                </div>
                <span className="text-cream-500 text-sm">
                  {item.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cream-500 text-center py-8">
            Пока нет публикаций. Добавьте первую экскурсию, тур или заметку!
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-navy-900/50 border border-navy-800/50 p-6 rounded">
        <h3 className="font-serif text-xl text-cream-100 mb-6">Быстрые действия</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <QuickActionButton
            icon="🗺"
            label="Добавить экскурсию"
            onClick={() => window.location.hash = '#excursions'}
          />
          <QuickActionButton
            icon="✈️"
            label="Добавить тур"
            onClick={() => window.location.hash = '#tours'}
          />
          <QuickActionButton
            icon="📝"
            label="Добавить заметку"
            onClick={() => window.location.hash = '#notes'}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, description, loading = false }: { title: string; value: number; icon: string; description: string; loading?: boolean }) {
  return (
    <div className="bg-navy-900/50 border border-navy-800/50 p-6 rounded">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-cream-500 text-sm">{title}</span>
      </div>
      {loading ? (
        <div className="h-10 flex items-center">
          <div className="w-6 h-6 border-2 border-navy-700 border-t-terracotta-500 rounded-full animate-spin" />
        </div>
      ) : (
        <p className="font-serif text-4xl text-cream-100">{value.toLocaleString('ru-RU')}</p>
      )}
      <p className="text-cream-500 text-sm mt-2">{description}</p>
    </div>
  )
}

function ContentStatRow({ label, count, color, maxCount }: { label: string; count: number; color: string; maxCount: number }) {
  const percentage = (count / maxCount) * 100
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-cream-300">{label}</span>
        <span className="text-cream-100">{count}</span>
      </div>
      <div className="h-2 bg-navy-800 rounded overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function QuickActionButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-navy-800/50 border border-navy-700/50 hover:border-terracotta-500/50 hover:bg-navy-800 transition-all text-left"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-cream-300 text-sm">{label}</span>
    </button>
  )
}

// ==================== EXCURSIONS SECTION ====================

function ExcursionsSection() {
  const { excursions, loading, addExcursion, updateExcursion, deleteExcursion } = useExcursions()
  const { addSlot } = useSchedule()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Функция для добавления экскурсии + расписание
  const handleAddExcursion = async (
    data: Parameters<typeof addExcursion>[0], 
    scheduleData?: { dateStart: string; dateEnd: string; startTime: string; endTime: string; meetingPoint: string; maxParticipants: number }
  ) => {
    // Сначала добавляем экскурсию и получаем ID
    const excursionId = await addExcursion(data)
    
    // Если есть данные расписания — добавляем слоты
    if (scheduleData && scheduleData.dateStart && scheduleData.meetingPoint && excursionId) {
      const startDate = new Date(scheduleData.dateStart)
      const endDate = new Date(scheduleData.dateEnd || scheduleData.dateStart)
      
      // Создаём слот для каждого дня в диапазоне
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        await addSlot({
          type: 'excursion',
          itemId: excursionId,
          itemTitle: data.title,
          date: new Date(currentDate),
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          meetingPoint: scheduleData.meetingPoint,
          maxParticipants: scheduleData.maxParticipants,
          isActive: true,
        })
        // Переходим к следующему дню
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-cream-100">Экскурсии</h2>
          <p className="text-cream-400 text-sm mt-1">Управление экскурсиями в Буэнос-Айресе и Рио-де-Жанейро</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors"
        >
          Добавить экскурсию
        </button>
      </div>

      {isAdding && (
        <ExcursionForm
          onSubmit={async (data, scheduleData) => {
            await handleAddExcursion(data, scheduleData)
            setIsAdding(false)
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid gap-6">
        {excursions.map((excursion) => (
          <div key={excursion.id}>
            {editingId === excursion.id ? (
              <ExcursionForm
                excursion={excursion}
                onSubmit={async (data) => {
                  await updateExcursion(excursion.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <ExcursionCard
                excursion={excursion}
                onEdit={() => setEditingId(excursion.id)}
                onDelete={() => deleteExcursion(excursion.id)}
              />
            )}
          </div>
        ))}
      </div>

      {excursions.length === 0 && !isAdding && (
        <EmptyState message="Нет экскурсий. Добавьте первую." />
      )}
    </div>
  )
}

function ExcursionCard({ excursion, onEdit, onDelete }: { excursion: Excursion; onEdit: () => void; onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Находим label города
  const cityLabel = DEFAULT_CITIES.find(c => c.value === excursion.city)?.label || excursion.city

  return (
    <div className="bg-navy-900/50 border border-navy-800/50 p-6">
      <div className="flex gap-6">
        {excursion.photoUrl && (
          <div className="w-32 h-32 flex-shrink-0 bg-navy-800 overflow-hidden rounded">
            <img src={excursion.photoUrl} alt={excursion.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-2 py-1 bg-navy-800 text-terracotta-400 text-xs uppercase tracking-wider mb-2">
                {cityLabel}
              </span>
              <h3 className="font-serif text-xl text-cream-100">{excursion.title}</h3>
              <p className="text-cream-400 text-sm mt-2 line-clamp-2">{excursion.description}</p>
              <div className="flex gap-4 mt-3 text-cream-500 text-sm">
                <span>${excursion.price}</span>
                <span>|</span>
                <span>{excursion.duration} ч.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-cream-400 hover:text-cream-100 transition-colors"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setIsDeleting(true)}
                className="p-2 text-cream-400 hover:text-red-400 transition-colors"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDeleting && (
        <ConfirmDialog
          message="Удалить эту экскурсию?"
          onConfirm={() => {
            onDelete()
            setIsDeleting(false)
          }}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

function ExcursionForm({ 
  excursion, 
  onSubmit, 
  onCancel 
}: { 
  excursion?: Excursion
  onSubmit: (data: Omit<Excursion, 'id' | 'createdAt' | 'updatedAt'>, scheduleData?: { dateStart: string; dateEnd: string; startTime: string; endTime: string; meetingPoint: string; maxParticipants: number }) => Promise<void>
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    title: excursion?.title || '',
    description: excursion?.description || '',
    price: excursion?.price ? String(excursion.price) : '',
    city: excursion?.city || 'buenos-aires',
    customCity: '',
    duration: excursion?.duration ? String(excursion.duration) : '4',
    features: excursion?.features?.join('\n') || '',
    photoUrl: excursion?.photoUrl || '',
  })
  const [useCustomCity, setUseCustomCity] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Данные для первой даты (опционально)
  const [addSchedule, setAddSchedule] = useState(!excursion) // По умолчанию включено для новых
  const [scheduleData, setScheduleData] = useState({
    dateStart: '',
    dateEnd: '', // Пустое = один день
    startTime: '10:00',
    endTime: '14:00',
    meetingPoint: '',
    maxParticipants: '10',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const schedule = addSchedule && scheduleData.dateStart && scheduleData.meetingPoint
        ? {
            dateStart: scheduleData.dateStart,
            dateEnd: scheduleData.dateEnd || scheduleData.dateStart, // Если не указана — один день
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            meetingPoint: scheduleData.meetingPoint,
            maxParticipants: parseInt(scheduleData.maxParticipants) || 10,
          }
        : undefined

      await onSubmit({
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price) || 0,
        city: useCustomCity ? formData.customCity : formData.city,
        duration: parseInt(formData.duration) || 1,
        features: formData.features.split('\n').filter(f => f.trim()),
        photoUrl: formData.photoUrl || undefined,
      }, schedule)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-navy-900/50 border border-navy-800/50 p-6 mb-6 rounded">
      <h3 className="font-serif text-lg text-cream-100 mb-6">
        {excursion ? 'Редактировать экскурсию' : 'Новая экскурсия'}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Город */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Город</label>
          {useCustomCity ? (
            <input
              type="text"
              value={formData.customCity}
              onChange={(e) => setFormData({ ...formData, customCity: e.target.value })}
              placeholder="Введите название города"
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
              required
            />
          ) : (
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            >
              {DEFAULT_CITIES.map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setUseCustomCity(!useCustomCity)}
            className="text-terracotta-400 text-xs mt-2 hover:text-terracotta-300"
          >
            {useCustomCity ? '← Выбрать из списка' : '+ Добавить другой город'}
          </button>
        </div>

        {/* Название */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Описание */}
        <div className="md:col-span-2">
          <label className="block text-cream-300 text-sm mb-2">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none resize-none rounded"
            required
          />
        </div>

        {/* Цена (только цифры) */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Цена (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({ ...formData, price: value })
              }}
              placeholder="300"
              className="w-full pl-8 pr-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
              required
            />
          </div>
        </div>

        {/* Длительность (только цифры) */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Длительность</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.duration}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({ ...formData, duration: value })
              }}
              placeholder="4"
              className="w-24 px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-center"
              required
            />
            <span className="text-cream-400">часов</span>
          </div>
        </div>

        {/* Особенности */}
        <div className="md:col-span-2">
          <label className="block text-cream-300 text-sm mb-2">Особенности (каждая с новой строки)</label>
          <textarea
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={4}
            placeholder="Персональный гид на полный день&#10;Маршрут под ваши интересы&#10;Рекомендации по ресторанам"
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none resize-none rounded"
          />
        </div>

        {/* Загрузка изображения */}
        <div className="md:col-span-2">
          <ImageUploader
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
          />
        </div>

        {/* Добавить дату для записи */}
        <div className="md:col-span-2 border-t border-navy-700 pt-6 mt-2">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={addSchedule}
              onChange={(e) => setAddSchedule(e.target.checked)}
              className="w-5 h-5 bg-navy-800 border-navy-700 rounded text-terracotta-500 focus:ring-terracotta-500"
            />
            <span className="text-cream-300 text-sm">📅 Добавить дату для записи</span>
          </label>

          {addSchedule && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-navy-800/50 rounded">
              <div>
                <label className="block text-cream-400 text-xs mb-1">Дата начала</label>
                <input
                  type="date"
                  value={scheduleData.dateStart}
                  onChange={(e) => setScheduleData({ ...scheduleData, dateStart: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-cream-400 text-xs mb-1">Дата окончания <span className="text-cream-500">(необязательно)</span></label>
                <input
                  type="date"
                  value={scheduleData.dateEnd}
                  min={scheduleData.dateStart}
                  onChange={(e) => setScheduleData({ ...scheduleData, dateEnd: e.target.value })}
                  placeholder="Оставьте пустым для одного дня"
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-cream-400 text-xs mb-1">Время начала</label>
                <input
                  type="time"
                  value={scheduleData.startTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-cream-400 text-xs mb-1">Время окончания</label>
                <input
                  type="time"
                  value={scheduleData.endTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-cream-400 text-xs mb-1">Макс. человек</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={scheduleData.maxParticipants}
                  onChange={(e) => setScheduleData({ ...scheduleData, maxParticipants: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-cream-400 text-xs mb-1">Место встречи</label>
                <input
                  type="text"
                  value={scheduleData.meetingPoint}
                  onChange={(e) => setScheduleData({ ...scheduleData, meetingPoint: e.target.value })}
                  placeholder="Plaza de Mayo"
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-sm"
                />
              </div>
              {scheduleData.dateStart && scheduleData.dateEnd && scheduleData.dateEnd !== scheduleData.dateStart && (
                <div className="md:col-span-2 text-cream-400 text-xs bg-navy-900/50 p-2 rounded">
                  📅 Будет создано несколько дат: с {new Date(scheduleData.dateStart).toLocaleDateString('ru-RU')} по {new Date(scheduleData.dateEnd).toLocaleDateString('ru-RU')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors disabled:opacity-50 rounded"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-navy-700 text-cream-400 hover:text-cream-100 text-sm tracking-wider uppercase transition-colors rounded"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

// ==================== TOURS SECTION ====================

function ToursSection() {
  const { tours, loading, addTour, updateTour, deleteTour } = useTours()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-cream-100">Авторские туры</h2>
          <p className="text-cream-400 text-sm mt-1">Туры по Аргентине, Бразилии и Перу</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors"
        >
          Добавить тур
        </button>
      </div>

      {isAdding && (
        <TourForm
          onSubmit={async (data) => {
            await addTour(data)
            setIsAdding(false)
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid gap-6">
        {tours.map((tour) => (
          <div key={tour.id}>
            {editingId === tour.id ? (
              <TourForm
                tour={tour}
                onSubmit={async (data) => {
                  await updateTour(tour.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <TourCard
                tour={tour}
                onEdit={() => setEditingId(tour.id)}
                onDelete={() => deleteTour(tour.id)}
              />
            )}
          </div>
        ))}
      </div>

      {tours.length === 0 && !isAdding && (
        <EmptyState message="Нет туров. Добавьте первый." />
      )}
    </div>
  )
}

function TourCard({ tour, onEdit, onDelete }: { tour: Tour; onEdit: () => void; onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Находим label страны
  const countryLabel = DEFAULT_COUNTRIES.find(c => c.value === tour.country)?.label || tour.country

  return (
    <div className="bg-navy-900/50 border border-navy-800/50 p-6 rounded">
      <div className="flex gap-6">
        {tour.photoUrl && (
          <div className="w-32 h-32 flex-shrink-0 bg-navy-800 overflow-hidden rounded">
            <img src={tour.photoUrl} alt={tour.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-2 py-1 bg-navy-800 text-terracotta-400 text-xs uppercase tracking-wider mb-2">
                {countryLabel}
              </span>
              <h3 className="font-serif text-xl text-cream-100">{tour.title}</h3>
              <p className="text-cream-400 text-sm mt-2 line-clamp-2">{tour.description}</p>
              <div className="flex gap-4 mt-3 text-cream-500 text-sm">
                <span>${tour.price}</span>
                <span>|</span>
                <span>{tour.duration} дн.</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onEdit} className="p-2 text-cream-400 hover:text-cream-100 transition-colors">
                <EditIcon />
              </button>
              <button onClick={() => setIsDeleting(true)} className="p-2 text-cream-400 hover:text-red-400 transition-colors">
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDeleting && (
        <ConfirmDialog
          message="Удалить этот тур?"
          onConfirm={() => {
            onDelete()
            setIsDeleting(false)
          }}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

function TourForm({ 
  tour, 
  onSubmit, 
  onCancel 
}: { 
  tour?: Tour
  onSubmit: (data: Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    description: tour?.description || '',
    price: tour?.price ? String(tour.price) : '',
    country: tour?.country || 'argentina',
    customCountry: '',
    duration: tour?.duration ? String(tour.duration) : '7',
    highlights: tour?.highlights?.join('\n') || '',
    photoUrl: tour?.photoUrl || '',
  })
  const [useCustomCountry, setUseCustomCountry] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price) || 0,
        country: useCustomCountry ? formData.customCountry : formData.country,
        duration: parseInt(formData.duration) || 1,
        highlights: formData.highlights.split('\n').filter(h => h.trim()),
        photoUrl: formData.photoUrl || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-navy-900/50 border border-navy-800/50 p-6 mb-6 rounded">
      <h3 className="font-serif text-lg text-cream-100 mb-6">
        {tour ? 'Редактировать тур' : 'Новый тур'}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Страна */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Страна</label>
          {useCustomCountry ? (
            <input
              type="text"
              value={formData.customCountry}
              onChange={(e) => setFormData({ ...formData, customCountry: e.target.value })}
              placeholder="Введите название страны"
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
              required
            />
          ) : (
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            >
              {DEFAULT_COUNTRIES.map(country => (
                <option key={country.value} value={country.value}>{country.label}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setUseCustomCountry(!useCustomCountry)}
            className="text-terracotta-400 text-xs mt-2 hover:text-terracotta-300"
          >
            {useCustomCountry ? '← Выбрать из списка' : '+ Добавить другую страну'}
          </button>
        </div>

        {/* Название */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Описание */}
        <div className="md:col-span-2">
          <label className="block text-cream-300 text-sm mb-2">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none resize-none rounded"
            required
          />
        </div>

        {/* Цена (только цифры) */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Цена (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({ ...formData, price: value })
              }}
              placeholder="3500"
              className="w-full pl-8 pr-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
              required
            />
          </div>
        </div>

        {/* Длительность (только цифры) */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Длительность</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.duration}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setFormData({ ...formData, duration: value })
              }}
              placeholder="7"
              className="w-24 px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded text-center"
              required
            />
            <span className="text-cream-400">дней</span>
          </div>
        </div>

        {/* Основные пункты */}
        <div className="md:col-span-2">
          <label className="block text-cream-300 text-sm mb-2">Основные пункты (каждый с новой строки)</label>
          <textarea
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            rows={4}
            placeholder="Винодельни Мендосы&#10;Водопады Игуасу&#10;Ледник Перито-Морено"
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none resize-none rounded"
          />
        </div>

        {/* Загрузка изображения */}
        <div className="md:col-span-2">
          <ImageUploader
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url })}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors disabled:opacity-50 rounded"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-navy-700 text-cream-400 hover:text-cream-100 text-sm tracking-wider uppercase transition-colors rounded"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

// ==================== NOTES SECTION ====================

function NotesSection() {
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-cream-100">Заметки</h2>
          <p className="text-cream-400 text-sm mt-1">Короткие заметки о культуре Латинской Америки</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors"
        >
          Добавить заметку
        </button>
      </div>

      {isAdding && (
        <NoteForm
          onSubmit={async (data) => {
            await addNote(data)
            setIsAdding(false)
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid gap-6">
        {notes.map((note) => (
          <div key={note.id}>
            {editingId === note.id ? (
              <NoteForm
                note={note}
                onSubmit={async (data) => {
                  await updateNote(note.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <NoteCard
                note={note}
                onEdit={() => setEditingId(note.id)}
                onDelete={() => deleteNote(note.id)}
              />
            )}
          </div>
        ))}
      </div>

      {notes.length === 0 && !isAdding && (
        <EmptyState message="Нет заметок. Добавьте первую." />
      )}
    </div>
  )
}

function NoteCard({ note, onEdit, onDelete }: { note: CultureNote; onEdit: () => void; onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <div className="bg-navy-900/50 border border-navy-800/50 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className="inline-block px-2 py-1 bg-navy-800 text-terracotta-400 text-xs uppercase tracking-wider mb-2">
            {note.category}
          </span>
          <h3 className="font-serif text-xl text-cream-100">{note.title}</h3>
          <p className="text-cream-400 text-sm mt-2 line-clamp-3">{note.content}</p>
          <p className="text-cream-500 text-xs mt-3">
            {note.updatedAt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={onEdit} className="p-2 text-cream-400 hover:text-cream-100 transition-colors">
            <EditIcon />
          </button>
          <button onClick={() => setIsDeleting(true)} className="p-2 text-cream-400 hover:text-red-400 transition-colors">
            <DeleteIcon />
          </button>
        </div>
      </div>

      {isDeleting && (
        <ConfirmDialog
          message="Удалить эту заметку?"
          onConfirm={() => {
            onDelete()
            setIsDeleting(false)
          }}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

function NoteForm({ 
  note, 
  onSubmit, 
  onCancel 
}: { 
  note?: CultureNote
  onSubmit: (data: Omit<CultureNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = ['Политика', 'Архитектура', 'Социология', 'Культура', 'Музыка', 'Кулинария', 'История']

  return (
    <form onSubmit={handleSubmit} className="bg-navy-900/50 border border-navy-800/50 p-6 mb-6">
      <h3 className="font-serif text-lg text-cream-100 mb-6">
        {note ? 'Редактировать заметку' : 'Новая заметка'}
      </h3>
      
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-cream-300 text-sm mb-2">Категория</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none"
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-cream-300 text-sm mb-2">Заголовок</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-cream-300 text-sm mb-2">Содержание</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none resize-none"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-navy-700 text-cream-400 hover:text-cream-100 text-sm tracking-wider uppercase transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

// ==================== SCHEDULE SECTION ====================

function ScheduleSection() {
  const { slots, loading, addSlot, updateSlot, deleteSlot } = useSchedule()
  const { excursions } = useExcursions()
  const { tours } = useTours()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Комбинируем экскурсии и туры для выбора
  const items = [
    ...excursions.map(e => ({ id: e.id, title: e.title, type: 'excursion' as const })),
    ...tours.map(t => ({ id: t.id, title: t.title, type: 'tour' as const })),
  ]

  if (loading) {
    return <LoadingSpinner />
  }

  // Группируем по датам
  const upcomingSlots = slots.filter(s => s.date >= new Date())
  const pastSlots = slots.filter(s => s.date < new Date())

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-cream-100">Расписание</h2>
          <p className="text-cream-400 text-sm mt-1">Управление датами и временем экскурсий</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors rounded"
        >
          Добавить дату
        </button>
      </div>

      {isAdding && (
        <ScheduleForm
          items={items}
          onSubmit={async (data, dateEnd) => {
            // Если указана дата окончания — создаём слоты для каждого дня
            if (dateEnd) {
              const startDate = new Date(data.date)
              const endDate = new Date(dateEnd)
              const currentDate = new Date(startDate)
              
              while (currentDate <= endDate) {
                await addSlot({
                  ...data,
                  date: new Date(currentDate),
                })
                currentDate.setDate(currentDate.getDate() + 1)
              }
            } else {
              await addSlot(data)
            }
            setIsAdding(false)
          }}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {/* Предстоящие */}
      <div className="mb-8">
        <h3 className="text-cream-300 text-sm uppercase tracking-wider mb-4">Предстоящие ({upcomingSlots.length})</h3>
        <div className="grid gap-4">
          {upcomingSlots.map((slot) => (
            <div key={slot.id}>
              {editingId === slot.id ? (
                <ScheduleForm
                  slot={slot}
                  items={items}
                  onSubmit={async (data) => {
                    await updateSlot(slot.id, data)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ScheduleCard
                  slot={slot}
                  onEdit={() => setEditingId(slot.id)}
                  onDelete={() => deleteSlot(slot.id)}
                  onToggle={() => updateSlot(slot.id, { isActive: !slot.isActive })}
                />
              )}
            </div>
          ))}
        </div>
        {upcomingSlots.length === 0 && !isAdding && (
          <EmptyState message="Нет запланированных дат. Добавьте первую." />
        )}
      </div>

      {/* Прошедшие */}
      {pastSlots.length > 0 && (
        <div>
          <h3 className="text-cream-500 text-sm uppercase tracking-wider mb-4">Прошедшие ({pastSlots.length})</h3>
          <div className="grid gap-4 opacity-60">
            {pastSlots.slice(0, 5).map((slot) => (
              <ScheduleCard
                key={slot.id}
                slot={slot}
                onEdit={() => {}}
                onDelete={() => deleteSlot(slot.id)}
                onToggle={() => {}}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ScheduleCard({ 
  slot, 
  onEdit, 
  onDelete, 
  onToggle,
  isPast = false 
}: { 
  slot: ScheduleSlot
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
  isPast?: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const spotsLeft = slot.maxParticipants - slot.currentParticipants
  const isFull = spotsLeft <= 0

  return (
    <div className={`bg-navy-900/50 border border-navy-800/50 p-4 rounded ${!slot.isActive && !isPast ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Дата */}
        <div className="w-16 h-16 bg-navy-800 rounded flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-cream-100">{slot.date.getDate()}</span>
          <span className="text-xs text-cream-500 uppercase">
            {slot.date.toLocaleDateString('ru-RU', { month: 'short' })}
          </span>
        </div>

        {/* Инфо */}
        <div className="flex-1 min-w-0">
          <p className="text-cream-100 font-medium truncate">{slot.itemTitle}</p>
          <p className="text-cream-400 text-sm">
            {slot.startTime} – {slot.endTime} • {slot.meetingPoint}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className={`text-sm ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
              {slot.currentParticipants}/{slot.maxParticipants} чел.
            </span>
            {!slot.isActive && <span className="text-yellow-500 text-xs">Неактивно</span>}
          </div>
        </div>

        {/* Кнопки */}
        {!isPast && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className={`p-2 rounded transition-colors ${slot.isActive ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-cream-500 hover:bg-cream-500/10'}`}
              title={slot.isActive ? 'Деактивировать' : 'Активировать'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {slot.isActive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                )}
              </svg>
            </button>
            <button onClick={onEdit} className="p-2 text-cream-400 hover:text-cream-100 transition-colors">
              <EditIcon />
            </button>
            <button onClick={() => setIsDeleting(true)} className="p-2 text-cream-400 hover:text-red-400 transition-colors">
              <DeleteIcon />
            </button>
          </div>
        )}
        
        {isPast && (
          <button onClick={() => setIsDeleting(true)} className="p-2 text-cream-400 hover:text-red-400 transition-colors">
            <DeleteIcon />
          </button>
        )}
      </div>

      {isDeleting && (
        <ConfirmDialog
          message="Удалить эту дату из расписания?"
          onConfirm={() => {
            onDelete()
            setIsDeleting(false)
          }}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

function ScheduleForm({
  slot,
  items,
  onSubmit,
  onCancel
}: {
  slot?: ScheduleSlot
  items: { id: string; title: string; type: 'excursion' | 'tour' }[]
  onSubmit: (data: Omit<ScheduleSlot, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>, dateEnd?: string) => Promise<void>
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    itemId: slot?.itemId || '',
    dateStart: slot?.date.toISOString().split('T')[0] || '',
    dateEnd: '', // Пустое = один день
    startTime: slot?.startTime || '10:00',
    endTime: slot?.endTime || '14:00',
    meetingPoint: slot?.meetingPoint || '',
    maxParticipants: slot?.maxParticipants ? String(slot.maxParticipants) : '10',
    isActive: slot?.isActive ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedItem = items.find(i => i.id === formData.itemId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return
    
    setIsSubmitting(true)
    try {
      await onSubmit({
        type: selectedItem.type,
        itemId: formData.itemId,
        itemTitle: selectedItem.title,
        date: new Date(formData.dateStart),
        startTime: formData.startTime,
        endTime: formData.endTime,
        meetingPoint: formData.meetingPoint,
        maxParticipants: parseInt(formData.maxParticipants) || 10,
        isActive: formData.isActive,
      }, formData.dateEnd || undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-navy-900/50 border border-navy-800/50 p-6 mb-6 rounded">
      <h3 className="font-serif text-lg text-cream-100 mb-6">
        {slot ? 'Редактировать дату' : 'Новая дата'}
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Экскурсия/Тур */}
        <div className="md:col-span-2">
          <label className="block text-cream-300 text-sm mb-2">Экскурсия или тур</label>
          <select
            value={formData.itemId}
            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          >
            <option value="">Выберите...</option>
            <optgroup label="Экскурсии">
              {items.filter(i => i.type === 'excursion').map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </optgroup>
            <optgroup label="Туры">
              {items.filter(i => i.type === 'tour').map(item => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Дата начала */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Дата начала</label>
          <input
            type="date"
            value={formData.dateStart}
            onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Дата окончания (опционально) */}
        {!slot && (
          <div>
            <label className="block text-cream-300 text-sm mb-2">
              Дата окончания <span className="text-cream-500 text-xs">(необязательно)</span>
            </label>
            <input
              type="date"
              value={formData.dateEnd}
              min={formData.dateStart}
              onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
              className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            />
            {formData.dateStart && formData.dateEnd && formData.dateEnd !== formData.dateStart && (
              <p className="text-cream-400 text-xs mt-2">
                📅 Будут созданы даты: {new Date(formData.dateStart).toLocaleDateString('ru-RU')} — {new Date(formData.dateEnd).toLocaleDateString('ru-RU')}
              </p>
            )}
          </div>
        )}

        {/* Макс. участников */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Макс. участников</label>
          <input
            type="text"
            inputMode="numeric"
            value={formData.maxParticipants}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              setFormData({ ...formData, maxParticipants: value })
            }}
            placeholder="10"
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Время начала */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Время начала</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Время окончания */}
        <div>
          <label className="block text-cream-300 text-sm mb-2">Время окончания</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Место встречи */}
        <div className="md:col-span-2">
          <label className="block text-cream-300 text-sm mb-2">Место встречи</label>
          <input
            type="text"
            value={formData.meetingPoint}
            onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
            placeholder="Plaza de Mayo, у памятника"
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 text-cream-100 focus:border-terracotta-500 focus:outline-none rounded"
            required
          />
        </div>

        {/* Активно */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 bg-navy-800 border-navy-700 rounded text-terracotta-500 focus:ring-terracotta-500"
            />
            <span className="text-cream-300 text-sm">Активно (видно для записи)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting || !formData.itemId}
          className="px-6 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 text-sm tracking-wider uppercase transition-colors disabled:opacity-50 rounded"
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-navy-700 text-cream-400 hover:text-cream-100 text-sm tracking-wider uppercase transition-colors rounded"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

// ==================== BOOKINGS SECTION ====================

function BookingsSection() {
  const { bookings, loading, deleteBooking } = useBookings()
  const { slots } = useSchedule()

  if (loading) {
    return <LoadingSpinner />
  }

  // Добавляем информацию о слоте к каждому бронированию
  const bookingsWithSlots = bookings.map(b => ({
    ...b,
    slot: slots.find(s => s.id === b.scheduleId)
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-cream-100">Записи</h2>
          <p className="text-cream-400 text-sm mt-1">Все записи на экскурсии и туры</p>
        </div>
        <div className="text-cream-400 text-sm">
          Всего: {bookings.length} записей ({bookings.reduce((sum, b) => sum + b.participantsCount, 0)} чел.)
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState message="Пока нет записей" />
      ) : (
        <div className="space-y-4">
          {bookingsWithSlots.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              slot={booking.slot}
              onDelete={() => deleteBooking(booking)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BookingCard({
  booking,
  slot,
  onDelete
}: {
  booking: Booking
  slot?: ScheduleSlot
  onDelete: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <div className="bg-navy-900/50 border border-navy-800/50 p-4 rounded">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cream-100 font-medium">{booking.name}</p>
          <p className="text-cream-400 text-sm">
            {booking.participantsCount} чел. • {slot?.itemTitle || 'Неизвестно'}
          </p>
          {slot && (
            <p className="text-cream-500 text-xs mt-1">
              {slot.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в {slot.startTime}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cream-500 text-xs">
            {booking.createdAt.toLocaleDateString('ru-RU')}
          </span>
          <button
            onClick={() => setIsDeleting(true)}
            className="p-2 text-cream-400 hover:text-red-400 transition-colors"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      {isDeleting && (
        <ConfirmDialog
          message={`Удалить запись ${booking.name}? Освободится ${booking.participantsCount} мест.`}
          onConfirm={() => {
            onDelete()
            setIsDeleting(false)
          }}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

// ==================== SHARED COMPONENTS ====================

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-10 h-10 border-4 border-navy-700 border-t-terracotta-500 rounded-full animate-spin" />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-cream-500">
      <p>{message}</p>
    </div>
  )
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-navy-950/90" onClick={onCancel} />
      <div className="relative bg-navy-900 border border-navy-700 p-6 max-w-sm mx-4">
        <p className="text-cream-100 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
          >
            Удалить
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-navy-700 text-cream-400 hover:text-cream-100 text-sm transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
