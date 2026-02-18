import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchTransactionsByMonth } from '../services/supabaseData';
import type { Transaction } from '../types';
import { useDate } from '../context/DateContext';

/**
 * Fetch all transactions for the current user
 */
export function useTransactions() {
    return useQuery<Transaction[], Error>({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    });
}

/**
 * Fetch transactions filtered by month and optionally by type
 */
export function useTransactionsByMonth(type?: Transaction['type']) {
    const { currentDate } = useDate();
    const date = currentDate;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return useQuery<Transaction[], Error>({
        queryKey: ['transactions', 'by-month', year, month, type],
        queryFn: () => fetchTransactionsByMonth(date, type),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
