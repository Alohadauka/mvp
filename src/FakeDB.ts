export type Message = {
  id: number
  type: 'complaint' | 'suggestion' | 'praise'
  department: string
  title: string
  body: string
  status: 'new' | 'approved' | 'answered' | 'resolved' | 'rejected'
  createdAt: string
  replies: { by: string; text: string }[]
  anonId?: string
}

export type User = { 
  id: string
  email: string
  password: string
  role: 'employee' | 'hr' | 'manager' | 'moderator' | 'supervisor'
  anonId?: string
  points?: number
  badges?: string[]
}

const now = () => new Date().toISOString()

let messages: Message[] = [
  { id: 1, type: 'complaint', department: 'Продажи', title: 'Задержка выплаты премий', body: 'Премии за последний квартал до сих пор не выплачены. Обещали до 15 числа, но уже 20-е.', status: 'new', createdAt: now(), replies: [], anonId: 'сотрудник-834' },
  { id: 2, type: 'praise', department: 'Поддержка', title: 'Отличная работа команды поддержки', body: 'Хочу поблагодарить Анну из отдела поддержки за оперативное решение моего вопроса. Очень профессионально!', status: 'resolved', createdAt: now(), replies: [{ by: 'HR', text: 'Спасибо за обратную связь! Передадим благодарность Анне.' }], anonId: 'сотрудник-521' },
  { id: 3, type: 'suggestion', department: 'IT', title: 'Предложение по улучшению рабочего процесса', body: 'Предлагаю внедрить систему автоматического резервного копирования данных. Это повысит безопасность и надежность работы.', status: 'approved', createdAt: now(), replies: [{ by: 'Руководитель IT', text: 'Идея интересная, рассмотрим на ближайшем совещании.' }], anonId: 'сотрудник-247' },
  { id: 4, type: 'complaint', department: 'HR', title: 'Проблема с графиком отпусков', body: 'Не могу согласовать отпуск на удобные мне даты. Система постоянно показывает, что все места заняты.', status: 'new', createdAt: now(), replies: [], anonId: 'сотрудник-912' },
  { id: 5, type: 'praise', department: 'Маркетинг', title: 'Отличная организация корпоратива', body: 'Спасибо отделу маркетинга за прекрасно организованное новогоднее мероприятие! Все было на высшем уровне.', status: 'resolved', createdAt: now(), replies: [], anonId: 'сотрудник-634' },
  { id: 6, type: 'suggestion', department: 'Общее', title: 'Предложение по улучшению офисного пространства', body: 'Хотелось бы добавить больше растений в офис и улучшить освещение. Это повысит комфорт работы сотрудников.', status: 'new', createdAt: now(), replies: [], anonId: 'сотрудник-189' }
]

let users: User[] = [
  { id: 'u1', email: 'employee@example.com', password: 'password', role: 'employee', anonId: 'сотрудник-834', points: 120, badges: ['Новичок', 'Активный участник'] },
  { id: 'u2', email: 'hr@example.com', password: 'password', role: 'hr', anonId: 'hr-001' },
  { id: 'u3', email: 'moderator@example.com', password: 'password', role: 'moderator', anonId: 'mod-001' },
  { id: 'u4', email: 'supervisor@example.com', password: 'password', role: 'supervisor', anonId: 'svp-001' },
  { id: 'u5', email: 'dauletorazalov@gmail.com', password: '12345678900', role: 'manager', anonId: 'manager-001' },
  { id: 'u6', email: 'mungi0518@gmail.com', password: '12345678900', role: 'employee', anonId: 'сотрудник-999', points: 0, badges: [] }
]

// Хранилище кодов подтверждения
let verificationCodes: Record<string, { code: string; expiresAt: number }> = {}

export const db = {
  fetchMessages: () => messages,
  fetchUsers: () => users,
  createMessage: (payload: Omit<Message, 'id' | 'status' | 'createdAt' | 'replies' | 'anonId'>) => {
    const id = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1
    // Генерируем случайный анонимный ID для нового сообщения
    const anonId = `сотрудник-${Math.floor(Math.random() * 9000 + 1000)}`
    const msg: Message = { id, ...payload, status: 'new', createdAt: now(), replies: [], anonId }
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
  },
  getUserByEmail: (email: string) => users.find(u => u.email === email),
  login: (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password)
    return user || null
  },
  // Проверка существования email
  checkEmailExists: (email: string): boolean => {
    return users.some(u => u.email === email)
  },
  // Генерация и отправка кода подтверждения
  sendVerificationCode: (email: string): string => {
    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    // Код действителен 10 минут
    const expiresAt = Date.now() + 10 * 60 * 1000
    
    verificationCodes[email] = { code, expiresAt }
    
    // Имитация отправки на email (в реальном приложении здесь был бы API вызов)
    // Для демо показываем код в alert
    console.log(`Код подтверждения для ${email}: ${code}`)
    
    // Отправляем "на почту" (в реальности здесь был бы вызов email сервиса)
    // Для демо показываем alert
    setTimeout(() => {
      alert(`Код подтверждения отправлен на ${email}\n\nКод: ${code}\n\n(В реальном приложении код придет на почту)`)
    }, 500)
    
    return code
  },
  // Проверка кода подтверждения
  verifyCode: (email: string, code: string): boolean => {
    const verification = verificationCodes[email]
    if (!verification) return false
    if (Date.now() > verification.expiresAt) {
      delete verificationCodes[email]
      return false
    }
    if (verification.code !== code) return false
    
    // Код верный, удаляем его
    delete verificationCodes[email]
    return true
  },
  // Регистрация нового пользователя
  register: (email: string, password: string): User => {
    const id = `u${users.length + 1}`
    const anonId = `сотрудник-${Math.floor(Math.random() * 9000 + 1000)}`
    const newUser: User = {
      id,
      email,
      password,
      role: 'employee',
      anonId,
      points: 0,
      badges: []
    }
    users.push(newUser)
    return newUser
  }
}

