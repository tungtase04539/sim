import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Fake services data (same as frontend)
const SERVICES: Record<string, { name: string; price: number }> = {
  '1': { name: 'Facebook', price: 5000 },
  '2': { name: 'Google', price: 6000 },
  '3': { name: 'Telegram', price: 4000 },
  '4': { name: 'WhatsApp', price: 5500 },
  '5': { name: 'TikTok', price: 4500 },
  '6': { name: 'Twitter/X', price: 5000 },
  '7': { name: 'Instagram', price: 5500 },
  '8': { name: 'Shopee', price: 3500 },
  '9': { name: 'Lazada', price: 3500 },
  '10': { name: 'Grab', price: 4000 },
  '11': { name: 'Zalo', price: 8000 },
  '12': { name: 'Discord', price: 4500 },
}

const COUNTRIES: Record<string, { name: string; code: string; flag: string }> = {
  '1': { name: 'Vietnam', code: '84', flag: '🇻🇳' },
  '2': { name: 'Indonesia', code: '62', flag: '🇮🇩' },
  '3': { name: 'Philippines', code: '63', flag: '🇵🇭' },
  '4': { name: 'Malaysia', code: '60', flag: '🇲🇾' },
  '5': { name: 'Thailand', code: '66', flag: '🇹🇭' },
  '6': { name: 'India', code: '91', flag: '🇮🇳' },
  '7': { name: 'Russia', code: '7', flag: '🇷🇺' },
  '8': { name: 'USA', code: '1', flag: '🇺🇸' },
  '9': { name: 'UK', code: '44', flag: '🇬🇧' },
  '10': { name: 'China', code: '86', flag: '🇨🇳' },
}

// Create a new OTP order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập' }, { status: 401 })
    }

    const { service_id, country_id } = await request.json()
    
    if (!service_id || !country_id) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin dịch vụ' }, { status: 400 })
    }

    // Get service and country from fake data
    const service = SERVICES[service_id]
    const country = COUNTRIES[country_id]

    if (!service) {
      return NextResponse.json({ success: false, error: 'Dịch vụ không tồn tại' }, { status: 404 })
    }

    if (!country) {
      return NextResponse.json({ success: false, error: 'Quốc gia không tồn tại' }, { status: 404 })
    }

    // Use service role for database operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ success: false, error: 'Lỗi cấu hình server' }, { status: 500 })
    }

    const cookieStore = await cookies()
    const adminSupabase = createServerClient(supabaseUrl, serviceRoleKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    })

    // Get user balance
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    const currentBalance = profile?.balance || 0
    const price = service.price

    if (currentBalance < price) {
      return NextResponse.json({ 
        success: false, 
        error: `Số dư không đủ. Cần ${price.toLocaleString()}đ, hiện có ${currentBalance.toLocaleString()}đ`,
      }, { status: 402 })
    }

    // Generate fake phone number
    const phoneNumber = `+${country.code}${Math.floor(100000000 + Math.random() * 900000000)}`
    const newBalance = currentBalance - price

    // Deduct balance
    await adminSupabase
      .from('profiles')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    // Create transaction record
    await adminSupabase.from('transactions').insert({
      user_id: user.id,
      type: 'purchase',
      amount: -price,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: `Thuê OTP - ${service.name}`,
      status: 'completed',
    })

    // Generate fake OTP after 3-5 seconds
    const orderId = 'ord_' + Math.random().toString(36).substr(2, 9)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    return NextResponse.json({
      success: true,
      data: {
        order_id: orderId,
        phone_number: phoneNumber,
        service: service.name,
        country: country.name,
        country_flag: country.flag,
        price,
        status: 'waiting',
        balance_after: newBalance,
        // Fake OTP will arrive in 3-5 seconds (handled by frontend)
        otp_code: otp, // In production, this would come later via webhook
      }
    })

  } catch (error: any) {
    console.error('Order create error:', error)
    return NextResponse.json({ success: false, error: 'Lỗi: ' + error.message }, { status: 500 })
  }
}

// Get user's orders (returns empty for now since we don't store fake orders)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Return empty array for fake orders
    return NextResponse.json({ success: true, data: [] })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
