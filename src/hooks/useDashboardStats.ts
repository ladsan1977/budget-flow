import { useQueries } from '@tanstack/react-query';
import { fetchTransactionsByMonth, fetchBudgets } from '../services/supabaseData';
import { VARIABLE_CATEGORY_ID } from '../lib/constants';
import type { DashboardStats } from '../types';
import type { Transaction, BudgetGoal } from '../types';
import { useAuth } from '../context/AuthContext';

/**
 * Computes DashboardStats from raw query data entirely on the client.
 * Called via the TanStack Query `select` option so the transform runs
 * whenever the cache changes — no extra network request required.
 */
function computeStats(
    transactions: Transaction[],
    budgets: BudgetGoal[]
): DashboardStats {
    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalFixedExpenses = transactions
        .filter(tx => tx.type === 'fixed')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalVariableExpenses = transactions
        .filter(tx => tx.type === 'variable')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const netFlow = totalIncome - totalFixedExpenses - totalVariableExpenses;

    const variableBudgetLimit =
        budgets.find(b => b.categoryId === VARIABLE_CATEGORY_ID)?.amount ?? 0;

    const variableBudgetPercent =
        variableBudgetLimit > 0
            ? (totalVariableExpenses / variableBudgetLimit) * 100
            : 0;

    return {
        totalIncome,
        totalFixedExpenses,
        totalVariableExpenses,
        netFlow,
        variableBudgetLimit,
        variableBudgetPercent,
    };
}

/**
 * Fetches transactions-by-month and budgets in parallel, then derives
 * DashboardStats on the client so the UI updates instantly on cache changes.
 */
export function useDashboardStats(currentDate: Date) {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const { user } = useAuth();

    const [txQuery, budgetQuery] = useQueries({
        queries: [
            {
                queryKey: ['transactions', 'by-month', year, month, undefined, user?.id],
                queryFn: () => fetchTransactionsByMonth(currentDate),
                enabled: !!user,
                staleTime: 1 * 60 * 1000, // 1 minute
            },
            {
                queryKey: ['budgets', `${year}-${month - 1}`, user?.id], // matches useBudgets key
                queryFn: () => fetchBudgets(currentDate),
                enabled: !!user,
                staleTime: 5 * 60 * 1000, // 5 minutes
            },
        ],
    });

    const isLoading = txQuery.isLoading || budgetQuery.isLoading;
    const error = txQuery.error ?? budgetQuery.error;

    const data =
        txQuery.data && budgetQuery.data
            ? computeStats(txQuery.data, budgetQuery.data)
            : undefined;

    return {
        data,
        isLoading,
        error,
        refetch: () => {
            txQuery.refetch();
            budgetQuery.refetch();
        },
    };
}
