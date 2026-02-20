import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, fetchTransactionsByMonth } from '../services/supabaseData';
import type { Transaction } from '../types';
import { useDate } from '../context/DateContext';
import { useAuth } from '../context/AuthContext';

/**
 * Fetch all transactions for the current user
 */
export function useTransactions() {
    const { user } = useAuth();
    return useQuery<Transaction[], Error>({
        queryKey: ['transactions', user?.id],
        queryFn: fetchTransactions,
        enabled: !!user,
    });
}

/**
 * Fetch transactions filtered by month and optionally by type
 */
export function useTransactionsByMonth(type?: Transaction['type']) {
    const { currentDate } = useDate();
    const { user } = useAuth();
    const date = currentDate;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return useQuery<Transaction[], Error>({
        queryKey: ['transactions', 'by-month', year, month, type, user?.id],
        queryFn: () => fetchTransactionsByMonth(date, type),
        enabled: !!user,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
