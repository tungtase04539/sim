'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email hoặc mật khẩu không đúng')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Vui lòng xác nhận email trước khi đăng nhập')
        } else {
          setError(signInError.message)
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-4 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform animate-pulse-glow">
              <span className="text-white font-bold text-3xl drop-shadow-lg">O</span>
            </div>
            <span className="text-3xl font-bold gradient-text">
              OTP Resale
            </span>
          </Link>
        </div>

        {/* Form */}
        <div className="glass-card-strong p-10">
          <h1 className="text-4xl font-bold gradient-text text-center mb-3 drop-shadow-lg">
            Đăng nhập
          </h1>
          <p className="text-white/80 text-center mb-8 text-lg drop-shadow-md">
            Chào mừng bạn quay lại!
          </p>

          {error && (
            <div className="mb-6 p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400/50 text-red-200 text-sm font-semibold shadow-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-dark-700 dark:text-dark-300 mb-2 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-700 dark:text-dark-300 mb-2 uppercase tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-dark-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-dark-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-dark-300 w-4 h-4" />
                <span className="text-xs text-dark-600 dark:text-dark-400">Nhớ đăng nhập</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-dark-600 dark:text-dark-400">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary-600 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center">
          <Link href="/" className="text-dark-500 hover:text-primary-600 text-sm">
            ← Quay lại trang chủ
          </Link>
        </p>
      </div>
    </div>
  )
}
