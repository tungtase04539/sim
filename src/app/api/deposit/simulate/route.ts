import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập' }, { status: 401 })
    }

    const { amount, payment_code } = await request.json()
    
    if (!amount || amount < 10000) {
      return NextResponse.json({ success: false, error: 'Số tiền không hợp lệ' }, { status: 400 })
    }

    // Create service role client directly here
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ 
        success: false, 
        error: `Missing env: URL=${!!supabaseUrl}, KEY=${!!serviceRoleKey}` 
      }, { status: 500 })
    }

    const cookieStore = await cookies()
    const adminSupabase = createServerClient(supabaseUrl, serviceRoleKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    })

    // Get current profile
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    let currentBalance = 0

    // If no profile exists, create one
    if (profileError || !profile) {
      const { error: insertError } = await adminSupabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          balance: amount,
          role: 'user',
        })

      if (insertError) {
        return NextResponse.json({ 
          success: false, 
          error: 'Lỗi tạo profile: ' + insertError.message
        }, { status: 500 })
      }

      // Create transaction
      await adminSupabase.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount: amount,
        balance_before: 0,
        balance_after: amount,
        description: 'Nạp tiền (Test)',
        status: 'completed',
        payment_method: 'test',
      })

      return NextResponse.json({
        success: true,
        data: { amount, balance_before: 0, balance_after: amount }
      })
    }

    currentBalance = profile.balance || 0
    const newBalance = currentBalance + amount

    // Update balance
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Lỗi cập nhật: ' + updateError.message
      }, { status: 500 })
    }

    // Create transaction record
    await adminSupabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: 'Nạp tiền (Test)',
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

    return NextResponse.json({
      success: true,
      data: { amount, balance_before: currentBalance, balance_after: newBalance }
    })

  } catch (error: any) {
    console.error('Deposit simulate error:', error)
    return NextResponse.json({ success: false, error: 'Lỗi: ' + error.message }, { status: 500 })
  }
}
