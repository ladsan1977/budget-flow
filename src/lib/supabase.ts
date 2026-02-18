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
 * Development helper to get current user ID
 * Falls back to env variable for RLS-enabled development
 */
export const getDevUserId = (): string => {
    const devUserId = import.meta.env.VITE_DEV_USER_ID;

    if (!devUserId) {
        console.warn(
            'VITE_DEV_USER_ID not set. RLS policies may return empty results.'
        );
    }

    return devUserId || '';
};
