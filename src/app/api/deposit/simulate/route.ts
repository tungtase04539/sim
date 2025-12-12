import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// This endpoint simulates a deposit for testing purposes
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập' }, { status: 401 })
    }

    const { amount, payment_code } = await request.json()
    
    if (!amount || amount < 10000) {
      return NextResponse.json({ success: false, error: 'Số tiền không hợp lệ' }, { status: 400 })
    }

    // Try to get profile first
    let { data: profile } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    let currentBalance = profile?.balance || 0

    // If no profile, try to create one using upsert
    if (!profile) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          balance: amount,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

      if (upsertError) {
        console.error('Upsert error:', upsertError)
        // Try direct RPC call or raw update
        const { error: updateError } = await supabase.rpc('add_balance', {
          user_id: user.id,
          add_amount: amount
        })
        
        if (updateError) {
          // Last resort - just try update
          await supabase
            .from('profiles')
            .update({ balance: amount })
            .eq('id', user.id)
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          amount,
          balance_before: 0,
          balance_after: amount,
        }
      })
    }

    // Update existing profile balance
    const newBalance = currentBalance + amount

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ success: false, error: 'Không thể cập nhật số dư: ' + updateError.message }, { status: 500 })
    }

    // Create transaction record
    try {
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount: amount,
        balance_before: currentBalance,
        balance_after: newBalance,
        description: 'Nạp tiền (Test)',
        status: 'completed',
        payment_method: 'test',
      })
    } catch (e) {
      console.log('Transaction insert error:', e)
    }

    // Update deposit request if exists
    if (payment_code) {
      try {
        await supabase
          .from('deposit_requests')
          .update({ status: 'completed' })
          .eq('payment_code', payment_code)
          .eq('user_id', user.id)
      } catch (e) {
        console.log('Deposit request update error:', e)
      }
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
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
