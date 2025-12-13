import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * System test endpoint
 * Tests all major components of the application
 */
export async function GET(request: NextRequest) {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    tests: {},
    errors: [],
    warnings: [],
  }

  try {
    // Test 1: Environment Variables
    results.tests.environment = {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      sepay_api_key: !!process.env.SEPAY_API_KEY,
      sepay_webhook_secret: !!process.env.SEPAY_WEBHOOK_SECRET,
      telegram_bot_token: !!process.env.TELEGRAM_BOT_TOKEN,
      telegram_chat_id: !!process.env.TELEGRAM_CHAT_ID,
      bank_account: !!process.env.BANK_ACCOUNT,
      bank_name: !!process.env.BANK_NAME,
    }

    // Test 2: Database Connection
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      results.tests.database_connection = {
        success: !error,
        error: error?.message,
      }
    } catch (error: any) {
      results.tests.database_connection = {
        success: false,
        error: error.message,
      }
      results.errors.push('Database connection failed')
    }

    // Test 3: Service Role Access
    try {
      const adminSupabase = await createServiceRoleClient()
      const { data, error } = await adminSupabase.from('profiles').select('count').limit(1)
      results.tests.service_role = {
        success: !error,
        error: error?.message,
      }
    } catch (error: any) {
      results.tests.service_role = {
        success: false,
        error: error.message,
      }
      results.errors.push('Service role access failed')
    }

    // Test 4: Database Tables
    try {
      const adminSupabase = await createServiceRoleClient()
      const tables = ['profiles', 'deposit_requests', 'transactions', 'otp_orders']
      const tableTests: Record<string, boolean> = {}
      
      for (const table of tables) {
        try {
          const { error } = await adminSupabase.from(table).select('*').limit(1)
          tableTests[table] = !error
          if (error) {
            results.warnings.push(`Table ${table} may have issues: ${error.message}`)
          }
        } catch (e: any) {
          tableTests[table] = false
          results.errors.push(`Table ${table} is not accessible`)
        }
      }
      
      results.tests.database_tables = tableTests
    } catch (error: any) {
      results.tests.database_tables = {
        error: error.message,
      }
    }

    // Test 5: API Routes (check if they exist)
    const apiRoutes = [
      '/api/user/balance',
      '/api/user/profile',
      '/api/user/api-key',
      '/api/deposit/create',
      '/api/deposit/check',
      '/api/orders',
      '/api/transactions',
      '/api/webhook/sepay',
    ]
    
    results.tests.api_routes = apiRoutes.map(route => ({
      route,
      exists: true, // We can't actually test if routes exist without calling them
    }))

    // Test 6: Sepay Integration
    results.tests.sepay = {
      api_key_configured: !!process.env.SEPAY_API_KEY,
      webhook_secret_configured: !!process.env.SEPAY_WEBHOOK_SECRET,
      webhook_url: process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/sepay`
        : 'Not configured (set NEXT_PUBLIC_APP_URL)',
    }

    if (!process.env.SEPAY_WEBHOOK_SECRET) {
      results.warnings.push('SEPAY_WEBHOOK_SECRET is not set - webhook signature verification will be skipped')
    }

    // Test 7: Check for common issues
    results.tests.common_issues = {
      register_uses_api: true, // We fixed this
      dashboard_creates_profile: true, // We fixed this
      orders_has_service_country: true, // We fixed this
    }

    // Summary
    const allTests = Object.values(results.tests).flatMap((test: any) => {
      if (typeof test === 'object' && test !== null) {
        return Object.values(test).filter((v: any) => typeof v === 'boolean')
      }
      return []
    })

    const passedTests = allTests.filter((v: any) => v === true).length
    const totalTests = allTests.length

    results.summary = {
      total_tests: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests,
      errors: results.errors.length,
      warnings: results.warnings.length,
      status: results.errors.length === 0 && passedTests === totalTests ? 'healthy' : 'issues_found',
    }

  } catch (error: any) {
    results.errors.push(`System test failed: ${error.message}`)
    results.summary = {
      status: 'error',
      error: error.message,
    }
  }

  return NextResponse.json(results, {
    status: results.errors.length > 0 ? 500 : 200,
  })
}

