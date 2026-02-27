import { Lightbulb } from 'lucide-react';
import { useTransactionModal } from '../../../context/TransactionModalContext';
import { useNavigate } from '@tanstack/react-router';

export function DashboardEmptyState() {
    const { openModal } = useTransactionModal();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-6 px-6 text-center animate-in fade-in duration-500">

            {/* Illustration — swaps between light and dark versions */}
            <div className="relative mb-4 select-none">
                <div className="absolute inset-0 rounded-full bg-brand-primary/5 blur-3xl scale-150 dark:hidden" />
                {/* Light mode illustration */}
                <img
                    src="/empty-state.png"
                    alt="No cash flow records yet"
                    className="relative w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-lg dark:hidden"
                    draggable={false}
                />
                {/* Dark mode illustration — transparent background, no blending needed */}
                <img
                    src="/empty-state-dark.png"
                    alt="No cash flow records yet"
                    className="relative w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-lg hidden dark:block"
                    draggable={false}
                />
            </div>

            {/* Main message with inline CTA link */}
            <div className="max-w-md mb-6 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    No cash flow records for this month yet.
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Start by{' '}
                    <button
                        onClick={() => openModal({ initialType: 'income' })}
                        className="font-semibold text-brand-primary underline underline-offset-4 decoration-2 decoration-brand-primary/40 hover:decoration-brand-primary transition-all"
                    >
                        adding your first transaction
                    </button>
                    {' '}to track your income, fixed costs, and daily spending — and unlock the full picture of your financial health.
                </p>
            </div>

            {/* Tip card */}
            <div className="flex items-start gap-3 max-w-sm rounded-2xl border border-brand-warning/30 bg-brand-warning/5 dark:bg-brand-warning/10 px-5 py-4 text-left">
                <div className="mt-0.5 shrink-0 p-1.5 rounded-full bg-brand-warning/15">
                    <Lightbulb className="w-4 h-4 text-brand-warning" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-warning mb-1">
                        Pro Tip
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Don&apos;t forget to set your{' '}
                        <button
                            onClick={() => navigate({ to: '/variable-budget' })}
                            className="font-semibold text-brand-warning underline underline-offset-2 hover:text-brand-warning/80 transition-colors"
                        >
                            monthly spending goal
                        </button>
                        {' '}to keep your daily budget on track.
                    </p>
                </div>
            </div>
        </div>
    );
}
