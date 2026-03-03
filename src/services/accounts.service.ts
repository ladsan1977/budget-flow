import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { Account } from '../types';
import { requireUser, handleSupabaseError } from './base';
import { mapAccount } from './mappers';

type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * Fetch all accounts for the current user
 */
export const fetchAccounts = async (): Promise<Account[]> => {
    const userId = await requireUser();

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

    if (error) {
        handleSupabaseError(error, 'Failed to fetch accounts');
    }

    return (data || []).map(mapAccount);
};

/**
 * Create a new account (e.g., "Main Bank" or "Cash")
 */
export const createAccount = async (
    account: Omit<Account, 'id' | 'userId' | 'createdAt'>
): Promise<Account> => {
    const userId = await requireUser();

    const payload: AccountInsert = {
        id: crypto.randomUUID(), // Manually generating ID to be consistent with your other services
        name: account.name,
        type: account.type,
        user_id: userId,
    };

    const { data, error } = await supabase
        .from('accounts')
        .insert(payload)
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to create account');
    }

    return mapAccount(data!);
};

/**
 * Update an existing account name or type
 */
export const updateAccount = async (
    id: string,
    updates: Partial<Omit<Account, 'id' | 'userId' | 'createdAt'>>
): Promise<Account> => {
    const userId = await requireUser();

    const updateData: AccountUpdate = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;

    const { data, error } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId) // Ownership check
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to update account');
    }

    return mapAccount(data!);
};

/**
 * Delete an account
 * Note: Will fail if the account has transactions (Foreign Key Constraint)
 */
export const deleteAccount = async (id: string): Promise<void> => {
    const userId = await requireUser();

    const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        // Code 23503: Foreign Key Violation (PostgreSQL)
        if (error.code === '23503') {
            throw new Error('No se puede eliminar la cuenta porque tiene movimientos registrados.');
        }
        handleSupabaseError(error, 'Failed to delete account');
    }
};
