
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTransactionsByMonth } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { formatCurrency, cn } from '../../lib/utils';
import { Copy, X, Calendar, Plus } from 'lucide-react';
import { CurrencyInput } from '../../components/ui/CurrencyInput';
import type { Transaction } from '../../types';
import { useDate } from '../../context/DateContext';
import { useCreateTransaction, useDeleteTransaction, useUpdateTransaction } from '../../hooks/useTransactionMutations';

export default function FixedExpensesPage() {
    const { currentDate, monthName, year } = useDate();

    const { data: transactions = [], error } = useTransactionsByMonth('fixed');
    const { data: categories = [] } = useCategories();

    if (error) {
        return <QueryErrorFallback error={error} title="Failed to load fixed expenses" />;
    }

    // Helper formatted string YYYY-MM
    const currentMonthStr = useMemo(() => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    }, [currentDate]);

    // Mutations
    const createMutation = useCreateTransaction();
    const deleteMutation = useDeleteTransaction();
    const updateMutation = useUpdateTransaction();

    // Transactions are now just the server transactions, filtering is handled by the hook but we need to filter for fixed type specifically if the hook returns all
    // Actually useTransactionsByMonth(currentDate, 'fixed') already filters by type 'fixed'
    // So transactions = serverTransactions

    // const transactions = serverTransactions; // Removed incorrect redeclaration

    const [isReplicateModalOpen, setIsReplicateModalOpen] = useState(false);
    const [draftTransactions, setDraftTransactions] = useState<Transaction[]>([]);

    // Filter transactions for the current viewing month (API already does this but good to double check or align with previous logic)
    const currentMonthFixedExpenses = useMemo(() => {
        // The hook already filters by month and type, so we can just use the data
        return transactions;
    }, [transactions]);

    const totalFixedAmount = useMemo(() => {
        return currentMonthFixedExpenses.reduce((sum, tx) => sum + tx.amount, 0);
    }, [currentMonthFixedExpenses]);

    const remainingToPay = useMemo(() => {
        return currentMonthFixedExpenses.filter(tx => !tx.isPaid).reduce((sum, tx) => sum + tx.amount, 0);
    }, [currentMonthFixedExpenses]);

    const completedCount = useMemo(() => {
        return currentMonthFixedExpenses.filter(tx => tx.isPaid).length;
    }, [currentMonthFixedExpenses]);

    const totalItems = currentMonthFixedExpenses.length;
    const pendingCount = totalItems - completedCount;

    const getPreviousMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-').map(Number);
        let prevMonth = month - 1;
        let prevYear = year;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
        }
        return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
    };

    const handleReplicateClick = () => {
        const prevMonthStr = getPreviousMonth(currentMonthStr);
        const prevMonthTxs = transactions.filter(tx =>
            tx.type === 'fixed' && tx.date.startsWith(prevMonthStr)
        );

        if (prevMonthTxs.length === 0) {
            alert(`No fixed expenses found in ${prevMonthStr} to replicate.`);
            return;
        }

        // Create drafts
        const drafts = prevMonthTxs.map(tx => {
            const day = tx.date.split('-')[2];
            return {
                ...tx,
                id: `replicated_${Date.now()}_${tx.id}`, // Assign a temporary unique ID for draft
                // Use currentMonthStr directly
                date: `${currentMonthStr}-${day}`,
                isPaid: false, // Reset status
            };
        });

        setDraftTransactions(drafts);
        setIsReplicateModalOpen(true);
    };

    const handleConfirmReplication = () => {
        draftTransactions.forEach(tx => {
            createMutation.mutate({
                description: tx.description,
                amount: tx.amount,
                date: tx.date, // Already formatted for current month in openReplicateModal
                categoryId: tx.categoryId,
                type: 'fixed',
                isPaid: false,
            });
        });

        setIsReplicateModalOpen(false);
        setDraftTransactions([]);
    };

    const togglePaidStatus = (id: string, currentStatus: boolean) => {
        updateMutation.mutate({
            id,
            updates: { isPaid: !currentStatus }
        });
    };

    const handleDraftChange = (id: string, field: keyof Transaction, value: any) => {
        setDraftTransactions(prev => prev.map(tx =>
            tx.id === id ? { ...tx, [field]: value } : tx
        ));
    };

    const removeDraft = (id: string) => {
        setDraftTransactions(prev => prev.filter(tx => tx.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Fixed Expenses
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your monthly recurring obligations.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Month Selector Removed (Moved to Header) */}

                    {/* Action Buttons */}
                    <Button onClick={handleReplicateClick} className="shadow-lg shadow-brand-primary/20 gap-2 font-medium">
                        <Copy className="h-4 w-4" />
                        Clone Last Month
                    </Button>
                    <Button variant="outline" className="gap-2 bg-white">
                        <Plus className="h-4 w-4" />
                        New Expense
                    </Button>
                </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid gap-4 md:grid-cols-3">
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

            {/* Expenses Table */}
            <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-slate-100 text-slate-500 dark:bg-brand-surface dark:border-slate-800 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Category / Service</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-brand-surface">
                            {currentMonthFixedExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No fixed expenses found for {monthName} {year}. <br />
                                        Try replicating from last month or add a new transaction.
                                    </td>
                                </tr>
                            ) : (
                                currentMonthFixedExpenses.map((tx) => {
                                    const category = categories.find(c => c.id === tx.categoryId);
                                    return (
                                        <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700")}>
                                                        {/* Placeholder Icon */}
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
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                                    onClick={() => deleteMutation.mutate(tx.id)}
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

            {/* Replication Modal */}
            {isReplicateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsReplicateModalOpen(false)} />

                    <Card className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                            <div>
                                <CardTitle>Review & Replicate</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Review expenses imported from last month.</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsReplicateModalOpen(false)} className="-mr-2">
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>

                        <div className="p-0 overflow-y-auto flex-1">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Description</th>
                                        <th className="px-6 py-3 font-medium">Amount</th>
                                        <th className="px-6 py-3 font-medium w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {draftTransactions.map((tx) => (
                                        <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-3">
                                                <input
                                                    type="text"
                                                    value={tx.description}
                                                    onChange={(e) => handleDraftChange(tx.id, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-none focus:ring-0 p-0 font-medium text-slate-900 dark:text-slate-100"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <CurrencyInput
                                                    value={tx.amount}
                                                    onChange={(val) => handleDraftChange(tx.id, 'amount', val)}
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button onClick={() => removeDraft(tx.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 p-6 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
                            <div className="mr-auto flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-bold text-slate-900 dark:text-slate-100">{draftTransactions.length}</span> items to import
                            </div>
                            <Button variant="ghost" onClick={() => setIsReplicateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmReplication} className="shadow-lg shadow-brand-primary/20">
                                Confirm & Save
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
