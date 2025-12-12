import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { processSePayWebhook, verifySePaySignature } from '@/lib/sepay'
import { notifyDeposit } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-sepay-signature') || ''
    const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET || ''

    // Verify webhook signature (optional but recommended)
    if (webhookSecret && !verifySePaySignature(body, signature, webhookSecret)) {
      console.warn('Invalid webhook signature')
      // Continue processing anyway for now
    }

    const payload = JSON.parse(body)
    const { isDeposit, paymentCode, amount, referenceNumber } = processSePayWebhook(payload)

    // Only process incoming transfers
    if (!isDeposit || !paymentCode) {
      return NextResponse.json({ success: true, message: 'Skipped - not a deposit or no payment code' })
    }

    const supabase = await createServiceRoleClient()

    // Find pending deposit request with matching payment code
    const { data: depositRequest, error: findError } = await supabase
      .from('deposit_requests')
      .select('*, profiles:user_id(*)')
      .eq('payment_code', paymentCode)
      .eq('status', 'pending')
      .single()

    if (findError || !depositRequest) {
      console.log('No matching deposit request found for code:', paymentCode)
      return NextResponse.json({ success: true, message: 'No matching deposit request' })
    }

    // Check if amount matches (allow some tolerance or any amount)
    if (amount < depositRequest.amount) {
      console.log('Amount mismatch:', { expected: depositRequest.amount, received: amount })
      // You might want to still process partial payments or reject them
    }

    // Start transaction
    const userProfile = depositRequest.profiles

    // Update user balance
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ 
        balance: userProfile.balance + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', depositRequest.user_id)

    if (balanceError) {
      console.error('Failed to update balance:', balanceError)
      return NextResponse.json({ success: false, error: 'Failed to update balance' }, { status: 500 })
    }

    // Create transaction record
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: depositRequest.user_id,
        type: 'deposit',
        amount: amount,
        balance_before: userProfile.balance,
        balance_after: userProfile.balance + amount,
        description: `Nạp tiền qua ${payload.gateway || 'Bank Transfer'}`,
        reference_id: referenceNumber,
        status: 'completed',
        payment_method: payload.gateway || 'bank_transfer',
      })

    if (txError) {
      console.error('Failed to create transaction:', txError)
    }

    // Update deposit request status
    await supabase
      .from('deposit_requests')
      .update({ 
        status: 'completed',
        sepay_transaction_id: referenceNumber
      })
      .eq('id', depositRequest.id)

    // Send Telegram notification
    await notifyDeposit(
      userProfile.email || depositRequest.user_id,
      amount,
      paymentCode,
      referenceNumber
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Deposit processed successfully',
      amount,
      paymentCode
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'sepay-webhook' })
}

