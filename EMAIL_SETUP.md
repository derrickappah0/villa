Email System (Edge-only)

This app uses a single Supabase Edge Function (`mailer`) to send admin notification emails through Resend. Secrets are stored as Supabase Function Secrets for easy deployment.

Configure

1) Supabase project is already linked. Set function secrets (replace values):

```bash
supabase secrets set \
  RESEND_API_KEY=re_your_actual_key \
  RESEND_FROM_EMAIL=onboarding@resend.dev \
  ADMIN_EMAILS=your_admin@example.com
```

2) Deploy the function:

```bash
supabase functions deploy mailer --no-verify-jwt
```

3) Next.js environment:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Test

- From the app:

```bash
curl -X POST http://localhost:3000/api/email-test \
  -H "Content-Type: application/json" \
  -d '{"type":"contact","data":{"name":"Test","email":"test@example.com","phone":"+233","subject":"Hello","message":"World"}}'
```

- Directly to Supabase (replace URL and key):

```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/mailer \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"contact","data":{"name":"Test","email":"t@e.com","phone":"+0","subject":"Hello","message":"World"}}'
```

Notes

- Keep `RESEND_API_KEY` only in Supabase Function Secrets.
- Do not store email credentials in `.env.local`.
- API routes call the function server-side after DB writes.

