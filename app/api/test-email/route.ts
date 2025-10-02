import { NextRequest, NextResponse } from 'next/server'
import { sendContactMessageNotification } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  console.log('🧪 [TEST EMAIL API] Email system test initiated')
  
  try {
    // Test email with sample data
    const testData = {
      name: "Test User",
      email: "test@example.com",
      phone: "+233 XX XXX XXXX",
      subject: "Email System Test",
      message: "This is a test message to verify that the email notification system is working properly. If you receive this email, your Resend integration is configured correctly!"
    }

    console.log('📧 [TEST EMAIL API] Sending test email with sample data...')
    const result = await sendContactMessageNotification(testData)
    
    if ((result as any)?.skipped) {
      console.log('⚠️ [TEST EMAIL API] Test email skipped (Resend not configured)')
      return NextResponse.json(
        {
          success: false,
          skipped: true,
          message: 'Email sending skipped: RESEND_API_KEY not configured',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }
    
    console.log('✅ [TEST EMAIL API] Test email completed successfully')
    return NextResponse.json(
      { 
        success: true, 
        message: 'Test email sent successfully!',
        messageId: (result as any)?.messageId,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ [TEST EMAIL API] Test email failed:', error)
    console.error('🔍 [TEST EMAIL API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Test email failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Email test endpoint. Use POST to send a test email.',
      instructions: 'Send a POST request to this endpoint to test email functionality.'
    },
    { status: 200 }
  )
}