import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction, updateTransaction, deleteTransaction } from '../services/supabaseData';
import type { Transaction } from '../types';
import { toast } from 'sonner';

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
            createTransaction(transaction),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Transaction created successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to create transaction:', error);
            toast.error(`Failed to create transaction: ${error.message}`);
        },
    });
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
            updateTransaction(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Transaction updated successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to update transaction:', error);
            toast.error(`Failed to update transaction: ${error.message}`);
        },
    });
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Transaction deleted successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to delete transaction:', error);
            toast.error(`Failed to delete transaction: ${error.message}`);
        },
    });
}
