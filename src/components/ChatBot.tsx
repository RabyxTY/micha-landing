import { useState } from 'react'

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const quickQuestions = [
    'Сколько стоит экскурсия?',
    'Как забронировать тур?',
    'Какие города доступны?',
    'Нужна ли виза?',
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Здесь можно интегрировать с реальным чат-ботом или отправить в WhatsApp/Telegram
      const whatsappUrl = `https://wa.me/79037634431?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      setMessage('')
      setIsOpen(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    const whatsappUrl = `https://wa.me/79037634431?text=${encodeURIComponent(question)}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border border-cream-200 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-navy-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-terracotta-600 rounded-full flex items-center justify-center">
                <span className="text-cream-50 font-serif text-lg">М</span>
              </div>
              <div>
                <p className="text-cream-50 font-medium text-sm">Михаил Дьяконов</p>
                <p className="text-cream-400 text-xs">Обычно отвечаю в течение часа</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-cream-400 hover:text-cream-100 transition-colors"
              aria-label="Закрыть чат"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Welcome Message */}
            <div className="bg-cream-100 p-4 mb-4">
              <p className="text-charcoal-700 text-sm leading-relaxed">
                Здравствуйте! Я помогу вам спланировать путешествие по Латинской Америке. Задайте вопрос или выберите тему ниже.
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2 mb-4">
              <p className="text-charcoal-500 text-xs uppercase tracking-wider mb-2">Частые вопросы</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left px-4 py-2 border border-cream-200 text-charcoal-700 text-sm hover:border-terracotta-400 hover:bg-cream-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ваш вопрос..."
                className="flex-1 px-4 py-3 border border-cream-200 focus:border-terracotta-400 focus:outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-4 py-3 bg-terracotta-600 hover:bg-terracotta-700 disabled:bg-cream-300 text-cream-50 transition-colors"
                aria-label="Отправить"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Powered by */}
            <p className="text-center text-charcoal-400 text-xs mt-4">
              Ответ через WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isOpen ? 'rotate-0' : ''}`}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Pulse Animation when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cream-100 rounded-full animate-ping" />
        )}
      </button>
    </>
  )
}
