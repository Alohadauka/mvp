import React from 'react'

type NavRoute = 'landing' | 'demo' | 'dashboard' | 'admin' | 'moderator' | 'profile' | 'supervisor'

type Props = { 
  onNavigate: (route: NavRoute) => void
  user: { email: string; role: string }
  onLogout: () => void
  currentRoute: NavRoute
}

const navItems: { label: string; route: NavRoute; icon: string; requiresAdmin?: boolean }[] = [
  { label: 'Уровни', route: 'landing', icon: '🎯' },
  { label: 'Обращения', route: 'demo', icon: '✉️' },
  { label: 'Аналитика', route: 'dashboard', icon: '📊', requiresAdmin: true },
  { label: 'Админ', route: 'admin', icon: '🗂️', requiresAdmin: true },
  { label: 'Модерация', route: 'moderator', icon: '🛡️', requiresAdmin: true },
  { label: 'Профиль', route: 'profile', icon: '👤' },
  { label: 'Супервайзер', route: 'supervisor', icon: '⭐', requiresAdmin: true }
]

export default function Navbar({ onNavigate, user, onLogout, currentRoute }: Props) {
  const canAccessAdmin = user.role === 'manager' || user.role === 'hr'

  const filteredNav = navItems.filter(item => {
    if (item.requiresAdmin && !canAccessAdmin) return false
    return true
  })

  return (
    <aside className="flex flex-col w-full lg:w-64 bg-[rgba(255,255,255,0.85)] border-b lg:border-b-0 lg:border-r border-brand/20 backdrop-blur-2xl sticky top-0 lg:h-screen">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-brand/20">
        <div className="h-12 w-12 rounded-2xl bg-cocoa text-cream flex items-center justify-center text-xl font-bold">AO</div>
        <div>
          <p className="text-lg font-semibold text-cocoa">AnonFlow</p>
          <p className="text-xs text-muted">SaaS для обращений</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {filteredNav.map(item => {
          const active = currentRoute === item.route
          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                active ? 'bg-cocoa text-cream shadow-[0_15px_30px_rgba(62,43,39,0.25)]' : 'text-muted hover:bg-brand/15'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-6 border-t border-brand/20 flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-card border border-brand/20">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Аккаунт</p>
          <p className="text-sm font-semibold text-cocoa mt-1">{user.email}</p>
          <p className="text-xs text-muted mt-1">{user.role.toUpperCase()}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full rounded-2xl border border-cocoa px-4 py-2 text-sm font-semibold text-cocoa hover:bg-cocoa hover:text-cream transition-all"
        >
          Выйти
        </button>
      </div>
    </aside>
  )
}

