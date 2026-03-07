import { Wallet, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { StatCard } from '../../../components/dashboard/StatCard';
import type { MonthStat } from '../../../types';

interface TrendSummaryCardsProps {
    totals: {
        income: number;
        expenses: number;
        netFlow: number;
    };
    monthCount: number;
    /** MonthStat[] used to derive avg values */
    data: MonthStat[];
}

/**
 * A row of three summary StatCards derived from the multi-month trend data.
 * Shows period totals and average net flow — giving instant at-a-glance context
 * above the chart.
 */
export function TrendSummaryCards({ totals, monthCount, data }: TrendSummaryCardsProps) {
    const activeMonths = data.filter(
        (d) => d.income > 0 || d.fixedExpenses > 0 || d.variableExpenses > 0
    ).length;

    const avgNetFlow = activeMonths > 0 ? totals.netFlow / activeMonths : 0;

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <StatCard
                title={`Total Income (${monthCount}M)`}
                amount={totals.income}
                icon={Wallet}
                iconColor="text-brand-success"
                description="All income sources across the period"
                className="border-brand-success/40"
            />
            <StatCard
                title={`Total Expenses (${monthCount}M)`}
                amount={totals.expenses}
                icon={BarChart2}
                iconColor="text-brand-primary"
                description="Fixed + variable across the period"
                className="border-brand-danger/40"
            />
            <StatCard
                title="Avg. Monthly Net Flow"
                amount={avgNetFlow}
                icon={avgNetFlow >= 0 ? TrendingUp : TrendingDown}
                iconColor={avgNetFlow >= 0 ? 'text-brand-success' : 'text-brand-danger'}
                amountColor={avgNetFlow >= 0 ? 'text-brand-success' : 'text-brand-danger'}
                description="Average net per active month"
                className="border-brand-primary/40"
            />
        </div>
    );
}
