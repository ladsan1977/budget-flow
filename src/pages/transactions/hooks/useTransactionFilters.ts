import { useState, useMemo } from 'react';
import { Route } from '../../../routes/transactions';
import type { Transaction, TransactionType } from '../../../types';

export type FilterStatus = 'all' | 'paid' | 'pending';
export type FilterType = TransactionType | 'all';
export type FilterExpenseNature = 'all' | 'fixed' | 'variable';

export interface TransactionFiltersState {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterType: FilterType;
    setFilterType: (type: FilterType) => void;
    filterStatus: FilterStatus;
    setFilterStatus: (status: FilterStatus) => void;
    filterExpenseNature: FilterExpenseNature;
    setFilterExpenseNature: (nature: FilterExpenseNature) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export function useTransactionFilters(sortedTransactions: Transaction[]) {
    const { type: initialType, expenseNature: initialExpenseNature } = Route.useSearch();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<FilterType>(initialType ?? 'all');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [filterExpenseNature, setFilterExpenseNature] = useState<FilterExpenseNature>(initialExpenseNature ?? 'all');

    const hasActiveFilters = searchQuery.trim() !== '' || filterType !== 'all' || filterStatus !== 'all' || filterExpenseNature !== 'all';

    const clearFilters = () => {
        setSearchQuery('');
        setFilterType('all');
        setFilterStatus('all');
        setFilterExpenseNature('all');
    };

    const filteredTransactions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return sortedTransactions.filter((tx) => {
            // --- Search: description OR date ---
            if (query) {
                const matchesDescription = tx.description?.toLowerCase().includes(query) ?? false;
                const matchesDate = tx.date.toLowerCase().includes(query);
                if (!matchesDescription && !matchesDate) return false;
            }

            // --- Filter: Type ---
            if (filterType !== 'all' && tx.type !== filterType) return false;

            // --- Filter: Status ---
            if (filterStatus === 'paid' && !tx.isPaid) return false;
            if (filterStatus === 'pending' && tx.isPaid) return false;

            // --- Filter: Expense Nature ---
            if (filterExpenseNature !== 'all' && tx.type === 'expense') {
                if (tx.expenseNature !== filterExpenseNature) return false;
            }

            return true;
        });
    }, [sortedTransactions, searchQuery, filterType, filterStatus, filterExpenseNature]);

    const filtersState: TransactionFiltersState = {
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterStatus,
        setFilterStatus,
        filterExpenseNature,
        setFilterExpenseNature,
        clearFilters,
        hasActiveFilters,
    };

    return {
        filteredTransactions,
        filtersState,
    };
}
