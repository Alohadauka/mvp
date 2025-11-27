import React from 'react'
import { db } from '../FakeDB'

type Props = {
  user: { email: string; role: string }
}

const roleLabels: Record<string, string> = {
  employee: 'Сотрудник',
  hr: 'HR специалист',
  manager: 'Менеджер',
  moderator: 'Модератор',
  supervisor: 'Супервайзер'
}

export default function Profile({ user }: Props) {
  const dbUser = db.getUserByEmail(user.email)
  const messages = db.fetchMessages()
  const userMessages = dbUser?.anonId ? messages.filter(m => m.anonId === dbUser.anonId) : []
  const resolvedCount = userMessages.filter(m => m.status === 'resolved').length
  const approvedCount = userMessages.filter(m => m.status === 'approved').length
  const roleLabel = roleLabels[user.role] || 'Сотрудник'
  const anonInitial = dbUser?.anonId ? dbUser.anonId.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()

  return (
    <div className="container-sm mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Мой профиль</h2>
        <p className="text-slate-400">Анонимный профиль сотрудника</p>
      </div>

      {/* Основная информация */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-mocha flex items-center justify-center text-3xl font-bold text-cream">
            {anonInitial}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">{roleLabel}</h3>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-slate-400 mb-1">Анонимный ID</div>
            <div className="text-lg font-semibold font-mono">{dbUser?.anonId ?? 'не назначен'}</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-slate-400 mb-1">Роль</div>
            <div className="text-lg font-semibold">{roleLabel}</div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-6 text-center border-l-4 border-brand">
          <div className="text-3xl font-bold text-brand mb-2">{dbUser?.points ?? 0}</div>
          <div className="text-sm text-slate-400">Баллы активности</div>
          <div className="text-xs text-slate-500 mt-2">За участие в системе</div>
        </div>
        <div className="card p-6 text-center border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-400 mb-2">{userMessages.length}</div>
          <div className="text-sm text-slate-400">Отправлено обращений</div>
          <div className="text-xs text-slate-500 mt-2">Всего в системе</div>
        </div>
        <div className="card p-6 text-center border-l-4 border-indigo-500">
          <div className="text-3xl font-bold text-indigo-400 mb-2">{resolvedCount}</div>
          <div className="text-sm text-slate-400">Решено</div>
          <div className="text-xs text-slate-500 mt-2">Ваших обращений</div>
        </div>
        <div className="card p-6 text-center border-l-4 border-brand">
          <div className="text-3xl font-bold text-brand mb-2">{approvedCount}</div>
          <div className="text-sm text-slate-400">Одобрено</div>
          <div className="text-xs text-slate-500 mt-2">Пройдено модерацию</div>
        </div>
      </div>

      {/* Бейджи */}
      {dbUser?.badges && dbUser.badges.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Достижения и бейджи</h3>
          <div className="flex flex-wrap gap-3">
            {dbUser.badges.map((badge, idx) => (
              <div 
                key={idx} 
                className="px-4 py-2 rounded-full bg-gradient-to-r from-brand/20 to-mocha/20 border border-brand/30 text-brand font-semibold"
              >
                🏆 {badge}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Мои обращения */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Мои обращения</h3>
        {userMessages.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            Вы еще не отправляли обращений
          </div>
        ) : (
          <div className="space-y-3">
            {userMessages.slice(0, 5).map(m => (
              <div key={m.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{m.title}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    m.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                    m.status === 'approved' ? 'bg-brand/20 text-brand' :
                    m.status === 'answered' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {m.status === 'resolved' ? 'Решено' :
                     m.status === 'approved' ? 'Одобрено' :
                     m.status === 'answered' ? 'Отвечено' : 'Новое'}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{m.body.substring(0, 100)}...</p>
              </div>
            ))}
            {userMessages.length > 5 && (
              <div className="text-center text-sm text-slate-400 pt-2">
                И еще {userMessages.length - 5} обращений...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

