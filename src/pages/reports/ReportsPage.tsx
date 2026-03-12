import { useState } from 'react';
import { BarChart2, TrendingUp, LineChart } from 'lucide-react';
import { TrendReportView } from './views/TrendReportView';
import { ProjectedCashFlowView } from './views/ProjectedCashFlowView';
import { MonthSelector } from '../../components/common/MonthSelector';
import { CustomDropdown } from '../../components/ui/CustomDropdown';

const REPORT_OPTIONS = [
    { id: 'trend', label: 'Income vs. Expenses Trend', icon: TrendingUp },
    { id: 'cashflow', label: 'Cash Flow Projection', icon: LineChart },
];

/**
 * Reports page orchestrator.
 * Manages which report is currently selected and delegates rendering to specific view components.
 */
export function ReportsPage() {
    const [selectedReportId, setSelectedReportId] = useState('trend');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-24 md:pb-0">
            {/* Page Header */}
            <div className="sticky sm:static top-16 z-20 -mx-4 sm:mx-0 -mt-4 sm:mt-0 p-4 sm:p-0 mb-2 sm:mb-2 pb-4 sm:pb-0 bg-slate-50/90 dark:bg-brand-background/90 sm:bg-transparent sm:dark:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-slate-200/50 dark:border-slate-800/50 sm:border-none flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <BarChart2 className="h-7 w-7 text-brand-primary" />
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Reports
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Select a report to analyze your finances
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Custom Report Selector */}
                        <div className="w-full sm:w-72 shrink-0">
                            <CustomDropdown
                                options={REPORT_OPTIONS}
                                value={selectedReportId}
                                onChange={setSelectedReportId}
                            />
                        </div>

                        {/* Month Selector */}
                        <div className="flex justify-start sm:justify-end">
                            <MonthSelector />
                        </div>
                    </div>
                </div>
            </div>

            {/* Render Selected View */}
            {selectedReportId === 'trend' && <TrendReportView />}
            {selectedReportId === 'cashflow' && <ProjectedCashFlowView />}
        </div>
    );
}
