import { formatCurrency } from '../../lib/utils';

type Props = {
    active?: boolean;
    payload?: Array<{ name?: string; value?: string | number; color?: string }>;
    label?: string;
};

/**
 * Reusable custom Recharts tooltip.
 * Pass as: <Tooltip content={<ChartTooltip />} />
 *
 * Styled to match the app's Card/typography system and formats values as currency.
 */
export function ChartTooltip({ active, payload, label }: Props) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-surface shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
            <div className="space-y-1.5">
                {payload.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-500 dark:text-slate-400">{entry.name}</span>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {formatCurrency(Number(entry.value))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
