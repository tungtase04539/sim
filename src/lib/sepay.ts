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
// Improved pattern matching for various formats
export function parsePaymentCode(content: string): string | null {
  if (!content) return null
  
  // Normalize: uppercase, remove extra spaces and special chars that might interfere
  const normalized = content.toUpperCase().trim()
  
  // Pattern 1: OTP followed by alphanumeric (OTPxxxxx or OTP xxxxx)
  const pattern1 = /OTP\s*([A-Z0-9]{4,10})/i
  const match1 = normalized.match(pattern1)
  if (match1) {
    return 'OTP' + match1[1].replace(/\s+/g, '')
  }
  
  // Pattern 2: OTPxxxxx (no space, direct)
  const pattern2 = /OTP[A-Z0-9]{4,10}/i
  const match2 = normalized.match(pattern2)
  if (match2) {
    return match2[0].replace(/\s+/g, '')
  }
  
  // Pattern 3: ND: OTPxxxxx or NOI DUNG: OTPxxxxx
  const pattern3 = /(?:ND|NOI\s*DUNG)\s*:?\s*(OTP[A-Z0-9]+)/i
  const match3 = normalized.match(pattern3)
  if (match3) {
    return match3[1].replace(/\s+/g, '')
  }
  
  // Pattern 4: MA TT: OTPxxxxx
  const pattern4 = /MA\s*TT\s*:?\s*(OTP[A-Z0-9]+)/i
  const match4 = normalized.match(pattern4)
  if (match4) {
    return match4[1].replace(/\s+/g, '')
  }
  
  // Pattern 5: Just look for OTP anywhere followed by alphanumeric
  const pattern5 = /OTP[A-Z0-9]+/i
  const match5 = normalized.match(pattern5)
  if (match5) {
    return match5[0].replace(/\s+/g, '').toUpperCase()
  }
  
  return null
}

// Get transactions from SePay API
export async function getSePayTransactions(
  fromDate?: string,
  toDate?: string
): Promise<SePayTransaction[]> {
  if (!SEPAY_API_KEY) {
    console.log('[SePay] API key not configured')
    return []
  }

  try {
    const params = new URLSearchParams()
    // Get transactions from last 24 hours by default
    if (!fromDate) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      params.append('fromDate', yesterday.toISOString().split('T')[0])
    } else {
      params.append('fromDate', fromDate)
    }
    
    if (toDate) {
      params.append('toDate', toDate)
    }

    console.log('[SePay] Fetching transactions...')
    
    const response = await fetch(
      `https://my.sepay.vn/userapi/transactions/list?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${SEPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[SePay] API error:', response.status, errorText)
      throw new Error(`SePay API error: ${response.status}`)
    }

    const data = await response.json()
    const transactions = data.transactions || data.data || []
    console.log(`[SePay] Found ${transactions.length} transactions`)
    
    return transactions
  } catch (error: any) {
    console.error('[SePay] Error fetching transactions:', error.message)
    return []
  }
}

// Check for matching deposit
export async function checkDeposit(
  paymentCode: string,
  expectedAmount: number
): Promise<{ found: boolean; transaction?: SePayTransaction; error?: string }> {
  try {
    console.log(`[SePay] Checking deposit - Code: ${paymentCode}, Amount: ${expectedAmount}`)
    
    if (!SEPAY_API_KEY) {
      console.log('[SePay] API key not configured, cannot check')
      return { found: false, error: 'SePay chưa được cấu hình' }
    }
    
    const transactions = await getSePayTransactions()
    
    if (transactions.length === 0) {
      console.log('[SePay] No transactions found')
      return { found: false, error: 'Không tìm thấy giao dịch nào' }
    }
    
    // Normalize payment code for comparison
    const normalizedPaymentCode = paymentCode.toUpperCase().replace(/\s+/g, '')
    
    for (const tx of transactions) {
      // Only check incoming transfers
      if (tx.transferType !== 'in') {
        continue
      }
      
      // Parse payment code from transaction content
      const txCode = parsePaymentCode(tx.transactionContent)
      
      console.log(`[SePay] Transaction ${tx.referenceNumber}:`)
      console.log(`  - Content: "${tx.transactionContent}"`)
      console.log(`  - Parsed code: ${txCode}`)
      console.log(`  - Amount: ${tx.transferAmount}`)
      
      if (!txCode) {
        continue
      }
      
      // Normalize and compare codes
      const normalizedTxCode = txCode.toUpperCase().replace(/\s+/g, '')
      
      if (normalizedTxCode === normalizedPaymentCode) {
        // Check if amount matches (allow 1% tolerance for fees)
        const tolerance = expectedAmount * 0.01
        const minAmount = expectedAmount - tolerance
        
        if (tx.transferAmount >= minAmount) {
          console.log(`[SePay] ✅ Found matching transaction: ${tx.referenceNumber}`)
          return { found: true, transaction: tx }
        } else {
          console.log(`[SePay] ⚠️ Code matches but amount too low: ${tx.transferAmount} < ${minAmount}`)
        }
      }
    }
    
    console.log('[SePay] ❌ No matching transaction found')
    return { found: false }
  } catch (error: any) {
    console.error('[SePay] Error checking deposit:', error)
    return { found: false, error: error.message || 'Lỗi khi kiểm tra giao dịch' }
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

