import { useState, useMemo, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import type { Category, TransactionType } from '../../types';
import * as LucideIcons from 'lucide-react';
import { resolveColor } from '../../lib/colors';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface MobileCategorySelectorProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    selectedId?: string;
    onSelect: (categoryId: string) => void;
    type: TransactionType;
}

export function MobileCategorySelector({
    isOpen,
    onClose,
    categories,
    selectedId,
    onSelect,
    type,
}: MobileCategorySelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Reset search when opened
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const filteredCategories = useMemo(() => {
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const incomeCategories = filteredCategories.filter(c => c.type === 'income');
    const fixedCategories = filteredCategories.filter(c => c.type === 'fixed');
    const variableCategories = filteredCategories.filter(c => c.type === 'variable');

    if (!isOpen) return null;

    const renderCategoryGroup = (title: string, groupCategories: Category[]) => {
        if (groupCategories.length === 0) return null;

        return (
            <div className="space-y-3 mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1 dark:text-slate-400">
                    {title}
                </h3>
                <div className="grid grid-cols-4 gap-3">
                    {groupCategories.map((cat) => {
                        const IconComponent = (LucideIcons as any)[cat.icon || 'HelpCircle'] || LucideIcons.HelpCircle;
                        const isSelected = cat.id === selectedId;
                        const bgColor = resolveColor(cat.color);

                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    onSelect(cat.id);
                                    onClose();
                                }}
                                className="group flex flex-col items-center gap-2"
                            >
                                <div
                                    className={cn(
                                        "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200",
                                        isSelected
                                            ? "ring-2 ring-brand-primary ring-offset-2 dark:ring-offset-slate-900 shadow-md scale-110"
                                            : "hover:scale-105 active:scale-95 shadow-sm opacity-90 hover:opacity-100"
                                    )}
                                    style={{
                                        backgroundColor: bgColor,
                                        color: '#ffffff', // Ensure icon is legible (white usually works best on colors)
                                    }}
                                >
                                    <IconComponent className="h-6 w-6" />
                                </div>
                                <span
                                    className={cn(
                                        "text-[11px] font-medium text-center leading-tight line-clamp-2 px-1 break-words w-full",
                                        isSelected
                                            ? "text-brand-primary dark:text-brand-primary"
                                            : "text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                    )}
                                >
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative w-full sm:max-w-md bg-white dark:bg-brand-surface rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh] transition-all animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-300">

                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-100 dark:border-slate-800 p-4 pt-5 sm:p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Category</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2 h-8 w-8 rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find a category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white transition-all"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-6 pt-5 custom-scrollbar">
                    {type === 'income' && renderCategoryGroup('Income', incomeCategories)}
                    {type === 'fixed' && renderCategoryGroup('Fixed Expenses', fixedCategories)}
                    {type === 'variable' && renderCategoryGroup('Variable Expenses', variableCategories)}

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <p className="text-sm">No categories found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
