import React, { useState } from 'react'
import { db, Message } from '../FakeDB'

const typeLabels: Record<string, string> = {
  complaint: 'Жалоба',
  suggestion: 'Предложение',
  praise: 'Похвала'
}

const statusLabels: Record<string, string> = {
  new: 'Новое',
  approved: 'Одобрено модератором',
  answered: 'Отвечено',
  resolved: 'Решено',
  rejected: 'Отклонено'
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  approved: 'bg-brand/20 text-brand border-brand/30',
  answered: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
}

export default function AdminPanel() {
  const [msgs, setMsgs] = useState(db.fetchMessages())
  const [filter, setFilter] = useState<string>('all')
  
  function changeStatus(id: number, s: Message['status']) {
    db.updateStatus(id, s)
    setMsgs(db.fetchMessages())
  }

  const filteredMsgs = filter === 'all' 
    ? msgs 
    : msgs.filter(m => m.status === filter)

  const stats = {
    all: msgs.length,
    new: msgs.filter(m => m.status === 'new').length,
    approved: msgs.filter(m => m.status === 'approved').length,
    answered: msgs.filter(m => m.status === 'answered').length,
    resolved: msgs.filter(m => m.status === 'resolved').length
  }

  return (
    <div className="container-sm mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Панель администратора</h2>
        <p className="text-slate-400">Управление всеми обращениями сотрудников</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold">{stats.all}</div>
          <div className="text-sm text-slate-400">Всего</div>
        </div>
        <div className="card p-4 text-center border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-400">{stats.new}</div>
          <div className="text-sm text-slate-400">Новых</div>
        </div>
        <div className="card p-4 text-center border-l-4 border-brand">
          <div className="text-2xl font-bold text-brand">{stats.approved}</div>
          <div className="text-sm text-slate-400">Одобрено модератором</div>
        </div>
        <div className="card p-4 text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-400">{stats.answered}</div>
          <div className="text-sm text-slate-400">Отвечено</div>
        </div>
        <div className="card p-4 text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
          <div className="text-sm text-slate-400">Решено</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-brand text-white' : 'bg-white/5 hover:bg-white/10'}`}
        >
          Все ({stats.all})
        </button>
        <button 
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'new' ? 'bg-blue-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
        >
          Новые ({stats.new})
        </button>
        <button 
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'approved' ? 'bg-brand text-white' : 'bg-white/5 hover:bg-white/10'}`}
        >
          Одобрено ({stats.approved})
        </button>
        <button 
          onClick={() => setFilter('answered')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'answered' ? 'bg-yellow-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
        >
          Отвечено ({stats.answered})
        </button>
        <button 
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'resolved' ? 'bg-green-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
        >
          Решено ({stats.resolved})
        </button>
      </div>

      {/* Список обращений */}
      <div className="space-y-4">
        {filteredMsgs.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">
            Нет обращений с выбранным статусом
          </div>
        ) : (
          filteredMsgs.map(m => (
            <div key={m.id} className="card p-6 hover:border-brand/50 border border-white/10 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-sm text-slate-500">#{m.id}</span>
                    <h3 className="text-lg font-semibold">{m.title}</h3>
                  </div>
                  {m.anonId && (
                    <div className="mb-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Анонимный ID отправителя:</span>
                        <span className="text-sm font-mono font-bold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded border border-indigo-500/30">
                          {m.anonId}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-brand/20 text-brand border border-brand/30 text-sm">
                      {typeLabels[m.type]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-sm">
                      {m.department}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[m.status]}`}>
                      {statusLabels[m.status]}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">{m.body}</p>
              
              {m.replies.length > 0 && (
                <div className="mb-4 pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold mb-2 text-slate-400">История ответов:</p>
                  {m.replies.map((reply, idx) => (
                    <div key={idx} className="mb-2 p-3 rounded-lg bg-white/5">
                      <span className="text-sm font-semibold text-brand">{reply.by}:</span>
                      <p className="text-sm text-slate-300 mt-1">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {m.status !== 'answered' && (
                  <button 
                    className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors border border-yellow-500/30"
                    onClick={() => changeStatus(m.id, 'answered')}
                  >
                    Отметить отвеченным
                  </button>
                )}
                {m.status !== 'resolved' && (
                  <button 
                    className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors border border-green-500/30"
                    onClick={() => changeStatus(m.id, 'resolved')}
                  >
                    Решить
                  </button>
                )}
                {m.status === 'resolved' && (
                  <span className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                    ✓ Решено
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-3">
                Создано: {new Date(m.createdAt).toLocaleString('ru-RU')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

