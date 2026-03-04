import { Search, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { TransactionFiltersState, FilterType, FilterStatus } from '../hooks/useTransactionFilters';

interface TransactionFiltersProps {
    filtersState: TransactionFiltersState;
}

const TYPE_OPTIONS: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'transfer', label: 'Transfer' },
];

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
];

function FilterChip({
    label,
    isActive,
    onClick,
    activeClassName,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
    activeClassName: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all border',
                isActive
                    ? activeClassName
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            )}
        >
            {label}
        </button>
    );
}

const TYPE_ACTIVE_CLASSES: Record<FilterType, string> = {
    all: 'border-brand-primary bg-brand-primary/10 text-brand-primary dark:border-brand-primary dark:bg-brand-primary/20',
    income: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400',
    expense: 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-900/30 dark:text-orange-400',
    transfer: 'border-slate-500 bg-slate-100 text-slate-700 dark:border-slate-400 dark:bg-slate-700 dark:text-slate-300',
};

const STATUS_ACTIVE_CLASSES: Record<FilterStatus, string> = {
    all: 'border-brand-primary bg-brand-primary/10 text-brand-primary dark:border-brand-primary dark:bg-brand-primary/20',
    paid: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-900/30 dark:text-orange-400',
};

export function TransactionFilters({ filtersState }: TransactionFiltersProps) {
    const {
        searchQuery, setSearchQuery,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        clearFilters, hasActiveFilters,
    } = filtersState;

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Search input */}
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by description or date..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:border-slate-800 dark:bg-brand-surface dark:text-slate-100 dark:placeholder-slate-500"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter chips row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {/* Type filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">Type:</span>
                    {TYPE_OPTIONS.map((opt) => (
                        <FilterChip
                            key={opt.value}
                            label={opt.label}
                            isActive={filterType === opt.value}
                            onClick={() => setFilterType(opt.value)}
                            activeClassName={TYPE_ACTIVE_CLASSES[opt.value]}
                        />
                    ))}
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">Status:</span>
                    {STATUS_OPTIONS.map((opt) => (
                        <FilterChip
                            key={opt.value}
                            label={opt.label}
                            isActive={filterStatus === opt.value}
                            onClick={() => setFilterStatus(opt.value)}
                            activeClassName={STATUS_ACTIVE_CLASSES[opt.value]}
                        />
                    ))}
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-auto"
                    >
                        <X className="h-3 w-3" />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
