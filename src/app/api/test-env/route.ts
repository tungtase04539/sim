import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    supabase_service_role: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    sepay_api_key: process.env.SEPAY_API_KEY ? '✅ Set' : '❌ Missing',
    telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing',
    telegram_chat_id: process.env.TELEGRAM_CHAT_ID ? '✅ Set' : '❌ Missing',
  })
}

