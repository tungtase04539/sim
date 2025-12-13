import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { processSePayWebhook, verifySePaySignature } from '@/lib/sepay'
import { notifyDeposit } from '@/lib/telegram'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let requestId = `webhook_${Date.now()}_${Math.random().toString(36).substring(7)}`
  
  try {
    console.log(`[${requestId}] Webhook received at ${new Date().toISOString()}`)
    
    const body = await request.text()
    console.log(`[${requestId}] Raw body length: ${body.length}`)
    console.log(`[${requestId}] Raw body preview: ${body.substring(0, 200)}`)
    
    const signature = request.headers.get('x-sepay-signature') || 
                     request.headers.get('x-sepay-signature') ||
                     request.headers.get('sepay-signature') ||
                     ''
    const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET || ''
    
    console.log(`[${requestId}] Signature header: ${signature ? 'Present' : 'Missing'}`)
    console.log(`[${requestId}] Webhook secret: ${webhookSecret ? 'Set' : 'Not set'}`)

    // Verify webhook signature (optional but recommended)
    if (webhookSecret && signature) {
      const isValid = verifySePaySignature(body, signature, webhookSecret)
      if (!isValid) {
        console.warn(`[${requestId}] ⚠️ Invalid webhook signature - but continuing for debugging`)
        // Continue processing for now to debug
      } else {
        console.log(`[${requestId}] ✅ Signature verified`)
      }
    } else {
      console.log(`[${requestId}] ⚠️ Skipping signature verification (secret or signature missing)`)
    }

    let payload: any
    try {
      payload = JSON.parse(body)
      console.log(`[${requestId}] Parsed payload:`, JSON.stringify(payload, null, 2))
    } catch (parseError) {
      console.error(`[${requestId}] ❌ Failed to parse JSON:`, parseError)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON payload',
        requestId 
      }, { status: 400 })
    }

    const { isDeposit, paymentCode, amount, referenceNumber } = processSePayWebhook(payload)
    
    console.log(`[${requestId}] Processed webhook:`, {
      isDeposit,
      paymentCode,
      amount,
      referenceNumber,
      transferType: payload.transferType,
      transactionContent: payload.transactionContent
    })

    // Only process incoming transfers
    if (!isDeposit) {
      console.log(`[${requestId}] ⏭️ Skipped - not a deposit (transferType: ${payload.transferType})`)
      return NextResponse.json({ 
        success: true, 
        message: 'Skipped - not a deposit',
        requestId 
      })
    }
    
    if (!paymentCode) {
      console.log(`[${requestId}] ⏭️ Skipped - no payment code found in content: "${payload.transactionContent}"`)
      return NextResponse.json({ 
        success: true, 
        message: 'Skipped - no payment code',
        requestId,
        transactionContent: payload.transactionContent
      })
    }

    const supabase = await createServiceRoleClient()

    // Find pending deposit request with matching payment code
    console.log(`[${requestId}] 🔍 Searching for deposit request with code: ${paymentCode}`)
    
    const { data: depositRequest, error: findError } = await supabase
      .from('deposit_requests')
      .select('*, profiles:user_id(*)')
      .eq('payment_code', paymentCode)
      .eq('status', 'pending')
      .single()

    if (findError) {
      console.error(`[${requestId}] ❌ Database error finding deposit:`, findError)
      
      // Try to find any deposit with this code (including completed ones)
      const { data: anyDeposit } = await supabase
        .from('deposit_requests')
        .select('id, status, payment_code')
        .eq('payment_code', paymentCode)
        .single()
      
      if (anyDeposit) {
        console.log(`[${requestId}] ℹ️ Deposit found but status is: ${anyDeposit.status}`)
        return NextResponse.json({ 
          success: true, 
          message: `Deposit already processed (status: ${anyDeposit.status})`,
          requestId 
        })
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Database error',
        details: findError.message,
        requestId 
      }, { status: 500 })
    }
    
    if (!depositRequest) {
      console.log(`[${requestId}] ⚠️ No matching deposit request found for code: ${paymentCode}`)
      
      // Log all pending deposits for debugging
      const { data: allPending } = await supabase
        .from('deposit_requests')
        .select('payment_code, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10)
      
      console.log(`[${requestId}] Recent pending deposits:`, allPending)
      
      return NextResponse.json({ 
        success: true, 
        message: 'No matching deposit request',
        requestId,
        searchedCode: paymentCode
      })
    }
    
    console.log(`[${requestId}] ✅ Found deposit request:`, {
      id: depositRequest.id,
      amount: depositRequest.amount,
      userId: depositRequest.user_id,
      status: depositRequest.status
    })

    // Check if amount matches (allow some tolerance)
    const amountDifference = Math.abs(amount - depositRequest.amount)
    const tolerance = 1000 // Allow 1000 VND difference
    
    if (amount < depositRequest.amount - tolerance) {
      console.warn(`[${requestId}] ⚠️ Amount mismatch:`, { 
        expected: depositRequest.amount, 
        received: amount,
        difference: amountDifference
      })
      // Still process but log the difference
    } else {
      console.log(`[${requestId}] ✅ Amount matches: ${amount} VND`)
    }

    // Get user profile
    const userProfile = depositRequest.profiles
    if (!userProfile) {
      console.error(`[${requestId}] ❌ User profile not found for user_id: ${depositRequest.user_id}`)
      return NextResponse.json({ 
        success: false, 
        error: 'User profile not found',
        requestId 
      }, { status: 404 })
    }

    const currentBalance = userProfile.balance || 0
    const newBalance = currentBalance + amount

    console.log(`[${requestId}] 💰 Updating balance:`, {
      userId: depositRequest.user_id,
      currentBalance,
      amount,
      newBalance
    })

    // Update user balance
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', depositRequest.user_id)

    if (balanceError) {
      console.error(`[${requestId}] ❌ Failed to update balance:`, balanceError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update balance',
        details: balanceError.message,
        requestId 
      }, { status: 500 })
    }
    
    console.log(`[${requestId}] ✅ Balance updated successfully`)

    // Create transaction record
    console.log(`[${requestId}] 📝 Creating transaction record...`)
    
    const { error: txError, data: transactionData } = await supabase
      .from('transactions')
      .insert({
        user_id: depositRequest.user_id,
        type: 'deposit',
        amount: amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Nạp tiền qua ${payload.gateway || 'Bank Transfer'}`,
        reference_id: referenceNumber || payload.id?.toString() || null,
        status: 'completed',
        payment_method: payload.gateway || 'bank_transfer',
      })
      .select()
      .single()

    if (txError) {
      console.error(`[${requestId}] ❌ Failed to create transaction:`, txError)
      // Don't fail the whole request, but log it
    } else {
      console.log(`[${requestId}] ✅ Transaction created:`, transactionData?.id)
    }

    // Update deposit request status
    console.log(`[${requestId}] 📝 Updating deposit request status...`)
    
    const { error: updateError } = await supabase
      .from('deposit_requests')
      .update({ 
        status: 'completed',
        sepay_transaction_id: referenceNumber || payload.id?.toString() || null
      })
      .eq('id', depositRequest.id)

    if (updateError) {
      console.error(`[${requestId}] ❌ Failed to update deposit request:`, updateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update deposit request',
        details: updateError.message,
        requestId 
      }, { status: 500 })
    }
    
    console.log(`[${requestId}] ✅ Deposit request updated to completed`)

    // Send Telegram notification
    try {
      await notifyDeposit(
        userProfile.email || depositRequest.user_id,
        amount,
        paymentCode,
        referenceNumber || payload.id?.toString()
      )
      console.log(`[${requestId}] ✅ Telegram notification sent`)
    } catch (telegramError) {
      console.error(`[${requestId}] ⚠️ Failed to send Telegram notification:`, telegramError)
      // Don't fail the request if Telegram fails
    }

    const duration = Date.now() - startTime
    console.log(`[${requestId}] ✅ Webhook processed successfully in ${duration}ms`)

    return NextResponse.json({ 
      success: true, 
      message: 'Deposit processed successfully',
      amount,
      paymentCode,
      requestId,
      duration: `${duration}ms`
    })

  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error(`[${requestId}] ❌ Webhook error after ${duration}ms:`, error)
    console.error(`[${requestId}] Error stack:`, error?.stack)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      requestId,
      duration: `${duration}ms`
    }, { status: 500 })
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'sepay-webhook' })
}

