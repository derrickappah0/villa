import { resend } from './resend'
import { 
  getAppointmentNotificationEmail, 
  getBuildRequestNotificationEmail,
  getContactMessageNotificationEmail 
} from './email-templates'

// Email configuration from environment variables
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'derrickappah17@gmail.com'

console.log('📧 [EMAIL CONFIG] Email service configuration:')
console.log('📤 [EMAIL CONFIG] From email:', FROM_EMAIL)
console.log('📥 [EMAIL CONFIG] Admin email:', ADMIN_EMAIL)
console.log('🔑 [EMAIL CONFIG] Resend API key configured:', !!process.env.RESEND_API_KEY)

if (!process.env.RESEND_FROM_EMAIL) {
  console.warn('⚠️ [EMAIL CONFIG] RESEND_FROM_EMAIL not set, using default: onboarding@resend.dev')
}

if (!process.env.ADMIN_EMAIL) {
  console.warn('⚠️ [EMAIL CONFIG] ADMIN_EMAIL not set, using default: derrickappah17@gmail.com')
}

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ [EMAIL CONFIG] RESEND_API_KEY not configured - emails will use mock mode')
  console.log('💡 [EMAIL CONFIG] To enable real email sending, add RESEND_API_KEY to your .env.local file')
}

interface AppointmentData {
  name: string
  email: string
  phone: string
  preferred_date: string
  preferred_time: string
  message?: string
  property_interest?: string
}

interface BuildRequestData {
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
}

interface ContactMessageData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendAppointmentNotification(appointmentData: AppointmentData) {
  console.log('🚀 [EMAIL SERVICE] Starting appointment notification process')
  console.log('📋 [EMAIL SERVICE] Appointment data received:', {
    name: appointmentData.name,
    email: appointmentData.email,
    phone: appointmentData.phone,
    date: appointmentData.preferred_date,
    time: appointmentData.preferred_time,
    interest: appointmentData.property_interest,
    hasMessage: !!appointmentData.message
  })
  
  try {
    console.log('📧 [EMAIL SERVICE] Generating appointment email template...')
    const emailTemplate = getAppointmentNotificationEmail(appointmentData)
    console.log('✅ [EMAIL SERVICE] Email template generated successfully')
    console.log('📬 [EMAIL SERVICE] Email details:', {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject
    })
    
    console.log('📤 [EMAIL SERVICE] Sending appointment notification via Resend...')
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    if (error) {
      console.error('❌ [EMAIL SERVICE] Error sending appointment notification:', error)
      const skipped = (error as any)?.skipped === true || (error as any)?.name === 'EmailSendSkipped' || /RESEND_API_KEY/i.test((error as any)?.message || '')
      if (skipped) {
        console.warn('⚠️ [EMAIL SERVICE] Appointment email skipped due to configuration (missing RESEND_API_KEY)')
        return { success: false, messageId: null, skipped: true }
      }
      console.error('🔍 [EMAIL SERVICE] Error details:', {
        message: (error as any)?.message,
        name: (error as any)?.name,
        stack: (error as any)?.stack
      })
      throw new Error(`Failed to send appointment notification: ${(error as any)?.message}`)
    }

    console.log('✅ [EMAIL SERVICE] Appointment notification sent successfully!')
    console.log('📨 [EMAIL SERVICE] Email ID:', data?.id)
    console.log('🎯 [EMAIL SERVICE] Notification sent to:', ADMIN_EMAIL)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('💥 [EMAIL SERVICE] Critical error in sendAppointmentNotification:', error)
    console.error('🔍 [EMAIL SERVICE] Error context:', {
      customerName: appointmentData.name,
      customerEmail: appointmentData.email,
      errorType: error instanceof Error ? error.constructor.name : typeof error
    })
    throw error
  }
}

export async function sendBuildRequestNotification(buildRequestData: BuildRequestData) {
  console.log('🏗️ [EMAIL SERVICE] Starting build request notification process')
  console.log('📋 [EMAIL SERVICE] Build request data received:', {
    name: buildRequestData.name,
    email: buildRequestData.email,
    phone: buildRequestData.phone,
    budget: buildRequestData.budget,
    location: buildRequestData.location,
    propertyType: buildRequestData.property_type,
    bedrooms: buildRequestData.bedrooms,
    bathrooms: buildRequestData.bathrooms,
    timeline: buildRequestData.timeline,
    hasSpecialRequirements: !!buildRequestData.special_requirements
  })
  
  try {
    console.log('📧 [EMAIL SERVICE] Generating build request email template...')
    const emailTemplate = getBuildRequestNotificationEmail(buildRequestData)
    console.log('✅ [EMAIL SERVICE] Build request email template generated successfully')
    console.log('📬 [EMAIL SERVICE] Email details:', {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject
    })
    
    console.log('📤 [EMAIL SERVICE] Sending build request notification via Resend...')
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    if (error) {
      console.error('❌ [EMAIL SERVICE] Error sending build request notification:', error)
      const skipped = (error as any)?.skipped === true || (error as any)?.name === 'EmailSendSkipped' || /RESEND_API_KEY/i.test((error as any)?.message || '')
      if (skipped) {
        console.warn('⚠️ [EMAIL SERVICE] Build request email skipped due to configuration (missing RESEND_API_KEY)')
        console.log('💡 [EMAIL SERVICE] Tip: Add RESEND_API_KEY to your environment variables')
        return { success: false, messageId: null, skipped: true }
      }
      console.error('🔍 [EMAIL SERVICE] Error details:', {
        message: (error as any)?.message,
        name: (error as any)?.name,
        stack: (error as any)?.stack
      })
      throw new Error(`Failed to send build request notification: ${(error as any)?.message}`)
    }

    console.log('✅ [EMAIL SERVICE] Build request notification sent successfully!')
    console.log('📨 [EMAIL SERVICE] Email ID:', data?.id)
    console.log('🎯 [EMAIL SERVICE] Notification sent to:', ADMIN_EMAIL)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('💥 [EMAIL SERVICE] Error in sendBuildRequestNotification:', error)
    console.error('🔍 [EMAIL SERVICE] Error context:', {
      customerName: buildRequestData.name,
      customerEmail: buildRequestData.email,
      budget: buildRequestData.budget,
      errorType: error instanceof Error ? error.constructor.name : typeof error
    })
    
    // Don't throw error for email issues - just log and continue
    console.warn('⚠️ [EMAIL SERVICE] Email notification failed, but continuing with request processing')
    return { success: false, messageId: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendContactMessageNotification(contactData: ContactMessageData) {
  console.log('💬 [EMAIL SERVICE] Starting contact message notification process')
  console.log('📋 [EMAIL SERVICE] Contact data received:', {
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    subject: contactData.subject,
    messageLength: contactData.message.length
  })
  
  try {
    console.log('📧 [EMAIL SERVICE] Generating contact message email template...')
    const emailTemplate = getContactMessageNotificationEmail(contactData)
    console.log('✅ [EMAIL SERVICE] Contact message email template generated successfully')
    console.log('📬 [EMAIL SERVICE] Email details:', {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject
    })
    
    console.log('📤 [EMAIL SERVICE] Sending contact message notification via Resend...')
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    if (error) {
      console.error('❌ [EMAIL SERVICE] Error sending contact message notification:', error)
      const skipped = (error as any)?.skipped === true || (error as any)?.name === 'EmailSendSkipped' || /RESEND_API_KEY/i.test((error as any)?.message || '')
      if (skipped) {
        console.warn('⚠️ [EMAIL SERVICE] Contact email skipped due to configuration (missing RESEND_API_KEY)')
        return { success: false, messageId: null, skipped: true }
      }
      console.error('🔍 [EMAIL SERVICE] Error details:', {
        message: (error as any)?.message,
        name: (error as any)?.name,
        stack: (error as any)?.stack
      })
      throw new Error(`Failed to send contact message notification: ${(error as any)?.message}`)
    }

    console.log('✅ [EMAIL SERVICE] Contact message notification sent successfully!')
    console.log('📨 [EMAIL SERVICE] Email ID:', data?.id)
    console.log('🎯 [EMAIL SERVICE] Notification sent to:', ADMIN_EMAIL)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('💥 [EMAIL SERVICE] Critical error in sendContactMessageNotification:', error)
    console.error('🔍 [EMAIL SERVICE] Error context:', {
      customerName: contactData.name,
      customerEmail: contactData.email,
      subject: contactData.subject,
      errorType: error instanceof Error ? error.constructor.name : typeof error
    })
    throw error
  }
}
