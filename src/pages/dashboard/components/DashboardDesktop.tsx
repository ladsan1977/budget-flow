import { useNavigate } from '@tanstack/react-router';
import { Button } from '../../../components/ui/Button';
import { Wallet, CreditCard, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { formatCurrency, cn } from '../../../lib/utils';
import { VariableBreakdownCard } from './VariableBreakdownCard';
import { StatCard } from '../../../components/dashboard/StatCard';
import { FlowCompositionCard } from './FlowCompositionCard';
import { ExpensesGaugeCard } from './ExpensesGaugeCard';
import type { useDashboardLogic } from '../hooks/useDashboardLogic';

type LogicData = ReturnType<typeof useDashboardLogic>;
interface DashboardDesktopProps {
    stats: NonNullable<LogicData['stats']>;
    variableBreakdown: LogicData['variableBreakdown'];
    overallBudgetUsagePercentage: LogicData['overallBudgetUsagePercentage'];
    gaugeColor: LogicData['gaugeColor'];
    gaugeStroke: LogicData['gaugeStroke'];
    flowComposition: LogicData['flowComposition'];
    monthName: LogicData['monthName'];
    year: LogicData['year'];
}

export function DashboardDesktop({
    stats,
    variableBreakdown,
    gaugeColor,
    gaugeStroke,
    flowComposition,
    monthName,
    year,
}: DashboardDesktopProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Overview for {monthName} {year}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate({ to: '/reports' })} variant="outline" className="shrink-0">
                        Download Report
                    </Button>
                    <Button onClick={() => navigate({ to: '/transactions' })} className="shrink-0">
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Total Income"
                    amount={stats.totalIncome}
                    icon={Wallet}
                    iconColor="text-brand-success"
                    description="+20.1% from last month"
                    className="border-brand-success/50 dark:border-brand-success/40"
                />
                <StatCard
                    title="Fixed Expenses"
                    amount={stats.totalFixedExpenses}
                    icon={CreditCard}
                    iconColor="text-brand-primary"
                    description="Scheduled & Regular"
                    className="border-brand-danger/50 dark:border-brand-danger/40"
                />
                <StatCard
                    title="Daily Budget"
                    amount={stats.totalVariableExpenses}
                    icon={ShoppingCart}
                    iconColor="text-brand-warning"
                    description={`${(stats.variableBudgetPercent).toFixed(1)}% of budget`}
                    className="border-brand-danger/50 dark:border-brand-danger/40"
                />
                <StatCard
                    title="Current Net Flow"
                    amount={stats.actualNetFlow}
                    icon={DollarSign}
                    iconColor="text-slate-500"
                    amountColor={stats.actualNetFlow >= 0 ? 'text-brand-success' : 'text-brand-danger'}
                    description="Income - Paid Expenses"
                    className="border-brand-primary/50 dark:border-brand-primary/40"
                />
                <StatCard
                    title="Projected Flow"
                    amount={stats.projectedNetFlow}
                    icon={TrendingUp}
                    iconColor="text-slate-500"
                    amountColor={stats.projectedNetFlow >= 0 ? 'text-brand-success' : 'text-brand-danger'}
                    description="Income - Expenses"
                    className="border-brand-primary/50 dark:border-brand-primary/40"
                />
            </div>

            {/* Split Composition vs Future Feature */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Flow Composition */}
                <FlowCompositionCard {...flowComposition} />

                {/* Right Column: Expenses Split Gauge */}
                <ExpensesGaugeCard
                    totalFixed={stats.totalFixedExpenses}
                    totalVariable={stats.totalVariableExpenses}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Monthly Spending Goal */}
                <Card className="border-brand-primary/20 bg-gradient-to-br from-white to-slate-50 dark:from-brand-surface dark:to-slate-900 col-span-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Monthly Spending Goal</CardTitle>
                        </div>
                        <CardDescription>
                            Your spending limit for all extra expenses this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row items-center justify-center gap-8 py-8">
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

                        <div className="space-y-4 text-left min-w-[200px]">
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

                {/* Variable Breakdown */}
                <div className="w-full">
                    <VariableBreakdownCard
                        breakdown={variableBreakdown}
                        className="w-full"
                    />
                </div>
            </div>


        </div>
    );
}
