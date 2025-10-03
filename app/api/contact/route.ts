import { NextRequest, NextResponse } from 'next/server'
import { createContactMessage, getContactMessages } from '@/lib/database/queries'
import { z } from 'zod'

const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
})

export async function POST(request: NextRequest) {
  console.log('💬 [CONTACT API] New contact message submission received')
  
  try {
    console.log('📋 [CONTACT API] Parsing request body...')
    const body = await request.json()
    console.log('📝 [CONTACT API] Request data received:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      messageLength: body.message ? body.message.length : 0
    })

    console.log('✅ [CONTACT API] Validating contact message data...')
    const validatedData = contactMessageSchema.parse(body)
    console.log('✅ [CONTACT API] Data validation successful')

    console.log('💾 [CONTACT API] Creating contact message in database...')
    const message = await createContactMessage({
      ...validatedData,
      status: 'unread',
    })
    console.log('✅ [CONTACT API] Contact message created successfully with ID:', message.id)

    // Send email notification to admin via Edge Function
    console.log('📧 [CONTACT API] Initiating edge email notification...')
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !anonKey) {
        console.warn('⚠️ [CONTACT API] Missing Supabase config for edge mailer, skipping email')
      } else {
        const response = await fetch(`${supabaseUrl}/functions/v1/mailer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'contact',
            data: validatedData,
          }),
        })
        const result = await response.json().catch(() => ({}))
        if (response.ok && result?.success) {
          console.log('✅ [CONTACT API] Edge email sent:', result?.messageId)
        } else {
          console.warn('⚠️ [CONTACT API] Edge email failed:', result?.error || response.status)
        }
      }
    } catch (emailError) {
      console.error('❌ [CONTACT API] Failed to send edge email notification:', emailError)
      console.warn('⚠️ [CONTACT API] Continuing with message creation despite email failure')
    }

    console.log('🎉 [CONTACT API] Contact message submission completed successfully')
    return NextResponse.json(
      { 
        success: true, 
        data: message,
        message: 'Message sent successfully!' 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ [CONTACT API] Validation error:', error.errors)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('💥 [CONTACT API] Critical error creating contact message:', error)
    console.error('🔍 [CONTACT API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send message. Please try again.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const messages = await getContactMessages()
    
    return NextResponse.json(
      { 
        success: true, 
        data: messages 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch contact messages' 
      },
      { status: 500 }
    )
  }
}
