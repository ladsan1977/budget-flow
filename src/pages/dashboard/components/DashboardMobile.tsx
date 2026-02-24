import { useNavigate } from '@tanstack/react-router';
import { Button } from '../../../components/ui/Button';
import { Wallet, CreditCard, ShoppingCart, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { formatCurrency, cn } from '../../../lib/utils';
import { VariableBreakdownCard } from './VariableBreakdownCard';
import { StatCard } from '../../../components/dashboard/StatCard';
import { BudgetGauge } from './BudgetGauge';
import { MonthSelector } from '../../../components/common/MonthSelector';
import type { useDashboardLogic } from '../hooks/useDashboardLogic';

type LogicData = ReturnType<typeof useDashboardLogic>;
interface DashboardMobileProps {
    stats: NonNullable<LogicData['stats']>;
    variableBreakdown: LogicData['variableBreakdown'];
    overallBudgetUsagePercentage: LogicData['overallBudgetUsagePercentage'];
    gaugeColor: LogicData['gaugeColor'];
    gaugeStroke: LogicData['gaugeStroke'];
    monthName: LogicData['monthName'];
    year: LogicData['year'];
}

export function DashboardMobile({
    stats,
    variableBreakdown,
    gaugeColor,
    gaugeStroke,
}: DashboardMobileProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="sticky top-16 z-20 -m-4 sm:-m-6 p-4 sm:p-6 pb-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Dashboard
                    </h1>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate({ to: '/reports' })} variant="outline" className="shrink-0">
                            Report
                        </Button>
                    </div>
                </div>
                <div className="flex justify-start w-full">
                    <MonthSelector />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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

            {/* Global Variable Goal */}
            <Card className="border-brand-primary/20 bg-gradient-to-br from-white to-slate-50 dark:from-brand-surface dark:to-slate-900 w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Global Variable Goal</CardTitle>
                    </div>
                    <CardDescription>
                        Your spending limit for all extra expenses this month.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-8 py-8">
                    <div className="relative h-48 w-48 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                            <circle
                                className="text-slate-200 dark:text-slate-700"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
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

                    <div className="space-y-4 text-center min-w-[200px]">
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

            {/* Net Cash Flow Gauge */}
            <BudgetGauge
                netFlow={stats.netFlow}
                totalIncome={stats.totalIncome}
                className="w-full"
            />

            {/* Variable Breakdown */}
            <VariableBreakdownCard
                breakdown={variableBreakdown}
                className="w-full"
            />
        </div>
    );
}
