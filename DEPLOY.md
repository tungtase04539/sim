# Hướng dẫn Deploy OTP Resale lên Vercel + Supabase

## 📋 Yêu cầu
- Tài khoản GitHub
- Tài khoản Supabase (miễn phí)
- Tài khoản Vercel (miễn phí)
- Tài khoản SePay (để nhận thanh toán)
- Bot Telegram (để nhận thông báo)

---

## 🗄️ Bước 1: Tạo Supabase Project

### 1.1. Đăng ký/Đăng nhập Supabase
1. Truy cập https://supabase.com
2. Click **Start your project** hoặc **Sign In**
3. Đăng nhập bằng GitHub

### 1.2. Tạo Project mới
1. Click **New Project**
2. Điền thông tin:
   - **Name**: `otp-resale`
   - **Database Password**: Tạo password mạnh (LƯU LẠI!)
   - **Region**: Singapore (gần VN nhất)
3. Click **Create new project**
4. Đợi 1-2 phút để project được tạo

### 1.3. Chạy Database Schema
1. Vào **SQL Editor** (menu bên trái)
2. Click **New query**
3. Copy toàn bộ nội dung file `supabase/schema.sql` và paste vào
4. Click **Run** (hoặc Ctrl+Enter)
5. Đợi thông báo "Success"

### 1.4. Lấy API Keys
1. Vào **Settings** → **API**
2. Copy các giá trị sau:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUz...`
   - **service_role key**: `eyJhbGciOiJIUz...` (Click "Reveal" để xem)

---

## 🤖 Bước 2: Tạo Telegram Bot

### 2.1. Tạo Bot
1. Mở Telegram, tìm **@BotFather**
2. Gửi `/newbot`
3. Đặt tên bot: `OTP Resale Notify`
4. Đặt username: `otpresale_notify_bot` (phải unique)
5. Copy **Bot Token** được cung cấp

### 2.2. Lấy Chat ID
1. Tạo Group/Channel mới trên Telegram
2. Thêm bot vào group
3. Gửi một tin nhắn bất kỳ trong group
4. Truy cập: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
5. Tìm `"chat":{"id":-123456789}` - đó là Chat ID

---

## 💳 Bước 3: Cấu hình SePay

### 3.1. Đăng ký SePay
1. Truy cập https://sepay.vn
2. Đăng ký tài khoản
3. Liên kết tài khoản ngân hàng

### 3.2. Lấy API Key
1. Vào **Cài đặt** → **API**
2. Copy **API Key**

### 3.3. Cấu hình thông tin ngân hàng
Cập nhật file `src/app/dashboard/deposit/page.tsx`:
```typescript
const BANK_INFO = {
  bankName: 'MB Bank',        // Tên ngân hàng của bạn
  accountNumber: '0326868888', // Số tài khoản của bạn
  accountName: 'OTP RESALE',   // Tên tài khoản
  bankBin: '970422',           // Mã BIN ngân hàng (xem danh sách trong src/lib/sepay.ts)
}
```

---

## 🚀 Bước 4: Deploy lên Vercel

### 4.1. Push code lên GitHub
```bash
# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Initial commit - OTP Resale"

# Tạo repo mới trên GitHub và push
git remote add origin https://github.com/YOUR_USERNAME/otp-resale.git
git branch -M main
git push -u origin main
```

### 4.2. Import vào Vercel
1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **Add New** → **Project**
4. Chọn repository `otp-resale`
5. **QUAN TRỌNG**: Thêm Environment Variables trước khi deploy

### 4.3. Thêm Environment Variables
Trong màn hình configure, thêm các biến sau:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUz...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUz...` |
| `SEPAY_API_KEY` | API key từ SePay |
| `SEPAY_WEBHOOK_SECRET` | Tự tạo chuỗi random |
| `TELEGRAM_BOT_TOKEN` | Token từ BotFather |
| `TELEGRAM_CHAT_ID` | Chat ID của group |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `OTP Resale` |

### 4.4. Deploy
1. Click **Deploy**
2. Đợi 2-3 phút để build hoàn tất
3. Truy cập URL được cung cấp

---

## ⚙️ Bước 5: Cấu hình sau Deploy

### 5.1. Cập nhật SePay Webhook
1. Vào SePay → **Cài đặt** → **Webhook**
2. Thêm URL: `https://your-domain.vercel.app/api/webhook/sepay`
3. Chọn sự kiện: **Giao dịch mới**

### 5.2. Tạo tài khoản Admin
1. Đăng ký tài khoản trên website
2. Vào Supabase → **Table Editor** → **profiles**
3. Tìm user của bạn, sửa `role` thành `admin`

### 5.3. Cấu hình Custom Domain (tuỳ chọn)
1. Vào Vercel → Project → **Settings** → **Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn

---

## 🔧 Troubleshooting

### Lỗi "Invalid API Key"
- Kiểm tra lại các environment variables
- Đảm bảo không có khoảng trắng thừa

### Webhook không hoạt động
- Kiểm tra URL webhook đúng chưa
- Xem logs trong Vercel → **Functions**

### Không nhận được Telegram
- Kiểm tra Bot Token và Chat ID
- Đảm bảo bot đã được thêm vào group

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs trong Vercel Dashboard
2. Xem logs trong Supabase → **Logs**
3. Tạo Issue trên GitHub repository

