import React from 'react';
import { MobileDataCard } from '../../../components/ui/MobileDataCard';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Edit2, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Category } from '../../../types';
import { resolveColor } from '../../../lib/colors';

interface CategoryMobileProps {
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

export function CategoryMobile({ categories, onEdit, onDelete }: CategoryMobileProps) {
    if (categories.length === 0) {
        return (
            <div className="flex flex-col gap-3">
                <div className="p-8 text-center text-slate-500 bg-white dark:bg-brand-surface rounded-xl border border-slate-200 dark:border-slate-800">
                    No categories found. Try adding a new one.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {categories.map((category) => {
                const IconComponent = category.icon && (LucideIcons as unknown as Record<string, React.ElementType>)[category.icon]
                    ? (LucideIcons as unknown as Record<string, React.ElementType>)[category.icon]
                    : LucideIcons.Folder;

                return (
                    <MobileDataCard
                        key={category.id}
                        icon={
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
                                style={{ backgroundColor: resolveColor(category.color) }}
                            >
                                <IconComponent className="h-4 w-4" />
                            </div>
                        }
                        categoryName="Category"
                        description={category.name}
                        statusNode={
                            <Badge variant={getBadgeVariant(category.type)} className="text-[10px] px-2 py-0.5 uppercase">
                                {category.type}
                            </Badge>
                        }
                        actions={
                            <>
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
                            </>
                        }
                    />
                );
            })}
        </div>
    );
}
