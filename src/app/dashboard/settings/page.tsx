'use client'

import { useState, useEffect } from 'react'
import { Settings, User, Lock, Bell, Save, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
  })

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      if (data.success) {
        setProfile({
          full_name: data.data.full_name || '',
          email: data.data.email || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile')
    }
    setIsFetching(false)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: profile.full_name })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Đã lưu thông tin!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Có lỗi xảy ra' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra' })
    }
    
    setIsLoading(false)
  }

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' })
      return
    }
    
    if (password.new.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự!' })
      return
    }
    
    setIsLoading(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          current_password: password.current,
          new_password: password.new 
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Đã đổi mật khẩu thành công!' })
        setPassword({ current: '', new: '', confirm: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Có lỗi xảy ra' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra' })
    }
    
    setIsLoading(false)
  }

  const tabs = [
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Lock },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ]

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary-500" />
          Cài đặt
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={cn(
          "p-4 rounded-xl flex items-center gap-3",
          message.type === 'success' 
            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
        )}>
          <CheckCircle2 className="w-5 h-5" />
          {message.text}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-dark-200 dark:border-dark-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage(null) }}
              className={cn(
                "flex items-center gap-2 px-6 py-4 font-medium transition-colors",
                activeTab === tab.id
                  ? "text-primary-600 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "text-dark-500 hover:text-dark-700 dark:hover:text-dark-300"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="input-field bg-dark-100 dark:bg-dark-700 cursor-not-allowed"
                />
                <p className="text-sm text-dark-500 mt-1">Email không thể thay đổi</p>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu thay đổi
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Đổi mật khẩu</h3>
              
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-dark-400" /> : <Eye className="w-5 h-5 text-dark-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  className="input-field"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isLoading || !password.current || !password.new}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                Đổi mật khẩu
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Cài đặt thông báo</h3>
              
              {[
                { id: 'email_deposit', label: 'Thông báo nạp tiền qua Email', checked: true },
                { id: 'email_order', label: 'Thông báo đơn hàng qua Email', checked: true },
                { id: 'telegram', label: 'Nhận thông báo qua Telegram', checked: false },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <span>{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none rounded-full peer dark:bg-dark-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
