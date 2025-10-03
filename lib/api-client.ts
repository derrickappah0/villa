interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      }
    }
  }

  // Appointments
  async createAppointment(data: {
    name: string
    email: string
    phone: string
    preferred_date: string
    preferred_time: string
    message?: string
    property_interest?: string
  }) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getAppointments() {
    return this.request('/appointments')
  }

  // Build Requests
  async createBuildRequest(data: {
    name: string
    email: string
    phone: string
    budget: number
    location: string
    property_type: string
    bedrooms: number
    bathrooms: number
    special_requirements?: string
    timeline: string
  }) {
    return this.request('/build-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getBuildRequests() {
    return this.request('/build-requests')
  }

  // Contact Messages
  async createContactMessage(data: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getContactMessages() {
    return this.request('/contact')
  }

  // Payment Plans
  async getPaymentPlans() {
    return this.request('/payment-plans')
  }

  async createPaymentPlan(data: {
    name: string
    description: string
    starting_price: number
    deposit_percentage: number
    interest_rate: number
    duration_months: number
    payment_frequency: 'monthly' | 'quarterly' | 'yearly'
    features: string[]
  }) {
    return this.request('/payment-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Edge Mailer helper
  async sendAdminEmailThroughEdge(payload: any) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    const res = await fetch(`${supabaseUrl}/functions/v1/mailer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    return res.json()
  }
}

export const apiClient = new ApiClient()
