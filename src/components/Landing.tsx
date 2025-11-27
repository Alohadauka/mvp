import React from 'react'

export default function Landing({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <div className="container-sm mx-auto p-6 max-w-6xl">
      {/* Hero Section */}
      <div className="card mb-8 p-8 bg-gradient-to-br from-card to-bg border border-brand/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">🔒</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand to-indigo-400 bg-clip-text text-transparent">
            Анонимные обращения для сотрудников
          </h1>
        </div>
        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
          Платформа для безопасного и анонимного общения сотрудников с руководством. 
          Высказывайте жалобы, предложения и благодарности без страха раскрытия личности.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate('demo')} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-mocha text-white font-semibold shadow-[0_20px_30px_rgba(123,94,85,0.35)] transition-all transform hover:scale-105"
          >
            Отправить обращение
          </button>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-semibold"
          >
            Посмотреть аналитику
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 hover:border-brand/50 border border-white/10 transition-all">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-xl font-semibold mb-2">Полная анонимность</h3>
          <p className="text-slate-300 leading-relaxed">
            Ваша личность полностью защищена. Система генерирует уникальный анонимный идентификатор, 
            который не может быть связан с вашими личными данными.
          </p>
        </div>
        <div className="card p-6 hover:border-brand/50 border border-white/10 transition-all">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="text-xl font-semibold mb-2">Многоуровневая модерация</h3>
          <p className="text-slate-300 leading-relaxed">
            Автоматическая фильтрация нежелательного контента в сочетании с ручной проверкой модераторами 
            обеспечивает качество обращений.
          </p>
        </div>
        <div className="card p-6 hover:border-brand/50 border border-white/10 transition-all">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-xl font-semibold mb-2">Детальная аналитика</h3>
          <p className="text-slate-300 leading-relaxed">
            Комплексные метрики, графики и отчеты помогают руководству принимать обоснованные решения 
            и улучшать работу компании.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6">Как это работает</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
            <h4 className="font-semibold mb-2">Создайте обращение</h4>
            <p className="text-sm text-slate-400">Выберите тип и опишите ситуацию</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
            <h4 className="font-semibold mb-2">Модерация</h4>
            <p className="text-sm text-slate-400">Автоматическая и ручная проверка</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
            <h4 className="font-semibold mb-2">Обработка</h4>
            <p className="text-sm text-slate-400">Ответственный отдел рассматривает</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-3 text-xl font-bold">4</div>
            <h4 className="font-semibold mb-2">Решение</h4>
            <p className="text-sm text-slate-400">Получите ответ и отслеживайте статус</p>
          </div>
        </div>
      </div>
    </div>
  )
}

