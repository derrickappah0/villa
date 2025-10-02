import { createClient } from './server'

// For now, use our custom vault table approach since we need the service role key
// In production, you should use the official Supabase Vault extension

// Store encrypted secrets in Supabase
export async function storeSecret(key: string, value: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vault_secrets')
    .upsert({ 
      key_name: key, 
      encrypted_value: value,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to store secret: ${error.message}`)
  }

  return data
}

// Retrieve encrypted secrets from Supabase
export async function getSecret(key: string): Promise<string | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vault_secrets')
    .select('encrypted_value')
    .eq('key_name', key)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    throw new Error(`Failed to retrieve secret: ${error.message}`)
  }

  return data?.encrypted_value || null
}

// Get all secret keys (without values)
export async function listSecrets() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vault_secrets')
    .select('key_name, created_at, updated_at')
    .order('key_name')

  if (error) {
    throw new Error(`Failed to list secrets: ${error.message}`)
  }

  return data
}

// Delete a secret
export async function deleteSecret(key: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('vault_secrets')
    .delete()
    .eq('key_name', key)

  if (error) {
    throw new Error(`Failed to delete secret: ${error.message}`)
  }

  return true
}
