import { Resend } from 'resend'
import { getSecret } from './supabase/vault'

let resendClient: Resend | null = null
let initializationPromise: Promise<Resend | null> | null = null

// Initialize Resend client with API key from Supabase Vault
async function initializeResend(): Promise<Resend | null> {
  console.log('🔧 [RESEND CLIENT] Starting Resend client initialization...')
  
  if (resendClient) {
    console.log('✅ [RESEND CLIENT] Using existing Resend client instance')
    return resendClient
  }

  try {
    console.log('🔍 [RESEND CLIENT] Checking Supabase Vault for API key...')
    // Try to get API key from Supabase Vault first
    const vaultApiKey = await getSecret('RESEND_API_KEY')
    
    if (vaultApiKey) {
      console.log('🔑 [RESEND CLIENT] Found Resend API key in Supabase Vault')
      console.log('🚀 [RESEND CLIENT] Initializing Resend client with Vault API key')
      resendClient = new Resend(vaultApiKey)
      console.log('✅ [RESEND CLIENT] Resend client initialized successfully from Vault')
      return resendClient
    }

    console.log('⚠️ [RESEND CLIENT] No API key found in Supabase Vault, checking environment variables...')
    // Fallback to environment variable
    const envApiKey = process.env.RESEND_API_KEY
    if (envApiKey) {
      console.log('🔑 [RESEND CLIENT] Found Resend API key in environment variables')
      console.log('🚀 [RESEND CLIENT] Initializing Resend client with environment API key')
      resendClient = new Resend(envApiKey)
      console.log('✅ [RESEND CLIENT] Resend client initialized successfully from environment')
      return resendClient
    }

    // No API key available

    console.warn('❌ [RESEND CLIENT] No Resend API key found in Vault or environment variables')
    console.log('💡 [RESEND CLIENT] To enable email sending, add RESEND_API_KEY to your .env.local file')
    console.log('💡 [RESEND CLIENT] Example: RESEND_API_KEY=re_your_api_key_here')
    return null
  } catch (error) {
    console.error('💥 [RESEND CLIENT] Failed to initialize Resend client:', error)
    console.error('🔍 [RESEND CLIENT] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    
    console.log('🔄 [RESEND CLIENT] Attempting fallback to environment variable...')
    // Fallback to environment variable if vault fails
    const envApiKey = process.env.RESEND_API_KEY
    if (envApiKey) {
      console.log('🔑 [RESEND CLIENT] Found environment API key during fallback')
      console.log('🚀 [RESEND CLIENT] Initializing Resend client with fallback environment key')
      resendClient = new Resend(envApiKey)
      console.log('✅ [RESEND CLIENT] Resend client initialized successfully via fallback')
      return resendClient
    }
    
    console.error('❌ [RESEND CLIENT] Fallback failed - no environment API key available')
    return null
  }
}

// Get Resend client (lazy initialization with promise caching)
async function getResendClient(): Promise<Resend | null> {
  if (resendClient) {
    return resendClient
  }
  
  if (!initializationPromise) {
    initializationPromise = initializeResend()
  }
  
  return initializationPromise
}

// Mock client for when no API key is available
const mockResendClient = {
  emails: {
    send: async (emailData: any) => {
      console.warn('📧 [RESEND CLIENT] Email sending skipped: No Resend API key configured')
      console.log('📋 [RESEND CLIENT] Mock email details:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        hasHtml: !!emailData.html,
        hasText: !!emailData.text
      })
      console.log('💡 [RESEND CLIENT] To send real emails, configure RESEND_API_KEY in your environment')
      return { data: null, error: { name: 'EmailSendSkipped', message: 'Resend disabled: missing RESEND_API_KEY', skipped: true } }
    }
  }
}

// Export resend client (with fallback)
export const resend = {
  emails: {
    send: async (emailData: any) => {
      console.log('📬 [RESEND CLIENT] Email send request initiated')
      console.log('📋 [RESEND CLIENT] Getting Resend client...')
      
      const client = await getResendClient()
      if (client) {
        console.log('✅ [RESEND CLIENT] Real Resend client available, sending email...')
        const result = await client.emails.send(emailData)
        console.log('📤 [RESEND CLIENT] Email send result:', {
          success: !result.error,
          messageId: result.data?.id,
          hasError: !!result.error
        })
        return result
      }
      
      console.log('⚠️ [RESEND CLIENT] No real client available, using mock client')
      const result = await mockResendClient.emails.send(emailData)
      console.log('📤 [RESEND CLIENT] Mock send result (skipped):', {
        success: false,
        skipped: (result as any)?.error?.skipped === true,
        message: (result as any)?.error?.message
      })
      return result
    }
  }
}
