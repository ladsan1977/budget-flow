import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Helper to enforce authentication at the service layer
export const requireUser = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized: No active session');
    }
    return user.id;
};

/**
 * Standardized error handling for Supabase operations
 */
export const handleSupabaseError = (error: PostgrestError, context: string): never => {
    console.error(`[Supabase Error] ${context}:`, error);
    throw new Error(`${context}: ${error.message}`);
};

/**
 * Returns the start and end dates (YYYY-MM-DD) for a given month.
 */
export function getMonthRange(date: Date): { startDate: string; endDate: string } {
    const month = date.getMonth() + 1; // 1-indexed
    const year = date.getFullYear();

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    return { startDate, endDate };
}
