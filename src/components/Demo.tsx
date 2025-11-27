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

const departmentOptions: Record<string, string[]> = {
  complaint: ['HR', 'Руководство', 'Оплата труда', 'Инфраструктура', 'Безопасность', 'IT'],
  suggestion: ['HR', 'IT', 'Продуктовая команда', 'Маркетинг', 'Офис', 'Обучение'],
  praise: ['HR', 'Команда поддержки', 'Отдел продаж', 'Маркетинг', 'IT', 'Общее']
}

export default function Demo() {
  const [list, setList] = useState<Message[]>(db.fetchMessages())
  const [form, setForm] = useState({ type: 'complaint', department: departmentOptions['complaint'][0], title: '', body: '' })

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    db.createMessage({ type: form.type as any, department: form.department, title: form.title, body: form.body })
    setList(db.fetchMessages())
    setForm({ type: 'complaint', department: departmentOptions['complaint'][0], title: '', body: '' })
    alert('Обращение успешно отправлено анонимно!')
  }

  return (
    <div className="container-sm mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Отправить обращение</h2>
        <p className="text-slate-400">Ваше обращение будет полностью анонимным</p>
      </div>

      <form onSubmit={submit} className="card mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-slate-200">Тип обращения</label>
            <div className="relative">
              <select 
                className="w-full p-3 rounded-lg bg-white/5 border-2 border-white/10 focus:border-brand focus:outline-none transition-all text-cocoa cursor-pointer appearance-none pr-10" 
                value={form.type} 
                onChange={e => {
                  const nextType = e.target.value
                  const nextDepartment = departmentOptions[nextType][0]
                  setForm({ ...form, type: nextType, department: nextDepartment })
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#3e2b27'
                }}
              >
                <option value="complaint" style={{ backgroundColor: '#f5ede8', color: '#3e2b27', padding: '0.6rem 0.8rem' }}>Жалоба</option>
                <option value="suggestion" style={{ backgroundColor: '#f5ede8', color: '#3e2b27', padding: '0.6rem 0.8rem' }}>Предложение</option>
                <option value="praise" style={{ backgroundColor: '#f5ede8', color: '#3e2b27', padding: '0.6rem 0.8rem' }}>Похвала</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-brand/10 border border-brand/30">
              <div className="text-xs text-slate-400 mb-1">Выбранный тип:</div>
              <div className="text-base font-semibold text-brand flex items-center gap-2">
                <span className="text-lg">
                  {form.type === 'complaint' ? '⚠️' : form.type === 'suggestion' ? '💡' : '⭐'}
                </span>
                {typeLabels[form.type]}
              </div>
            </div>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Отдел</label>
            <select
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-slate-100 cursor-pointer"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
            >
              {departmentOptions[form.type].map(option => (
                <option key={option} value={option} className="bg-[#0b1320] text-slate-100">
                  {option}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-2">
              Список сформирован автоматически под выбранный тип обращения
            </p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Тема обращения</label>
          <input 
            required 
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors" 
            value={form.title} 
            onChange={e => setForm({ ...form, title: e.target.value })} 
            placeholder="Краткое описание проблемы или предложения"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Подробное описание</label>
          <textarea 
            required 
            rows={5}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors resize-none" 
            value={form.body} 
            onChange={e => setForm({ ...form, body: e.target.value })} 
            placeholder="Опишите ситуацию подробно..."
          />
        </div>
        <button 
          type="submit" 
          className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-brand to-mocha text-white font-semibold shadow-[0_15px_30px_rgba(123,94,85,0.35)] transition-all transform hover:scale-105"
        >
          Отправить анонимно
        </button>
      </form>

      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2">Последние обращения</h3>
        <p className="text-slate-400">Всего обращений: {list.length}</p>
      </div>
      <div className="space-y-4">
        {list.map(m => (
          <div key={m.id} className="card p-6 hover:border-brand/50 border border-white/10 transition-all">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500">#{m.id}</span>
                  <h4 className="text-lg font-semibold">{m.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-brand/20 text-brand border border-brand/30">
                    {typeLabels[m.type]}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300">
                    {m.department}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[m.status]}`}>
                {statusLabels[m.status]}
              </span>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">{m.body}</p>
            {m.replies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm font-semibold mb-2 text-slate-400">Ответы:</p>
                {m.replies.map((reply, idx) => (
                  <div key={idx} className="mb-2 p-3 rounded-lg bg-white/5">
                    <span className="text-sm font-semibold text-brand">{reply.by}:</span>
                    <p className="text-sm text-slate-300 mt-1">{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-slate-500 mt-4">
              Создано: {new Date(m.createdAt).toLocaleString('ru-RU')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

