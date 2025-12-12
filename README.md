# OTP Resale - Dịch vụ cho thuê SIM nhận OTP

Hệ thống cho thuê SIM nhận OTP tương tự otpnhanh.net, được xây dựng với Next.js, Supabase và tích hợp thanh toán SePay.

## 🚀 Tính năng

### Người dùng
- ✅ Đăng ký/Đăng nhập với email
- ✅ Thuê số điện thoại nhận OTP
- ✅ Hỗ trợ 180+ quốc gia, 1000+ dịch vụ
- ✅ Nạp tiền tự động qua chuyển khoản ngân hàng (SePay)
- ✅ Hoàn tiền tự động khi không nhận được OTP
- ✅ Lịch sử giao dịch chi tiết
- ✅ API key để tích hợp

### Admin
- ✅ Dashboard quản trị tổng quan
- ✅ Quản lý người dùng
- ✅ Quản lý dịch vụ và quốc gia
- ✅ Thống kê doanh thu, giao dịch
- ✅ Cấu hình hệ thống

### Tích hợp
- ✅ SePay - Thanh toán tự động
- ✅ Telegram Bot - Thông báo giao dịch
- ✅ API RESTful đầy đủ

## 🛠 Công nghệ

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: SePay (VietQR)
- **Deployment**: Vercel

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <your-repo-url>
cd otp-resale
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo Supabase Project

1. Đăng nhập [Supabase](https://supabase.com)
2. Tạo project mới
3. Vào SQL Editor và chạy file `supabase/schema.sql`
4. Copy URL và API keys

### 4. Cấu hình Environment Variables

Tạo file `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SePay Payment Gateway
SEPAY_API_KEY=your_sepay_api_key
SEPAY_WEBHOOK_SECRET=your_webhook_secret

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=OTP Resale
```

### 5. Cấu hình SePay

1. Đăng ký tài khoản tại [SePay](https://sepay.vn)
2. Lấy API Key từ trang quản trị
3. Cấu hình Webhook URL: `https://your-domain.com/api/webhook/sepay`

### 6. Tạo Telegram Bot

1. Chat với [@BotFather](https://t.me/BotFather) trên Telegram
2. Tạo bot mới với `/newbot`
3. Copy Bot Token
4. Lấy Chat ID của group/channel để nhận thông báo

### 7. Chạy Development Server

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy lên Vercel

### 1. Push code lên GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import vào Vercel

1. Đăng nhập [Vercel](https://vercel.com)
2. Click "New Project"
3. Import từ GitHub repository
4. Thêm Environment Variables
5. Deploy!

### 3. Cấu hình Domain

1. Vào Settings > Domains
2. Thêm custom domain (nếu có)
3. Cập nhật NEXT_PUBLIC_APP_URL

### 4. Cập nhật Webhook URL

Cập nhật SePay webhook URL thành domain production của bạn.

## 📁 Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── dashboard/        # Dashboard components
│   ├── home/             # Homepage components
│   └── ui/               # Shared UI components
└── lib/                  # Utilities
    ├── supabase/         # Supabase clients
    ├── types.ts          # TypeScript types
    ├── utils.ts          # Helper functions
    ├── telegram.ts       # Telegram integration
    └── sepay.ts          # SePay integration
```

## 🔐 Tài khoản Admin

Sau khi deploy, cập nhật role của user thành 'admin' trong Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 📝 API Documentation

### Authentication

Sử dụng API Key trong header:

```
Authorization: Bearer your_api_key
```

### Endpoints

#### Lấy danh sách dịch vụ
```
GET /api/services
```

#### Lấy danh sách quốc gia
```
GET /api/countries
```

#### Thuê số nhận OTP
```
POST /api/orders
{
  "service_id": "uuid",
  "country_id": "uuid"
}
```

#### Kiểm tra trạng thái đơn
```
GET /api/orders/:id
```

#### Hủy đơn
```
DELETE /api/orders/:id
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue.

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Liên hệ

- Telegram: [@otpresale](https://t.me/otpresale)
- Email: support@otpresale.com
