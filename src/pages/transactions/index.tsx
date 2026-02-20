
import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useCategories } from '../../hooks/useCategories';
import { useTransactionsByMonth } from '../../hooks/useTransactions';
import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { formatCurrency, cn } from '../../lib/utils';
import { Plus, Search, CheckCircle2, Clock } from 'lucide-react';
import type { TransactionType } from '../../types';
import { TransactionModal } from '../../components/transactions/TransactionModal';

export default function TransactionsPage() {

    // Server state is now sufficient since we invalidate queries on success
    const { data: transactions = [], error, refetch } = useTransactionsByMonth();
    const { data: categories = [] } = useCategories();

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (error) {
        return <QueryErrorFallback error={error} resetErrorBoundary={refetch} title="Failed to load transactions" />;
    }

    const getBadgeVariant = (txType: TransactionType) => {
        switch (txType) {
            case 'income': return 'success';
            case 'fixed': return 'default'; // Indigo/Primary
            case 'variable': return 'warning';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Transactions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your income and expenses.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="h-10 w-full md:w-[200px] rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-800 dark:bg-brand-surface dark:text-slate-100"
                        />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-brand-primary/20">
                        <Plus className="h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Main Table Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                                                {/* Icon placeholder */}
                                                <div className={cn("h-2 w-2 rounded-full", category?.color?.replace('text-', 'bg-') || 'bg-slate-400')} />
                                                {category?.name || 'Uncategorized'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getBadgeVariant(tx.type)}>
                                                {tx.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tx.isPaid ? (
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-brand-success">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Paid
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className={cn(
                                            "px-6 py-4 text-right font-bold tabular-nums",
                                            tx.type === 'income' ? 'text-brand-success' : 'text-slate-900 dark:text-slate-100'
                                        )}>
                                            {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
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

            {/* Add Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
