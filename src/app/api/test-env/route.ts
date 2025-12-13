import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const envCheck = {
    // Supabase
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    supabase_service_role: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    
    // Sepay
    sepay_api_key: process.env.SEPAY_API_KEY ? '✅ Set' : '❌ Missing',
    sepay_merchant_id: process.env.SEPAY_MERCHANT_ID ? '✅ Set' : '⚠️ Optional',
    sepay_webhook_secret: process.env.SEPAY_WEBHOOK_SECRET ? '✅ Set' : '⚠️ Recommended',
    
    // Telegram
    telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '⚠️ Optional',
    telegram_chat_id: process.env.TELEGRAM_CHAT_ID ? '✅ Set' : '⚠️ Optional',
    
    // Bank Info
    bank_account: process.env.BANK_ACCOUNT ? '✅ Set' : '⚠️ Using default',
    bank_name: process.env.BANK_NAME ? '✅ Set' : '⚠️ Using default',
    next_public_bank_code: process.env.NEXT_PUBLIC_BANK_CODE ? '✅ Set' : '⚠️ Using default',
    next_public_bank_account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ? '✅ Set' : '⚠️ Using default',
    next_public_bank_name: process.env.NEXT_PUBLIC_BANK_NAME ? '✅ Set' : '⚠️ Using default',
    next_public_bank_account_name: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ? '✅ Set' : '⚠️ Using default',
    
    // App URL (for webhook)
    next_public_app_url: process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '⚠️ Recommended for webhook',
  }

  // Calculate summary
  const required = [
    'supabase_url',
    'supabase_anon_key',
    'supabase_service_role',
    'sepay_api_key',
  ]
  
  const optional = Object.keys(envCheck).filter(key => !required.includes(key))
  
  const missingRequired = required.filter(key => envCheck[key as keyof typeof envCheck].includes('❌'))
  const allSet = missingRequired.length === 0

  return NextResponse.json({
    status: allSet ? '✅ All required env variables are set' : '❌ Missing required variables',
    summary: {
      required: required.length,
      optional: optional.length,
      missing_required: missingRequired,
      all_required_set: allSet,
    },
    variables: envCheck,
    webhook_url: process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/sepay`
      : 'Not configured (set NEXT_PUBLIC_APP_URL)',
    notes: {
      sepay_webhook_secret: 'Required if you want to verify webhook signatures',
      next_public_app_url: 'Required to configure webhook URL in Sepay dashboard',
      telegram: 'Optional - only needed if you want Telegram notifications',
      bank_info: 'Can use defaults, but recommended to set for production',
    }
  })
}

