import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import type { Account } from '../../../types';
import { Wallet, Banknote } from 'lucide-react';

export interface AccountFormProps {
    id?: string;
    initialData?: Partial<Account>;
    onSubmit: (data: Partial<Account>) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function AccountForm({ id, initialData, onSubmit, onCancel, isLoading }: AccountFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [type, setType] = useState<Account['type']>(initialData?.type || 'bank');
    const [isDefault, setIsDefault] = useState<boolean>(initialData?.isDefault || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSubmit({ name, type, isDefault });
    };

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
            <div className="space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 mb-1 block">Account Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Main Checking"
                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 placeholder:text-slate-400"
                        autoFocus
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 mb-1 block">Account Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['bank', 'cash'] as const).map((t) => {
                            const isSelected = type === t;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                                        isSelected
                                            ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:text-slate-400"
                                    )}
                                >
                                    {t === 'bank' ? <Wallet className="h-6 w-6" /> : <Banknote className="h-6 w-6" />}
                                    <span className="text-sm font-medium capitalize">{t}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <label className="text-sm font-medium text-slate-500 block">Primary Account</label>
                    <div
                        className={cn(
                            "flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all",
                            isDefault
                                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                        onClick={() => setIsDefault(!isDefault)}
                    >
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-sm font-medium",
                                isDefault ? "text-yellow-700 dark:text-yellow-500" : "text-slate-700 dark:text-slate-300"
                            )}>
                                Set as Primary Account
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 pr-4">
                                This account will be selected by default when adding new transactions.
                            </span>
                        </div>
                        <div
                            className={cn(
                                "flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                                isDefault ? "bg-yellow-500" : "bg-slate-200 dark:bg-slate-700"
                            )}
                        >
                            <div
                                className={cn(
                                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                                    isDefault ? "translate-x-5" : "translate-x-0"
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden sm:flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !name} className="px-8 shadow-lg shadow-brand-primary/20">
                    {isLoading ? 'Saving...' : 'Save Account'}
                </Button>
            </div>
        </form>
    );
}
