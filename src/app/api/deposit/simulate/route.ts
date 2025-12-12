import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

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

    // Use service role client to bypass RLS
    let adminSupabase
    try {
      adminSupabase = await createServiceRoleClient()
    } catch (e) {
      // Fallback to regular client if service role not available
      adminSupabase = supabase
    }

    // Get current profile
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    let currentBalance = profile?.balance || 0
    const newBalance = currentBalance + amount

    // If no profile exists, create one
    if (!profile) {
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
        console.error('Insert profile error:', insertError)
        return NextResponse.json({ 
          success: false, 
          error: 'Không thể tạo profile. Vui lòng thêm SUPABASE_SERVICE_ROLE_KEY vào Vercel.' 
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: { amount, balance_before: 0, balance_after: amount }
      })
    }

    // Update balance
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update balance error:', updateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Không thể cập nhật số dư. Vui lòng thêm SUPABASE_SERVICE_ROLE_KEY vào Vercel.' 
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

  } catch (error) {
    console.error('Deposit simulate error:', error)
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống' }, { status: 500 })
  }
}
