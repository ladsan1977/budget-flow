import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
} from '../services/accounts.service';
import type { Account } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

/**
 * Hook to fetch all accounts for the current user.
 */
export function useAccounts() {
    const { user } = useAuth();

    return useQuery<Account[], Error>({
        queryKey: ['accounts', user?.id],
        queryFn: fetchAccounts,
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes cache
    });
}

/**
 * Hook providing mutations for account management.
 */
export function useAccountMutations() {
    const queryClient = useQueryClient();

    const createAccountMutation = useMutation({
        mutationFn: (account: Omit<Account, 'id' | 'userId' | 'createdAt'>) =>
            createAccount(account),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account created successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to create account:', error);
            toast.error(error.message || 'Failed to create account');
        },
    });

    const updateAccountMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Account, 'id' | 'userId' | 'createdAt'>> }) =>
            updateAccount(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account updated successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to update account:', error);
            toast.error(error.message || 'Failed to update account');
        },
    });

    const deleteAccountMutation = useMutation({
        mutationFn: (id: string) => deleteAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            toast.success('Account deleted successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to delete account:', error);
            toast.error(error.message || 'Failed to delete account');
        },
    });

    return {
        createAccountMutation,
        updateAccountMutation,
        deleteAccountMutation,
    };
}
