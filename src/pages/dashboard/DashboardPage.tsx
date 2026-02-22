
import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useTransactionsByMonth } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { DashboardSkeleton } from '../../components/ui/DashboardSkeleton';
import { formatCurrency, cn } from '../../lib/utils';
import { Wallet, CreditCard, ShoppingCart, DollarSign } from 'lucide-react';
import { useDate } from '../../context/DateContext';
import { useMemo } from 'react';
import type { CategoryBreakdown } from '../../types';
import { VariableBreakdownCard } from './VariableBreakdownCard';
import { StatCard } from '../../components/dashboard/StatCard';
import { MonthSelector } from '../../components/common/MonthSelector';

export default function DashboardPage() {
    const navigate = useNavigate();
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

        // Phase 2: resolve category metadata and build the final array.
        // If no budget limit is set, fall back to total variable spending so bars
        // are shown relative to each other rather than all rendering at 0%.
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

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <QueryErrorFallback error={error} resetErrorBoundary={refetch} />;
    }

    if (!stats) {
        return null;
    }

    // Calculate color based on percentage
    const gaugeColor = stats.variableBudgetPercent > 80
        ? 'text-brand-danger'
        : stats.variableBudgetPercent > 50
            ? 'text-brand-warning'
            : 'text-brand-success';

    const gaugeStroke = stats.variableBudgetPercent > 80
        ? '#F43F5E' // brand-danger
        : stats.variableBudgetPercent > 50
            ? '#F59E0B' // brand-warning
            : '#10B981'; // brand-success

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-y-6 md:gap-4 lg:gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 order-1 sticky top-16 md:top-0 z-20 -m-4 sm:-m-6 p-4 sm:p-6 pb-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 md:static md:m-0 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 hidden md:block">
                            Overview for {monthName} {year}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate({ to: '/reports' })} variant="outline" className="shrink-0">
                            <span className="hidden sm:inline">Download Report</span>
                            <span className="sm:hidden">Report</span>
                        </Button>
                        <Button onClick={() => navigate({ to: '/transactions' })} className="shrink-0 hidden sm:inline-flex">
                            Add Transaction
                        </Button>
                    </div>
                </div>
                <div className="md:hidden flex justify-start w-full">
                    <MonthSelector />
                </div>
            </div>

            {/* Global Variable Goal - Main Feature */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-4 order-2 md:order-3 border-brand-primary/20 bg-gradient-to-br from-white to-slate-50 dark:from-brand-surface dark:to-slate-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Global Variable Goal</CardTitle>
                    </div>
                    <CardDescription>
                        Your spending limit for all extra expenses this month.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-center gap-8 py-8">

                    {/* Circular Gauge */}
                    <div className="relative h-48 w-48 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                className="text-slate-200 dark:text-slate-700"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                            {/* Progress Circle */}
                            <circle
                                className={cn("transition-all duration-1000 ease-out", gaugeColor)}
                                strokeWidth="8"
                                strokeLinecap="round"
                                stroke={gaugeStroke}
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                style={{
                                    strokeDasharray: `${2 * Math.PI * 40}`,
                                    strokeDashoffset: `${2 * Math.PI * 40 * (1 - Math.min(stats.variableBudgetPercent, 100) / 100)}`,
                                }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                {Math.round(stats.variableBudgetPercent)}%
                            </span>
                            <span className="text-xs text-slate-500 font-medium">CONSUMED</span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 text-center md:text-left min-w-[200px]">
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Total Budget Goal</div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(stats.variableBudgetLimit)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Remaining</div>
                            <div className="text-xl font-semibold text-brand-success">
                                {formatCurrency(stats.variableBudgetLimit - stats.totalVariableExpenses)}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 order-3 md:order-2 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Income"
                    amount={stats.totalIncome}
                    icon={Wallet}
                    iconColor="text-brand-success"
                    description="+20.1% from last month"
                />

                <StatCard
                    title="Fixed Expenses"
                    amount={stats.totalFixedExpenses}
                    icon={CreditCard}
                    iconColor="text-brand-primary"
                    description="Scheduled & Regular"
                />

                <StatCard
                    title="Variable Spent"
                    amount={stats.totalVariableExpenses}
                    icon={ShoppingCart}
                    iconColor="text-brand-warning"
                    description={`${(stats.variableBudgetPercent).toFixed(1)}% of budget`}
                />

                <StatCard
                    title="Net Cash Flow"
                    amount={stats.netFlow}
                    icon={DollarSign}
                    iconColor="text-slate-500"
                    amountColor={stats.netFlow >= 0 ? 'text-brand-success' : 'text-brand-danger'}
                    description="Income - (Fixed + Variable)"
                />
            </div>

            <VariableBreakdownCard
                breakdown={variableBreakdown}
                className="col-span-1 md:col-span-2 lg:col-span-3 order-4"
            />
        </div>
    );
}
