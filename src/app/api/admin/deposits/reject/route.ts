import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

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

    const adminSupabase = await createServiceRoleClient()

    // Update deposit request status to rejected/expired
    const { error } = await adminSupabase
      .from('deposit_requests')
      .update({ status: 'expired' })
      .eq('id', deposit_id)
      .eq('status', 'pending')

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to reject deposit' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Deposit rejected'
    })

  } catch (error) {
    console.error('Reject deposit error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

