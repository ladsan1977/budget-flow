import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTransactionsByMonth } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useDate } from '../../../context/DateContext';
import { useDeleteTransaction, useUpdateTransaction, useBulkCreateTransactions, useBulkDeleteTransactions } from '../../../hooks/useTransactionMutations';
import { shiftDateToTargetMonth } from '../../../lib/utils';
import { fetchTransactionsByMonth } from '../../../services/transactions.service';
import type { Transaction } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

export function useFixedExpensesLogic() {
    const { currentDate, monthName, year } = useDate();
    const { user } = useAuth();

    const { data: transactions = [], error, isLoading } = useTransactionsByMonth('fixed');
    const { data: categories = [] } = useCategories();

    const prevMonthDate = useMemo(() => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    }, [currentDate]);

    const { data: prevMonthTransactions = [] } = useQuery<Transaction[], Error>({
        queryKey: ['transactions', 'by-month', prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 'fixed', user?.id],
        queryFn: () => fetchTransactionsByMonth(prevMonthDate, 'fixed'),
        enabled: !!user,
        staleTime: 1 * 60 * 1000,
    });

    // Helper formatted string YYYY-MM
    const currentMonthStr = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    }, [currentDate]);

    // Mutations
    const deleteMutation = useDeleteTransaction();
    const updateMutation = useUpdateTransaction();
    const bulkCreateMutation = useBulkCreateTransactions();
    const bulkDeleteMutation = useBulkDeleteTransactions();

    // Modals and State
    const [isReplicateModalOpen, setIsReplicateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [draftTransactions, setDraftTransactions] = useState<Transaction[]>([]);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    // Derived State
    const currentMonthFixedExpenses = useMemo(() => {
        return transactions;
    }, [transactions]);

    const totalFixedAmount = useMemo(() => {
        return currentMonthFixedExpenses.reduce((sum, tx) => sum + tx.amount, 0);
    }, [currentMonthFixedExpenses]);

    const remainingToPay = useMemo(() => {
        return currentMonthFixedExpenses.filter(tx => !tx.isPaid).reduce((sum, tx) => sum + tx.amount, 0);
    }, [currentMonthFixedExpenses]);

    const completedCount = useMemo(() => {
        return currentMonthFixedExpenses.filter(tx => tx.isPaid).length;
    }, [currentMonthFixedExpenses]);

    const paidAmount = currentMonthFixedExpenses
        .filter(tx => tx.isPaid)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const paidPercentage = totalFixedAmount > 0
        ? (paidAmount / totalFixedAmount) * 100
        : 0;

    const pendingPercentage = totalFixedAmount > 0
        ? (remainingToPay / totalFixedAmount) * 100
        : 0;

    const prevMonthTotalFixedAmount = useMemo(() => {
        return prevMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    }, [prevMonthTransactions]);

    const monthOverMonthChange = useMemo(() => {
        if (prevMonthTotalFixedAmount === 0) {
            return totalFixedAmount > 0 ? 100 : 0;
        }
        const diff = totalFixedAmount - prevMonthTotalFixedAmount;
        return (diff / prevMonthTotalFixedAmount) * 100;
    }, [totalFixedAmount, prevMonthTotalFixedAmount]);

    const totalItems = currentMonthFixedExpenses.length;
    const pendingCount = totalItems - completedCount;

    const sourceMonthName = useMemo(() => {
        const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        return prevMonthDate.toLocaleString('default', { month: 'long' });
    }, [currentDate]);

    const isPending = bulkCreateMutation.isPending || bulkDeleteMutation.isPending || deleteMutation.isPending || updateMutation.isPending;

    // Handlers
    const handleReplicateClick = async () => {
        const [yearStr, monthStr] = currentMonthStr.split('-');
        const currentYear = Number(yearStr);
        const currentMonth = Number(monthStr);
        // To get the first day of the previous month safely:
        // prevMonthDate is already defined, but wait, here we used (currentMonth - 2), let's keep it as is.
        const prevMonthDateForReplicate = new Date(currentYear, currentMonth - 2, 1);

        try {
            const prevMonthTxs = await fetchTransactionsByMonth(prevMonthDateForReplicate, 'fixed');

            if (prevMonthTxs.length === 0) {
                setInfoMessage(`There are no fixed expenses registered for the previous month to clone.`);
                setIsInfoModalOpen(true);
                return;
            }

            // Create drafts
            const drafts = prevMonthTxs.map(tx => {
                const newDateStr = shiftDateToTargetMonth(tx.date, currentYear, currentMonth);
                return {
                    ...tx,
                    id: `replicated_${Date.now()}_${tx.id}`,
                    date: newDateStr,
                    isPaid: false,
                };
            });

            setDraftTransactions(drafts);
            setIsReplicateModalOpen(true);
        } catch (err) {
            setInfoMessage('Error loading previous month expenses: ' + (err as Error).message);
            setIsInfoModalOpen(true);
        }
    };

    const proceedWithReplication = async () => {
        setIsReplicateModalOpen(false);
        setIsConfirmModalOpen(false);

        if (currentMonthFixedExpenses.length > 0) {
            await bulkDeleteMutation.mutateAsync({ date: currentDate, type: 'fixed' });
        }

        const payloads = draftTransactions.map(tx => ({
            description: tx.description,
            amount: tx.amount,
            date: tx.date,
            categoryId: tx.categoryId,
            type: 'fixed' as const,
            isPaid: false,
        }));

        await bulkCreateMutation.mutateAsync(payloads);
        setDraftTransactions([]);
    };

    const handleConfirmReplication = () => {
        if (currentMonthFixedExpenses.length > 0) {
            setIsConfirmModalOpen(true);
        } else {
            proceedWithReplication();
        }
    };

    const togglePaidStatus = (id: string, currentStatus: boolean) => {
        updateMutation.mutate({
            id,
            updates: { isPaid: !currentStatus }
        });
    };

    const handleDraftChange = (id: string, field: keyof Transaction, value: Transaction[keyof Transaction]) => {
        setDraftTransactions(prev => prev.map(tx =>
            tx.id === id ? { ...tx, [field]: value } : tx
        ));
    };

    const removeDraft = (id: string) => {
        setDraftTransactions(prev => prev.filter(tx => tx.id !== id));
    };

    const confirmDeleteTransaction = () => {
        if (transactionToDelete) {
            deleteMutation.mutate(transactionToDelete);
            setTransactionToDelete(null);
        }
    };

    return {
        data: {
            currentDate,
            monthName,
            year,
            transactions: currentMonthFixedExpenses,
            categories,
            draftTransactions,
            sourceMonthName,
            targetMonthName: monthName
        },
        stats: {
            totalFixedAmount,
            paidAmount,
            paidPercentage,
            pendingPercentage,
            monthOverMonthChange,
            remainingToPay,
            completedCount,
            totalItems,
            pendingCount
        },
        modals: {
            isReplicateModalOpen, setIsReplicateModalOpen,
            isAddModalOpen, setIsAddModalOpen,
            editingTransaction, setEditingTransaction,
            isInfoModalOpen, setIsInfoModalOpen,
            isConfirmModalOpen, setIsConfirmModalOpen,
            transactionToDelete, setTransactionToDelete,
            infoMessage, setInfoMessage
        },
        actions: {
            handleReplicateClick,
            handleConfirmReplication,
            proceedWithReplication,
            togglePaidStatus,
            handleDraftChange,
            removeDraft,
            confirmDeleteTransaction
        },
        queryState: {
            error,
            isLoading,
            isPending
        }
    };
}

export type FixedExpensesLogicReturn = ReturnType<typeof useFixedExpensesLogic>;
