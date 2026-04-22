import { createClient } from '@supabase/supabase-js';

/**
 * Returns a validated Supabase URL and anon key from environment.
 * Throws a clear error at runtime (inside a request handler) rather than at module load.
 */
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
    );
  }
  return { url, anonKey };
}

/**
 * Public Supabase client - safe for browser use.
 * Uses the anon key with Row Level Security enforced.
 * Lazy-initialised so module load does not throw on missing env vars.
 */
export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

/**
 * Admin Supabase client - server-side only!
 * Uses the service role key which bypasses RLS.
 * WARNING: Never expose this to the browser.
 * Returns null when SUPABASE_SERVICE_KEY is not set.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Legacy named exports kept for backward compatibility
export const supabaseClient = typeof window !== 'undefined'
  ? (() => {
      try { return getSupabaseClient(); } catch { return null as any; }
    })()
  : null as any;

export const supabaseAdmin = typeof window === 'undefined'
  ? (() => {
      try { return getSupabaseAdmin(); } catch { return null; }
    })()
  : null;

export default supabaseClient;
