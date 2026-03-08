import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactionMutations';
import { formatCurrency, cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';
import type { Transaction, TransactionType, ExpenseNature } from '../../types';
import { useDate } from '../../context/DateContext';
import { useVariableBudgetLimit } from '../../hooks/useBudgets';
import { useAccounts } from '../../hooks/useAccounts';
import { MobileCategorySelector } from './MobileCategorySelector';
import * as LucideIcons from 'lucide-react';
import { resolveColor } from '../../lib/colors';
import { ModalHeaderActions } from '../common/ModalHeaderActions';
import { CategoryFormModal } from '../categories/CategoryFormModal';
import { MobileRadioDrawer } from '../common/MobileRadioDrawer';
import { CurrencyInput } from '../ui/CurrencyInput';
import { toast } from 'sonner';

export interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: TransactionType;
    initialExpenseNature?: ExpenseNature | null;
    lockType?: boolean;
    initialData?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, initialType = 'expense', initialExpenseNature = 'variable', lockType = false, initialData = null }: TransactionModalProps) {
    const { currentDate } = useDate();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
    // Default the date to the current viewed month, but if viewing current month try to use today
    const { data: variableBudgetLimit = 0 } = useVariableBudgetLimit(currentDate);
    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();

    // Form State
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<TransactionType>(initialType);
    const [expenseNature, setExpenseNature] = useState<ExpenseNature | null>(initialExpenseNature || null);
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [createCategoryInitialName, setCreateCategoryInitialName] = useState('');
    const [isAccountSelectorOpen, setIsAccountSelectorOpen] = useState(false);
    const [isToAccountSelectorOpen, setIsToAccountSelectorOpen] = useState(false);

    // Ref to the underlying <input> inside CurrencyInput so we can select-all on open
    const amountInputRef = useRef<HTMLInputElement>(null);

    // Initial Date & Preset Logic - Triggers ONLY on modal open/close
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setDescription(initialData.description || '');
                setAmount(initialData.amount.toString());
                setDate(initialData.date);
                setType(initialData.type);
                setExpenseNature(initialData.expenseNature || null);
                setCategoryId(initialData.categoryId || '');
                setAccountId(initialData.accountId || '');
                setToAccountId(initialData.toAccountId || '');
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
                setExpenseNature(initialType === 'expense' ? (initialExpenseNature || 'variable') : null);
                setDescription('');
                setAmount('');
                setCategoryId('');
                setAccountId('');
                setToAccountId('');
                setIsPaid(initialType === 'transfer' ? true : false);
            }
        } else {
            // Reset state eagerly when modal closes
            setDescription('');
            setAmount('');
            setCategoryId('');
            setAccountId('');
            setToAccountId('');
            setExpenseNature(null);
            setIsPaid(false);
        }
    }, [isOpen, currentDate, initialType, initialExpenseNature, initialData]);

    // Auto-select Default Account when available for new transactions
    useEffect(() => {
        if (isOpen && !initialData && !accountId && accounts.length > 0) {
            const defaultAccount = accounts.find(a => a.isDefault);
            setAccountId(defaultAccount ? defaultAccount.id : accounts[0].id);
        }
    }, [isOpen, initialData, accountId, accounts]);

    // Force default behaviors based on type selection dynamically
    useEffect(() => {
        if (!isOpen || initialData) return;

        if (type === 'transfer') {
            setIsPaid(true); // Transfers always paid immediately 
            setExpenseNature(null);
            setCategoryId('');
        } else if (type === 'income') {
            setExpenseNature(null);
        } else if (type === 'expense') {
            if (!expenseNature) {
                setExpenseNature('variable');
            }
        }
    }, [type, isOpen, initialData, expenseNature]);

    // When adding a new transaction, auto-focus the amount field so the user
    // can start typing immediately without having to backspace the default "0.00".
    // We skip this for edits — the field already shows the pre-filled amount.
    useEffect(() => {
        if (isOpen && !initialData) {
            // rAF lets the modal finish its CSS animation before we steal focus
            const id = requestAnimationFrame(() => {
                amountInputRef.current?.focus();
                amountInputRef.current?.select();
            });
            return () => cancelAnimationFrame(id);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!amount) {
            toast.error('Please enter an amount');
            return;
        }
        if (!description) {
            toast.error('Please enter a description');
            return;
        }
        if (type !== 'transfer' && !categoryId) {
            toast.error('Please select a category');
            return;
        }
        if (!accountId) {
            toast.error('Please select an account');
            return;
        }
        if (type === 'transfer') {
            if (!toAccountId) {
                toast.error('Please select a destination account');
                return;
            }
            if (accountId === toAccountId) {
                toast.error('Source and destination accounts must be different');
                return;
            }
        }

        const payload = {
            description,
            amount: parseFloat(amount),
            date,
            type,
            categoryId: type === 'transfer' ? null : categoryId,
            accountId,
            toAccountId: type === 'transfer' ? toAccountId : null,
            expenseNature: type === 'expense' ? (expenseNature || 'variable') : null,
            isPaid,
        };

        if (initialData) {
            // Include potential `id` if mapping requires it, but `updateMutation` takes `id` separately.
            updateMutation.mutate({
                id: initialData.id,
                updates: payload
            }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[150] sm:flex sm:items-center sm:justify-center p-0 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <Card className="fixed top-10 bottom-24 left-4 right-4 sm:relative sm:top-auto sm:bottom-auto sm:left-auto sm:right-auto sm:w-full sm:max-w-lg sm:h-auto flex flex-col transform overflow-hidden sm:overflow-visible rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in zoom-in-95 duration-200">
                <CardHeader className="shrink-0 flex flex-row items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 dark:border-slate-800">
                    <CardTitle className="text-lg md:text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 flex-none">
                        {initialData ? 'Edit' : 'Add'} Transaction
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <ModalHeaderActions
                            onCancel={onClose}
                            onSubmit={handleSave}
                            isPending={createMutation.isPending || updateMutation.isPending}
                        />
                    </div>
                </CardHeader>

                <div className="flex flex-col sm:overflow-visible overflow-y-auto w-full md:h-auto min-h-0">
                    <div className="p-4 sm:p-6 pb-12 sm:pb-6 space-y-6 flex-1">
                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500">Amount</label>
                            <CurrencyInput
                                ref={amountInputRef}
                                value={parseFloat(amount) || 0}
                                onChange={(val) => setAmount(val === 0 ? '' : val.toString())}
                                placeholder="0.00"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-xl font-bold text-slate-900 outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                                prefixClassName="left-4 text-lg font-bold text-slate-400"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Type Selection */}
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-sm font-medium text-slate-500">Transaction Type</label>
                                <div className="grid grid-cols-3 gap-1 sm:gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900/50">
                                    {(['income', 'expense', 'transfer'] as const).map((t) => {
                                        const label = t === 'income' ? 'Income' : t === 'expense' ? 'Expense' : 'Transfer';
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => {
                                                    if (!lockType) {
                                                        if (t !== type) {
                                                            setType(t);
                                                        }
                                                    }
                                                }}
                                                disabled={lockType && t !== type}
                                                className={cn(
                                                    "rounded-md px-1 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all text-center",
                                                    type === t
                                                        ? "bg-white text-slate-900 shadow-sm dark:bg-brand-surface dark:text-slate-100"
                                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                                                    lockType && t !== type && "opacity-50 cursor-not-allowed hover:text-slate-500 dark:hover:text-slate-400"
                                                )}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Expense Nature Selection (If Expense) */}
                            {type === 'expense' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Expense Nature</label>
                                    <div className="flex h-11 items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/50">
                                        {(['fixed', 'variable'] as const).map((nature) => (
                                            <button
                                                key={nature}
                                                type="button"
                                                onClick={() => setExpenseNature(nature)}
                                                className={cn(
                                                    "flex-1 h-full rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                                                    expenseNature === nature
                                                        ? "bg-white text-slate-900 shadow-sm dark:bg-brand-surface dark:text-slate-100"
                                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                                )}
                                            >
                                                {nature === 'fixed' ? 'Fixed' : 'Variable'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Account Selection */}
                            {type !== 'transfer' ? (
                                <div className={cn("space-y-2", type === 'expense' ? "" : "sm:col-span-2")}>
                                    <label className="text-sm font-medium text-slate-500">Account</label>
                                    <button
                                        type="button"
                                        disabled={accountsLoading}
                                        onClick={() => setIsAccountSelectorOpen(true)}
                                        className={cn(
                                            "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all text-left",
                                            accountsLoading && "opacity-60 cursor-not-allowed",
                                            !accountId && "text-slate-500"
                                        )}
                                    >
                                        <span className="truncate">
                                            {accountId ? accounts.find(a => a.id === accountId)?.name : 'Select an Account'}
                                        </span>
                                        <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-50" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-500">From Account</label>
                                        <button
                                            type="button"
                                            disabled={accountsLoading}
                                            onClick={() => setIsAccountSelectorOpen(true)}
                                            className={cn(
                                                "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all text-left",
                                                accountsLoading && "opacity-60 cursor-not-allowed",
                                                !accountId && "text-slate-500"
                                            )}
                                        >
                                            <span className="truncate">
                                                {accountId ? accounts.find(a => a.id === accountId)?.name : 'From Account'}
                                            </span>
                                            <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-50" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-500">To Account</label>
                                        <button
                                            type="button"
                                            disabled={accountsLoading}
                                            onClick={() => setIsToAccountSelectorOpen(true)}
                                            className={cn(
                                                "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all text-left",
                                                accountsLoading && "opacity-60 cursor-not-allowed",
                                                !toAccountId && "text-slate-500"
                                            )}
                                        >
                                            <span className="truncate">
                                                {toAccountId ? accounts.find(a => a.id === toAccountId)?.name : 'To Account'}
                                            </span>
                                            <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-50" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Description */}
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-sm font-medium text-slate-500">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={type === 'transfer' ? "e.g. Savings Transfer" : "e.g. Weekly Groceries"}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                                />
                            </div>

                            {/* Category - Hidden on Transfer */}
                            {type !== 'transfer' && (
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
                                            <span>Loading...</span>
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
                                                        <span className="font-medium text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-xs">{selected.name}</span>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <span>Select Category</span>
                                        )}
                                        <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-50" />
                                    </button>
                                </div>
                            )}

                            {/* Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base md:text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>

                            {/* Status Toggle - Hidden on Transfer */}
                            {type !== 'transfer' && (
                                <div className="flex items-center space-x-2 sm:col-span-2">
                                    <input
                                        type="checkbox"
                                        id="isPaid"
                                        checked={isPaid}
                                        onChange={(e) => setIsPaid(e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                    />
                                    <label htmlFor="isPaid" className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer select-none">
                                        {type === 'income' ? 'Mark as Received' : 'Mark as Paid'}
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Conditional Info Box */}
                        {type === 'expense' && expenseNature === 'variable' && (
                            <div className="flex gap-3 rounded-lg border border-brand-warning/20 bg-brand-warning/5 p-4 text-sm text-brand-warning">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>
                                    This will affect your monthly variable limit of <strong>{formatCurrency(variableBudgetLimit)}</strong>.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Footer (Hidden on Mobile) */}
                    <div className="hidden sm:flex justify-end gap-3 border-t border-slate-100 p-4 pb-6 sm:p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 sm:rounded-b-2xl">
                        <Button variant="ghost" onClick={onClose} disabled={createMutation.isPending || updateMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="px-8 shadow-lg shadow-brand-primary/20"
                        >
                            {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : (initialData ? 'Save Changes' : 'Save Transaction')}
                        </Button>
                    </div>
                </div>
            </Card>

            <MobileCategorySelector
                isOpen={isCategorySelectorOpen}
                onClose={() => setIsCategorySelectorOpen(false)}
                categories={categories}
                selectedId={categoryId}
                type={type}
                onSelect={(newCategoryId) => {
                    setCategoryId(newCategoryId);
                    if (!lockType) {
                        const category = categories.find(c => c.id === newCategoryId);
                        if (category) {
                            setType(category.type);
                        }
                    }
                }}
                onCreateNew={(name) => {
                    // Close the selector briefly, or leave it behind. Leaving it open is fine 
                    // since the Create modal will be on top (z-[70] vs z-[60]).
                    setCreateCategoryInitialName(name);
                    setIsCreateCategoryOpen(true);
                }}
            />

            <MobileRadioDrawer
                isOpen={isAccountSelectorOpen}
                onClose={() => setIsAccountSelectorOpen(false)}
                title={type !== 'transfer' ? "Select Account" : "From Account"}
                options={accounts.map(a => ({ id: a.id, label: a.name }))}
                selectedId={accountId}
                onSelect={(newId) => {
                    if (type === 'transfer' && newId !== accountId) {
                        setToAccountId('');
                    }
                    setAccountId(newId);
                }}
            />

            <MobileRadioDrawer
                isOpen={isToAccountSelectorOpen}
                onClose={() => setIsToAccountSelectorOpen(false)}
                title="To Account"
                options={accounts
                    .filter(a => a.id !== accountId)
                    .map(a => ({ id: a.id, label: a.name }))}
                selectedId={toAccountId}
                onSelect={setToAccountId}
            />

            <CategoryFormModal
                isOpen={isCreateCategoryOpen}
                onClose={() => setIsCreateCategoryOpen(false)}
                initialName={createCategoryInitialName}
                initialType={type === 'transfer' ? 'expense' : type}
                onSuccess={(newCategoryId) => {
                    setCategoryId(newCategoryId);
                    // The new category type is already matched to the form's initialType (or user set),
                    // so we don't strictly need to do `setType(newCategoryType)` here, 
                    // but it's safe to assume the user wants it selected and we just close the selector.
                    setIsCategorySelectorOpen(false);
                }}
            />
        </div>
    );
}
