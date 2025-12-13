// Telegram Bot integration for notifications

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Send message to Telegram
async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram] Not configured, skipping notification')
    return false
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('[Telegram] Error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Telegram] Error sending message:', error)
    return false
  }
}

// Notify about deposit
export async function notifyDeposit(
  userEmail: string,
  amount: number,
  paymentCode: string,
  referenceNumber: string
): Promise<void> {
  const message = `
💰 <b>Nạp tiền thành công</b>

👤 Email: ${userEmail}
💵 Số tiền: ${amount.toLocaleString('vi-VN')}đ
🔖 Mã thanh toán: ${paymentCode}
📝 Mã tham chiếu: ${referenceNumber}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
  `.trim()

  await sendTelegramMessage(message)
}

// Notify about order
export async function notifyOrder(
  userEmail: string,
  service: string,
  phoneNumber: string,
  amount: number
): Promise<void> {
  const message = `
📱 <b>Đơn hàng mới</b>

👤 Email: ${userEmail}
🛍️ Dịch vụ: ${service}
📞 Số điện thoại: ${phoneNumber}
💵 Giá: ${amount.toLocaleString('vi-VN')}đ
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
  `.trim()

  await sendTelegramMessage(message)
}

// Notify about refund
export async function notifyRefund(
  userEmail: string,
  amount: number,
  reason: string
): Promise<void> {
  const message = `
↩️ <b>Hoàn tiền</b>

👤 Email: ${userEmail}
💵 Số tiền: ${amount.toLocaleString('vi-VN')}đ
📝 Lý do: ${reason}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
  `.trim()

  await sendTelegramMessage(message)
}

// Send alert
export async function notifyAlert(message: string): Promise<void> {
  await sendTelegramMessage(`⚠️ <b>Alert</b>\n\n${message}`)
}

