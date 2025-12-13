import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { processSePayWebhook, parsePaymentCode } from '@/lib/sepay'

export const dynamic = 'force-dynamic'

// Test endpoint to simulate webhook payload
export async function POST(request: NextRequest) {
  try {
    const { paymentCode, amount, transactionContent } = await request.json()

    if (!paymentCode) {
      return NextResponse.json({ 
        success: false, 
        error: 'paymentCode is required' 
      }, { status: 400 })
    }

    // Test payment code parsing
    const testContent = transactionContent || `NAP TIEN ${paymentCode}`
    const parsedCode = parsePaymentCode(testContent)

    // Check if deposit request exists
    const supabase = await createServiceRoleClient()
    const { data: depositRequest, error } = await supabase
      .from('deposit_requests')
      .select('*, profiles:user_id(*)')
      .eq('payment_code', paymentCode)
      .single()

    // Simulate webhook payload
    const mockPayload = {
      id: Date.now(),
      gateway: 'MB',
      transactionDate: new Date().toISOString(),
      accountNumber: process.env.BANK_ACCOUNT || '0326868888',
      transferType: 'in',
      transferAmount: amount || 100000,
      transactionContent: testContent,
      referenceNumber: `TEST_${Date.now()}`,
      description: testContent,
    }

    const processed = processSePayWebhook(mockPayload)

    return NextResponse.json({
      success: true,
      test: {
        paymentCode,
        testContent,
        parsedCode,
        processed,
        depositRequest: depositRequest ? {
          id: depositRequest.id,
          status: depositRequest.status,
          amount: depositRequest.amount,
          userId: depositRequest.user_id,
          hasProfile: !!depositRequest.profiles
        } : null,
        error: error?.message,
      },
      mockPayload,
      message: 'Test completed. Check if payment code matches and deposit request exists.'
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

// GET endpoint to check webhook configuration
export async function GET() {
  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/sepay`
    : 'Not configured'
  
  return NextResponse.json({
    webhookUrl,
    webhookSecret: process.env.SEPAY_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing',
    sepayApiKey: process.env.SEPAY_API_KEY ? '✅ Set' : '❌ Missing',
    instructions: [
      '1. Configure webhook URL in Sepay dashboard:',
      `   ${webhookUrl}`,
      '2. Set SEPAY_WEBHOOK_SECRET in environment variables',
      '3. Use POST /api/webhook/sepay/test with paymentCode to test',
      '4. Check logs for webhook processing details'
    ]
  })
}

