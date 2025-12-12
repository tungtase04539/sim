export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  balance: number
  role: 'user' | 'admin'
  api_key: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  code: string
  icon: string | null
  price: number
  available_numbers: number
  success_rate: number
  is_active: boolean
  created_at: string
}

export interface Country {
  id: string
  name: string
  code: string
  flag: string
  is_active: boolean
}

export interface Operator {
  id: string
  name: string
  code: string
  country_id: string
  is_active: boolean
}

export interface OTPOrder {
  id: string
  user_id: string
  service_id: string
  country_id: string
  operator_id: string | null
  phone_number: string | null
  otp_code: string | null
  price: number
  status: 'pending' | 'waiting' | 'success' | 'failed' | 'cancelled' | 'refunded'
  external_order_id: string | null
  created_at: string
  updated_at: string
  expires_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdraw' | 'purchase' | 'refund'
  amount: number
  balance_before: number
  balance_after: number
  description: string | null
  reference_id: string | null
  status: 'pending' | 'completed' | 'failed'
  payment_method: string | null
  created_at: string
}

export interface DepositRequest {
  id: string
  user_id: string
  amount: number
  payment_code: string
  bank_account: string
  bank_name: string
  status: 'pending' | 'completed' | 'expired'
  sepay_transaction_id: string | null
  created_at: string
  expires_at: string
}

export interface SystemSetting {
  id: string
  key: string
  value: string
  description: string | null
  updated_at: string
}

export interface ApiLog {
  id: string
  user_id: string | null
  endpoint: string
  method: string
  request_body: any
  response_body: any
  status_code: number
  ip_address: string | null
  created_at: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  successRate: number
  todayRevenue: number
  todayOrders: number
  pendingDeposits: number
  activeServices: number
}

export interface ChartData {
  date: string
  revenue: number
  orders: number
}

