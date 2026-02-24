import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Edit2, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Category } from '../../../types';
import { resolveColor } from '../../../lib/colors';

interface CategoryDesktopProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

const getBadgeVariant = (type: string) => {
    switch (type) {
        case 'income': return 'success';
        case 'variable': return 'warning';
        case 'fixed': return 'primary';
        default: return 'outline';
    }
};

export function CategoryDesktop({ categories, onEdit, onDelete }: CategoryDesktopProps) {
    if (categories.length === 0) {
        return (
            <Card className="flex overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface flex-col">
                <div className="p-8 text-center text-slate-500">
                    No categories found. Try adding a new one.
                </div>
            </Card>
        );
    }

    return (
        <Card className="flex overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface flex-col max-h-[600px]">
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white border-b border-slate-100 text-slate-500 dark:bg-brand-surface dark:border-slate-800 dark:text-slate-400 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 font-medium">Category Name</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-brand-surface">
                        {categories.map((category) => {
                            const IconComponent = category.icon && (LucideIcons as unknown as Record<string, React.ElementType>)[category.icon]
                                ? (LucideIcons as unknown as Record<string, React.ElementType>)[category.icon]
                                : LucideIcons.Folder;

                            return (
                                <tr key={category.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                                                style={{ backgroundColor: resolveColor(category.color) }}
                                            >
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                {category.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getBadgeVariant(category.type)} className="text-[10px] px-2 py-0.5 uppercase">
                                            {category.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-brand-primary"
                                                onClick={() => onEdit(category)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                                onClick={() => onDelete(category.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
