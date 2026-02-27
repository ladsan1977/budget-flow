import { useState, useMemo } from 'react';
import { useTransactionsByMonth } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useDeleteTransaction, useUpdateTransaction } from '../../../hooks/useTransactionMutations';
import type { Transaction, TransactionType } from '../../../types';

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
            // Priority 1: Type (income -> fixed expenses -> variable expenses)
            const typeOrder: Record<TransactionType, number> = { income: 0, fixed: 1, variable: 2 };
            const typeDiff = typeOrder[a.type] - typeOrder[b.type];
            if (typeDiff !== 0) {
                return typeDiff;
            }

            // Priority 2: Date ascending
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            const dateDiff = dateA - dateB;
            if (dateDiff !== 0) return dateDiff;

            // Priority 3: Stable sort by ID
            return a.id.localeCompare(b.id);
        });
    }, [transactions]);

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
            transactions: sortedTransactions,
            categories
        },
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
