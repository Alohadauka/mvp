import React from 'react'
import { db } from '../FakeDB'

export default function Supervisor() {
  const msgs = db.fetchMessages()
  const resolved = msgs.filter(m => m.status === 'resolved').length
  const approved = msgs.filter(m => m.status === 'approved').length
  const answered = msgs.filter(m => m.status === 'answered').length
  const newMsgs = msgs.filter(m => m.status === 'new').length
  const total = msgs.length
  
  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0
  const responseRate = total > 0 ? Math.round(((approved + answered + resolved) / total) * 100) : 0
  
  // Рейтинг HR (чем больше решено, тем выше рейтинг)
  const hrRating = Math.min(100, Math.max(0, resolvedPercent + (responseRate * 0.3)))

  // Статистика по отделам
  const departmentStats: Record<string, { total: number; resolved: number }> = {}
  msgs.forEach(m => {
    if (!departmentStats[m.department]) {
      departmentStats[m.department] = { total: 0, resolved: 0 }
    }
    departmentStats[m.department].total++
    if (m.status === 'resolved') {
      departmentStats[m.department].resolved++
    }
  })

  return (
    <div className="container-sm mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Панель супервайзера</h2>
        <p className="text-slate-400">Общий обзор работы системы обращений</p>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-6 border-l-4 border-brand">
          <div className="text-sm text-slate-400 mb-1">Всего обращений</div>
          <div className="text-3xl font-bold mb-2">{total}</div>
          <div className="text-xs text-slate-500">В системе</div>
        </div>
        <div className="card p-6 border-l-4 border-blue-500">
          <div className="text-sm text-slate-400 mb-1">Новых</div>
          <div className="text-3xl font-bold text-blue-400 mb-2">{newMsgs}</div>
          <div className="text-xs text-slate-500">Требуют внимания</div>
        </div>
        <div className="card p-6 border-l-4 border-brand">
          <div className="text-sm text-slate-400 mb-1">Одобрено модератором</div>
          <div className="text-3xl font-bold text-brand mb-2">{approved}</div>
          <div className="text-xs text-slate-500">{total > 0 ? Math.round((approved / total) * 100) : 0}% от общего</div>
        </div>
        <div className="card p-6 border-l-4 border-green-500">
          <div className="text-sm text-slate-400 mb-1">Решено</div>
          <div className="text-3xl font-bold text-green-400 mb-2">{resolved}</div>
          <div className="text-xs text-slate-500">{resolvedPercent}% от общего</div>
        </div>
        <div className="card p-6 border-l-4 border-indigo-500">
          <div className="text-sm text-slate-400 mb-1">Рейтинг HR</div>
          <div className="text-3xl font-bold text-indigo-400 mb-2">{Math.round(hrRating)}</div>
          <div className="text-xs text-slate-500">из 100 баллов</div>
        </div>
      </div>

      {/* Прогресс-бары */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Показатели эффективности</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Процент решенных обращений</span>
              <span className="text-sm text-slate-400">{resolvedPercent}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all"
                style={{ width: `${resolvedPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Процент ответов</span>
              <span className="text-sm text-slate-400">{responseRate}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all"
                style={{ width: `${responseRate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Общий рейтинг HR</span>
              <span className="text-sm text-slate-400">{Math.round(hrRating)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-brand to-mocha h-3 rounded-full transition-all"
                style={{ width: `${hrRating}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Статистика по отделам */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Статистика по отделам</h3>
        <div className="space-y-4">
          {Object.entries(departmentStats).map(([dept, stats]) => {
            const deptResolvedPercent = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
            return (
              <div key={dept} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{dept}</span>
                  <span className="text-sm text-slate-400">
                    {stats.resolved} из {stats.total} решено
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div 
                    className="bg-brand h-2 rounded-full transition-all"
                    style={{ width: `${deptResolvedPercent}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">{deptResolvedPercent}% эффективности</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

