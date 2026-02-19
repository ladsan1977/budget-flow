import { supabase, getDevUserId } from '../lib/supabase';
import type { Category, Transaction, BudgetGoal } from '../types';
import type { Database } from '../types/database.types';
import { VARIABLE_CATEGORY_ID } from '../lib/constants';

// ─── Database row / payload type aliases ─────────────────────────────────────
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];

/**
 * Convert database category to app Category type
 */
const mapCategory = (row: CategoryRow): Category => ({
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon || undefined,
    color: row.color || undefined,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Convert database transaction to app Transaction type
 */
const mapTransaction = (row: TransactionRow): Transaction => ({
    id: row.id,
    amount: row.amount,
    date: row.date,
    description: row.description,
    categoryId: row.category_id,
    type: row.type,
    isPaid: row.is_paid,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Convert database budget to app BudgetGoal type
 */
const mapBudget = (row: BudgetRow): BudgetGoal => ({
    id: row.id,
    categoryId: row.category_id,
    amount: row.limit_amount,
    month: row.month_year,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

/**
 * Fetch all categories for the current user
 */
export const fetchCategories = async (): Promise<Category[]> => {
    const userId = getDevUserId();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return (data || []).map(mapCategory);
};

/**
 * Fetch all transactions for the current user
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
    const userId = getDevUserId();

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return (data || []).map(mapTransaction);
};

/**
 * Fetch transactions filtered by month and type
 */
export const fetchTransactionsByMonth = async (
    date: Date,
    type?: Transaction['type']
): Promise<Transaction[]> => {
    const userId = getDevUserId();
    const month = date.getMonth() + 1; // 1-indexed
    const year = date.getFullYear();

    // Calculate date range for the month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

    // Calculate next month for upper bound
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    // Build query
    let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lt('date', endDate);

    if (type) {
        query = query.eq('type', type);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch transactions: ${error.message}`);
    }

    return (data || []).map(mapTransaction);
};

/**
 * Fetch budget goals for the current user, optionally filtered by month
 */
export const fetchBudgets = async (date?: Date): Promise<BudgetGoal[]> => {
    const userId = getDevUserId();

    let query = supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

    if (date) {
        // Filter by specific month
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        // Construct date string matching DB format (assuming YYYY-MM-DD for the first of the month)
        const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;
        query = query.eq('month_year', dateStr);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Failed to fetch budgets: ${error.message}`);
    }

    return (data || []).map(mapBudget);
};

/**
 * Set the monthly variable budget (Managed via 'Groceries' category)
 * Uses native .upsert() targeting the unique constraint (user_id, category_id, month_year)
 * for a clean single-request operation.
 */
export const setMonthlyVariableBudget = async (date: Date, amount: number): Promise<BudgetGoal> => {
    const userId = getDevUserId();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;

    const payload: BudgetInsert = {
        user_id: userId,
        category_id: VARIABLE_CATEGORY_ID,
        month_year: dateStr,
        limit_amount: amount,
    };

    const { data, error } = await supabase
        .from('budgets')
        .upsert(payload, { onConflict: 'user_id,category_id,month_year' })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to save budget: ${error.message}`);
    }

    return mapBudget(data);
};



/**
 * Create a new transaction
 */
export const createTransaction = async (
    transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> => {
    const userId = getDevUserId();

    const payload: TransactionInsert = {
        user_id: userId,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        category_id: transaction.categoryId,
        type: transaction.type,
        is_paid: transaction.isPaid,
    };

    const { data, error } = await supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
    }

    return mapTransaction(data);
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Transaction> => {
    const userId = getDevUserId();

    // Build a partial update containing only the fields that actually changed.
    const updateData: TransactionUpdate = {};
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;

    const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)   // RLS ownership check
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update transaction: ${error.message}`);
    }

    return mapTransaction(data);
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (id: string): Promise<void> => {
    const userId = getDevUserId();

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // RLS check

    if (error) {
        throw new Error(`Failed to delete transaction: ${error.message}`);
    }
};
