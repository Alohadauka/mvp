import React from 'react'
import { db } from '../FakeDB'
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

export default function Dashboard() {
  const data = db.fetchMessages()
  const totals = {
    new: data.filter(d => d.status === 'new').length,
    approved: data.filter(d => d.status === 'approved').length,
    answered: data.filter(d => d.status === 'answered').length,
    resolved: data.filter(d => d.status === 'resolved').length,
    rejected: data.filter(d => d.status === 'rejected').length
  }
  
  const byType = {
    complaint: data.filter(d => d.type === 'complaint').length,
    suggestion: data.filter(d => d.type === 'suggestion').length,
    praise: data.filter(d => d.type === 'praise').length
  }

  const chartData = [
    { name: 'Новые', value: totals.new, color: '#60a5fa' },
    { name: 'Одобрено', value: totals.approved, color: '#8b6c63' },
    { name: 'Отвечено', value: totals.answered, color: '#fbbf24' },
    { name: 'Решено', value: totals.resolved, color: '#34d399' },
    { name: 'Отклонено', value: totals.rejected, color: '#f87171' }
  ]

  const typeChartData = [
    { name: 'Жалобы', value: byType.complaint, color: '#f87171' },
    { name: 'Предложения', value: byType.suggestion, color: '#60a5fa' },
    { name: 'Похвалы', value: byType.praise, color: '#34d399' }
  ]

  const total = data.length
  const resolvedPercent = total > 0 ? Math.round((totals.resolved / total) * 100) : 0
  const approvalPercent = total > 0 ? Math.round((totals.approved / total) * 100) : 0

  return (
    <div className="container-sm mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Аналитика обращений</h2>
        <p className="text-slate-400">Общая статистика по всем обращениям сотрудников</p>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card p-6 border-l-4 border-blue-500">
          <div className="text-sm text-slate-400 mb-1">Новые обращения</div>
          <div className="text-3xl font-bold text-blue-400">{totals.new}</div>
          <div className="text-xs text-slate-500 mt-2">Требуют внимания</div>
        </div>
        <div className="card p-6 border-l-4 border-brand">
          <div className="text-sm text-slate-400 mb-1">Одобрено модератором</div>
          <div className="text-3xl font-bold text-brand">{totals.approved}</div>
          <div className="text-xs text-slate-500 mt-2">{approvalPercent}% от общего</div>
        </div>
        <div className="card p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-slate-400 mb-1">В обработке</div>
          <div className="text-3xl font-bold text-yellow-400">{totals.answered}</div>
          <div className="text-xs text-slate-500 mt-2">Получен ответ</div>
        </div>
        <div className="card p-6 border-l-4 border-green-500">
          <div className="text-sm text-slate-400 mb-1">Решено</div>
          <div className="text-3xl font-bold text-green-400">{totals.resolved}</div>
          <div className="text-xs text-slate-500 mt-2">{resolvedPercent}% от общего</div>
        </div>
        <div className="card p-6 border-l-4 border-red-500">
          <div className="text-sm text-slate-400 mb-1">Всего</div>
          <div className="text-3xl font-bold">{total}</div>
          <div className="text-xs text-slate-500 mt-2">Обращений в системе</div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Распределение по статусам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={chartData} 
                dataKey="value" 
                outerRadius={100} 
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Распределение по типам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={typeChartData} 
                dataKey="value" 
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {typeChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Детальная статистика */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Детальная статистика</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-slate-400 mb-2">Жалобы</div>
            <div className="text-2xl font-bold">{byType.complaint}</div>
            <div className="text-xs text-slate-500 mt-1">
              {total > 0 ? Math.round((byType.complaint / total) * 100) : 0}% от общего
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-slate-400 mb-2">Предложения</div>
            <div className="text-2xl font-bold">{byType.suggestion}</div>
            <div className="text-xs text-slate-500 mt-1">
              {total > 0 ? Math.round((byType.suggestion / total) * 100) : 0}% от общего
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-slate-400 mb-2">Похвалы</div>
            <div className="text-2xl font-bold">{byType.praise}</div>
            <div className="text-xs text-slate-500 mt-1">
              {total > 0 ? Math.round((byType.praise / total) * 100) : 0}% от общего
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

