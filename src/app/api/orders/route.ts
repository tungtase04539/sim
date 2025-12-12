import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notifyOrder } from '@/lib/telegram'

// Create a new OTP order
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { service_id, country_id } = await request.json()
    
    if (!service_id || !country_id) {
      return NextResponse.json({ success: false, error: 'Missing service_id or country_id' }, { status: 400 })
    }

    // Get service price
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
    }

    // Get country
    const { data: country, error: countryError } = await supabase
      .from('countries')
      .select('*')
      .eq('id', country_id)
      .single()

    if (countryError || !country) {
      return NextResponse.json({ success: false, error: 'Country not found' }, { status: 404 })
    }

    // Check user balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    const price = service.price
    if (profile.balance < price) {
      return NextResponse.json({ 
        success: false, 
        error: 'Số dư không đủ. Vui lòng nạp thêm tiền.',
        required: price,
        balance: profile.balance
      }, { status: 402 })
    }

    // Generate phone number (in production, this would come from OTP provider API)
    const phoneNumber = `+${country.code}${Math.floor(100000000 + Math.random() * 900000000)}`
    
    // Deduct balance
    const newBalance = profile.balance - price
    await supabase
      .from('profiles')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('otp_orders')
      .insert({
        user_id: user.id,
        service_id,
        country_id,
        phone_number: phoneNumber,
        price,
        status: 'waiting',
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      // Refund if order creation fails
      await supabase
        .from('profiles')
        .update({ balance: profile.balance })
        .eq('id', user.id)
      
      return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'purchase',
      amount: -price,
      balance_before: profile.balance,
      balance_after: newBalance,
      description: `Thuê OTP - ${service.name}`,
      reference_id: order.id,
      status: 'completed',
    })

    // Send notification
    await notifyOrder(user.email || '', service.name, country.name, phoneNumber, price)

    // Simulate OTP arrival after 3-8 seconds (in production, this would be from webhook)
    setTimeout(async () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      await supabase
        .from('otp_orders')
        .update({ otp_code: otp, status: 'success', updated_at: new Date().toISOString() })
        .eq('id', order.id)
    }, 3000 + Math.random() * 5000)

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        phone_number: phoneNumber,
        service: service.name,
        country: country.name,
        price,
        status: 'waiting',
        balance_after: newBalance,
        expires_at: order.expires_at,
      }
    })

  } catch (error) {
    console.error('Order create error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('otp_orders')
      .select(`
        *,
        services:service_id(name, code, icon),
        countries:country_id(name, code, flag)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: orders })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

