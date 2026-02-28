import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { BudgetGoal } from '../types';
import { requireUser, handleSupabaseError, getMonthRange } from './base';
import { mapBudget } from './mappers';

type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

/**
 * Fetch budget goals for the current user, optionally filtered by month
 */
export const fetchBudgets = async (date?: Date): Promise<BudgetGoal[]> => {
    const userId = await requireUser();

    let query = supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

    if (date) {
        // Filter by specific month
        const { startDate } = getMonthRange(date);
        query = query.eq('month_year', startDate);
    }

    const { data, error } = await query;

    if (error) {
        handleSupabaseError(error, 'Failed to fetch budgets');
    }

    return (data || []).map(mapBudget);
};

/**
 * Set the monthly spending goal for the current user.
 * Uses native .upsert() targeting the unique constraint (user_id, month_year)
 * for a clean single-request operation.
 */
export const setMonthlyVariableBudget = async (date: Date, amount: number): Promise<BudgetGoal> => {
    const userId = await requireUser();
    const { startDate } = getMonthRange(date);

    const payload: BudgetInsert = {
        user_id: userId,
        month_year: startDate,
        limit_amount: amount,
    };

    const { data, error } = await supabase
        .from('budgets')
        .upsert(payload, { onConflict: 'user_id,month_year' })
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to save budget');
    }

    return mapBudget(data!);
};
