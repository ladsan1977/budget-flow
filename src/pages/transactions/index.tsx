
import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useCategories } from '../../hooks/useCategories';
import { useTransactionsByMonth } from '../../hooks/useTransactions';
import { useVariableBudgetLimit } from '../../hooks/useBudgets';
import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { formatCurrency, cn } from '../../lib/utils';
import { Plus, X, Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type { TransactionType } from '../../types';
import { useDate } from '../../context/DateContext';

import { useCreateTransaction } from '../../hooks/useTransactionMutations';

export default function TransactionsPage() {
    const { currentDate } = useDate();

    // Server state is now sufficient since we invalidate queries on success
    const { data: transactions = [], error, refetch } = useTransactionsByMonth();
    const { data: categories = [] } = useCategories();
    const { data: variableBudgetLimit = 0 } = useVariableBudgetLimit(currentDate);

    const createMutation = useCreateTransaction();

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (error) {
        return <QueryErrorFallback error={error} resetErrorBoundary={refetch} title="Failed to load transactions" />;
    }

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<string>('');
    // Default date to current view's month/year, but keep day as today if possible or 1st
    // If current view is same month as today, use today, else 1st
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
    const initialDate = isCurrentMonth ? today : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // adjust for timezone offset for input date format yyyy-mm-dd
    const formatDateForInput = (d: Date) => {
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - (offset * 60 * 1000));
        return local.toISOString().split('T')[0];
    }

    const [date, setDate] = useState(formatDateForInput(initialDate));
    const [type, setType] = useState<TransactionType>('variable');
    const [categoryId, setCategoryId] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    const handleSave = () => {
        if (!description || !amount || !categoryId) return;

        createMutation.mutate({
            description,
            amount: parseFloat(amount),
            date,
            type,
            categoryId,
            isPaid,
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
                resetForm();
            }
        });
    };

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDate(formatDateForInput(initialDate));
        setType('variable');
        setCategoryId('');
        setIsPaid(false);
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const fixedCategories = categories.filter(c => c.type === 'fixed');
    const variableCategories = categories.filter(c => c.type === 'variable');

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

            {/* Add Transaction Modal (Slide-over / Dialog style) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />

                    <Card className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                            <CardTitle>Add Transaction</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="-mr-2">
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>

                        <div className="p-6 space-y-6">
                            {/* Amount Input - Big & Central */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pl-8 text-2xl font-bold text-slate-900 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Type Selection */}
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium text-slate-500">Transaction Type</label>
                                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900/50">
                                        {(['income', 'fixed', 'variable'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => { setType(t); setCategoryId(''); }}
                                                className={cn(
                                                    "rounded-md px-3 py-2 text-sm font-medium transition-all capitalize",
                                                    type === t
                                                        ? "bg-white text-slate-900 shadow-sm dark:bg-brand-surface dark:text-slate-100"
                                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium text-slate-500">Description</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="e.g. Weekly Groceries"
                                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Category</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => {
                                            const newCategoryId = e.target.value;
                                            setCategoryId(newCategoryId);
                                            const category = categories.find(c => c.id === newCategoryId);
                                            if (category) {
                                                setType(category.type);
                                            }
                                        }}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                                    >
                                        <option value="" disabled>Select Category</option>

                                        {incomeCategories.length > 0 && (
                                            <optgroup label="Income">
                                                {incomeCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </optgroup>
                                        )}

                                        {fixedCategories.length > 0 && (
                                            <optgroup label="Fixed Expenses">
                                                {fixedCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </optgroup>
                                        )}

                                        {variableCategories.length > 0 && (
                                            <optgroup label="Variable Expenses">
                                                {variableCategories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </optgroup>
                                        )}
                                    </select>
                                </div>

                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                                    />
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center space-x-2 sm:col-span-2">
                                    <input
                                        type="checkbox"
                                        id="isPaid"
                                        checked={isPaid}
                                        onChange={(e) => setIsPaid(e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                    />
                                    <label htmlFor="isPaid" className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer select-none">
                                        Mark as Paid / Received
                                    </label>
                                </div>
                            </div>

                            {/* Conditional Info Box */}
                            {type === 'variable' && (
                                <div className="flex gap-3 rounded-lg border border-brand-warning/20 bg-brand-warning/5 p-4 text-sm text-brand-warning">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p>
                                        This will affect your monthly variable limit of <strong>{formatCurrency(variableBudgetLimit)}</strong>.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 p-6 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="px-8 shadow-lg shadow-brand-primary/20">
                                Save Transaction
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
