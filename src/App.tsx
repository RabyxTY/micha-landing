import { useState, useRef, useCallback } from 'react'
import { TourCard } from './components/TourCard'
import { ChatBot } from './components/ChatBot'
import { AdminLoginModal } from './components/AdminLoginModal'
import { getFeaturedTours, authorTours, premiumOffers, cultureNotes as staticCultureNotes, pdfGuides } from './data/tours'
import { usePublicExcursions, usePublicTours, usePublicNotes } from './hooks/usePublicContent'
import { usePageView } from './hooks/useStats'

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '#home', label: 'Главная' },
    { href: '#about', label: 'Обо мне' },
    { href: '#services', label: 'Услуги' },
    { href: '#notes', label: 'Заметки' },
    { href: '#guides', label: 'Гайды' },
    { href: '#contact', label: 'Контакты' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-sm border-b border-navy-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" className="font-serif text-2xl text-cream-100 tracking-wide">
            Михаил Дьяконов
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-cream-200 hover:text-terracotta-400 transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cream-100 p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-navy-800/50">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-cream-200 hover:text-terracotta-400 transition-colors text-sm tracking-widest uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-navy-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Location Tags */}
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="text-terracotta-400 text-sm tracking-[0.3em] uppercase font-medium">
              Буэнос-Айрес
            </span>
            <span className="text-charcoal-500">|</span>
            <span className="text-terracotta-400 text-sm tracking-[0.3em] uppercase font-medium">
              Рио-де-Жанейро
            </span>
            <span className="text-charcoal-500">|</span>
            <span className="text-terracotta-400 text-sm tracking-[0.3em] uppercase font-medium">
              Авторские туры
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream-50 leading-tight mb-6">
            Буэнос-Айрес. Рио-де-Жанейро.
            <br />
            <span className="text-cream-300 italic">Латинская Америка.</span>
          </h1>

          <p className="font-serif text-3xl md:text-4xl text-cream-400 mb-8 italic">
            Глубже, чем туризм.
          </p>

          {/* Subtitle */}
          <p className="text-cream-300 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
            Персональные экскурсии от кандидата наук и исследователя культуры. 
            Аргентина и Бразилия через призму истории, антропологии и современной действительности.
          </p>

          {/* CTA Button */}
          <a
            href="#contact"
            className="inline-flex items-center px-10 py-4 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 transition-all duration-300 tracking-widest uppercase text-sm font-medium group"
          >
            Обсудить маршрут
            <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          {/* Features */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-navy-800/50">
            <div className="flex items-center gap-3 text-cream-400">
              <svg className="w-5 h-5 text-terracotta-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Персональный подход</span>
            </div>
            <div className="flex items-center gap-3 text-cream-400">
              <svg className="w-5 h-5 text-terracotta-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Безопасность</span>
            </div>
            <div className="flex items-center gap-3 text-cream-400">
              <svg className="w-5 h-5 text-terracotta-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Экспертность</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

// About Section
function AboutSection() {
  const facts = [
    { icon: '🎓', title: 'Кандидат наук', desc: 'Академический подход к культуре региона' },
    { icon: '🌎', title: 'Два города', desc: 'Постоянная база в Буэнос-Айресе и Рио-де-Жанейро' },
    { icon: '🗣', title: 'Два языка', desc: 'Свободное владение испанским и португальским' },
    { icon: '📚', title: 'Исследователь', desc: 'Глубокое понимание истории и антропологии' },
  ]

  return (
    <section id="about" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img 
                src="/images/guide-1.jpg" 
                alt="Михаил Дьяконов — персональный гид по Латинской Америке"
                className="w-full h-full object-cover"
              />
              {/* Decorative Frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-terracotta-400 -z-10" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-terracotta-600 text-sm tracking-[0.3em] uppercase mb-4">Обо мне</p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy-900 mb-4">
              Михаил Дьяконов
            </h2>
            <p className="font-serif text-xl text-navy-600 italic mb-8">
              Кандидат наук. Исследователь культуры. Персональный гид.
            </p>

            <div className="space-y-6 text-charcoal-700 leading-relaxed">
              <p>
                Меня зовут Михаил Дьяконов. Я — кандидат наук, исследователь культуры Латинской Америки 
                и практикующий гид в двух странах: Аргентине и Бразилии.
              </p>
              <p>
                Более десяти лет я изучаю историю, антропологию и современную жизнь этого региона. 
                Жил и работал в Буэнос-Айресе и Рио-де-Жанейро. Говорю на испанском и португальском.
              </p>
              <p>
                Моя работа — это не стандартные туристические маршруты. Это структурированное погружение 
                в культурный контекст. Я показываю города так, как их видят местные интеллектуалы: 
                через архитектуру, литературу, музыку, кулинарные традиции и повседневную жизнь.
              </p>
            </div>

            {/* Quote */}
            <blockquote className="mt-10 pl-6 border-l-2 border-terracotta-400">
              <p className="font-serif text-xl text-navy-800 italic">
                «Латинская Америка — это не экзотика. Это сложная, противоречивая и интеллектуально 
                богатая территория. Я помогу вам её понять.»
              </p>
            </blockquote>
          </div>
        </div>

        {/* Facts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {facts.map((fact, index) => (
            <div 
              key={index} 
              className="bg-white p-8 border border-cream-200 hover:border-terracotta-300 transition-colors duration-300"
            >
              <span className="text-3xl mb-4 block">{fact.icon}</span>
              <h3 className="font-serif text-xl text-navy-900 mb-2">{fact.title}</h3>
              <p className="text-charcoal-600 text-sm">{fact.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Credentials Section
function CredentialsSection() {
  const credentials = [
    { 
      title: 'Кандидат исторических наук',
      institution: 'Институт Латинской Америки РАН',
      year: '2015',
      desc: 'Диссертация по культурной антропологии региона'
    },
    { 
      title: 'Сертифицированный гид',
      institution: 'Аргентина',
      year: '2018',
      desc: 'Официальная аккредитация Министерства туризма'
    },
    { 
      title: 'Сертифицированный гид',
      institution: 'Бразилия',
      year: '2019',
      desc: 'Официальная аккредитация EMBRATUR'
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-terracotta-400 text-sm tracking-[0.3em] uppercase mb-4">Квалификация</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6">
            Образование и сертификаты
          </h2>
          <p className="text-cream-300 max-w-2xl mx-auto">
            Академический фундамент и официальные аккредитации для профессиональной работы 
            в сфере культурного туризма
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {credentials.map((cred, index) => (
            <div 
              key={index}
              className="bg-navy-800/50 border border-navy-700/50 p-8 hover:border-terracotta-500/50 transition-colors duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-terracotta-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-terracotta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-terracotta-400 text-sm">{cred.year}</span>
              </div>
              <h3 className="font-serif text-xl text-cream-100 mb-2">{cred.title}</h3>
              <p className="text-cream-400 text-sm mb-4">{cred.institution}</p>
              <p className="text-cream-500 text-sm">{cred.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Services Section
function ServicesSection() {
  const featuredTours = getFeaturedTours()
  const { excursions, loading: excursionsLoading } = usePublicExcursions()
  const { tours: firestoreTours, loading: toursLoading } = usePublicTours()

  // Маппинг городов на русский
  const cityLabels: Record<string, string> = {
    'buenos-aires': 'Буэнос-Айрес',
    'rio-de-janeiro': 'Рио-де-Жанейро',
    'sao-paulo': 'Сан-Паулу',
    'lima': 'Лима',
    'cusco': 'Куско',
    'santiago': 'Сантьяго',
    'montevideo': 'Монтевидео',
    'bogota': 'Богота',
    'cartagena': 'Картахена',
    'havana': 'Гавана',
  }

  // Конвертируем экскурсии из Firestore в формат TourCard
  const firestoreExcursionsAsTours = excursions.map(exc => {
    const cityLabel = cityLabels[exc.city] || exc.city
    const isArgentina = ['buenos-aires', 'mendoza', 'cordoba'].includes(exc.city)
    
    return {
      id: exc.id,
      firestoreId: exc.id, // ID для бронирования
      city: cityLabel,
      country: isArgentina ? 'Аргентина' : 'Бразилия',
      title: exc.title,
      description: exc.description,
      features: exc.features,
      format: `${exc.duration} ч.`,
      accent: isArgentina ? 'from-navy-700 to-navy-900' : 'from-terracotta-600 to-terracotta-800',
      featured: true,
      price: `от $${exc.price}`,
      photoUrl: exc.photoUrl,
    }
  })

  // Используем данные из Firestore если они есть, иначе fallback на статические
  const displayTours = excursions.length > 0 ? firestoreExcursionsAsTours : featuredTours

  return (
    <section id="services" className="py-24 lg:py-32 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm tracking-[0.3em] uppercase mb-4">Услуги</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy-900 mb-6">
            Персональные экскурсии
          </h2>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Индивидуальные программы по Аргентине и Бразилии для тех, 
            кто ценит глубину и качество
          </p>
        </div>

        {/* Loading State */}
        {excursionsLoading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-cream-300 border-t-terracotta-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Tour Cards - используем компонент TourCard */}
        {!excursionsLoading && (
          <div className="grid lg:grid-cols-2 gap-8">
            {displayTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}

        {/* Авторские туры из Firestore */}
        {!toursLoading && firestoreTours.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {firestoreTours.map((tour) => {
              // Маппинг стран на русский
              const countryLabels: Record<string, string> = {
                argentina: 'Аргентина',
                brazil: 'Бразилия',
                peru: 'Перу',
                chile: 'Чили',
                uruguay: 'Уругвай',
                colombia: 'Колумбия',
                cuba: 'Куба',
                mexico: 'Мексика',
                ecuador: 'Эквадор',
                bolivia: 'Боливия',
              }
              const countryLabel = countryLabels[tour.country] || tour.country
              
              return (
                <div key={tour.id} className="bg-white border border-cream-200 p-8 hover:border-terracotta-300 transition-colors">
                  {tour.photoUrl && (
                    <div className="aspect-video mb-4 overflow-hidden -mx-8 -mt-8">
                      <img src={tour.photoUrl} alt={tour.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="inline-block px-2 py-1 bg-navy-100 text-navy-700 text-xs uppercase tracking-wider mb-4">
                    {countryLabel}
                  </span>
                  <h3 className="font-serif text-2xl text-navy-900 mb-4">{tour.title}</h3>
                  <p className="text-charcoal-600 mb-4 line-clamp-3">{tour.description}</p>
                  <div className="flex gap-4 text-charcoal-500 text-sm mb-6">
                    <span>от ${tour.price}</span>
                    <span>|</span>
                    <span>{tour.duration} дн.</span>
                  </div>
                  <a href="#contact" className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium tracking-wider uppercase">
                    Узнать подробнее →
                  </a>
                </div>
              )
            })}
          </div>
        )}

        {/* Additional Services - из данных authorTours (fallback) */}
        {(firestoreTours.length === 0 || toursLoading) && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {authorTours.map((tour) => (
              <div key={tour.id} className="bg-white border border-cream-200 p-8">
                <h3 className="font-serif text-2xl text-navy-900 mb-4">{tour.title}</h3>
                <p className="text-charcoal-600 mb-6">{tour.description}</p>
                <a href="#contact" className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium tracking-wider uppercase">
                  {tour.ctaText}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Premium Offers Section
function PremiumSection() {
  return (
    <section className="py-24 lg:py-32 bg-navy-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-terracotta-400 text-sm tracking-[0.3em] uppercase mb-4">Премиум</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6">
            Персональный сервис без компромиссов
          </h2>
          <p className="text-cream-300 max-w-2xl mx-auto">
            Для тех, кто ценит качество, безопасность и глубину
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {premiumOffers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-gradient-to-b from-navy-800/50 to-navy-900/50 border border-navy-700/50 p-8 relative group hover:border-terracotta-500/50 transition-all duration-500"
            >
              {/* Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta-500 to-terracotta-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              
              <h3 className="font-serif text-2xl text-cream-100 mb-2">{offer.name}</h3>
              <p className="text-cream-400 text-sm mb-6">{offer.audience}</p>
              
              <ul className="space-y-3 mb-8">
                {offer.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-cream-300 text-sm">
                    <svg className="w-4 h-4 text-terracotta-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-navy-700/50">
                <p className="text-terracotta-400 font-serif text-xl">{offer.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Package */}
        <div className="mt-12 bg-navy-800/30 border border-navy-700/50 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl text-cream-100 mb-2">Security-First Package</h3>
              <p className="text-cream-400 mb-4">Для VIP-гостей, для которых безопасность — приоритет</p>
              <p className="text-cream-300 text-sm">
                Предварительный аудит безопасности маршрута, транспорт с профессиональным водителем, 
                сопровождение 24/7, прямая связь с локальными службами, резервные планы.
              </p>
            </div>
            <a 
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-terracotta-500 text-terracotta-400 hover:bg-terracotta-500 hover:text-cream-50 transition-all duration-300 tracking-widest uppercase text-sm whitespace-nowrap"
            >
              Запросить
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Reviews Section
function ReviewsSection() {
  const reviews = [
    {
      text: 'Михаил — редкий случай, когда гид действительно понимает, о чём говорит. Его экскурсия по Буэнос-Айресу была больше похожа на лекцию профессора, только на улицах города. Без пустых восторгов — только суть.',
      name: 'Александр К.',
      location: 'Москва',
      role: 'Предприниматель, IT-сектор',
    },
    {
      text: 'Мы с женой много путешествуем и привыкли к определённому уровню сервиса. Михаил полностью ему соответствует. Всё было организовано безупречно: от трансферов до бронирований. Но главное — это глубина его знаний о регионе.',
      name: 'Дмитрий С.',
      location: 'Санкт-Петербург',
      role: 'Управляющий партнёр, финансовый сектор',
    },
    {
      text: 'Я приехала в Рио на три дня по работе и хотела за это время понять город. Михаил составил маршрут, который за один день дал мне больше, чем неделя самостоятельных прогулок.',
      name: 'Мария Л.',
      location: 'Лондон',
      role: 'Директор по маркетингу, FMCG',
    },
    {
      text: 'Для меня было важно понять культурный контекст Аргентины перед деловыми переговорами. Консультация с Михаилом оказалась бесценной — он объяснил то, что не прочитаешь ни в одном путеводителе.',
      name: 'Игорь Н.',
      location: 'Дубай',
      role: 'CEO, международный консалтинг',
    },
  ]

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm tracking-[0.3em] uppercase mb-4">Отзывы</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy-900 mb-6">
            Что говорят гости
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white border border-cream-200 p-8 lg:p-10 relative"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-8 text-cream-200 font-serif text-8xl leading-none">"</div>
              
              <p className="text-charcoal-700 leading-relaxed mb-8 relative z-10">
                {review.text}
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-cream-200">
                <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                  <span className="text-navy-600 font-serif text-lg">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-navy-900">{review.name}, {review.location}</p>
                  <p className="text-charcoal-500 text-sm">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Principles Section
function PrinciplesSection() {
  const principles = [
    {
      title: 'Академический подход',
      desc: 'Каждая экскурсия основана на исследованиях, а не на туристических шаблонах. Я рассказываю то, что знаю — не то, что ожидают услышать.',
    },
    {
      title: 'Персональный формат',
      desc: 'Никаких групповых туров. Только индивидуальная работа или малые группы до 4 человек. Ваш маршрут — только ваш.',
    },
    {
      title: 'Безопасность',
      desc: 'Латинская Америка требует понимания контекста. Я знаю, куда можно идти, а куда не стоит. Все маршруты проверены лично.',
    },
    {
      title: 'Глубина, а не охват',
      desc: 'Лучше увидеть три места и понять их, чем пробежать двадцать. Качество впечатлений важнее их количества.',
    },
    {
      title: 'Без посредников',
      desc: 'Вы работаете напрямую со мной. Никаких агентств, субподрядчиков и скрытых комиссий.',
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-terracotta-400 text-sm tracking-[0.3em] uppercase mb-4">Подход</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6">
            Принципы работы
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {principles.map((principle, index) => (
            <div key={index} className="relative pl-8 border-l border-navy-700">
              <h3 className="font-serif text-xl text-cream-100 mb-3">{principle.title}</h3>
              <p className="text-cream-400 text-sm leading-relaxed">{principle.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Culture Notes Section (Blog)
function CultureNotesSection() {
  const { notes: firestoreNotes, loading } = usePublicNotes()

  // Используем заметки из Firestore если есть, иначе статические
  const displayNotes = firestoreNotes.length > 0 
    ? firestoreNotes.map(note => ({
        id: note.id,
        title: note.title,
        excerpt: note.content.substring(0, 200) + (note.content.length > 200 ? '...' : ''),
        category: note.category,
        date: note.createdAt.toISOString(),
        readTime: `${Math.max(1, Math.ceil(note.content.length / 1000))} мин`,
      }))
    : staticCultureNotes

  return (
    <section id="notes" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-terracotta-600 text-sm tracking-[0.3em] uppercase mb-4">Заметки</p>
          <h2 className="font-serif text-4xl md:text-5xl text-navy-900 mb-6">
            О культуре региона
          </h2>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Эссе и исследования о политике, архитектуре и социальной жизни Латинской Америки
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-cream-300 border-t-terracotta-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Notes Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayNotes.map((note) => (
              <article 
                key={note.id}
                className="bg-white border border-cream-200 group hover:border-terracotta-300 transition-all duration-300"
              >
                {/* Category Badge */}
                <div className="p-6 pb-0">
                  <span className="inline-block px-3 py-1 bg-navy-100 text-navy-700 text-xs tracking-wider uppercase">
                    {note.category}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-navy-900 mb-3 leading-tight group-hover:text-terracotta-700 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed mb-6">
                    {note.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-cream-200">
                    <span className="text-charcoal-500 text-xs">
                      {new Date(note.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="text-charcoal-500 text-xs flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {note.readTime}
                    </span>
                  </div>
                </div>

                {/* Read More */}
                <div className="px-6 pb-6">
                  <a 
                    href={`#note-${note.id}`}
                    className="inline-flex items-center text-terracotta-600 hover:text-terracotta-700 text-sm font-medium tracking-wider uppercase group/link"
                  >
                    Читать
                    <svg className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayNotes.length === 0 && (
          <p className="text-center text-charcoal-500">Заметки скоро появятся</p>
        )}
      </div>
    </section>
  )
}

// PDF Guides Section
function GuidesSection() {
  const handleDownload = (downloadUrl: string, title: string) => {
    // Создаём ссылку для скачивания
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '-')}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="guides" className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-terracotta-400 text-sm tracking-[0.3em] uppercase mb-4">Гайды</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream-50 mb-6">
            Материалы для подготовки
          </h2>
          <p className="text-cream-300 max-w-2xl mx-auto">
            PDF-гайды с практической информацией. Скачайте бесплатно и готовьтесь к путешествию
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pdfGuides.map((guide) => (
            <div 
              key={guide.id}
              className="bg-navy-800/50 border border-navy-700/50 overflow-hidden group hover:border-terracotta-500/50 transition-all duration-300"
            >
              {/* Cover Accent */}
              <div className={`h-2 bg-gradient-to-r ${guide.coverColor}`} />
              
              {/* Content */}
              <div className="p-8">
                {/* PDF Icon */}
                <div className="w-14 h-14 bg-navy-700/50 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-terracotta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-6 4h4" />
                  </svg>
                </div>

                <h3 className="font-serif text-xl text-cream-100 mb-3">
                  {guide.title}
                </h3>
                <p className="text-cream-400 text-sm leading-relaxed mb-6">
                  {guide.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-6 text-cream-500 text-xs">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {guide.pages} страниц
                  </span>
                  <span>PDF</span>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(guide.downloadUrl, guide.title)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-terracotta-500 text-terracotta-400 hover:bg-terracotta-500 hover:text-cream-50 transition-all duration-300 text-sm tracking-wider uppercase"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Скачать PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Note */}
        <div className="mt-12 text-center">
          <p className="text-cream-500 text-sm">
            Нужен индивидуальный гайд? 
            <a href="#contact" className="text-terracotta-400 hover:text-terracotta-300 ml-2 underline underline-offset-4">
              Напишите мне
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dates: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log('Form submitted:', formData)
    alert('Спасибо за заявку. Я свяжусь с вами в течение 24 часов.')
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Content */}
          <div>
            <p className="text-terracotta-600 text-sm tracking-[0.3em] uppercase mb-4">Контакты</p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy-900 mb-6">
              Обсудим ваш маршрут
            </h2>
            <p className="text-charcoal-600 leading-relaxed mb-10">
              Расскажите о ваших планах, интересах и датах поездки. 
              Я отвечу в течение 24 часов и предложу оптимальный формат.
            </p>

            {/* Direct Contact */}
            <div className="space-y-6">
              <a 
                href="https://wa.me/79037634431"
                className="flex items-center gap-4 text-navy-800 hover:text-terracotta-600 transition-colors group"
              >
                <div className="w-12 h-12 bg-white border border-cream-200 flex items-center justify-center group-hover:border-terracotta-300 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <span className="font-medium block">Написать в WhatsApp</span>
                  <span className="text-sm text-charcoal-500">+7 903 763-44-31</span>
                </div>
              </a>

              <a 
                href="https://t.me/Dyakonov_world"
                className="flex items-center gap-4 text-navy-800 hover:text-terracotta-600 transition-colors group"
              >
                <div className="w-12 h-12 bg-white border border-cream-200 flex items-center justify-center group-hover:border-terracotta-300 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div>
                  <span className="font-medium block">Написать в Telegram</span>
                  <span className="text-sm text-charcoal-500">@Dyakonov_world</span>
                </div>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-cream-200 p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-charcoal-700 mb-2">Имя</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-cream-200 focus:border-terracotta-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-charcoal-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-cream-200 focus:border-terracotta-400 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-charcoal-700 mb-2">Телефон / WhatsApp</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-cream-200 focus:border-terracotta-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dates" className="block text-sm text-charcoal-700 mb-2">Даты поездки (примерные)</label>
                <input
                  type="text"
                  id="dates"
                  value={formData.dates}
                  onChange={(e) => setFormData({...formData, dates: e.target.value})}
                  className="w-full px-4 py-3 border border-cream-200 focus:border-terracotta-400 focus:outline-none transition-colors"
                  placeholder="например, март 2026"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-charcoal-700 mb-2">Комментарий</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-cream-200 focus:border-terracotta-400 focus:outline-none transition-colors resize-none"
                  placeholder="Расскажите о ваших интересах и пожеланиях"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 transition-colors tracking-widest uppercase text-sm font-medium"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const [footerEmail, setFooterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  
  // Скрытая логика входа в админ-панель
  const clickCountRef = useRef(0)
  const lastClickTimeRef = useRef(0)
  const REQUIRED_CLICKS = 5
  const CLICK_TIMEOUT = 2000 // 2 секунды между кликами максимум

  const handleCopyrightClick = useCallback(() => {
    const now = Date.now()
    
    // Сбрасываем счётчик, если прошло слишком много времени с последнего клика
    if (now - lastClickTimeRef.current > CLICK_TIMEOUT) {
      clickCountRef.current = 0
    }
    
    lastClickTimeRef.current = now
    clickCountRef.current += 1
    
    // При достижении 5 кликов открываем модальное окно
    if (clickCountRef.current >= REQUIRED_CLICKS) {
      clickCountRef.current = 0
      setShowAdminModal(true)
    }
  }, [])

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (footerEmail.trim()) {
      // Здесь можно добавить интеграцию с email-сервисом
      console.log('Newsletter subscription:', footerEmail)
      setSubscribed(true)
      setFooterEmail('')
    }
  }

  return (
    <footer className="bg-navy-950 border-t border-navy-800/50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif text-2xl text-cream-100 mb-3">Михаил Дьяконов</p>
            <p className="text-cream-400 text-sm leading-relaxed mb-6">
              Персональный гид по Латинской Америке. Буэнос-Айрес, Рио-де-Жанейро и авторские туры.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/79037634431" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-navy-700 flex items-center justify-center text-cream-400 hover:text-terracotta-400 hover:border-terracotta-500 transition-colors" 
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/Dyakonov_world" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-navy-700 flex items-center justify-center text-cream-400 hover:text-terracotta-400 hover:border-terracotta-500 transition-colors" 
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
            {/* Contact Info */}
            <div className="mt-4 text-cream-400 text-sm space-y-1">
              <p>WhatsApp: +7 903 763-44-31</p>
              <p>Telegram: @Dyakonov_world</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream-100 font-medium mb-4 tracking-wider uppercase text-sm">Навигация</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Главная</a></li>
              <li><a href="#about" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Обо мне</a></li>
              <li><a href="#services" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Услуги</a></li>
              <li><a href="#notes" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Заметки</a></li>
              <li><a href="#guides" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Гайды</a></li>
              <li><a href="#contact" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Контакты</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-cream-100 font-medium mb-4 tracking-wider uppercase text-sm">Услуги</h4>
            <ul className="space-y-3">
              <li><a href="#services" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Буэнос-Айрес</a></li>
              <li><a href="#services" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Рио-де-Жанейро</a></li>
              <li><a href="#services" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Авторские туры</a></li>
              <li><a href="#services" className="text-cream-400 hover:text-terracotta-400 transition-colors text-sm">Консультации</a></li>
            </ul>
          </div>

          {/* Newsletter / Quick Contact */}
          <div>
            <h4 className="text-cream-100 font-medium mb-4 tracking-wider uppercase text-sm">Быстрая связь</h4>
            {subscribed ? (
              <div className="bg-navy-800/50 border border-navy-700 p-4">
                <p className="text-terracotta-400 text-sm">Спасибо за подписку</p>
                <p className="text-cream-400 text-xs mt-1">Я свяжусь с вами в ближайшее время</p>
              </div>
            ) : (
              <form onSubmit={handleFooterSubmit} className="space-y-3">
                <p className="text-cream-400 text-sm mb-3">
                  Оставьте email — я пришлю полезные материалы о путешествиях
                </p>
                <div className="flex">
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="Ваш email"
                    className="flex-1 px-4 py-3 bg-navy-800/50 border border-navy-700 text-cream-100 placeholder-cream-500 focus:border-terracotta-500 focus:outline-none text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 transition-colors"
                    aria-label="Подписаться"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-navy-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-cream-500 text-sm">
              <span 
                onClick={handleCopyrightClick}
                className="cursor-default select-none"
                role="button"
                tabIndex={-1}
                aria-hidden="true"
              >©</span> {new Date().getFullYear()} Михаил Дьяконов. Все права защищены.
            </p>
            <div className="flex items-center gap-6 text-cream-500 text-sm">
              <span>Буэнос-Айрес, Аргентина</span>
              <span className="hidden sm:inline">|</span>
              <span>Рио-де-Жанейро, Бразилия</span>
            </div>
          </div>
        </div>
      </div>

      {/* Скрытое модальное окно для входа в админ-панель */}
      <AdminLoginModal 
        isOpen={showAdminModal} 
        onClose={() => setShowAdminModal(false)} 
      />
    </footer>
  )
}

// Main App Component
function App() {
  // Трекинг просмотров страниц
  usePageView()

  return (
    <div className="antialiased">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <CredentialsSection />
        <ServicesSection />
        <PremiumSection />
        <ReviewsSection />
        <PrinciplesSection />
        <CultureNotesSection />
        <GuidesSection />
        <ContactSection />
      </main>
      <Footer />
      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  )
}

export default App
