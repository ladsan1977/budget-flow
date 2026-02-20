import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Environment validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file.'
    );
}

/**
 * Supabase client singleton
 * Type-safe client with generated database types
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    }
);

/**
 * @deprecated Use Supabase authentication sessions (`supabase.auth.getUser()`) for production environments. 
 * This is a development fallback only.
 */
export const getDevUserId = (): string => {
    console.warn('DEPRECATION WARNING: getDevUserId() is deprecated. UI should use real Supabase Auth sessions.')
    const devUserId = import.meta.env.VITE_DEV_USER_ID;

    if (!devUserId) {
        console.warn(
            'VITE_DEV_USER_ID not set. RLS policies may return empty results.'
        );
    }

    return devUserId || '';
};
