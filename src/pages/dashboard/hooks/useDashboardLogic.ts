import { useMemo } from 'react';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import { useTransactionsByMonth } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useDate } from '../../../context/DateContext';
import type { CategoryBreakdown } from '../../../types';

export function useDashboardLogic() {
    const { currentDate, monthName, year } = useDate();

    const { data: stats, isLoading, error, refetch } = useDashboardStats(currentDate);
    const { data: variableTransactions = [] } = useTransactionsByMonth('variable');
    const { data: categories = [] } = useCategories();

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

    return {
        stats,
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
