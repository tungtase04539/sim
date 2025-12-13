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
  if (!content || typeof content !== 'string') {
    return null
  }

  // Normalize content: remove extra spaces, convert to uppercase
  const normalized = content.trim().toUpperCase()
  
  // Look for pattern like "OTP" followed by alphanumeric code
  // Patterns to try (in order of specificity):
  const patterns = [
    // Exact match: OTP followed by alphanumeric (8+ chars)
    /OTP[A-Z0-9]{8,}/,
    // OTP with spaces: OTP ABC123XYZ
    /OTP\s+([A-Z0-9]{8,})/,
    // MA TT: OTPCODE or NAP: OTPCODE
    /(?:MA\s*TT|NAP)\s*:?\s*(OTP[A-Z0-9]{8,})/i,
    // Just OTP code without prefix
    /^OTP[A-Z0-9]{8,}$/,
    // Any alphanumeric code that starts with OTP
    /\b(OTP[A-Z0-9]{6,})\b/,
    // Try to extract any code that looks like payment code (alphanumeric, 8+ chars)
    /\b([A-Z0-9]{10,})\b/,
  ]

  for (const pattern of patterns) {
    const match = normalized.match(pattern)
    if (match) {
      // Extract the code (use first capture group if available, otherwise use full match)
      const code = match[1] || match[0]
      if (code) {
        const cleaned = code.replace(/\s+/g, '').toUpperCase()
        // Validate: should start with OTP and be at least 8 chars
        if (cleaned.startsWith('OTP') && cleaned.length >= 11) {
          console.log(`[parsePaymentCode] Found code: ${cleaned} from content: "${content}"`)
          return cleaned
        }
      }
    }
  }

  // If no pattern matched, try to find any OTP-like code
  const otpMatch = normalized.match(/OTP[A-Z0-9]+/i)
  if (otpMatch) {
    const code = otpMatch[0].replace(/\s+/g, '').toUpperCase()
    console.log(`[parsePaymentCode] Found OTP code (loose match): ${code} from content: "${content}"`)
    return code
  }

  console.log(`[parsePaymentCode] No payment code found in content: "${content}"`)
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
export function processSePayWebhook(payload: SePayWebhookPayload | any): {
  isDeposit: boolean
  paymentCode: string | null
  amount: number
  referenceNumber: string
} {
  // Handle different payload formats
  const transferType = payload.transferType || payload.transfer_type || payload.type
  const transactionContent = payload.transactionContent || payload.transaction_content || payload.content || payload.description || ''
  const transferAmount = payload.transferAmount || payload.transfer_amount || payload.amount || 0
  const referenceNumber = payload.referenceNumber || payload.reference_number || payload.id?.toString() || payload.transaction_id || ''

  const isDeposit = transferType === 'in' || transferType === 'IN' || transferType === 1
  
  console.log('[processSePayWebhook] Processing payload:', {
    transferType,
    transactionContent,
    transferAmount,
    referenceNumber,
    isDeposit
  })
  
  const paymentCode = parsePaymentCode(transactionContent)
  
  return {
    isDeposit,
    paymentCode,
    amount: Number(transferAmount),
    referenceNumber: String(referenceNumber),
  }
}

