import { Search, X, Filter } from 'lucide-react';
import { CustomDropdown } from '../../../components/ui/CustomDropdown';
import type { TransactionFiltersState, FilterType, FilterStatus, FilterExpenseNature } from '../hooks/useTransactionFilters';

interface TransactionFiltersProps {
    filtersState: TransactionFiltersState;
}

const TYPE_OPTIONS: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All Types' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
    { id: 'transfer', label: 'Transfer' },
];

const STATUS_OPTIONS: { id: FilterStatus; label: string }[] = [
    { id: 'all', label: 'All Statuses' },
    { id: 'paid', label: 'Paid' },
    { id: 'pending', label: 'Pending' },
];

const NATURE_OPTIONS: { id: FilterExpenseNature; label: string }[] = [
    { id: 'all', label: 'All Natures' },
    { id: 'fixed', label: 'Fixed' },
    { id: 'variable', label: 'Variable' },
];

export function TransactionFilters({ filtersState }: TransactionFiltersProps) {
    const {
        searchQuery, setSearchQuery,
        filterType, setFilterType,
        filterStatus, setFilterStatus,
        filterExpenseNature, setFilterExpenseNature,
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

            {/* Filter Dropdowns row */}
            <div className="flex flex-wrap items-center gap-3">
                <CustomDropdown
                    className="w-full sm:w-36"
                    options={TYPE_OPTIONS}
                    value={filterType}
                    onChange={(val) => setFilterType(val as FilterType)}
                    icon={Filter}
                />

                <CustomDropdown
                    className="w-full sm:w-36"
                    options={STATUS_OPTIONS}
                    value={filterStatus}
                    onChange={(val) => setFilterStatus(val as FilterStatus)}
                />

                {(filterType === 'all' || filterType === 'expense') && (
                    <CustomDropdown
                        className="w-full sm:w-40"
                        options={NATURE_OPTIONS}
                        value={filterExpenseNature}
                        onChange={(val) => setFilterExpenseNature(val as FilterExpenseNature)}
                    />
                )}

                {/* Clear all */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-auto sm:ml-2"
                    >
                        <X className="h-3 w-3" />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
