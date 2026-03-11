import { useProjectedCashFlow } from '../hooks/useProjectedCashFlow';
import { ProjectedCashFlowChart } from '../components/ProjectedCashFlowChart';

export function ProjectedCashFlowView() {
    const { data, isLoading } = useProjectedCashFlow();

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Chart */}
            <div className="w-full">
                {isLoading ? (
                    <div className="h-[420px] w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800" />
                ) : (
                    <ProjectedCashFlowChart data={data} />
                )}
            </div>

            {/* Context table mimicking the spreadsheet visualization could go down here */}
            {!isLoading && data.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-[0_1px_0_0_theme(colors.slate.200)] dark:shadow-[0_1px_0_0_theme(colors.slate.700)]">
                            <tr>
                                <th className="py-3 px-4 w-28 text-center">Date</th>
                                <th className="py-3 px-4 text-right">Income</th>
                                <th className="py-3 px-4 text-right">Expenses</th>
                                <th className="py-3 px-4 text-right">Projected Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="py-2.5 px-4 font-medium text-center text-slate-500 w-28">{row.date}</td>
                                    <td className="py-2.5 px-4 text-right text-brand-success">
                                        {row.income > 0 ? `$${(row.income).toLocaleString('en-US')}` : ''}
                                    </td>
                                    <td className="py-2.5 px-4 text-right text-brand-primary">
                                        {row.expenses > 0 ? `$${(row.expenses).toLocaleString('en-US')}` : ''}
                                    </td>
                                    <td className="py-2.5 px-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                                        ${(row.projectedBalance).toLocaleString('en-US')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
