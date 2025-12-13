const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface TelegramMessage {
  type: 'deposit' | 'order' | 'refund' | 'alert'
  title: string
  details: Record<string, string | number>
}

export async function sendTelegramNotification(message: TelegramMessage): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured')
    return false
  }

  const emoji = {
    deposit: '💰',
    order: '📱',
    refund: '↩️',
    alert: '⚠️',
  }

  let text = `${emoji[message.type]} <b>${message.title}</b>\n\n`
  
  for (const [key, value] of Object.entries(message.details)) {
    text += `<b>${key}:</b> ${value}\n`
  }
  
  text += `\n⏰ ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      }
    )

    const result = await response.json()
    return result.ok
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
    return false
  }
}

export async function notifyDeposit(
  userEmail: string,
  amount: number,
  paymentCode: string,
  transactionId?: string
): Promise<void> {
  await sendTelegramNotification({
    type: 'deposit',
    title: 'Nạp tiền thành công',
    details: {
      'Email': userEmail,
      'Số tiền': `${amount.toLocaleString('vi-VN')} VND`,
      'Mã thanh toán': paymentCode,
      'Mã giao dịch': transactionId || 'N/A',
    },
  })
}

export async function notifyOrder(
  userEmail: string,
  service: string,
  country: string,
  phone: string,
  price: number
): Promise<void> {
  await sendTelegramNotification({
    type: 'order',
    title: 'Đơn thuê OTP mới',
    details: {
      'Email': userEmail,
      'Dịch vụ': service,
      'Quốc gia': country,
      'Số điện thoại': phone,
      'Giá': `${price.toLocaleString('vi-VN')} VND`,
    },
  })
}

export async function notifyRefund(
  userEmail: string,
  orderId: string,
  amount: number,
  reason: string
): Promise<void> {
  await sendTelegramNotification({
    type: 'refund',
    title: 'Hoàn tiền đơn hàng',
    details: {
      'Email': userEmail,
      'Mã đơn': orderId,
      'Số tiền hoàn': `${amount.toLocaleString('vi-VN')} VND`,
      'Lý do': reason,
    },
  })
}

export async function notifyAlert(title: string, message: string): Promise<void> {
  await sendTelegramNotification({
    type: 'alert',
    title,
    details: {
      'Chi tiết': message,
    },
  })
}

