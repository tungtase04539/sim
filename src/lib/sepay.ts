// SePay Integration for automatic bank payment verification
// Documentation: https://sepay.vn/docs

const SEPAY_API_KEY = process.env.SEPAY_API_KEY
const SEPAY_MERCHANT_ID = process.env.SEPAY_MERCHANT_ID

interface SePayTransaction {
  id: string
  gateway: string
  transactionDate: string
  accountNumber: string
  subAccount: string | null
  transferType: 'in' | 'out'
  transferAmount: number
  accumulated: number
  code: string | null
  transactionContent: string
  referenceNumber: string
  description: string
}

interface SePayWebhookPayload {
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  subAccount: string | null
  transferType: string
  transferAmount: number
  accumulated: number
  code: string | null
  transactionContent: string
  referenceNumber: string
  description: string
}

export interface PaymentInfo {
  bankAccount: string
  bankName: string
  accountName: string
  amount: number
  content: string
  qrCodeUrl: string
}

// Generate QR Code URL for VietQR
export function generateVietQRUrl(
  bankBin: string,
  accountNumber: string,
  amount: number,
  content: string,
  accountName: string = 'OTP RESALE'
): string {
  const template = 'compact2'
  const baseUrl = 'https://img.vietqr.io/image'
  
  return `${baseUrl}/${bankBin}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(accountName)}`
}

// Bank BIN codes for VietQR
export const BANK_BINS: Record<string, string> = {
  'VCB': '970436',      // Vietcombank
  'TCB': '970407',      // Techcombank
  'MB': '970422',       // MB Bank
  'ACB': '970416',      // ACB
  'VPB': '970432',      // VPBank
  'TPB': '970423',      // TPBank
  'STB': '970403',      // Sacombank
  'HDB': '970437',      // HDBank
  'VIB': '970441',      // VIB
  'SHB': '970443',      // SHB
  'MSB': '970426',      // MSB
  'OCB': '970448',      // OCB
  'BIDV': '970418',     // BIDV
  'AGR': '970405',      // Agribank
}

// Verify SePay webhook signature
export function verifySePaySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
}

// Parse payment code from transaction content
export function parsePaymentCode(content: string): string | null {
  // Look for pattern like "OTP" followed by alphanumeric code
  const patterns = [
    /OTP[A-Z0-9]{8,}/i,
    /MA\s*TT\s*:?\s*([A-Z0-9]+)/i,
    /NAP\s*:?\s*([A-Z0-9]+)/i,
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      return match[0].replace(/\s+/g, '').toUpperCase()
    }
  }

  return null
}

// Get transactions from SePay API
export async function getSePayTransactions(
  fromDate?: string,
  toDate?: string
): Promise<SePayTransaction[]> {
  if (!SEPAY_API_KEY) {
    throw new Error('SePay API key not configured')
  }

  const params = new URLSearchParams()
  if (fromDate) params.append('fromDate', fromDate)
  if (toDate) params.append('toDate', toDate)

  const response = await fetch(
    `https://my.sepay.vn/userapi/transactions/list?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${SEPAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch SePay transactions')
  }

  const data = await response.json()
  return data.transactions || []
}

// Check for matching deposit
export async function checkDeposit(
  paymentCode: string,
  expectedAmount: number
): Promise<{ found: boolean; transaction?: SePayTransaction }> {
  try {
    const transactions = await getSePayTransactions()
    
    for (const tx of transactions) {
      if (tx.transferType !== 'in') continue
      
      const txCode = parsePaymentCode(tx.transactionContent)
      
      if (txCode === paymentCode && tx.transferAmount >= expectedAmount) {
        return { found: true, transaction: tx }
      }
    }
    
    return { found: false }
  } catch (error) {
    console.error('Error checking deposit:', error)
    return { found: false }
  }
}

// Process webhook from SePay
export function processSePayWebhook(payload: SePayWebhookPayload): {
  isDeposit: boolean
  paymentCode: string | null
  amount: number
  referenceNumber: string
} {
  const isDeposit = payload.transferType === 'in'
  const paymentCode = parsePaymentCode(payload.transactionContent)
  
  return {
    isDeposit,
    paymentCode,
    amount: payload.transferAmount,
    referenceNumber: payload.referenceNumber,
  }
}

