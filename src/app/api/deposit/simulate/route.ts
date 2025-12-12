import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { notifyDeposit } from '@/lib/telegram'

// This endpoint simulates a deposit for testing purposes
// In production, deposits would come through the SePay webhook
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Please login first' }, { status: 401 })
    }

    const { amount, payment_code } = await request.json()
    
    if (!amount || amount < 10000) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })
    }

    // Use service role client to bypass RLS
    const adminSupabase = await createServiceRoleClient()

    // Get current balance
    let { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    // If profile doesn't exist, create it
    if (profileError || !profile) {
      const { data: newProfile, error: createError } = await adminSupabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          balance: 0,
          role: 'user',
        })
        .select('balance')
        .single()

      if (createError) {
        console.error('Failed to create profile:', createError)
        return NextResponse.json({ success: false, error: 'Failed to create profile' }, { status: 500 })
      }
      
      profile = newProfile
    }

    const currentBalance = profile?.balance || 0
    const newBalance = currentBalance + amount

    // Update balance
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update balance:', updateError)
      return NextResponse.json({ success: false, error: 'Failed to update balance' }, { status: 500 })
    }

    // Create transaction record
    await adminSupabase.from('transactions').insert({
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
      await adminSupabase
        .from('deposit_requests')
        .update({ status: 'completed' })
        .eq('payment_code', payment_code)
        .eq('user_id', user.id)
    }

    // Send Telegram notification
    try {
      await notifyDeposit(user.email || '', amount, payment_code || 'TEST', 'test-' + Date.now())
    } catch (e) {
      console.log('Telegram notification skipped')
    }

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
