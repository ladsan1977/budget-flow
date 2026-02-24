import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { BudgetGoal } from '../types';
import { requireUser, handleSupabaseError, getMonthRange } from './base';
import { mapBudget } from './mappers';
import { VARIABLE_CATEGORY_ID } from '../lib/constants';

type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

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
 * Set the monthly variable budget (Managed via 'Groceries' / variable proxy category)
 * Uses native .upsert() targeting the unique constraint (user_id, category_id, month_year)
 * for a clean single-request operation.
 */
export const setMonthlyVariableBudget = async (date: Date, amount: number): Promise<BudgetGoal> => {
    const userId = await requireUser();
    const { startDate } = getMonthRange(date);

    // Ensure the required proxy category exists for this user before setting budget
    const categoryPayload: CategoryInsert = {
        id: VARIABLE_CATEGORY_ID,
        name: 'Variable Expenses',
        type: 'variable',
        icon: 'ShoppingCart',
        color: 'text-blue-500',
        user_id: userId,
    };

    const { error: categoryError } = await supabase
        .from('categories')
        .upsert(categoryPayload, { onConflict: 'id', ignoreDuplicates: true });

    if (categoryError) {
        handleSupabaseError(categoryError, 'Failed to create default variable category');
    }

    const payload: BudgetInsert = {
        user_id: userId,
        category_id: VARIABLE_CATEGORY_ID,
        month_year: startDate,
        limit_amount: amount,
    };

    const { data, error } = await supabase
        .from('budgets')
        .upsert(payload, { onConflict: 'category_id,month_year' })
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to save budget');
    }

    return mapBudget(data!);
};
