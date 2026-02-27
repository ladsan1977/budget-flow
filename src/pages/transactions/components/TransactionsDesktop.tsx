import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, cn } from '../../../lib/utils';
import { Plus, Search, Edit2, X } from 'lucide-react';
import type { TransactionType } from '../../../types';
import type { TransactionsLogicReturn } from '../hooks/useTransactionsLogic';

const getBadgeVariant = (txType: TransactionType) => {
    switch (txType) {
        case 'income': return 'success';
        case 'fixed': return 'primary'; // Indigo/Primary
        case 'variable': return 'warning';
        default: return 'outline';
    }
};

export function TransactionsDesktop({
    data: { transactions, categories },
    modals: { setIsAddModalOpen, setEditingTransaction, setTransactionToDelete },
    actions: { togglePaidStatus }
}: TransactionsLogicReturn) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 hidden md:block">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Transactions
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Manage your income and expenses.
                        </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="h-10 w-full md:w-[200px] rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-800 dark:bg-brand-surface dark:text-slate-100"
                            />
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-lg shadow-brand-primary/20 shrink-0 inline-flex">
                            <Plus className="h-4 w-4" />
                            <span>Add Transaction</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Table Card */}
            <Card className="flex overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface flex-col max-h-[600px]">
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-brand-surface">
                            {transactions.map((tx) => {
                                const category = categories.find(c => c.id === tx.categoryId);
                                return (
                                    <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                                            {tx.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                <div className={cn("h-2 w-2 rounded-full", category?.color?.replace('text-', 'bg-') || 'bg-slate-400')} />
                                                {category?.name || 'Uncategorized'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getBadgeVariant(tx.type)}>
                                                {tx.type === 'income' ? 'Income' : tx.type === 'fixed' ? 'Fixed Expenses' : tx.type === 'variable' ? 'Daily Budget' : tx.type}
                                            </Badge>
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
                                        <td className={cn(
                                            "px-6 py-4 text-right font-bold tabular-nums",
                                            tx.type === 'income' ? 'text-brand-success' : 'text-slate-900 dark:text-slate-100'
                                        )}>
                                            {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
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
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No transactions found.
                    </div>
                )}
            </Card>
        </div>
    );
}
