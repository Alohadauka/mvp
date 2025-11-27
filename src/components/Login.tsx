import React, { useState } from 'react'
import { db } from '../FakeDB'

type Props = {
  onLogin: (user: { email: string; role: string }) => void
}

type RegisterStep = 'email' | 'code' | 'password'

export default function Login({ onLogin }: Props) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [registerStep, setRegisterStep] = useState<RegisterStep>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const user = db.login(email, password)
      if (user) {
        onLogin({ email: user.email, role: user.role })
      } else {
        setError('Неверный email или пароль')
      }
      setLoading(false)
    }, 300)
  }

  function handleRegisterEmail(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    if (db.checkEmailExists(email)) {
      setError('Пользователь с таким email уже зарегистрирован')
      return
    }

    setLoading(true)
    setTimeout(() => {
      db.sendVerificationCode(email)
      setRegisterStep('code')
      setLoading(false)
    }, 300)
  }

  function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (db.verifyCode(email, code)) {
        setRegisterStep('password')
      } else {
        setError('Неверный код подтверждения или код истек')
      }
      setLoading(false)
    }, 300)
  }

  function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const newUser = db.register(email, password)
      onLogin({ email: newUser.email, role: newUser.role })
      setLoading(false)
    }, 300)
  }

  function resetForm() {
    setIsRegister(false)
    setEmail('')
    setPassword('')
    setCode('')
    setRegisterStep('email')
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold mb-2">
            {isRegister ? 'Регистрация' : 'Вход в систему'}
          </h2>
          <p className="text-slate-400">
            {isRegister 
              ? registerStep === 'email' 
                ? 'Введите email для регистрации'
                : registerStep === 'code'
                ? 'Введите код подтверждения из письма'
                : 'Придумайте пароль'
              : 'Введите email и пароль для доступа'}
          </p>
        </div>

        {!isRegister ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-slate-200">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-slate-100"
                placeholder="example@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-200">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-slate-100"
                placeholder="Введите пароль"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-mocha text-white font-semibold shadow-[0_15px_30px_rgba(123,94,85,0.35)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-sm text-brand hover:text-indigo-400 transition-colors"
              >
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
          </form>
        ) : (
          <>
            {registerStep === 'email' && (
              <form onSubmit={handleRegisterEmail} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-200">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-slate-100"
                    placeholder="example@email.com"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-mocha text-white font-semibold shadow-[0_15px_30px_rgba(123,94,85,0.35)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Отправка...' : 'Отправить код'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    Вернуться к входу
                  </button>
                </div>
              </form>
            )}

            {registerStep === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-200">Код подтверждения</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-slate-100 text-center text-2xl font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Код отправлен на {email}
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-mocha text-white font-semibold shadow-[0_15px_30px_rgba(123,94,85,0.35)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Проверка...' : 'Подтвердить код'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCode('')
                      db.sendVerificationCode(email)
                    }}
                    className="text-sm text-brand hover:text-indigo-400 transition-colors"
                  >
                    Отправить код повторно
                  </button>
                </div>
              </form>
            )}

            {registerStep === 'password' && (
              <form onSubmit={handleSetPassword} className="space-y-6">
                <div>
                  <label className="block mb-2 font-semibold text-slate-200">Придумайте пароль</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-brand focus:outline-none transition-colors text-slate-100"
                    placeholder="Минимум 6 символов"
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Пароль должен содержать минимум 6 символов
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || password.length < 6}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-mocha text-white font-semibold shadow-[0_15px_30px_rgba(123,94,85,0.35)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </form>
            )}
          </>
        )}

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-slate-500 text-center">
            {!isRegister && 'Для доступа к админ-панели требуется роль менеджера или HR'}
          </p>
        </div>
      </div>
    </div>
  )
}

