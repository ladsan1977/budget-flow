import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, cn } from '../../../lib/utils';
import { Copy, Plus, Calendar, Edit2, X } from 'lucide-react';
import type { FixedExpensesLogicReturn } from '../hooks/useFixedExpensesLogic';

export function FixedExpensesDesktop({
    data: { monthName, year, transactions, categories },
    stats: { totalFixedAmount, remainingToPay, completedCount, totalItems, pendingCount },
    modals: { setIsAddModalOpen, setEditingTransaction, setTransactionToDelete },
    actions: { handleReplicateClick, togglePaidStatus }
}: FixedExpensesLogicReturn) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Fixed Expenses
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Manage your monthly recurring obligations.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        <Button onClick={handleReplicateClick} className="shadow-lg shadow-brand-primary/20 gap-2 font-medium shrink-0 inline-flex">
                            <Copy className="h-4 w-4" />
                            <span>Clone Last Month</span>
                        </Button>
                        <Button onClick={() => setIsAddModalOpen(true)} variant="outline" className="gap-2 bg-white shrink-0 inline-flex">
                            <Plus className="h-4 w-4" />
                            <span>New Expense</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid gap-4 grid-cols-3">
                {/* Total Costs Card */}
                <Card className="bg-white border-slate-200 dark:bg-[#151932] dark:border-[#252a41] shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Fixed Costs</p>
                        <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            {formatCurrency(totalFixedAmount)}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <span>↘ 2.4%</span> from last month
                        </div>
                    </CardContent>
                </Card>

                {/* Remaining to Pay Card */}
                <Card className="bg-white border-slate-200 dark:bg-[#151932] dark:border-[#252a41] shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Remaining to Pay</p>
                        <div className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{formatCurrency(remainingToPay)}</div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                                style={{ width: `${totalFixedAmount > 0 ? ((totalFixedAmount - remainingToPay) / totalFixedAmount) * 100 : 0}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Completed Payments Card */}
                <Card className="bg-white border-slate-200 dark:bg-[#151932] dark:border-[#252a41] shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Completed Payments</p>
                        <div className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                            {completedCount} <span className="text-slate-400 dark:text-slate-500 text-xl font-normal">/ {totalItems}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold h-5 flex items-center justify-center min-w-[20px]">{pendingCount}</span> items pending action
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Expenses Table */}
            <Card className="flex overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface flex-col max-h-[500px]">
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-slate-100 text-slate-500 dark:bg-brand-surface dark:border-slate-800 dark:text-slate-400 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Category / Service</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-brand-surface">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No fixed expenses found for {monthName} {year}. <br />
                                        Try replicating from last month or add a new transaction.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => {
                                    const category = categories.find(c => c.id === tx.categoryId);
                                    return (
                                        <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700")}>
                                                        <Calendar className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-slate-100">{tx.description}</div>
                                                        <div className="text-xs text-slate-500">{category?.name || 'Uncategorized'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {new Date(tx.date).getDate()}th
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                                                {formatCurrency(tx.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => togglePaidStatus(tx.id, tx.isPaid)}
                                                    className={cn(
                                                        "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-all min-w-[70px]",
                                                        tx.isPaid
                                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                            : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                                    )}
                                                >
                                                    {tx.isPaid ? 'Paid' : 'Pending'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-brand-primary"
                                                    onClick={() => setEditingTransaction(tx)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                                    onClick={() => setTransactionToDelete(tx.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
