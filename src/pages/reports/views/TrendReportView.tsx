import { useState } from 'react';
import { useTrendReport } from '../hooks/useTrendReport';
import { TrendChart } from '../components/TrendChart';
import { cn } from '../../../lib/utils';

const RANGE_OPTIONS: { label: string; value: number }[] = [
    { label: '3M', value: 3 },
    { label: '6M', value: 6 },
    { label: '12M', value: 12 },
];

const PERIOD_LABELS: Record<number, string> = {
    3: '3 months',
    6: '6 months',
    12: '12 months',
};

export function TrendReportView() {
    const [monthCount, setMonthCount] = useState(6);
    const { data, isLoading, error } = useTrendReport(monthCount);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                {/* Month Range Picker */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 self-start sm:self-auto w-full sm:w-auto overflow-x-auto">
                    {RANGE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setMonthCount(opt.value)}
                            className={cn(
                                'flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                                monthCount === opt.value
                                    ? 'bg-white dark:bg-brand-surface text-brand-primary shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="rounded-lg border border-brand-danger/30 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
                    Failed to load report data. Please try again.
                </div>
            )}

            {/* Chart */}
            {isLoading ? (
                <div className="h-[420px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : (
                <TrendChart data={data} periodLabel={PERIOD_LABELS[monthCount]} />
            )}
        </div>
    );
}
