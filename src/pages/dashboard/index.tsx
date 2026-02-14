
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { calculateDashboardStats, CATEGORIES } from '../../services/mockData';
import { formatCurrency, cn } from '../../lib/utils';
import { Wallet, CreditCard, ShoppingCart, DollarSign } from 'lucide-react';
import { useDate } from '../../context/DateContext';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { currentDate, monthName, year } = useDate();
    const stats = useMemo(() => calculateDashboardStats(currentDate), [currentDate]);

    // Calculate color based on percentage
    const gaugeColor = stats.variablePercentage > 100
        ? 'text-brand-danger'
        : stats.variablePercentage > 80
            ? 'text-brand-warning'
            : 'text-brand-success';

    const gaugeStroke = stats.variablePercentage > 100
        ? '#F43F5E' // brand-danger
        : stats.variablePercentage > 80
            ? '#F59E0B' // brand-warning
            : '#10B981'; // brand-success

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Overview for {monthName} {year}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Download Report</Button>
                    <Button onClick={() => navigate({ to: '/transactions' })}>Add Transaction</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <Wallet className="h-4 w-4 text-brand-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalIncome)}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fixed Expenses</CardTitle>
                        <CreditCard className="h-4 w-4 text-brand-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalFixed)}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Scheduled & Regular
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Variable Spent</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-brand-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalVariable)}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {(stats.variablePercentage).toFixed(1)}% of budget
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                        <DollarSign className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", stats.netCashFlow >= 0 ? 'text-brand-success' : 'text-brand-danger')}>
                            {formatCurrency(stats.netCashFlow)}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Income - (Fixed + Variable)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Global Variable Goal - Main Feature */}
                <Card className="col-span-4 lg:col-span-4 border-brand-primary/20 bg-gradient-to-br from-white to-slate-50 dark:from-brand-surface dark:to-slate-900">
                    <CardHeader>
                        <CardTitle>Global Variable Goal</CardTitle>
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
                                        strokeDashoffset: `${2 * Math.PI * 40 * (1 - Math.min(stats.variablePercentage, 100) / 100)}`,
                                    }}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {Math.round(stats.variablePercentage)}%
                                </span>
                                <span className="text-xs text-slate-500 font-medium">CONSUMED</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 text-center md:text-left">
                            <div>
                                <div className="text-sm text-slate-500 mb-1">Total Budget Goal</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {formatCurrency(stats.variableBudgetLimit)}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 mb-1">Remaining</div>
                                <div className="text-xl font-semibold text-brand-success">
                                    {formatCurrency(stats.variableBudgetLimit - stats.totalVariable)}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Variable Breakdown */}
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Variable Breakdown</CardTitle>
                        <CardDescription>
                            Where your money is going.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats.variableTransactions.map((tx) => {
                                const category = CATEGORIES.find(c => c.id === tx.categoryId);
                                const percentOfTotal = (tx.amount / stats.variableBudgetLimit) * 100;

                                return (
                                    <div key={tx.id} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 font-medium">
                                                {/* Icon placeholder if we had dynamic icon mapping */}
                                                <div className={cn("h-2 w-2 rounded-full", category?.color?.replace('text-', 'bg-') || 'bg-slate-500')} />
                                                {category?.name || tx.description}
                                            </div>
                                            <div className="text-slate-500">
                                                {formatCurrency(tx.amount)}
                                            </div>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className={cn("h-full transition-all", category?.color?.replace('text-', 'bg-') || 'bg-brand-primary')}
                                                style={{ width: `${percentOfTotal}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {stats.variableTransactions.length === 0 && (
                                <div className="py-8 text-center text-slate-500">
                                    No variable expenses yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" className="w-full text-brand-primary text-sm" onClick={() => navigate({ to: '/transactions' })}>
                            View All Transactions
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
