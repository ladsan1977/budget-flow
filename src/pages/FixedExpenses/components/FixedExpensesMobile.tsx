import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import { Copy, Calendar, Edit2, X } from 'lucide-react';
import { MobileDataCard } from '../../../components/ui/MobileDataCard';
import { MonthSelector } from '../../../components/common/MonthSelector';
import type { FixedExpensesLogicReturn } from '../hooks/useFixedExpensesLogic';
import { FixedExpensesStats } from './FixedExpensesStats';

export function FixedExpensesMobile({
    data: { monthName, year, transactions, categories },
    stats,
    modals: { setEditingTransaction, setTransactionToDelete },
    actions: { handleReplicateClick, togglePaidStatus }
}: FixedExpensesLogicReturn) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="sticky top-16 z-20 -m-4 sm:-m-6 p-4 sm:p-6 pb-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Fixed Expenses
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        <Button onClick={handleReplicateClick} variant="outline" size="sm" className="shadow-lg shadow-brand-primary/20 shrink-0 gap-2 h-10 px-3 flex">
                            <Copy className="h-4 w-4" />
                            <span className="text-sm font-medium">Clone</span>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-start w-full">
                    <MonthSelector />
                </div>
            </div>

            {/* Summary Cards Row */}
            <FixedExpensesStats stats={stats} />

            {/* Mobile Cards List */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 mt-2 px-1 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Expenses List
                    </h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                        {transactions.length} items
                    </span>
                </div>
                <div className="flex flex-col gap-3">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 bg-white dark:bg-brand-surface rounded-xl border border-slate-200 dark:border-slate-800">
                            No fixed expenses found for {monthName} {year}. <br />
                            Try replicating from last month or add a new transaction.
                        </div>
                    ) : (
                        transactions.map((tx) => {
                            const category = categories.find(c => c.id === tx.categoryId);
                            return (
                                <MobileDataCard
                                    key={tx.id}
                                    icon={<Calendar className="h-3 w-3" />}
                                    categoryName={category?.name || 'Uncategorized'}
                                    date={`${new Date(tx.date).getDate()}th`}
                                    description={tx.description}
                                    amount={tx.amount}
                                    isIncome={false}
                                    statusNode={
                                        <button
                                            onClick={() => togglePaidStatus(tx.id, tx.isPaid)}
                                            className={cn(
                                                "inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold transition-all min-w-[60px]",
                                                tx.isPaid
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                            )}
                                        >
                                            {tx.isPaid ? 'Paid' : 'Pending'}
                                        </button>
                                    }
                                    actions={
                                        <>
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
                                        </>
                                    }
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
