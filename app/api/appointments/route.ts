import { NextRequest, NextResponse } from 'next/server'
import { createAppointment, getAppointments } from '@/lib/database/queries'
import { sendAppointmentNotification } from '@/lib/email-service'
import { z } from 'zod'

const appointmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  preferred_date: z.string().min(1, 'Preferred date is required'),
  preferred_time: z.string().min(1, 'Preferred time is required'),
  message: z.string().optional(),
  property_interest: z.string().optional(),
})

export async function POST(request: NextRequest) {
  console.log('📅 [APPOINTMENTS API] New appointment booking request received')
  
  try {
    console.log('📋 [APPOINTMENTS API] Parsing request body...')
    const body = await request.json()
    console.log('📝 [APPOINTMENTS API] Request data received:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      date: body.preferred_date,
      time: body.preferred_time,
      interest: body.property_interest,
      hasMessage: !!body.message
    })

    console.log('✅ [APPOINTMENTS API] Validating appointment data...')
    const validatedData = appointmentSchema.parse(body)
    console.log('✅ [APPOINTMENTS API] Data validation successful')

    console.log('💾 [APPOINTMENTS API] Creating appointment in database...')
    const appointment = await createAppointment({
      ...validatedData,
      status: 'pending',
    })
    console.log('✅ [APPOINTMENTS API] Appointment created successfully with ID:', appointment.id)

    // Send email notification to admin
    console.log('📧 [APPOINTMENTS API] Initiating email notification...')
    try {
      const emailResult = await sendAppointmentNotification(validatedData)
      if ((emailResult as any)?.skipped) {
        console.log('⚠️ [APPOINTMENTS API] Email notification skipped (Resend not configured)')
      } else if ((emailResult as any)?.success) {
        console.log('✅ [APPOINTMENTS API] Email notification sent successfully:', emailResult.messageId)
      } else {
        console.warn('⚠️ [APPOINTMENTS API] Email notification not successful')
      }
    } catch (emailError) {
      console.error('❌ [APPOINTMENTS API] Failed to send email notification:', emailError)
      console.warn('⚠️ [APPOINTMENTS API] Continuing with appointment creation despite email failure')
      // Don't fail the appointment creation if email fails
    }

    console.log('🎉 [APPOINTMENTS API] Appointment booking completed successfully')
    return NextResponse.json(
      { 
        success: true, 
        data: appointment,
        message: 'Appointment booked successfully!' 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ [APPOINTMENTS API] Validation error:', error.errors)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('💥 [APPOINTMENTS API] Critical error creating appointment:', error)
    console.error('🔍 [APPOINTMENTS API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to book appointment. Please try again.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const appointments = await getAppointments()
    
    return NextResponse.json(
      { 
        success: true, 
        data: appointments 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch appointments' 
      },
      { status: 500 }
    )
  }
}
