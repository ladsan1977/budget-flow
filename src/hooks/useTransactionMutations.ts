import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction, updateTransaction, deleteTransaction, createMultipleTransactions, deleteTransactionsByMonthAndType } from '../services/transactions.service';
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

export function useBulkCreateTransactions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactions: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]) =>
            createMultipleTransactions(transactions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Transactions cloned successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to clone transactions:', error);
            toast.error(`Failed to clone transactions: ${error.message}`);
        },
    });
}

export function useBulkDeleteTransactions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ date, type }: { date: Date; type: Transaction['type'] }) =>
            deleteTransactionsByMonthAndType(date, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
        onError: (error: Error) => {
            console.error('Failed to delete existing transactions for cloning:', error);
            toast.error(`Failed to clear previous records: ${error.message}`);
        },
    });
}
