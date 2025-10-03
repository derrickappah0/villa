import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ success: false, error: 'Missing Supabase env' }, { status: 500 })
    }

    const body = await request.json().catch(() => ({}))
    const payload = Object.keys(body || {}).length ? body : {
      type: 'contact',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+233000000',
        subject: 'Edge Mailer Test',
        message: 'If you see this, the Edge function mailer works.'
      }
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/mailer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const result = await response.json().catch(() => ({}))

    return NextResponse.json({ success: !!result?.success, result }, { status: response.ok ? 200 : 500 })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to this endpoint to test Edge mailer' })
}


