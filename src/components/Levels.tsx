import React from 'react'
import { db } from '../FakeDB'

type Props = {
  user: { email: string; role: string }
  onNavigate: (route: 'demo' | 'dashboard' | 'profile' | 'landing') => void
}

const missions = [
  { title: 'Отправить обращение', xp: 40, desc: 'Сообщите о проблеме или предложении' },
  { title: 'Получить ответ HR', xp: 25, desc: 'Дождитесь реакции на обращение' },
  { title: 'Одобрено модератором', xp: 35, desc: 'Пройдите проверку в модерации' },
  { title: 'Решённое обращение', xp: 60, desc: 'Получите окончательное решение' },
  { title: 'Похвала коллеге', xp: 20, desc: 'Поделитесь позитивной историей' }
]

function calcLevel(points: number) {
  const level = Math.floor(points / 150) + 1
  const currentLevelBase = (level - 1) * 150
  const nextLevelBase = level * 150
  const progress = Math.min(1, (points - currentLevelBase) / (nextLevelBase - currentLevelBase || 1))
  const xpToNext = nextLevelBase - points
  return { level, nextLevelBase, progress, xpToNext }
}

export default function Levels({ user, onNavigate }: Props) {
  const dbUser = db.getUserByEmail(user.email)
  const points = dbUser?.points ?? 0
  const { level, progress, xpToNext } = calcLevel(points)

  const leaderboard = db
    .fetchUsers()
    .map(u => ({
      email: u.email,
      points: u.points ?? 0,
      role: u.role,
      level: calcLevel(u.points ?? 0).level
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)

  const recent = db
    .fetchMessages()
    .filter(m => dbUser?.anonId && m.anonId === dbUser.anonId)
    .slice(0, 4)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Ваш уровень</p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-5xl font-semibold text-cocoa">Lv {level}</span>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  {points} XP
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('demo')}
              className="rounded-full border border-cocoa px-5 py-2 text-sm font-semibold text-cocoa transition hover:bg-cocoa hover:text-cream"
            >
              Новое обращение
            </button>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted uppercase tracking-[0.3em]">
              <span>Прогресс</span>
              <span>До следующего уровня: {xpToNext} XP</span>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-white/60">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-brand to-mocha transition-all"
                style={{ width: `${Math.min(progress * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="card flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Награды</p>
            <h3 className="mt-2 text-xl font-semibold">Еженедельный бонус</h3>
            <p className="mt-1 text-sm text-muted">+25 XP за три обращения в неделю</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/70 px-3 py-4">
              <p className="text-xs text-muted">Серия</p>
              <p className="text-2xl font-semibold text-cocoa">4</p>
            </div>
            <div className="rounded-2xl bg-white/70 px-3 py-4">
              <p className="text-xs text-muted">Бейджи</p>
              <p className="text-2xl font-semibold text-cocoa">{dbUser?.badges?.length ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-white/70 px-3 py-4">
              <p className="text-xs text-muted">XP/день</p>
              <p className="text-2xl font-semibold text-cocoa">{Math.round(points / Math.max(level, 1))}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Задачи</p>
              <h3 className="text-xl font-semibold mt-1">Активности на сегодня</h3>
            </div>
            <span className="text-xs text-muted">+ XP за выполнение</span>
          </div>
          <div className="mt-4 space-y-3">
            {missions.map(mission => (
              <div
                key={mission.title}
                className="flex items-center justify-between rounded-2xl border border-brand/20 bg-white/80 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-cocoa">{mission.title}</p>
                  <p className="text-sm text-muted">{mission.desc}</p>
                </div>
                <span className="rounded-full bg-brand/15 px-3 py-1 text-sm font-semibold text-brand">
                  +{mission.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Лидеры недели</p>
          <h3 className="text-xl font-semibold mt-1">Топ 5 сотрудников</h3>
          <div className="mt-4 space-y-3">
            {leaderboard.map((entry, idx) => (
              <div key={entry.email} className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cocoa">{entry.email}</p>
                    <p className="text-xs text-muted">
                      Lv {entry.level} · {entry.points} XP
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted uppercase">{entry.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">История</p>
              <h3 className="text-xl font-semibold mt-1">Недавние достижения</h3>
            </div>
            <button className="text-xs text-brand hover:text-mocha" onClick={() => onNavigate('demo')}>
              Подробнее
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-muted">У вас пока нет активностей. Создайте первое обращение!</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recent.map(item => (
                <div key={item.id} className="rounded-2xl bg-white/80 px-4 py-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-cocoa">
                    <span>{item.title}</span>
                    <span className="text-xs text-muted">{new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <p className="text-sm text-muted">{item.department}</p>
                  <span className="mt-2 inline-flex rounded-full bg-brand/15 px-3 py-1 text-xs text-brand">
                    Статус: {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Советы</p>
          <h3 className="text-xl font-semibold mt-1">Как быстрее расти</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="rounded-2xl bg-white/80 px-4 py-3">
              • Описывайте проблему детально — так обращение быстрее одобрят и решат.
            </li>
            <li className="rounded-2xl bg-white/80 px-4 py-3">
              • Отправляйте обратную связь HR после решения — получите дополнительные XP.
            </li>
            <li className="rounded-2xl bg-white/80 px-4 py-3">
              • Делитесь похвалами — позитивные истории усиливают рейтинг команды.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

