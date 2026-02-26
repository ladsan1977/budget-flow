import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, cn } from '../../../lib/utils';
import { AlertCircle, Plus } from 'lucide-react';
import type { useVariableExpensesLogic } from './../hooks/useVariableExpensesLogic';
import { VariableExpenseCategoryItem } from './VariableExpenseCategoryItem';
import { VariableBudgetEditor } from './VariableBudgetEditor';

type LogicData = ReturnType<typeof useVariableExpensesLogic>;

export function VariableExpensesDesktop({ data, stats, state, actions, modals }: LogicData) {
    const { globalLimit } = data;
    const { totalSpent, remainingBalance, percentage, breakdown, statusColor, statusTextColor } = stats;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Dayly Budget
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track your discretionary spending against a global monthly goal.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => modals.setIsAddModalOpen(true)} variant="outline" className="gap-2 bg-white shrink-0 inline-flex">
                        <Plus className="h-4 w-4" />
                        <span>Add Spending</span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Left Column: Global Limit & Progress (8 cols) */}
                <div className="md:col-span-8 space-y-6">

                    {/* Global Limit Card */}
                    <VariableBudgetEditor globalLimit={globalLimit} state={state} actions={actions} />

                    {/* Fulfillment Progress Card */}
                    <Card className="bg-white border-slate-200 dark:bg-brand-surface dark:border-slate-800 shadow-sm">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        Total Spent So Far
                                    </p>
                                    <div className={cn("text-4xl font-extrabold tabular-nums tracking-tight", statusTextColor)}>
                                        {formatCurrency(totalSpent)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        Remaining Balance
                                    </p>
                                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                                        {formatCurrency(remainingBalance)}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={cn("h-full transition-all duration-1000 ease-out", statusColor)}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>

                            <div className="flex justify-between mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span>0%</span>
                                <span>{percentage.toFixed(1)}% Used</span>
                                <span>100%</span>
                            </div>

                            {percentage >= 100 && (
                                <div className="mt-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <div>
                                        <span className="font-bold">Budget Exceeded!</span> You have spent {formatCurrency(totalSpent - globalLimit)} over your limit.
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Right Column: Breakdown List (4 cols) */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="h-full bg-white border-slate-200 dark:bg-brand-surface dark:border-slate-800 shadow-sm flex flex-col">
                        <CardHeader>
                            <CardTitle>Spending Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-5">
                                {breakdown.map((item) => (
                                    <VariableExpenseCategoryItem key={item.id} item={item} />
                                ))}

                                {breakdown.length === 0 && (
                                    <div className="text-center py-10 text-slate-400">
                                        <p>No variable expenses yet.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
