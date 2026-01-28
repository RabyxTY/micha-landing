// Структура данных для туров - легко добавлять новые страны и города

export interface TourFeature {
  text: string
}

export interface Tour {
  id: string
  city: string
  country: string
  title: string
  description: string
  features: string[]
  format: string
  accent: string
  // Флаг для отображения на главной странице
  featured: boolean
}

export interface AuthorTour {
  id: string
  title: string
  description: string
  ctaText: string
}

export interface PremiumOffer {
  id: string
  name: string
  audience: string
  features: string[]
  price: string
}

// Основные туры по городам
export const cityTours: Tour[] = [
  {
    id: 'buenos-aires',
    city: 'Буэнос-Айрес',
    country: 'Аргентина',
    title: 'Столица, которая помнит всё',
    description: 'Индивидуальные экскурсии по историческим кварталам, литературным местам и культурным пространствам города. Маршруты адаптируются под ваши интересы: от аргентинского танго и архитектуры до политической истории XX века.',
    features: [
      'Персональный гид на полный день',
      'Маршрут под ваши интересы',
      'Рекомендации по ресторанам',
      'Организация логистики',
    ],
    format: '4–8 часов',
    accent: 'from-navy-700 to-navy-900',
    featured: true,
  },
  {
    id: 'rio-de-janeiro',
    city: 'Рио-де-Жанейро',
    country: 'Бразилия',
    title: 'Город контрастов и смыслов',
    description: 'Индивидуальные экскурсии, которые выходят за пределы пляжей и статуй. История колониальной Бразилии, музыкальная культура, социальная география города. Понимание того, как устроен Рио изнутри.',
    features: [
      'Персональное сопровождение',
      'Культурологический контекст',
      'Нестандартные локации',
      'Полное сопровождение',
    ],
    format: '4–8 часов',
    accent: 'from-terracotta-600 to-terracotta-800',
    featured: true,
  },
  // Пример: как добавить новый тур (Перу)
  // {
  //   id: 'lima',
  //   city: 'Лима',
  //   country: 'Перу',
  //   title: 'Столица гастрономии Южной Америки',
  //   description: 'Кулинарные традиции, колониальная архитектура и доинкские цивилизации. Лима — город, где встречаются все культуры Перу.',
  //   features: [
  //     'Гастрономический маршрут',
  //     'Исторический центр',
  //     'Музеи и галереи',
  //     'Местная кухня',
  //   ],
  //   format: '4–8 часов',
  //   accent: 'from-amber-600 to-amber-800',
  //   featured: true,
  // },
  // {
  //   id: 'cusco',
  //   city: 'Куско',
  //   country: 'Перу',
  //   title: 'Сердце империи инков',
  //   description: 'Древняя столица инков, где каждый камень хранит тысячелетнюю историю. Мачу-Пикчу, Священная долина и живая культура кечуа.',
  //   features: [
  //     'Мачу-Пикчу',
  //     'Священная долина',
  //     'Инкские руины',
  //     'Андская культура',
  //   ],
  //   format: '2–5 дней',
  //   accent: 'from-emerald-700 to-emerald-900',
  //   featured: false,
  // },
]

// Авторские туры
export const authorTours: AuthorTour[] = [
  {
    id: 'multi-day',
    title: 'Авторские туры',
    description: 'Многодневные программы от 3 до 14 дней. Винодельческие регионы Аргентины, исторические города Бразилии, природные достопримечательности. Полная организация маршрута.',
    ctaText: 'Узнать подробнее →',
  },
  {
    id: 'consultation',
    title: 'Консультация',
    description: 'Видеоконсультация 60–90 минут для самостоятельных путешественников. Персональные рекомендации по маршруту, безопасности, культурным особенностям.',
    ctaText: 'Записаться →',
  },
]

// Премиум офферы
export const premiumOffers: PremiumOffer[] = [
  {
    id: 'executive',
    name: 'Executive Day Tour',
    audience: 'Деловые путешественники с ограниченным временем',
    features: ['Персональный гид на 6–8 часов', 'Трансфер бизнес-класса', 'Обед fine dining', 'Гибкий маршрут'],
    price: 'от $800/день',
  },
  {
    id: 'immersion',
    name: 'Private Cultural Immersion',
    audience: 'Семьи и пары, ценящие приватность и глубину',
    features: ['Программа на 3–5 дней', 'Закрытые визиты', 'Ассистент 24/7', 'Лучшие отели'],
    price: 'от $3,500 за 3 дня',
  },
  {
    id: 'grand-tour',
    name: 'Latin America Grand Tour',
    audience: 'Те, кто хочет глубоко изучить регион',
    features: ['Маршрут 7–14 дней', 'Бизнес-класс перелёты', 'Отели 5*', 'Консьерж-сервис'],
    price: 'от $12,000 за 7 дней',
  },
]

// Получить только featured туры для главной страницы
export const getFeaturedTours = () => cityTours.filter(tour => tour.featured)

// Получить туры по стране
export const getToursByCountry = (country: string) => 
  cityTours.filter(tour => tour.country === country)

// Получить список уникальных стран
export const getCountries = () => 
  [...new Set(cityTours.map(tour => tour.country))]

// Культурные заметки (блог)
export interface CultureNote {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
}

export const cultureNotes: CultureNote[] = [
  {
    id: 'peronism',
    title: 'Перонизм как культурный код: почему Аргентина делится на peronistas и antiperonistas',
    excerpt: 'Феномен, определяющий политическую идентичность страны уже семьдесят лет. Как один человек создал движение, которое невозможно классифицировать.',
    category: 'Политика',
    readTime: '12 мин',
    date: '2025-12-15',
  },
  {
    id: 'niemeyer',
    title: 'Оскар Нимейер и бразильский модернизм: как архитектура стала манифестом нации',
    excerpt: 'История о том, как изогнутые линии бетона отразили мечту о новой Бразилии. Бразилиа, Рио и наследие великого архитектора.',
    category: 'Архитектура',
    readTime: '15 мин',
    date: '2025-11-28',
  },
  {
    id: 'favelas',
    title: 'Фавелы Рио: социальная география между мифом и реальностью',
    excerpt: 'Деконструкция стереотипов о неформальных поселениях. Как 1,5 миллиона человек создали параллельную городскую культуру.',
    category: 'Социология',
    readTime: '18 мин',
    date: '2025-10-12',
  },
]

// PDF-гайды для скачивания
export interface PdfGuide {
  id: string
  title: string
  description: string
  pages: number
  downloadUrl: string
  coverColor: string
}

export const pdfGuides: PdfGuide[] = [
  {
    id: 'ba-essential',
    title: 'Буэнос-Айрес: глубокий гид',
    description: 'Маршруты, рестораны, культурные коды. Всё, что нужно знать перед поездкой.',
    pages: 48,
    downloadUrl: '/guides/buenos-aires-essential.pdf',
    coverColor: 'from-navy-700 to-navy-900',
  },
  {
    id: 'rio-essential',
    title: 'Рио-де-Жанейро: за пределами пляжей',
    description: 'История, музыка, архитектура. Город глазами исследователя культуры.',
    pages: 52,
    downloadUrl: '/guides/rio-essential.pdf',
    coverColor: 'from-terracotta-600 to-terracotta-800',
  },
  {
    id: 'safety-latam',
    title: 'Безопасность в Латинской Америке',
    description: 'Практические рекомендации для самостоятельных путешественников.',
    pages: 24,
    downloadUrl: '/guides/safety-latam.pdf',
    coverColor: 'from-charcoal-600 to-charcoal-800',
  },
]