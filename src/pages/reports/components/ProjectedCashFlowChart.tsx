import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { formatCompactCurrency } from '../../../lib/utils';
import { useIsMobile } from '../../../hooks/ui/useIsMobile';
import type { DailyProjection } from '../hooks/useProjectedCashFlow';

interface Props {
    data: DailyProjection[];
}

/**
 * Renders the Projected Cash Flow as a line chart.
 * Follows the user's specific spreadsheet visualization.
 */
export function ProjectedCashFlowChart({ data }: Props) {
    const hasData = data.length > 0;
    const isMobile = useIsMobile();

    // Custom formatter for the internal tooltips to show full numbers
    // e.g. $10,473,992
    const formatFullCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>Cash Flow Projection</CardTitle>
                        <CardDescription className="mt-1">
                            Daily projection based on scheduled income and recurring expenses
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!hasData ? (
                    <div className="flex h-64 items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
                        No projection data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={360}>
                        <LineChart
                            data={data}
                            margin={
                                isMobile
                                    ? { top: 20, right: 10, left: 0, bottom: 20 }
                                    : { top: 20, right: 20, left: 10, bottom: 20 }
                            }
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-800"
                                vertical={true}
                                horizontal={true}
                            />

                            {/* Match the user's spreadsheet interval: show every 7 days (weekly) */}
                            <XAxis
                                dataKey="date"
                                tick={{ fill: 'currentColor', fontSize: 11 }}
                                className="text-slate-500 dark:text-slate-400"
                                axisLine={true}
                                tickLine={true}
                                interval={6}
                                tickMargin={12}
                                label={{ value: 'Date', position: 'insideBottom', offset: -15, fill: 'currentColor', fontSize: 13 }}
                            />

                            <YAxis
                                tickFormatter={(value) => {
                                    if (value === 0) return '$0';
                                    return new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        notation: 'compact',
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                    }).format(value);
                                }}
                                tick={{ fill: 'currentColor', fontSize: 10 }}
                                className="text-slate-500 dark:text-slate-400"
                                axisLine={true}
                                tickLine={true}
                                width={isMobile ? 50 : 60}
                                label={
                                    isMobile ? undefined : {
                                        value: 'Balance in Millions',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fill: 'currentColor',
                                        fontSize: 13,
                                        dy: 60
                                    }
                                }
                            />

                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-3 text-sm">
                                                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Date: {label}</p>
                                                <div className="flex flex-col gap-1">
                                                    {payload.map((entry: any, index: number) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
                                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                                {formatFullCurrency(Number(entry.value) || 0)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />

                            <Line
                                type="stepAfter" // Step chart makes sense for daily discreet changes
                                dataKey="projectedBalance"
                                name="Projected Flow"
                                stroke="#3B82F6" // Standard blue to match the spreadsheet
                                strokeWidth={2.5}
                                dot={(props: any) => {
                                    // Custom dot that renders a label on top to match the image precisely
                                    const { cx, cy, payload, index } = props;
                                    // Let's only show labels for significant data points to avoid clutter,
                                    // or perhaps every other point, or if there were income/expenses that day, 
                                    // for simplicity let's show value if there was activity, except day 1
                                    const hasActivity = index === 0 || payload.income > 0 || payload.expenses > 0;

                                    // Alternate vertical placement to prevent horizontal overlapping 
                                    // between consecutive days (one goes up, one goes down)
                                    const yOffset = index % 2 === 0 ? -12 : 20;

                                    return (
                                        <g key={`dot-${index}`}>
                                            <circle cx={cx} cy={cy} r={hasActivity ? 4 : 2} fill="#3B82F6" stroke="white" strokeWidth={hasActivity ? 1.5 : 1} />
                                            {hasActivity && !isMobile && (
                                                <text
                                                    x={cx}
                                                    y={cy + yOffset}
                                                    fill="#3B82F6"
                                                    fontSize="11"
                                                    textAnchor="middle"
                                                    fontWeight="bold"
                                                >
                                                    {formatCompactCurrency(payload.projectedBalance)}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
