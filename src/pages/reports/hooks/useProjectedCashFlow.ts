import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { useDate } from '../../../context/DateContext';
import { fetchTransactionsByMonth } from '../../../services/transactions.service';

export interface DailyProjection {
    date: string;
    income: number;
    expenses: number;
    flow: number;
    projectedBalance: number;
}

/**
 * Hook to get projected cash flow day by day using real user data.
 */
export function useProjectedCashFlow() {
    const { currentDate } = useDate();
    const { user } = useAuth();

    // 1. Fetch transactions for the currently selected month
    const { data: monthTransactions = [], isLoading, error } = useQuery({
        queryKey: ['transactions', 'by-month', currentDate.getFullYear(), currentDate.getMonth() + 1, undefined, undefined, user?.id],
        queryFn: () => fetchTransactionsByMonth(currentDate),
        enabled: !!user,
    });

    // 3. Compute daily projections 
    const data = useMemo<DailyProjection[]>(() => {
        if (isLoading || !user) return [];

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Group transactions by day (1 to daysInMonth)
        const dailyTxs = new Map<number, { income: number; expenses: number }>();

        for (const tx of monthTransactions) {
            // Note: handle timezone shifts. If tx.date is YYYY-MM-DD, parsing directly 
            // as new Date('YYYY-MM-DD') shifts it to UTC which pushes day 1 to previous month's last day.
            let txDate: Date;
            if (tx.date.includes('T')) {
                txDate = new Date(tx.date);
            } else {
                const [y, m, d] = tx.date.split('-').map(Number);
                txDate = new Date(y, m - 1, d);
            }

            // Only aggregate if it actually matches the current queried month
            if (txDate.getMonth() === month && txDate.getFullYear() === year) {
                const day = txDate.getDate();
                const current = dailyTxs.get(day) || { income: 0, expenses: 0 };

                if (tx.type === 'income') {
                    current.income += tx.amount;
                } else if (tx.type === 'expense') {
                    current.expenses += tx.amount;
                }

                dailyTxs.set(day, current);
            }
        }

        const projections: DailyProjection[] = [];

        // Option A: Start the month from zero and accumulate flow progressively
        let accumulatedBalance = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`;
            const activity = dailyTxs.get(day) || { income: 0, expenses: 0 };

            // Apply the net flow of this specific day to our running tally
            const flow = activity.income - activity.expenses;
            accumulatedBalance += flow;

            projections.push({
                date: dateStr,
                income: activity.income,
                expenses: activity.expenses,
                flow,
                projectedBalance: accumulatedBalance
            });
        }

        return projections;
    }, [isLoading, user, currentDate, monthTransactions]);

    return { data, isLoading, error: error ?? null };
}
