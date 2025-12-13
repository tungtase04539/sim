import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generatePaymentCode } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await request.json()
    
    if (!amount || amount < 10000) {
      return NextResponse.json({ success: false, error: 'Số tiền tối thiểu là 10,000đ' }, { status: 400 })
    }

    const paymentCode = generatePaymentCode()
    
    // Create deposit request
    const { data: deposit, error: depositError } = await supabase
      .from('deposit_requests')
      .insert({
        user_id: user.id,
        amount,
        payment_code: paymentCode,
        bank_account: process.env.BANK_ACCOUNT || '0326868888',
        bank_name: process.env.BANK_NAME || 'MB Bank',
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (depositError) {
      console.error('Deposit error:', depositError)
      return NextResponse.json({ success: false, error: 'Không thể tạo yêu cầu nạp tiền' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: deposit.id,
        amount,
        payment_code: paymentCode,
        bank_account: deposit.bank_account,
        bank_name: deposit.bank_name,
        expires_at: deposit.expires_at,
      }
    })

  } catch (error) {
    console.error('Deposit create error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

