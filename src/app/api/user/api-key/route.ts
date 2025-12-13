import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateApiKey } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('api_key')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        api_key: profile.api_key
      }
    })

  } catch (error) {
    console.error('API key fetch error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const newApiKey = generateApiKey()

    const { error } = await supabase
      .from('profiles')
      .update({ 
        api_key: newApiKey,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to generate API key' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        api_key: newApiKey
      }
    })

  } catch (error) {
    console.error('API key generation error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

