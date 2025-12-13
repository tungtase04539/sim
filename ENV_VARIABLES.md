# Environment Variables

## Required Variables (Bắt buộc)

### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Sepay
```env
SEPAY_API_KEY=your_sepay_api_key
```

## Recommended Variables (Khuyến nghị)

### Sepay Webhook
```env
SEPAY_WEBHOOK_SECRET=your_webhook_secret  # Để verify webhook signature
SEPAY_MERCHANT_ID=your_merchant_id        # Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com  # URL của app để cấu hình webhook
```

### Bank Information
```env
BANK_ACCOUNT=your_bank_account_number
BANK_NAME=your_bank_name
NEXT_PUBLIC_BANK_CODE=your_bank_code
NEXT_PUBLIC_BANK_ACCOUNT=your_bank_account_number
NEXT_PUBLIC_BANK_NAME=your_bank_name
NEXT_PUBLIC_BANK_ACCOUNT_NAME=your_account_name
```

## Optional Variables (Tùy chọn)

### Telegram Notifications
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

## Kiểm tra Environment Variables

Sử dụng endpoint sau để kiểm tra:
```bash
GET /api/test-env
```

Hoặc test toàn bộ hệ thống:
```bash
GET /api/test-system
```

## Default Values

Nếu không set các biến sau, hệ thống sẽ dùng giá trị mặc định:
- `BANK_ACCOUNT`: `0326868888`
- `BANK_NAME`: `MB Bank`
- `NEXT_PUBLIC_BANK_CODE`: `MB`
- `NEXT_PUBLIC_BANK_ACCOUNT`: `0326868888`
- `NEXT_PUBLIC_BANK_NAME`: `MB Bank`
- `NEXT_PUBLIC_BANK_ACCOUNT_NAME`: `NGUYEN VAN A`

## Webhook Configuration

Sau khi set `NEXT_PUBLIC_APP_URL`, webhook URL sẽ là:
```
https://your-domain.com/api/webhook/sepay
```

Cấu hình URL này trong Sepay dashboard với:
- Method: POST
- Header: `x-sepay-signature` (nếu có `SEPAY_WEBHOOK_SECRET`)

