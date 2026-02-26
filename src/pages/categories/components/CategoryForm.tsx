import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import type { Category, TransactionType } from '../../../types';
import * as LucideIcons from 'lucide-react';
import { resolveColor, PRESET_COLORS } from '../../../lib/colors';
import { PRESET_ICONS } from '../../../lib/icons';

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export interface CategoryFormProps {
    id?: string;
    initialData?: Partial<Category>;
    onSubmit: (data: Partial<Category>) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CategoryForm({ id, initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [type, setType] = useState<TransactionType>(initialData?.type || 'variable');
    const [icon, setIcon] = useState(initialData?.icon || getRandomItem(PRESET_ICONS));
    const [color, setColor] = useState(initialData?.color || getRandomItem(PRESET_COLORS));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        onSubmit({ name, type, icon, color });
    };

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
            <div className="space-y-6 flex-1">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Groceries"
                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100"
                        autoFocus
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Type</label>
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900/50">
                        {(['income', 'fixed', 'variable'] as const).map((t) => {
                            const label = t === 'income' ? 'Income' : t === 'fixed' ? 'Fixed Expenses' : 'Daily Budget';
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "rounded-md px-1 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all text-center",
                                        type === t
                                            ? "bg-white text-slate-900 shadow-sm dark:bg-brand-surface dark:text-slate-100"
                                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    {type === 'variable' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
                            For flexible day-to-day spending
                        </p>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-start sm:items-center justify-between gap-2">
                            <label className="text-sm font-medium text-slate-500 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                                <span>Pick an Icon</span>
                                {type === 'variable' && (
                                    <span className="text-[10px] sm:text-[11px] font-normal text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full flex items-center w-fit">
                                        <LucideIcons.Info className="w-3 h-3 mr-1" />
                                        Counts towards monthly goal
                                    </span>
                                )}
                            </label>
                            <button
                                type="button"
                                onClick={() => setIcon(getRandomItem(PRESET_ICONS))}
                                className="text-xs text-brand-primary font-medium hover:underline shrink-0 pt-0.5 sm:pt-0"
                            >
                                Randomize
                            </button>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {PRESET_ICONS.map((iconName) => {
                                const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setIcon(iconName)}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                            icon === iconName
                                                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30"
                                                : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                                        )}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-500">Pick a Color</label>
                            <button
                                type="button"
                                onClick={() => setColor(getRandomItem(PRESET_COLORS))}
                                className="text-xs text-brand-primary font-medium hover:underline"
                            >
                                Randomize
                            </button>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {PRESET_COLORS.map((colorName) => {
                                return (
                                    <button
                                        key={colorName}
                                        type="button"
                                        onClick={() => setColor(colorName)}
                                        className={cn(
                                            "h-10 w-10 flex items-center justify-center rounded-full transition-all border-2",
                                            color === colorName
                                                ? "border-slate-800 dark:border-white scale-110 shadow-sm"
                                                : "border-transparent hover:scale-105"
                                        )}
                                        style={{ backgroundColor: resolveColor(colorName) }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden sm:flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !name} className="px-8 shadow-lg shadow-brand-primary/20">
                    {isLoading ? 'Saving...' : 'Save Category'}
                </Button>
            </div>
        </form>
    );
}
