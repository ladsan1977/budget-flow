import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { ChartTooltip } from '../../../components/ui/ChartTooltip';
import { ChartLegend } from '../../../components/ui/ChartLegend';
import { formatCompactCurrency } from '../../../lib/utils';
import type { MonthStat } from '../../../types';

// Brand colors — mirroring the CSS variables used throughout the project
const COLORS = {
    income: '#10B981',       // brand-success
    fixed: '#6366F1',        // brand-primary
    variable: '#F59E0B',     // brand-warning
    netFlow: '#64748B',      // slate-500
};

interface TrendChartProps {
    data: MonthStat[];
    periodLabel: string;
}

/**
 * Pure presentational component — all data comes from props.
 * Receives MonthStat[] from useTrendReport (via ReportsPage) and renders
 * a Recharts AreaChart with four series.
 */
export function TrendChart({ data, periodLabel }: TrendChartProps) {
    const hasData = data.some(
        (d) => d.income > 0 || d.fixedExpenses > 0 || d.variableExpenses > 0
    );

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>Income vs. Expenses Trend</CardTitle>
                        <CardDescription className="mt-1">
                            Monthly breakdown over the last {periodLabel}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!hasData ? (
                    <div className="flex h-64 items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
                        No transaction data for this period.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart
                            data={data}
                            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={COLORS.income} stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="gradFixed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.fixed} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={COLORS.fixed} stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="gradVariable" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.variable} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={COLORS.variable} stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="gradNetFlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.netFlow} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={COLORS.netFlow} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-800"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="month"
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                className="text-slate-500 dark:text-slate-400"
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tickFormatter={formatCompactCurrency}
                                tick={{ fill: 'currentColor', fontSize: 11 }}
                                className="text-slate-400 dark:text-slate-500"
                                axisLine={false}
                                tickLine={false}
                                width={60}
                            />

                            <Tooltip content={<ChartTooltip />} />
                            <Legend content={<ChartLegend />} />

                            <Area
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke={COLORS.income}
                                strokeWidth={2.5}
                                fill="url(#gradIncome)"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="fixedExpenses"
                                name="Fixed Expenses"
                                stroke={COLORS.fixed}
                                strokeWidth={2.5}
                                fill="url(#gradFixed)"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="variableExpenses"
                                name="Variable Expenses"
                                stroke={COLORS.variable}
                                strokeWidth={2.5}
                                fill="url(#gradVariable)"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="netFlow"
                                name="Net Flow"
                                stroke={COLORS.netFlow}
                                strokeWidth={2}
                                strokeDasharray="5 3"
                                fill="url(#gradNetFlow)"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
