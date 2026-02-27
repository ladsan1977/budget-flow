import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { useTransactionsByMonth } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useDate } from '../../../context/DateContext';
import { useAuth } from '../../../context/AuthContext';
import { fetchTransactionsByMonth } from '../../../services/transactions.service';
import { supabase } from '../../../lib/supabase';
import type { CategoryBreakdown, Transaction } from '../../../types';

export function useDashboardLogic() {
    const { currentDate, monthName, year } = useDate();
    const { user } = useAuth();

    const { data: stats, isLoading, error, refetch } = useDashboardStats(currentDate);
    const { data: variableTransactions = [] } = useTransactionsByMonth('variable');
    const { data: categories = [] } = useCategories();

    // Check if user has ANY transactions across all months (not just current).
    // Used to distinguish a brand-new user (show full onboarding) from a user
    // who navigated to a future/empty month (show lighter empty state).
    const { data: hasAnyTransactions = false } = useQuery<boolean, Error>({
        queryKey: ['transactions', 'any-exists', user?.id],
        queryFn: async () => {
            const { count } = await supabase
                .from('transactions')
                .select('id', { count: 'exact', head: true })
                .limit(1);
            return (count ?? 0) > 0;
        },
        enabled: !!user,
        staleTime: 5 * 60 * 1000,
    });

    const prevMonthDate = useMemo(() => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    }, [currentDate]);

    const { data: prevMonthIncomeTxs = [] } = useQuery<Transaction[], Error>({
        queryKey: ['transactions', 'by-month', prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 'income', user?.id],
        queryFn: () => fetchTransactionsByMonth(prevMonthDate, 'income'),
        enabled: !!user,
        staleTime: 1 * 60 * 1000,
    });

    const incomeMomChange = useMemo(() => {
        if (!stats) return null;
        const prevMonthTotalIncome = prevMonthIncomeTxs.reduce((sum, tx) => sum + tx.amount, 0);

        if (prevMonthTotalIncome === 0) {
            return stats.totalIncome > 0 ? 100 : 0;
        }
        const diff = stats.totalIncome - prevMonthTotalIncome;
        return (diff / prevMonthTotalIncome) * 100;
    }, [stats, prevMonthIncomeTxs]);

    /**
     * Groups variable transactions by categoryId using a Map for O(n) performance,
     * then sorts descending by totalAmount so highest spending appears first.
     */
    const variableBreakdown = useMemo((): CategoryBreakdown[] => {
        if (!variableTransactions.length || !stats) return [];

        const budgetLimit = stats.variableBudgetLimit;

        // Phase 1: accumulate totals per category with a Map — O(n)
        const totalsMap = new Map<string, { totalAmount: number; firstDescription: string }>();
        for (const tx of variableTransactions) {
            const key = tx.categoryId ?? '__uncategorized__';
            const existing = totalsMap.get(key);
            if (existing) {
                existing.totalAmount += tx.amount;
            } else {
                totalsMap.set(key, { totalAmount: tx.amount, firstDescription: tx.description });
            }
        }

        const denominator = budgetLimit > 0 ? budgetLimit : stats.totalVariableExpenses;
        const breakdown: CategoryBreakdown[] = [];
        for (const [key, { totalAmount, firstDescription }] of totalsMap) {
            const category = categories.find(c => c.id === key);
            breakdown.push({
                categoryId: key,
                name: category?.name ?? firstDescription ?? 'Uncategorized',
                color: category?.color,
                totalAmount,
                percentOfBudget: denominator > 0 ? (totalAmount / denominator) * 100 : 0,
            });
        }

        // Phase 3: sort descending by spending amount
        return breakdown.sort((a, b) => b.totalAmount - a.totalAmount);
    }, [variableTransactions, categories, stats]);

    // Calculate a "Budget Usage Percentage" for the overall monthly budget.
    // We can define this as total expenses (fixed + variable) / total income.
    const overallBudgetUsagePercentage = useMemo(() => {
        if (!stats) return 0;
        const totalExpenses = stats.totalFixedExpenses + stats.totalVariableExpenses;
        if (stats.totalIncome > 0) {
            return (totalExpenses / stats.totalIncome) * 100;
        }
        return 0;
    }, [stats]);

    const gaugeColor = useMemo(() => {
        if (!stats) return 'text-brand-success';
        return stats.variableBudgetPercent > 80
            ? 'text-brand-danger'
            : stats.variableBudgetPercent > 50
                ? 'text-brand-warning'
                : 'text-brand-success';
    }, [stats]);

    const gaugeStroke = useMemo(() => {
        if (!stats) return '#10B981'; // brand-success
        return stats.variableBudgetPercent > 80
            ? '#F43F5E' // brand-danger
            : stats.variableBudgetPercent > 50
                ? '#F59E0B' // brand-warning
                : '#10B981';
    }, [stats]);

    const flowComposition = useMemo(() => {
        if (!stats) {
            return {
                totalIncome: 0,
                paidFixed: 0,
                pendingFixed: 0,
                paidVariable: 0,
                pendingVariable: 0,
            };
        }
        return {
            totalIncome: stats.totalIncome ?? 0,
            paidFixed: stats.paidFixedExpenses ?? 0,
            pendingFixed: stats.pendingFixedExpenses ?? 0,
            paidVariable: stats.paidVariableExpenses ?? 0,
            pendingVariable: stats.pendingVariableExpenses ?? 0,
        };
    }, [stats]);

    const isEmptyState = stats?.totalTransactions === 0;
    // True only when this is a genuine first-time user with no data anywhere.
    const isFirstTimeUser = isEmptyState && !hasAnyTransactions;

    return {
        stats,
        isEmptyState,
        isFirstTimeUser,
        incomeMomChange,
        variableBreakdown,
        overallBudgetUsagePercentage,
        gaugeColor,
        gaugeStroke,
        flowComposition,
        isLoading,
        error,
        refetch,
        monthName,
        year
    };
}
