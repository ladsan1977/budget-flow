import { useState, useRef, useEffect } from 'react';
import { BarChart2, TrendingUp, LineChart, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TrendReportView } from './views/TrendReportView';
import { ProjectedCashFlowView } from './views/ProjectedCashFlowView';
import { MonthSelector } from '../../components/common/MonthSelector';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedReport = REPORT_OPTIONS.find(r => r.id === selectedReportId) || REPORT_OPTIONS[0];
    const Icon = selectedReport.icon;

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                        <div className="relative w-full sm:w-72 shrink-0" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={cn(
                                    "w-full flex items-center justify-between rounded-lg border bg-white dark:bg-slate-800 py-2.5 px-3 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary",
                                    isDropdownOpen
                                        ? "border-brand-primary ring-1 ring-brand-primary text-slate-900 dark:text-slate-100"
                                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                                )}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <Icon className="h-4 w-4 shrink-0 text-brand-primary/80" />
                                    <span className="truncate text-sm font-medium">{selectedReport.label}</span>
                                </div>
                                <ChevronDown className={cn(
                                    "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                                    isDropdownOpen && "rotate-180 text-brand-primary"
                                )} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                                    {REPORT_OPTIONS.map((opt) => {
                                        const OptionIcon = opt.icon;
                                        const isSelected = selectedReportId === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedReportId(opt.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "relative flex w-full items-center gap-2 rounded-md py-2 pl-3 pr-9 text-sm outline-none transition-colors",
                                                    isSelected
                                                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                                                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                                )}
                                            >
                                                <OptionIcon className={cn(
                                                    "h-4 w-4 shrink-0",
                                                    isSelected ? "text-brand-primary" : "text-slate-400 dark:text-slate-500"
                                                )} />
                                                <span className="truncate">{opt.label}</span>
                                                {isSelected && (
                                                    <span className="absolute right-3 flex h-full items-center justify-center text-brand-primary">
                                                        <Check className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
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
