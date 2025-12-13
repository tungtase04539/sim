import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { checkDeposit } from '@/lib/sepay'
import { notifyDeposit } from '@/lib/telegram'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Check if a deposit has been completed (via SePay API polling)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { payment_code } = await request.json()
    
    if (!payment_code) {
      return NextResponse.json({ success: false, error: 'Payment code required' }, { status: 400 })
    }

    console.log(`[Deposit Check] User ${user.id} checking payment code: ${payment_code}`)

    // Check if deposit request exists and is pending
    const { data: depositRequest, error: findError } = await supabase
      .from('deposit_requests')
      .select('*')
      .eq('payment_code', payment_code)
      .eq('user_id', user.id)
      .single()

    if (findError || !depositRequest) {
      console.log(`[Deposit Check] Deposit request not found for code: ${payment_code}`)
      return NextResponse.json({ success: false, error: 'Deposit request not found' }, { status: 404 })
    }

    // If already completed
    if (depositRequest.status === 'completed') {
      console.log(`[Deposit Check] Deposit already completed: ${payment_code}`)
      return NextResponse.json({ 
        success: true, 
        status: 'completed',
        message: 'Đã nạp tiền thành công!'
      })
    }

    // Check SePay for matching transaction
    console.log(`[Deposit Check] Checking SePay for code: ${payment_code}, amount: ${depositRequest.amount}`)
    const { found, transaction, error: checkError } = await checkDeposit(
      payment_code, 
      depositRequest.amount
    )

    if (checkError) {
      console.log(`[Deposit Check] SePay check error: ${checkError}`)
      // Don't fail, just return pending status
    }

    if (found && transaction) {
      console.log(`[Deposit Check] ✅ Found matching transaction: ${transaction.referenceNumber}`)
      
      // Use service role client for admin operations
      const adminSupabase = await createServiceRoleClient()
      
      // Get current user balance
      const { data: profile, error: profileError } = await adminSupabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('[Deposit Check] Error fetching profile:', profileError)
        return NextResponse.json({ 
          success: false, 
          error: 'Lỗi khi lấy thông tin tài khoản' 
        }, { status: 500 })
      }

      const currentBalance = profile?.balance || 0
      const depositAmount = transaction.transferAmount
      const newBalance = currentBalance + depositAmount

      console.log(`[Deposit Check] Updating balance: ${currentBalance} + ${depositAmount} = ${newBalance}`)

      // Update user balance
      const { error: updateError } = await adminSupabase
        .from('profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('[Deposit Check] Error updating balance:', updateError)
        return NextResponse.json({ 
          success: false, 
          error: 'Lỗi khi cập nhật số dư' 
        }, { status: 500 })
      }

      // Create transaction record
      const { error: txError } = await adminSupabase.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount: depositAmount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Nạp tiền qua ${transaction.gateway || 'Bank Transfer'}`,
        reference_id: transaction.referenceNumber,
        status: 'completed',
        payment_method: 'bank_transfer',
      })

      if (txError) {
        console.error('[Deposit Check] Error creating transaction:', txError)
        // Continue even if transaction record fails
      }

      // Update deposit request status
      const { error: statusError } = await adminSupabase
        .from('deposit_requests')
        .update({ 
          status: 'completed',
          sepay_transaction_id: transaction.referenceNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', depositRequest.id)

      if (statusError) {
        console.error('[Deposit Check] Error updating deposit status:', statusError)
        // Continue even if status update fails
      }

      // Send Telegram notification
      try {
        await notifyDeposit(
          user.email || '',
          depositAmount,
          payment_code,
          transaction.referenceNumber
        )
      } catch (telegramError) {
        console.error('[Deposit Check] Telegram notification error:', telegramError)
        // Don't fail if telegram fails
      }

      console.log(`[Deposit Check] ✅ Deposit completed successfully`)

      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Nạp tiền thành công!',
        data: {
          amount: depositAmount,
          balance_after: newBalance,
        }
      })
    }

    // Check if expired
    if (new Date(depositRequest.expires_at) < new Date()) {
      console.log(`[Deposit Check] Deposit expired: ${payment_code}`)
      
      const { error: expireError } = await supabase
        .from('deposit_requests')
        .update({ status: 'expired' })
        .eq('id', depositRequest.id)
      
      if (expireError) {
        console.error('[Deposit Check] Error updating expired status:', expireError)
      }
      
      return NextResponse.json({
        success: false,
        status: 'expired',
        message: 'Yêu cầu nạp tiền đã hết hạn'
      })
    }

    console.log(`[Deposit Check] Still pending: ${payment_code}`)
    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Đang chờ thanh toán...'
    })

  } catch (error: any) {
    console.error('[Deposit Check] Unexpected error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}

