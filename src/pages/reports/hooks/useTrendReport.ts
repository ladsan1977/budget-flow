import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { useDate } from '../../../context/DateContext';
import { fetchTransactionsByMonth } from '../../../services/transactions.service';
import type { Transaction, MonthStat } from '../../../types';

const SHORT_MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Pure function — no side-effects, fully testable.
 * Derives a MonthStat from a flat array of transactions for one month.
 */
export function computeMonthStat(
    txs: Transaction[],
    label: string,
    monthKey: string
): MonthStat {
    let income = 0;
    let fixedExpenses = 0;
    let variableExpenses = 0;

    for (const tx of txs) {
        if (tx.type === 'income') {
            income += tx.amount;
        } else if (tx.type === 'expense') {
            if (tx.expenseNature === 'fixed') fixedExpenses += tx.amount;
            else if (tx.expenseNature === 'variable') variableExpenses += tx.amount;
        }
    }

    return {
        month: label,
        monthKey,
        income,
        fixedExpenses,
        variableExpenses,
        netFlow: income - fixedExpenses - variableExpenses,
    };
}

/**
 * Fetches and aggregates MonthStat data for the last `monthCount` months.
 *
 * Pattern mirrors useDashboardLogic: parallel useQueries → client-side transform.
 * Each month maps to one cache entry keyed by [year, month] so results are
 * automatically shared with the dashboard queries when months overlap.
 */
export function useTrendReport(monthCount: number = 6) {
    const { currentDate } = useDate();
    const { user } = useAuth();

    // Build array of Dates for the last `monthCount` months (oldest → newest)
    const monthDates = useMemo(() => {
        return Array.from({ length: monthCount }, (_, i) => {
            const offset = monthCount - 1 - i; // so index 0 = oldest
            return new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);
        });
    }, [currentDate, monthCount]);

    // Parallel fetch — one query per month, reuses existing TanStack Query cache
    const results = useQueries({
        queries: monthDates.map((date) => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            return {
                queryKey: ['transactions', 'by-month', year, month, undefined, undefined, user?.id],
                queryFn: () => fetchTransactionsByMonth(date),
                enabled: !!user,
                staleTime: 5 * 60 * 1000, // 5 minutes — longer for historical months
            };
        }),
    });

    const isLoading = results.some((r) => r.isLoading);
    const error = results.find((r) => r.error)?.error ?? null;

    const data = useMemo<MonthStat[]>(() => {
        if (isLoading) return [];
        return monthDates.map((date, i) => {
            const txs = results[i].data ?? [];
            const label = SHORT_MONTH_LABELS[date.getMonth()];
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return computeMonthStat(txs, label, monthKey);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, monthDates]);

    // 6-month aggregate totals for the summary cards
    const totals = useMemo(() => {
        return data.reduce(
            (acc, stat) => ({
                income: acc.income + stat.income,
                expenses: acc.expenses + stat.fixedExpenses + stat.variableExpenses,
                netFlow: acc.netFlow + stat.netFlow,
            }),
            { income: 0, expenses: 0, netFlow: 0 }
        );
    }, [data]);

    return { data, totals, isLoading, error };
}
