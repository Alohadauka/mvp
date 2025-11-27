
Project structure

mvp-vite-tailwind/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ FakeDB.ts
│  ├─ index.css
│  └─ components/
│     ├─ Navbar.tsx
│     ├─ Preloader.tsx
│     ├─ Landing.tsx
│     ├─ Demo.tsx
│     ├─ Dashboard.tsx
│     ├─ AdminPanel.tsx
│     ├─ Moderator.tsx
│     ├─ Profile.tsx
│     └─ Supervisor.tsx
└─ README.md


File: package.json

json
{
  "name": "mvp-vite-tailwind",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^10.12.16",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.4.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.5.5",
    "typescript": "^5.5.0",
    "vite": "^5.2.0"
  }
}


File: vite.config.ts

ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```



 File: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["DOM", "ES2021"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}



File: tailwind.config.cjs

js
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#60a5fa',
        bg: '#071126',
        card: '#0b1320'
      }
    }
  },
  plugins: []
}


File: postcss.config.cjs

js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}


File: index.html

html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MVP Prototype</title>
  </head>
  <body class="bg-bg text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


File: src/main.tsx

tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)



 File: src/App.tsx

  tsx
import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Landing from './components/Landing'
import Demo from './components/Demo'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import Moderator from './components/Moderator'
import Profile from './components/Profile'
import Supervisor from './components/Supervisor'

type Route = 'landing' | 'demo' | 'dashboard' | 'admin' | 'moderator' | 'profile' | 'supervisor'

export default function App() {
  const [route, setRoute] = useState<Route>('landing')
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800)
    return () => clearTimeout(timer)
  }, [])

  function handleNavigate(next: Route) {
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderScreen() {
    switch (route) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />
      case 'demo':
        return <Demo />
      case 'dashboard':
        return <Dashboard />
      case 'admin':
        return <AdminPanel />
      case 'moderator':
        return <Moderator />
      case 'profile':
        return <Profile />
      case 'supervisor':
        return <Supervisor />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <Navbar onNavigate={handleNavigate} />
      <main>{booting ? <Preloader /> : renderScreen()}</main>
    </div>
  )
}



File: src/index.css

 css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand: #60a5fa;
}

/* small custom utilities for cards */
.card {
  @apply bg-[rgba(255,255,255,0.03)] rounded-2xl shadow-lg p-4;
}

/* responsive tweaks */
@media (max-width: 640px) {
  .container-sm {
    @apply px-4;
  }
}



File: src/FakeDB.ts

ts
export type Message = {
  id: number
  type: 'complaint' | 'suggestion' | 'praise'
  department: string
  title: string
  body: string
  status: 'new' | 'answered' | 'resolved' | 'rejected'
  createdAt: string
  replies: { by: string; text: string }[]
}

export type User = { id: string; role: string; anonId?: string; points?: number; badges?: string[] }

const now = () => new Date().toISOString()

let messages: Message[] = [
  { id: 1, type: 'complaint', department: 'Sales', title: 'Late bonuses', body: 'Bonuses delayed', status: 'new', createdAt: now(), replies: [] },
  { id: 2, type: 'praise', department: 'Support', title: 'Great support', body: 'Kudos to Anna', status: 'resolved', createdAt: now(), replies: [{ by: 'HR', text: 'Thanks!' }] }
]

let users: User[] = [
  { id: 'u1', role: 'employee', anonId: 'emp-834', points: 120, badges: ['starter'] },
  { id: 'u2', role: 'hr' },
  { id: 'u3', role: 'moderator' },
  { id: 'u4', role: 'supervisor' }
]

export const db = {
  fetchMessages: () => messages,
  fetchUsers: () => users,
  createMessage: (payload: Omit<Message, 'id' | 'status' | 'createdAt' | 'replies'>) => {
    const id = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1
    const msg: Message = { id, ...payload, status: 'new', createdAt: now(), replies: [] }
    messages = [msg, ...messages]
    return msg
  },
  replyMessage: (id: number, reply: { by: string; text: string }) => {
    messages = messages.map(m => (m.id === id ? { ...m, replies: [...m.replies, reply], status: 'answered' } : m))
    return messages.find(m => m.id === id)
  },
  updateStatus: (id: number, status: Message['status']) => {
    messages = messages.map(m => (m.id === id ? { ...m, status } : m))
    return messages.find(m => m.id === id)
  }
}



File: src/components/Navbar.tsx

tsx
import React from 'react'

type Props = { onNavigate: (route: string) => void }
export default function Navbar({ onNavigate }: Props) {
  return (
    <header className="flex items-center justify-between p-4 container-sm">
      <div className="text-lg font-bold cursor-pointer" onClick={() => onNavigate('landing')}>MVP-Brand</div>
      <nav className="space-x-2 hidden sm:block">
        <button className="px-3 py-1 rounded-lg hover:bg-white/5" onClick={() => onNavigate('demo')}>Demo</button>
        <button className="px-3 py-1 rounded-lg hover:bg-white/5" onClick={() => onNavigate('dashboard')}>Dashboard</button>
        <button className="px-3 py-1 rounded-lg hover:bg-white/5" onClick={() => onNavigate('admin')}>Admin</button>
        <button className="px-3 py-1 rounded-lg hover:bg-white/5" onClick={() => onNavigate('moderator')}>Moderator</button>
        <button className="px-3 py-1 rounded-lg hover:bg-white/5" onClick={() => onNavigate('profile')}>Profile</button>
      </nav>
    </header>
  )
}


 File: src/components/Preloader.tsx

tsx
import React from 'react'
import { motion } from 'framer-motion'

export default function Preloader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">⚡</motion.div>
      <div className="text-sm text-slate-400 mt-3">Загрузка...</div>
    </div>
  )
}




File: src/components/Landing.tsx

tsx
import React from 'react'

export default function Landing({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <div className="container-sm mx-auto p-4">
      <div className="card mb-4">
        <h1 className="text-2xl font-semibold">Анонимные обращения для сотрудников</h1>
        <p className="text-slate-300 mt-2">Быстро, безопасно, анонимно — MVP версия</p>
        <div className="mt-4">
          <button onClick={() => onNavigate('demo')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-indigo-500 text-slate-900">Посмотреть Demo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold">Анонимность</h3>
          <p className="text-sm text-slate-300">Сотрудники не раскрывают личность.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Модерация</h3>
          <p className="text-sm text-slate-300">Фильтры + ручная проверка.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Аналитика</h3>
          <p className="text-sm text-slate-300">Базовые метрики и рейтинг HR.</p>
        </div>
      </div>
    </div>
  )
}



File: src/components/Demo.tsx

tsx
import React, { useState } from 'react'
import { db, Message } from '../FakeDB'

export default function Demo() {
  const [list, setList] = useState<Message[]>(db.fetchMessages())
  const [form, setForm] = useState({ type: 'complaint', department: 'General', title: '', body: '' })

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    db.createMessage({ type: form.type as any, department: form.department, title: form.title, body: form.body })
    setList(db.fetchMessages())
    setForm({ type: 'complaint', department: 'General', title: '', body: '' })
    alert('Обращение отправлено анонимно (имитация).')
  }

  return (
    <div className="container-sm mx-auto p-4">
      <h2 className="text-xl font-medium mb-3">Demo — отправить обращение</h2>
      <form onSubmit={submit} className="card mb-4">
        <label className="block mb-2">Тип
          <select className="w-full mt-2 p-2 rounded-md bg-transparent border border-white/5" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="complaint">Жалоба</option>
            <option value="suggestion">Предложение</option>
            <option value="praise">Похвала</option>
          </select>
        </label>
        <label className="block mb-2">Отдел
          <input className="w-full mt-2 p-2 rounded-md bg-transparent border border-white/5" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
        </label>
        <label className="block mb-2">Тема
          <input required className="w-full mt-2 p-2 rounded-md bg-transparent border border-white/5" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="block mb-2">Сообщение
          <textarea required className="w-full mt-2 p-2 rounded-md bg-transparent border border-white/5" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
        </label>
        <div className="mt-3">
          <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-indigo-500 text-slate-900">Отправить</button>
        </div>
      </form>

      <h3 className="text-lg">Последние обращения (имитация)</h3>
      <div className="space-y-3 mt-3">
        {list.map(m => (
          <div key={m.id} className="card">
            <div className="flex justify-between"><strong>#{m.id} {m.title}</strong><span className="text-sm text-slate-400">{m.type} / {m.department}</span></div>
            <p className="mt-2 text-slate-300">{m.body}</p>
            <div className="text-xs text-slate-400 mt-2">Статус: <b className="text-white">{m.status}</b> — {new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}



File: src/components/Dashboard.tsx

tsx
import React from 'react'
import { db } from '../FakeDB'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const data = db.fetchMessages()
  const totals = {
    new: data.filter(d => d.status === 'new').length,
    answered: data.filter(d => d.status === 'answered').length,
    resolved: data.filter(d => d.status === 'resolved').length
  }
  const chartData = [
    { name: 'new', value: totals.new },
    { name: 'answered', value: totals.answered },
    { name: 'resolved', value: totals.resolved }
  ]
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658']

  return (
    <div className="container-sm mx-auto p-4">
      <h2 className="text-xl font-medium mb-3">Аналитика</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="card">Новые: <b>{totals.new}</b></div>
        <div className="card">Отвечено: <b>{totals.answered}</b></div>
        <div className="card">Решено: <b>{totals.resolved}</b></div>
      </div>
      <div className="card h-56">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={60} fill="#8884d8">
              {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}



File: src/components/AdminPanel.tsx

tsx
import React, { useState } from 'react'
import { db } from '../FakeDB'

export default function AdminPanel() {
  const [msgs, setMsgs] = useState(db.fetchMessages())
  function changeStatus(id: number, s: any) {
    db.updateStatus(id, s)
    setMsgs(db.fetchMessages())
  }
  return (
    <div className="container-sm mx-auto p-4">
      <h2 className="text-xl font-medium mb-3">Admin — управление обращениями</h2>
      <div className="space-y-3">
        {msgs.map(m => (
          <div key={m.id} className="card">
            <div className="flex justify-between"><strong>{m.title}</strong><span className="text-sm text-slate-400">{m.type}</span></div>
            <p className="mt-2 text-slate-300">{m.body}</p>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 rounded-md bg-white/5" onClick={() => changeStatus(m.id, 'answered')}>Отметить отвеченным</button>
              <button className="px-3 py-1 rounded-md bg-white/5" onClick={() => changeStatus(m.id, 'resolved')}>Решить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




File: src/components/Moderator.tsx

tsx
import React, { useState } from 'react'
import { db } from '../FakeDB'

export default function Moderator() {
  const [msgs, setMsgs] = useState(db.fetchMessages())
  function moderate(id: number, accept = true) {
    db.updateStatus(id, accept ? 'new' : 'rejected')
    setMsgs(db.fetchMessages())
  }
  return (
    <div className="container-sm mx-auto p-4">
      <h2 className="text-xl font-medium mb-3">Moderator — модерация</h2>
      <div className="space-y-3">
        {msgs.map(m => (
          <div key={m.id} className="card">
            <div className="flex justify-between"><strong>{m.title}</strong><span className="text-sm text-slate-400">{m.type}</span></div>
            <p className="mt-2 text-slate-300">{m.body}</p>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 rounded-md bg-white/5" onClick={() => moderate(m.id, true)}>Принять</button>
              <button className="px-3 py-1 rounded-md bg-white/5" onClick={() => moderate(m.id, false)}>Отклонить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



File: src/components/Profile.tsx

tsx
import React from 'react'
import { db } from '../FakeDB'

export default function Profile() {
  const users = db.fetchUsers()
  const u = users[0]
  return (
    <div className="container-sm mx-auto p-4">
      <div className="card">
        <h2 className="text-xl font-medium">Профиль сотрудника (анонимный)</h2>
        <div className="mt-2">Anon ID: <b>{u.anonId}</b></div>
        <div>Баллы: <b>{u.points}</b></div>
        <div>Бейджи: {u.badges?.join(', ')}</div>
      </div>
    </div>
  )
}

 File: src/components/Supervisor.tsx

tsx
import React from 'react'
import { db } from '../FakeDB'

export default function Supervisor() {
  const msgs = db.fetchMessages()
  const resolved = msgs.filter(m => m.status === 'resolved').length
  return (
    <div className="container-sm mx-auto p-4">
      <h2 className="text-xl font-medium mb-3">Панель супервайзера</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">Всего обращений: <b>{msgs.length}</b></div>
        <div className="card">Решено: <b>{resolved}</b></div>
        <div className="card">Рейтинг HR: <b>{Math.max(0, 100 - resolved)}</b></div>
      </div>
    </div>
  )
}