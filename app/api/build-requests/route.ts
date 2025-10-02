import { NextRequest, NextResponse } from 'next/server'
import { createBuildRequest, getBuildRequests } from '@/lib/database/queries'
import { sendBuildRequestNotification } from '@/lib/email-service'
import { z } from 'zod'

const buildRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  budget: z.number().min(0, 'Budget must be a positive number'),
  location: z.string().min(1, 'Location is required'),
  property_type: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().min(1, 'Number of bedrooms must be at least 1'),
  bathrooms: z.number().min(1, 'Number of bathrooms must be at least 1'),
  special_requirements: z.string().optional(),
  timeline: z.string().min(1, 'Timeline is required'),
})

export async function POST(request: NextRequest) {
  console.log('🏗️ [BUILD REQUESTS API] New build request submission received')
  
  try {
    console.log('📋 [BUILD REQUESTS API] Parsing request body...')
    const body = await request.json()
    console.log('📝 [BUILD REQUESTS API] Request data received:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      budget: body.budget,
      location: body.location,
      propertyType: body.property_type,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      timeline: body.timeline,
      hasSpecialRequirements: !!body.special_requirements
    })

    console.log('✅ [BUILD REQUESTS API] Validating build request data...')
    const validatedData = buildRequestSchema.parse(body)
    console.log('✅ [BUILD REQUESTS API] Data validation successful')

    console.log('💾 [BUILD REQUESTS API] Creating build request in database...')
    const buildRequest = await createBuildRequest({
      ...validatedData,
      status: 'pending',
    })
    console.log('✅ [BUILD REQUESTS API] Build request created successfully with ID:', buildRequest.id)

    // Send email notification to admin
    console.log('📧 [BUILD REQUESTS API] Initiating email notification...')
    try {
      const emailResult = await sendBuildRequestNotification(validatedData)
      if (emailResult.success) {
        console.log('✅ [BUILD REQUESTS API] Build request email notification sent successfully:', emailResult.messageId)
      } else if (emailResult.skipped) {
        console.log('⚠️ [BUILD REQUESTS API] Build request email notification skipped (no API key configured)')
      } else {
        console.warn('❌ [BUILD REQUESTS API] Build request email notification failed:', emailResult.error)
      }
    } catch (emailError) {
      console.error('💥 [BUILD REQUESTS API] Failed to send build request email notification:', emailError)
      console.warn('⚠️ [BUILD REQUESTS API] Continuing with request creation despite email failure')
      // Don't fail the request creation if email fails
    }

    console.log('🎉 [BUILD REQUESTS API] Build request submission completed successfully')
    return NextResponse.json(
      { 
        success: true, 
        data: buildRequest,
        message: 'Build request submitted successfully!' 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ [BUILD REQUESTS API] Validation error:', error.errors)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error', 
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('💥 [BUILD REQUESTS API] Critical error creating build request:', error)
    console.error('🔍 [BUILD REQUESTS API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit build request. Please try again.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const buildRequests = await getBuildRequests()
    
    return NextResponse.json(
      { 
        success: true, 
        data: buildRequests 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching build requests:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch build requests' 
      },
      { status: 500 }
    )
  }
}
