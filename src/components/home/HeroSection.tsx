'use client'

import { Zap, Shield, Clock, Globe } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const features = [
    { icon: Zap, text: 'Nhận OTP trong 30s', color: 'text-yellow-500' },
    { icon: Shield, text: 'Hoàn tiền 100%', color: 'text-green-500' },
    { icon: Clock, text: 'Hỗ trợ 24/7', color: 'text-blue-500' },
    { icon: Globe, text: '180+ quốc gia', color: 'text-purple-500' },
  ]

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animate-delay-200" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animate-delay-400" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Hệ thống đang hoạt động ổn định
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 dark:text-white mb-6 animate-fade-in animate-delay-100">
            Thuê SIM Nhận{' '}
            <span className="text-gradient">OTP</span>
            <br />
            Nhanh Chóng & Uy Tín
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-dark-600 dark:text-dark-300 max-w-3xl mx-auto mb-8 animate-fade-in animate-delay-200">
            Dịch vụ cho thuê số điện thoại ảo nhận mã OTP từ hơn 180 quốc gia. 
            Hỗ trợ hơn 1000+ dịch vụ như Facebook, Google, Telegram, TikTok và nhiều hơn nữa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in animate-delay-300">
            <Link href="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Bắt đầu ngay
              <Zap className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              Xem bảng giá
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in animate-delay-400">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-4 flex flex-col items-center gap-2"
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <span className="text-sm font-medium text-dark-700 dark:text-dark-200">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

