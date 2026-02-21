import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactionMutations';
import { formatCurrency, cn } from '../../lib/utils';
import { X, AlertCircle } from 'lucide-react';
import type { Transaction, TransactionType } from '../../types';
import { useDate } from '../../context/DateContext';
import { useVariableBudgetLimit } from '../../hooks/useBudgets';
import { MobileCategorySelector } from './MobileCategorySelector';
import * as LucideIcons from 'lucide-react';
import { resolveColor } from '../../lib/colors';

export interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: TransactionType;
    lockType?: boolean;
    initialData?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, initialType = 'variable', lockType = false, initialData = null }: TransactionModalProps) {
    const { currentDate } = useDate();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    // Default the date to the current viewed month, but if viewing current month try to use today
    const { data: variableBudgetLimit = 0 } = useVariableBudgetLimit(currentDate);
    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType>(initialType);
    const [categoryId, setCategoryId] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);

    // Initial Date Logic
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setDescription(initialData.description);
                setAmount(initialData.amount.toString());
                setDate(initialData.date);
                setType(initialData.type);
                setCategoryId(initialData.categoryId || '');
                setIsPaid(initialData.isPaid);
            } else {
                const today = new Date();
                const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
                const initDate = isCurrentMonth ? today : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                const offset = initDate.getTimezoneOffset();
                const local = new Date(initDate.getTime() - (offset * 60 * 1000));
                const dateStr = local.toISOString().split('T')[0];

                setDate(dateStr);
                setType(initialType);
                setDescription('');
                setAmount('');
                setCategoryId('');
                setIsPaid(false);
            }
        }
    }, [isOpen, currentDate, initialType, initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!description || !amount || !categoryId) return;

        if (initialData) {
            updateMutation.mutate({
                id: initialData.id,
                updates: {
                    description,
                    amount: parseFloat(amount),
                    date,
                    type,
                    categoryId,
                    isPaid,
                }
            }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else {
            createMutation.mutate({
                description,
                amount: parseFloat(amount),
                date,
                type,
                categoryId,
                isPaid,
            }, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <Card className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                    <CardTitle>{initialData ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <div className="p-6 space-y-6">
                    {/* Amount Input */}
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
                                        onClick={() => {
                                            if (!lockType) {
                                                setType(t);
                                                setCategoryId('');
                                            }
                                        }}
                                        disabled={lockType && t !== type}
                                        className={cn(
                                            "rounded-md px-3 py-2 text-sm font-medium transition-all capitalize",
                                            type === t
                                                ? "bg-white text-slate-900 shadow-sm dark:bg-brand-surface dark:text-slate-100"
                                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                                            lockType && t !== type && "opacity-50 cursor-not-allowed hover:text-slate-500 dark:hover:text-slate-400"
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
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500">Category</label>
                            <button
                                type="button"
                                disabled={categoriesLoading}
                                onClick={() => setIsCategorySelectorOpen(true)}
                                className={cn(
                                    "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all",
                                    categoriesLoading && "opacity-60 cursor-not-allowed",
                                    !categoryId && "text-slate-500"
                                )}
                            >
                                {categoriesLoading ? (
                                    <span>Loading categories...</span>
                                ) : categoryId ? (
                                    (() => {
                                        const selected = categories.find(c => c.id === categoryId);
                                        if (!selected) return <span>Select Category</span>;
                                        const IconComponent = (LucideIcons as any)[selected.icon || 'HelpCircle'] || LucideIcons.HelpCircle;
                                        return (
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg shadow-sm"
                                                    style={{
                                                        backgroundColor: resolveColor(selected.color),
                                                        color: '#ffffff'
                                                    }}
                                                >
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">{selected.name}</span>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <span>Select Category</span>
                                )}
                                <LucideIcons.ChevronDown className="h-4 w-4 text-slate-400 opacity-50" />
                            </button>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
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
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="px-8 shadow-lg shadow-brand-primary/20">
                        {initialData ? 'Save Changes' : 'Save Transaction'}
                    </Button>
                </div>
            </Card>

            <MobileCategorySelector
                isOpen={isCategorySelectorOpen}
                onClose={() => setIsCategorySelectorOpen(false)}
                categories={categories}
                selectedId={categoryId}
                type={type}
                lockType={lockType}
                onSelect={(newCategoryId) => {
                    setCategoryId(newCategoryId);
                    if (!lockType) {
                        const category = categories.find(c => c.id === newCategoryId);
                        if (category) {
                            setType(category.type);
                        }
                    }
                }}
            />
        </div>
    );
}
