import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { X, Loader2 } from 'lucide-react';
import { CurrencyInput } from '../../../components/ui/CurrencyInput';
import type { Transaction } from '../../../types';

export interface FixedExpensesReplicationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;

    // Data
    draftTransactions: Transaction[];

    // View state
    sourceMonthName: string;
    targetMonthName: string;
    isPending: boolean;

    // Actions
    onDraftChange: (id: string, field: keyof Transaction, value: any) => void;
    onRemoveDraft: (id: string) => void;
}

export function FixedExpensesReplicationModal({
    isOpen,
    onOpenChange,
    onConfirm,
    draftTransactions,
    sourceMonthName,
    targetMonthName,
    isPending,
    onDraftChange,
    onRemoveDraft
}: FixedExpensesReplicationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={() => !isPending && onOpenChange(false)}
            />

            <Card className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                    <div>
                        <CardTitle>Review & Replicate</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">
                            Review expenses imported from {sourceMonthName} to {targetMonthName}.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="-mr-2"
                        disabled={isPending}
                    >
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
                                            onChange={(e) => onDraftChange(tx.id, 'description', e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 font-medium text-slate-900 dark:text-slate-100"
                                            disabled={isPending}
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <CurrencyInput
                                            value={tx.amount}
                                            onChange={(val) => onDraftChange(tx.id, 'amount', val)}
                                            disabled={isPending}
                                        />
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => onRemoveDraft(tx.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            disabled={isPending}
                                        >
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
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="shadow-lg shadow-brand-primary/20 min-w-[140px]"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Confirm & Save'
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
