import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { Transaction } from '../types';
import { requireUser, handleSupabaseError, getMonthRange } from './base';
import { mapTransaction } from './mappers';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

/**
 * Fetch all transactions for the current user
 */
export const fetchTransactions = async (): Promise<Transaction[]> => {
    const userId = await requireUser();

    const { data, error } = await supabase
        .from('transactions')
        .select('*, account:accounts!account_id(*), toAccount:accounts!to_account_id(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        handleSupabaseError(error, 'Failed to fetch transactions');
    }

    return (data || []).map(mapTransaction);
};

/**
 * Fetch transactions filtered by month and type
 */
export const fetchTransactionsByMonth = async (
    date: Date,
    type?: Transaction['type'],
    expenseNature?: Transaction['expenseNature']
): Promise<Transaction[]> => {
    const userId = await requireUser();
    const { startDate, endDate } = getMonthRange(date);

    let query = supabase
        .from('transactions')
        .select('*, account:accounts!account_id(*), toAccount:accounts!to_account_id(*)')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lt('date', endDate);

    if (type) {
        query = query.eq('type', type);
    }
    if (expenseNature) {
        query = query.eq('expense_nature', expenseNature);
    }

    const { data, error } = await query
        .order('date', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        handleSupabaseError(error, 'Failed to fetch transactions');
    }

    return (data || []).map(mapTransaction);
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
        category_id: transaction.categoryId || null,
        account_id: transaction.accountId,
        to_account_id: transaction.toAccountId || null,
        type: transaction.type,
        expense_nature: transaction.expenseNature || null,
        is_paid: transaction.isPaid,
    };

    const { data, error } = await supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to create transaction');
    }

    return mapTransaction(data!);
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Transaction> => {
    const userId = await requireUser();

    // Mapping camelCase (UI) to snake_case (DB)
    const updateData: TransactionUpdate = {};
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.accountId !== undefined) updateData.account_id = updates.accountId;
    if (updates.toAccountId !== undefined) updateData.to_account_id = updates.toAccountId;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.expenseNature !== undefined) updateData.expense_nature = updates.expenseNature;
    if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;

    const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to update transaction');
    }

    return mapTransaction(data!);
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
        .eq('user_id', userId);

    if (error) {
        handleSupabaseError(error, 'Failed to delete transaction');
    }
};

/**
 * Bulk create transactions (Used for replicating Fixed Expenses)
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
        category_id: tx.categoryId || null,
        account_id: tx.accountId,
        to_account_id: tx.toAccountId || null,
        type: tx.type,
        expense_nature: tx.expenseNature || null,
        is_paid: tx.isPaid,
    }));

    const { data, error } = await supabase
        .from('transactions')
        .insert(payloads)
        .select();

    if (error) {
        handleSupabaseError(error, 'Failed to create multiple transactions');
    }

    return (data || []).map(mapTransaction);
};

export const deleteTransactionsByMonthAndType = async (
    date: Date,
    type: Transaction['type'],
    expenseNature?: Transaction['expenseNature']
): Promise<void> => {
    const userId = await requireUser();
    const { startDate, endDate } = getMonthRange(date);

    let query = supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId)
        .eq('type', type)
        .gte('date', startDate)
        .lt('date', endDate);

    if (expenseNature) {
        query = query.eq('expense_nature', expenseNature);
    }

    const { error } = await query;

    if (error) {
        handleSupabaseError(error, 'Failed to delete transactions');
    }
};
