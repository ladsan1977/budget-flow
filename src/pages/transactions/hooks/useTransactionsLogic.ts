import { useState, useMemo } from 'react';
import { useTransactionsByMonth } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useDeleteTransaction, useUpdateTransaction } from '../../../hooks/useTransactionMutations';
import { useTransactionFilters } from './useTransactionFilters';
import type { Transaction } from '../../../types';

export function useTransactionsLogic() {
    const { data: transactions = [], error, refetch, isPending: isQueryPending } = useTransactionsByMonth();
    const { data: categories = [] } = useCategories();
    const deleteMutation = useDeleteTransaction();
    const updateMutation = useUpdateTransaction();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => {
            // 1. Date ascending
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) return dateA - dateB;

            // 2. Type ascending (income → expense → transfer)
            const typeOrder: Record<string, number> = { income: 0, expense: 1, transfer: 2 };
            const typeDiff = (typeOrder[a.type] ?? 3) - (typeOrder[b.type] ?? 3);
            if (typeDiff !== 0) return typeDiff;

            // 3. Amount descending
            if (b.amount !== a.amount) return b.amount - a.amount;

            // 5. Stable sort by ID
            return a.id.localeCompare(b.id);
        });
    }, [transactions]);

    const { filteredTransactions, filtersState } = useTransactionFilters(sortedTransactions);

    const confirmDeleteTransaction = () => {
        if (transactionToDelete) {
            deleteMutation.mutate(transactionToDelete);
            setTransactionToDelete(null);
        }
    };

    const togglePaidStatus = (id: string, currentStatus: boolean) => {
        updateMutation.mutate({
            id,
            updates: { isPaid: !currentStatus }
        });
    };

    const isPending = isQueryPending || deleteMutation.isPending || updateMutation.isPending;

    return {
        data: {
            transactions: filteredTransactions,
            categories
        },
        filters: filtersState,
        modals: {
            isAddModalOpen, setIsAddModalOpen,
            editingTransaction, setEditingTransaction,
            transactionToDelete, setTransactionToDelete
        },
        actions: {
            confirmDeleteTransaction,
            togglePaidStatus,
            refetch
        },
        queryState: {
            error,
            isPending
        }
    };
}

export type TransactionsLogicReturn = ReturnType<typeof useTransactionsLogic>;
