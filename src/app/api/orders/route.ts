import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Fake services data (same as frontend)
const SERVICES: Record<string, { name: string; price: number }> = {
  '1': { name: 'Facebook', price: 5000 },
  '2': { name: 'Google/Gmail', price: 6000 },
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
  '13': { name: 'Microsoft', price: 5000 },
  '14': { name: 'Any Other', price: 3000 },
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
  '10': { name: 'Ukraine', code: '380', flag: '🇺🇦' },
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

    // Generate fake phone number and order code
    const phoneNumber = `+${country.code}${Math.floor(100000000 + Math.random() * 900000000)}`
    const orderCode = Math.floor(100000000 + Math.random() * 900000000).toString()
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

    // Generate fake OTP (in production, this would come from the provider)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const smsContent = `Your ${service.name} verification code is: ${otp}`

    // Store order metadata in external_order_id as JSON
    const orderMetadata = JSON.stringify({
      service_name: service.name,
      country_name: country.name,
      country_flag: country.flag,
      order_code: orderCode,
    })

    // Create OTP order in database
    // Note: service_id and country_id are stored in external_order_id as JSON
    // If your schema requires these fields, add them here
    const { data: order, error: orderError } = await adminSupabase
      .from('otp_orders')
      .insert({
        user_id: user.id,
        service_id: service_id, // Add if schema requires
        country_id: country_id, // Add if schema requires
        phone_number: phoneNumber,
        otp_code: otp,
        price: price,
        status: 'success', // Fake orders are always successful
        external_order_id: orderMetadata,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order insert error:', orderError)
      // Even if order save fails, the user has paid, so we return success
    }

    return NextResponse.json({
      success: true,
      data: {
        order_id: order?.id || 'temp_' + orderCode,
        order_code: orderCode,
        phone_number: phoneNumber,
        service: service.name,
        country: country.name,
        country_flag: country.flag,
        price,
        otp_code: otp,
        sms_content: smsContent,
        status: 'success',
        balance_after: newBalance,
        created_at: new Date().toISOString(),
      }
    })

  } catch (error: any) {
    console.error('Order create error:', error)
    return NextResponse.json({ success: false, error: 'Lỗi: ' + error.message }, { status: 500 })
  }
}

// Get user's orders history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role to bypass RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 })
    }

    const cookieStore = await cookies()
    const adminSupabase = createServerClient(supabaseUrl, serviceRoleKey, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    })

    // Fetch orders sorted by created_at DESC (newest first)
    const { data: orders, error } = await adminSupabase
      .from('otp_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Orders fetch error:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Transform orders to include metadata
    const transformedOrders = (orders || []).map(order => {
      let metadata = { service_name: 'Unknown', country_name: 'Unknown', country_flag: '🌐', order_code: '' }
      try {
        if (order.external_order_id) {
          metadata = JSON.parse(order.external_order_id)
        }
      } catch (e) {
        // Keep default metadata
      }

      return {
        id: order.id,
        code: metadata.order_code || order.id.substring(0, 9),
        phone_number: order.phone_number || '',
        service: metadata.service_name,
        country: metadata.country_name,
        country_flag: metadata.country_flag,
        price: parseFloat(order.price) || 0,
        otp_code: order.otp_code,
        sms_content: order.otp_code ? `Your ${metadata.service_name} verification code is: ${order.otp_code}` : null,
        status: order.status,
        created_at: order.created_at,
        expires_at: order.expires_at,
      }
    })

    return NextResponse.json({ success: true, data: transformedOrders })

  } catch (error: any) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
