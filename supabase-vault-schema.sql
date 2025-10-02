-- Create vault_secrets table for storing encrypted API keys and secrets
CREATE TABLE IF NOT EXISTS vault_secrets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  encrypted_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vault_secrets_key_name ON vault_secrets(key_name);

-- Enable Row Level Security
ALTER TABLE vault_secrets ENABLE ROW LEVEL SECURITY;

-- Create policies for vault_secrets
-- Allow all operations for authenticated users (server-side operations)
CREATE POLICY "Allow server operations on vault_secrets" ON vault_secrets
  FOR ALL USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_vault_secrets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vault_secrets_updated_at
  BEFORE UPDATE ON vault_secrets
  FOR EACH ROW
  EXECUTE FUNCTION update_vault_secrets_updated_at();

-- Insert some example secrets (replace with your actual values)
INSERT INTO vault_secrets (key_name, encrypted_value) VALUES
  ('RESEND_API_KEY', 're_your_resend_api_key_here'),
  ('STRIPE_SECRET_KEY', 'sk_test_your_stripe_key_here'),
  ('OPENAI_API_KEY', 'sk-your_openai_key_here')
ON CONFLICT (key_name) DO NOTHING;
