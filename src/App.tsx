import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Login from './components/Login'
import Levels from './components/Levels'
import Demo from './components/Demo'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import Moderator from './components/Moderator'
import Profile from './components/Profile'
import Supervisor from './components/Supervisor'

type Route = 'landing' | 'demo' | 'dashboard' | 'admin' | 'moderator' | 'profile' | 'supervisor'

type User = {
  email: string
  role: string
}

export default function App() {
  const [route, setRoute] = useState<Route>('landing')
  const [booting, setBooting] = useState(true)
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800)
    return () => clearTimeout(timer)
  }, [])

  function handleLogin(userData: { email: string; role: string }) {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setRoute('landing')
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('user')
    setRoute('landing')
  }

  function handleNavigate(next: Route) {
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderScreen() {
    // Проверка доступа - только менеджер и HR могут видеть аналитику, админ-панель и модерацию
    const canAccessAdmin = user && (user.role === 'manager' || user.role === 'hr')
    
    if ((route === 'admin' || route === 'dashboard' || route === 'moderator') && !canAccessAdmin) {
      return (
        <div className="container-sm mx-auto p-6 max-w-4xl">
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-2">Доступ запрещен</h2>
            <p className="text-slate-400">
              {route === 'admin' && 'У вас нет прав для доступа к админ-панели'}
              {route === 'dashboard' && 'У вас нет прав для доступа к аналитике'}
              {route === 'moderator' && 'У вас нет прав для доступа к модерации'}
            </p>
            <button 
              onClick={() => handleNavigate('landing')}
              className="mt-4 px-6 py-2 rounded-lg bg-brand/20 text-brand hover:bg-brand/30 transition-colors border border-brand/30"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )
    }

    switch (route) {
      case 'landing':
        return <Levels user={user!} onNavigate={handleNavigate} />
      case 'demo':
        return <Demo />
      case 'dashboard':
        return <Dashboard />
      case 'admin':
        return <AdminPanel />
      case 'moderator':
        return <Moderator />
      case 'profile':
        return <Profile user={user!} />
      case 'supervisor':
        return <Supervisor />
      default:
        return null
    }
  }

  const routeMeta: Record<Route, { title: string; subtitle: string; actionLabel?: string; actionRoute?: Route }> = {
    landing: { title: 'Прогресс и уровни', subtitle: 'Геймификация активности сотрудников', actionLabel: 'Создать обращение', actionRoute: 'demo' },
    demo: { title: 'Обращения сотрудников', subtitle: 'Формы, статусы и история взаимодействий', actionLabel: 'Создать обращение', actionRoute: 'demo' },
    dashboard: { title: 'Аналитика', subtitle: 'Метрики по обращениям и типам', actionLabel: 'Экспорт отчёта', actionRoute: 'dashboard' },
    admin: { title: 'Администрирование', subtitle: 'Управление обращениями и статусами', actionLabel: 'Создать заметку', actionRoute: 'admin' },
    moderator: { title: 'Модерация', subtitle: 'Проверка обращений перед передачей', actionLabel: 'Правила модерации', actionRoute: 'moderator' },
    profile: { title: 'Профиль пользователя', subtitle: 'Личные данные и статистика активности', actionLabel: 'Редактировать профиль', actionRoute: 'profile' },
    supervisor: { title: 'Панель супервайзера', subtitle: 'Ключевые показатели работы HR‑команды', actionLabel: 'Скачать отчёт', actionRoute: 'supervisor' }
  }

  const currentMeta = routeMeta[route] || routeMeta.landing
  const actionEnabled = currentMeta.actionLabel && currentMeta.actionRoute

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-bg text-cocoa flex flex-col lg:flex-row">
      <Navbar currentRoute={route} onNavigate={handleNavigate} user={user!} onLogout={handleLogout} />
      <div className="flex-1 min-h-screen bg-[rgba(255,255,255,0.85)] flex flex-col">
        <header className="sticky top-0 z-10 border-b border-brand/20 bg-[rgba(255,255,255,0.95)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-8 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted">{currentMeta.subtitle}</p>
              <h1 className="text-3xl font-semibold mt-2">{currentMeta.title}</h1>
            </div>
            <div className="flex flex-col gap-3 w-full md:flex-row md:items-center md:w-auto">
              <div className="relative w-full md:w-72">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск по платформе"
                  className="w-full rounded-full border border-brand/30 bg-white px-4 py-2 pl-11 text-sm text-cocoa placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              {actionEnabled && (
                <button
                  onClick={() => handleNavigate(currentMeta.actionRoute!)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cocoa px-5 py-2 text-sm font-semibold text-cream shadow-[0_15px_30px_rgba(62,43,39,0.25)] transition hover:bg-mocha"
                >
                  <span className="text-base">＋</span>
                  {currentMeta.actionLabel}
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          {booting ? <Preloader /> : renderScreen()}
        </main>
      </div>
    </div>
  )
}

