import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { notifyDeposit } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { deposit_id } = await request.json()

    if (!deposit_id) {
      return NextResponse.json({ success: false, error: 'Deposit ID required' }, { status: 400 })
    }

    // Use service role for admin operations
    const adminSupabase = await createServiceRoleClient()

    // Get deposit request
    const { data: deposit, error: findError } = await adminSupabase
      .from('deposit_requests')
      .select('*, profiles:user_id(*)')
      .eq('id', deposit_id)
      .single()

    if (findError || !deposit) {
      return NextResponse.json({ success: false, error: 'Deposit not found' }, { status: 404 })
    }

    if (deposit.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Deposit already processed' }, { status: 400 })
    }

    const userProfile = deposit.profiles
    const currentBalance = userProfile.balance || 0
    const newBalance = currentBalance + deposit.amount

    // Update user balance
    const { error: balanceError } = await adminSupabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', deposit.user_id)

    if (balanceError) {
      return NextResponse.json({ success: false, error: 'Failed to update balance' }, { status: 500 })
    }

    // Create transaction record
    await adminSupabase.from('transactions').insert({
      user_id: deposit.user_id,
      type: 'deposit',
      amount: deposit.amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: `Nạp tiền (Admin duyệt)`,
      reference_id: deposit.payment_code,
      status: 'completed',
      payment_method: 'bank_transfer',
    })

    // Update deposit request status
    await adminSupabase
      .from('deposit_requests')
      .update({ 
        status: 'completed',
        sepay_transaction_id: 'ADMIN_APPROVED_' + Date.now()
      })
      .eq('id', deposit.id)

    // Send Telegram notification
    await notifyDeposit(
      userProfile.email || '',
      deposit.amount,
      deposit.payment_code,
      'Admin Approved'
    )

    return NextResponse.json({
      success: true,
      message: 'Deposit approved successfully',
      data: {
        amount: deposit.amount,
        user_email: userProfile.email,
        new_balance: newBalance,
      }
    })

  } catch (error) {
    console.error('Approve deposit error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

