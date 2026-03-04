import { X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface MobileRadioDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: { id: string; label: string }[];
    selectedId?: string;
    onSelect: (id: string) => void;
}

export function MobileRadioDrawer({
    isOpen,
    onClose,
    title,
    options,
    selectedId,
    onSelect
}: MobileRadioDrawerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[160] flex items-end sm:items-center justify-center sm:p-6">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative w-full sm:max-w-sm bg-white dark:bg-brand-surface rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] transition-all animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-100 dark:border-slate-800 p-4 pt-5 sm:p-5 pb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2 h-8 w-8 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 pb-10 custom-scrollbar">
                    <div className="space-y-1.5">
                        {options.map((option) => {
                            const isSelected = selectedId === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onSelect(option.id);
                                        // Give the radio button a tiny visual delay before closing for better UX
                                        setTimeout(onClose, 150);
                                    }}
                                    className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 transition-all hover:bg-slate-50 active:scale-[0.98] dark:hover:bg-slate-800/50 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                                >
                                    <span className={cn(
                                        "text-base font-medium transition-colors",
                                        isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                                    )}>
                                        {option.label}
                                    </span>

                                    <div className={cn(
                                        "flex h-[22px] w-[22px] items-center justify-center rounded-full border shadow-sm transition-all duration-200",
                                        isSelected
                                            ? "border-brand-primary bg-brand-primary text-white scale-110"
                                            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                                    )}>
                                        <Check className={cn("h-3.5 w-3.5 transition-transform duration-200", isSelected ? "scale-100" : "scale-0")} strokeWidth={3} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
