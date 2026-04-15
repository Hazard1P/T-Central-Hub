import { createClient } from '@supabase/supabase-js';

let adminClient = null;

export function getAdminSupabaseClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}

export function isServerPersistenceConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertRecord(table, payload) {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    const error = new Error('Server persistence is not configured.');
    error.code = 'PERSISTENCE_NOT_CONFIGURED';
    throw error;
  }

  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    const wrapped = new Error(error.message || `Unable to write to ${table}.`);
    wrapped.code = error.code || 'PERSISTENCE_WRITE_FAILED';
    throw wrapped;
  }
}
