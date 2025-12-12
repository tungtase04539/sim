import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    
    // Clear all auth cookies
    const response = NextResponse.redirect(new URL('/login', request.url))
    
    // Delete Supabase auth cookies
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    
    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
