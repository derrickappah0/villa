// Supabase Edge Function: mailer
// Unified email sender using Resend REST API. Secrets are managed via
// Supabase Function Secrets for easy deployment.
// Types: this file runs in Deno on Supabase; declare Deno for TS tooling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any

type MailPayload = {
  type: 'appointment' | 'build' | 'contact'
  data: Record<string, unknown>
  options?: { reply_to?: string }
}

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function getEnv() {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
  const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'
  const adminRaw = Deno.env.get('ADMIN_EMAILS') || 'nandysvilla.homes@gmail.com'
  const ADMIN_EMAILS = adminRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
  return { RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_EMAILS }
}

// ---- DB-backed templates helpers ----
function getSupabaseEnv() {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || ''
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  return { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY }
}

function interpolate(template: string | undefined, data: Record<string, unknown>): string | undefined {
  if (!template) return undefined
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = (data as any)[key]
    return value === undefined || value === null ? '' : String(value)
  })
}

async function fetchTemplateFromDb(type: MailPayload['type']): Promise<{
  subject_template: string
  html_template: string
  text_template?: string
} | null> {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv()
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null

  const url = `${SUPABASE_URL}/rest/v1/email_templates?type=eq.${type}&is_active=eq.true&select=subject_template,html_template,text_template&order=updated_at.desc&limit=1`
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) return null
  const json = await res.json().catch(() => []) as Array<any>
  if (!Array.isArray(json) || json.length === 0) return null
  return json[0]
}

function buildEmailFromDbTemplate(payload: MailPayload, from: string, admins: string[], tmpl: { subject_template: string, html_template: string, text_template?: string }) {
  // Provide some convenient derived placeholders
  const d = { ...(payload.data as any) }
  if (d.budget !== undefined) {
    const n = Number(d.budget || 0)
    d.budget_formatted = isNaN(n) ? '' : n.toLocaleString()
  }

  const subject = interpolate(tmpl.subject_template, d) || ''
  const html = interpolate(tmpl.html_template, d)
  const text = interpolate(tmpl.text_template, d)
  return { from, to: admins, subject, html, text }
}

function renderTemplates(payload: MailPayload, from: string, admins: string[]) {
  const t = payload.type
  const d = payload.data as any

  if (t === 'appointment') {
    const subject = `New Appointment Booking - ${d.name}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>New Appointment Booking</h2>
        <p><strong>Name:</strong> ${d.name}</p>
        <p><strong>Email:</strong> ${d.email}</p>
        <p><strong>Phone:</strong> ${d.phone}</p>
        <p><strong>Date:</strong> ${d.preferred_date}</p>
        <p><strong>Time:</strong> ${d.preferred_time}</p>
        ${d.property_interest ? `<p><strong>Interest:</strong> ${d.property_interest}</p>` : ''}
        ${d.message ? `<p><strong>Message:</strong> ${d.message}</p>` : ''}
      </div>
    `
    const text = `New Appointment Booking - ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nDate: ${d.preferred_date}\nTime: ${d.preferred_time}`
    return { from, to: admins, subject, html, text }
  }

  if (t === 'build') {
    const subject = `New Build Request - ${d.name} (Budget: GHS ${Number(d.budget || 0).toLocaleString()})`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>New Build Request</h2>
        <p><strong>Name:</strong> ${d.name}</p>
        <p><strong>Email:</strong> ${d.email}</p>
        <p><strong>Phone:</strong> ${d.phone}</p>
        <p><strong>Budget:</strong> GHS ${Number(d.budget || 0).toLocaleString()}</p>
        <p><strong>Location:</strong> ${d.location}</p>
        <p><strong>Property Type:</strong> ${d.property_type}</p>
        <p><strong>Bedrooms:</strong> ${d.bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${d.bathrooms}</p>
        <p><strong>Timeline:</strong> ${d.timeline}</p>
        ${d.special_requirements ? `<p><strong>Special Requirements:</strong> ${d.special_requirements}</p>` : ''}
      </div>
    `
    const text = `New Build Request - ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nBudget: GHS ${Number(d.budget || 0).toLocaleString()}\nLocation: ${d.location}`
    return { from, to: admins, subject, html, text }
  }

  // contact
  const subject = `New Contact Message - ${d.subject}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${d.name}</p>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Phone:</strong> ${d.phone}</p>
      <p><strong>Subject:</strong> ${d.subject}</p>
      <p><strong>Message:</strong> ${d.message}</p>
    </div>
  `
  const text = `New Contact Message - ${d.subject}\nFrom: ${d.name} <${d.email}>\nPhone: ${d.phone}\n\n${d.message}`
  return { from, to: admins, subject, html, text }
}

async function sendViaResend(emailData: { from: string, to: string[], subject: string, html?: string, text?: string, reply_to?: string }) {
  const { RESEND_API_KEY } = getEnv()
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'Missing RESEND_API_KEY function secret' }
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  })
  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { ok: false, error: json?.message || `Resend API error (${response.status})`, details: json }
  }
  return { ok: true, id: json?.id || json?.data?.id || null }
}

Deno.serve(async (req: Request) => {
  console.log('[MAILER] Request received', { method: req.method, time: new Date().toISOString() })
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405)
  }

  try {
    const payload = await req.json() as MailPayload
    console.log('[MAILER] Parsed payload', { type: payload?.type })
    if (!payload || !payload.type || !payload.data) {
      return jsonResponse({ success: false, error: 'Invalid payload' }, 400)
    }

    const { RESEND_FROM_EMAIL, ADMIN_EMAILS } = getEnv()
    console.log('[MAILER] Env check', { hasFrom: !!RESEND_FROM_EMAIL, adminCount: ADMIN_EMAILS.length })
    if (!ADMIN_EMAILS.length) {
      return jsonResponse({ success: false, error: 'Missing ADMIN_EMAILS function secret' }, 500)
    }

    // Try DB template first; fallback to inline templates
    let base
    try {
      const tmpl = await fetchTemplateFromDb(payload.type)
      if (tmpl) {
        base = buildEmailFromDbTemplate(payload, RESEND_FROM_EMAIL, ADMIN_EMAILS, tmpl)
      } else {
        base = renderTemplates(payload, RESEND_FROM_EMAIL, ADMIN_EMAILS)
      }
    } catch {
      base = renderTemplates(payload, RESEND_FROM_EMAIL, ADMIN_EMAILS)
    }
    const emailData = { ...base, reply_to: payload.options?.reply_to }

    const result = await sendViaResend(emailData)
    if (!result.ok) {
      console.warn('[MAILER] Resend send failed', { error: result.error })
      return jsonResponse({ success: false, error: result.error, details: result.details }, 500)
    }

    console.log('[MAILER] Email sent', { id: result.id })
    return jsonResponse({ success: true, messageId: result.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[MAILER] Unhandled error', { message })
    return jsonResponse({ success: false, error: message }, 500)
  }
})


