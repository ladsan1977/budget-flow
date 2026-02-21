import { supabase } from '../lib/supabase';
import type { Category, Transaction, BudgetGoal } from '../types';
import type { Database } from '../types/database.types';
import { VARIABLE_CATEGORY_ID } from '../lib/constants';

// Helper to enforce authentication at the service layer
const requireUser = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized: No active session');
    }
    return user.id;
};

// ─── Database row / payload type aliases ─────────────────────────────────────
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

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
    const userId = await requireUser();

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
    const userId = await requireUser();

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
    const userId = await requireUser();
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
    const userId = await requireUser();

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
    const userId = await requireUser();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;

    // Ensure the required proxy category exists for this user before setting budget
    // This resolves foreign key violation where the proxy category hasn't been created yet for new users
    const { data: categoryData, error: categoryCheckError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', VARIABLE_CATEGORY_ID)
        .eq('user_id', userId)
        .maybeSingle();

    if (categoryCheckError) {
        throw new Error(`Failed to check budget category: ${categoryCheckError.message}`);
    }

    if (!categoryData) {
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
            .insert(categoryPayload);

        if (categoryError && categoryError.code !== '23505') { // Ignore unique violation if racing
            throw new Error(`Failed to create default variable category: ${categoryError.message}`);
        }
    }

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
    const userId = await requireUser();

    const payload: TransactionInsert = {
        id: crypto.randomUUID(),
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
    const userId = await requireUser();

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
    const userId = await requireUser();

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // RLS check

    if (error) {
        throw new Error(`Failed to delete transaction: ${error.message}`);
    }
};

/**
 * Create a new category
 */
export const createCategory = async (
    category: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Category> => {
    const userId = await requireUser();

    const payload: CategoryInsert = {
        id: crypto.randomUUID(),
        name: category.name,
        type: category.type,
        icon: category.icon || null,
        color: category.color || null,
        user_id: userId,
    };

    const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create category: ${error.message}`);
    }

    return mapCategory(data);
};

/**
 * Update an existing category
 */
export const updateCategory = async (
    id: string,
    updates: Partial<Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Category> => {
    const userId = await requireUser();

    const updateData: CategoryUpdate = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.icon !== undefined) updateData.icon = updates.icon || null;
    if (updates.color !== undefined) updateData.color = updates.color || null;

    const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update category: ${error.message}`);
    }

    return mapCategory(data);
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
    const userId = await requireUser();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        throw new Error(`Failed to delete category: ${error.message}`);
    }
}

/**
 * Bulk create transactions
 */
export const createMultipleTransactions = async (
    transactions: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]
): Promise<Transaction[]> => {
    const userId = await requireUser();

    const payloads: TransactionInsert[] = transactions.map(tx => ({
        id: crypto.randomUUID(),
        user_id: userId,
        amount: tx.amount,
        date: tx.date,
        description: tx.description,
        category_id: tx.categoryId,
        type: tx.type,
        is_paid: tx.isPaid,
    }));

    const { data, error } = await supabase
        .from('transactions')
        .insert(payloads)
        .select();

    if (error) {
        throw new Error(`Failed to create multiple transactions: ${error.message}`);
    }

    return (data || []).map(mapTransaction);
};

/**
 * Bulk delete transactions for a specific month and type
 */
export const deleteTransactionsByMonthAndType = async (
    date: Date,
    type: Transaction['type']
): Promise<void> => {
    const userId = await requireUser();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId)
        .eq('type', type)
        .gte('date', startDate)
        .lt('date', endDate);

    if (error) {
        throw new Error(`Failed to delete transactions: ${error.message}`);
    }
};;
