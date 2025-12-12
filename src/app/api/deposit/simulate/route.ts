import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notifyDeposit } from '@/lib/telegram'

// This endpoint simulates a deposit for testing purposes
// In production, deposits would come through the SePay webhook
// Force dynamic rendering - Updated
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, payment_code } = await request.json()
    
    if (!amount || amount < 10000) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })
    }

    // Get current balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const currentBalance = profile.balance || 0
    const newBalance = currentBalance + amount

    // Update balance
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ success: false, error: 'Failed to update balance' }, { status: 500 })
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: 'Nạp tiền (Test Mode)',
      status: 'completed',
      payment_method: 'test',
    })

    // Update deposit request if exists
    if (payment_code) {
      await supabase
        .from('deposit_requests')
        .update({ status: 'completed' })
        .eq('payment_code', payment_code)
        .eq('user_id', user.id)
    }

    // Send Telegram notification
    await notifyDeposit(user.email || '', amount, payment_code || 'TEST', 'test-' + Date.now())

    return NextResponse.json({
      success: true,
      data: {
        amount,
        balance_before: currentBalance,
        balance_after: newBalance,
      }
    })

  } catch (error) {
    console.error('Deposit simulate error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

