import type { LegendProps } from 'recharts';

type Props = Pick<LegendProps, 'layout' | 'align' | 'verticalAlign'> & {
    payload?: Array<{ value: string; color?: string }>;
};

/**
 * Reusable custom Recharts legend.
 * Pass as: <Legend content={<ChartLegend />} />
 *
 * Renders colored circle + label pairs in a flex row, matching the app font+color system.
 */
export function ChartLegend({ payload }: Props) {
    if (!payload?.length) return null;

    return (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-3">
            {payload.map((entry) => (
                <div key={entry.value} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.value}</span>
                </div>
            ))}
        </div>
    );
}
