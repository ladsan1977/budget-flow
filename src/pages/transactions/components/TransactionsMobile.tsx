import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { Plus, Search, Edit2, X } from 'lucide-react';
import type { TransactionType } from '../../../types';
import type { TransactionsLogicReturn } from '../hooks/useTransactionsLogic';
import { MobileDataCard } from '../../../components/ui/MobileDataCard';
import { MonthSelector } from '../../../components/common/MonthSelector';

const getBadgeVariant = (txType: TransactionType) => {
    switch (txType) {
        case 'income': return 'success';
        case 'fixed': return 'primary'; // Indigo/Primary
        case 'variable': return 'warning';
        default: return 'outline';
    }
};

export function TransactionsMobile({
    data: { transactions, categories },
    modals: { setIsAddModalOpen, setEditingTransaction, setTransactionToDelete },
    actions: { togglePaidStatus }
}: TransactionsLogicReturn) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 md:hidden">
            {/* Header & Controls */}
            <div className="sticky top-16 z-20 -m-4 sm:-m-6 p-4 sm:p-6 pb-4 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Transactions
                        </h1>
                    </div>
                    <div className="flex gap-2 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-800 dark:bg-brand-surface dark:text-slate-100"
                            />
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-lg shadow-brand-primary/20 shrink-0 inline-flex">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add Transaction</span>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-start w-full">
                    <MonthSelector />
                </div>
            </div>

            {/* Mobile Cards List */}
            <div className="flex flex-col gap-3">
                {transactions.map((tx) => {
                    const category = categories.find(c => c.id === tx.categoryId);
                    return (
                        <MobileDataCard
                            key={tx.id}
                            icon={
                                <div className={cn("h-3 w-3 rounded-full", category?.color?.replace('text-', 'bg-') || 'bg-slate-400')} />
                            }
                            categoryName={category?.name || 'Uncategorized'}
                            date={tx.date}
                            description={tx.description}
                            amount={tx.amount}
                            isIncome={tx.type === 'income'}
                            statusNode={
                                <div className="flex gap-2 items-center">
                                    <Badge variant={getBadgeVariant(tx.type)} className="text-[10px] px-1.5 py-0">
                                        {tx.type === 'income' ? 'Income' : tx.type === 'fixed' ? 'Fixed Expenses' : tx.type === 'variable' ? 'Daily Budget' : tx.type}
                                    </Badge>
                                    <button
                                        onClick={() => togglePaidStatus(tx.id, tx.isPaid)}
                                        className={cn(
                                            "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-all min-w-[50px]",
                                            tx.isPaid
                                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                        )}
                                    >
                                        {tx.isPaid ? 'Paid' : 'Pending'}
                                    </button>
                                </div>
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
                })}
                {transactions.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
}
