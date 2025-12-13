import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { checkDeposit } from '@/lib/sepay'
import { notifyDeposit } from '@/lib/telegram'

export const dynamic = 'force-dynamic'

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

    // Check if deposit request exists and is pending
    const { data: depositRequest, error: findError } = await supabase
      .from('deposit_requests')
      .select('*')
      .eq('payment_code', payment_code)
      .eq('user_id', user.id)
      .single()

    if (findError || !depositRequest) {
      return NextResponse.json({ success: false, error: 'Deposit request not found' }, { status: 404 })
    }

    // If already completed
    if (depositRequest.status === 'completed') {
      return NextResponse.json({ 
        success: true, 
        status: 'completed',
        message: 'Đã nạp tiền thành công!'
      })
    }

    // Check SePay for matching transaction
    const { found, transaction } = await checkDeposit(payment_code, depositRequest.amount)

    if (found && transaction) {
      // Use service role client for admin operations
      const adminSupabase = await createServiceRoleClient()
      
      // Get current user balance
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single()

      const currentBalance = profile?.balance || 0
      const newBalance = currentBalance + transaction.transferAmount

      // Update user balance
      await adminSupabase
        .from('profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      // Create transaction record
      await adminSupabase.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount: transaction.transferAmount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: `Nạp tiền qua ${transaction.gateway || 'Bank Transfer'}`,
        reference_id: transaction.referenceNumber,
        status: 'completed',
        payment_method: 'bank_transfer',
      })

      // Update deposit request status
      await adminSupabase
        .from('deposit_requests')
        .update({ 
          status: 'completed',
          sepay_transaction_id: transaction.referenceNumber
        })
        .eq('id', depositRequest.id)

      // Send Telegram notification
      await notifyDeposit(
        user.email || '',
        transaction.transferAmount,
        payment_code,
        transaction.referenceNumber
      )

      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Nạp tiền thành công!',
        data: {
          amount: transaction.transferAmount,
          balance_after: newBalance,
        }
      })
    }

    // Check if expired
    if (new Date(depositRequest.expires_at) < new Date()) {
      await supabase
        .from('deposit_requests')
        .update({ status: 'expired' })
        .eq('id', depositRequest.id)
      
      return NextResponse.json({
        success: false,
        status: 'expired',
        message: 'Yêu cầu nạp tiền đã hết hạn'
      })
    }

    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Đang chờ thanh toán...'
    })

  } catch (error) {
    console.error('Check deposit error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

