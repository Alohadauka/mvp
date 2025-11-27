import React, { useState } from 'react'
import { db, Message } from '../FakeDB'

const typeLabels: Record<string, string> = {
  complaint: 'Жалоба',
  suggestion: 'Предложение',
  praise: 'Похвала'
}

export default function Moderator() {
  const [msgs, setMsgs] = useState(db.fetchMessages())
  
  function moderate(id: number, accept = true) {
    db.updateStatus(id, accept ? 'approved' : 'rejected')
    setMsgs(db.fetchMessages())
  }

  const pendingMsgs = msgs.filter(m => m.status === 'new')
  const approvedMsgs = msgs.filter(m => m.status === 'approved')
  const rejectedMsgs = msgs.filter(m => m.status === 'rejected')

  return (
    <div className="container-sm mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Панель модератора</h2>
        <p className="text-slate-400">Проверка и модерация обращений сотрудников</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-400">{pendingMsgs.length}</div>
          <div className="text-sm text-slate-400">Требуют проверки</div>
        </div>
        <div className="card p-4 text-center border-l-4 border-brand">
          <div className="text-2xl font-bold text-brand">{approvedMsgs.length}</div>
          <div className="text-sm text-slate-400">Одобрено</div>
        </div>
        <div className="card p-4 text-center border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-400">{rejectedMsgs.length}</div>
          <div className="text-sm text-slate-400">Отклонено</div>
        </div>
      </div>

      {/* Инструкция */}
      <div className="card p-4 mb-6 bg-blue-500/10 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h4 className="font-semibold mb-1">Правила модерации</h4>
            <p className="text-sm text-slate-300">
              Проверяйте обращения на соответствие правилам компании. Принимайте корректные обращения, 
              отклоняйте спам, оскорбления и неподходящий контент.
            </p>
          </div>
        </div>
      </div>

      {/* Список обращений для модерации */}
      <h3 className="text-xl font-semibold mb-4">Обращения на модерации</h3>
      <div className="space-y-4 mb-8">
        {pendingMsgs.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">
            Нет обращений, требующих модерации
          </div>
        ) : (
          pendingMsgs.map(m => (
            <div key={m.id} className="card p-6 hover:border-brand/50 border border-white/10 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-slate-500">#{m.id}</span>
                    <h3 className="text-lg font-semibold">{m.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-brand/20 text-brand border border-brand/30 text-sm">
                      {typeLabels[m.type]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-sm">
                      {m.department}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">{m.body}</p>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <button 
                  className="px-6 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors border border-green-500/30 font-semibold"
                  onClick={() => moderate(m.id, true)}
                >
                  ✓ Принять
                </button>
                <button 
                  className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30 font-semibold"
                  onClick={() => moderate(m.id, false)}
                >
                  ✗ Отклонить
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-3">
                Создано: {new Date(m.createdAt).toLocaleString('ru-RU')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Отклоненные обращения */}
      {rejectedMsgs.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4">Отклоненные обращения</h3>
          <div className="space-y-4">
            {rejectedMsgs.map(m => (
              <div key={m.id} className="card p-6 opacity-60 border border-red-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500">#{m.id}</span>
                  <h3 className="text-lg font-semibold">{m.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs">
                    Отклонено
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{m.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

