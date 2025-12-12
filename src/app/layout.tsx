import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'OTP Resale - Thuê SIM Nhận OTP Nhanh Chóng',
  description: 'Dịch vụ cho thuê SIM nhận OTP từ nhiều quốc gia, hỗ trợ hơn 1000 dịch vụ, thanh toán tự động qua ngân hàng.',
  keywords: ['otp', 'sim', 'thuê sim', 'nhận otp', 'verification', 'sms'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
