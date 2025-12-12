import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: profile.balance || 0
      }
    })

  } catch (error) {
    console.error('Balance fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

