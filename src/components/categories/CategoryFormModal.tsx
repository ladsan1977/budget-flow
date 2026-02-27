import { Card, CardHeader, CardTitle } from '../ui/Card';
import { ModalHeaderActions } from '../common/ModalHeaderActions';
import { CategoryForm } from '../../pages/categories/components/CategoryForm';
import { useCreateCategory } from '../../hooks/useCategoryMutations';
import { cn } from '../../lib/utils';
import type { Category, TransactionType } from '../../types';

export interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialName?: string;
    initialType?: TransactionType;
    onSuccess?: (categoryId: string) => void;
}

export function CategoryFormModal({ isOpen, onClose, initialName, initialType, onSuccess }: CategoryFormModalProps) {
    const createMutation = useCreateCategory();

    if (!isOpen) return null;

    const handleSubmit = (data: Partial<Category>) => {
        createMutation.mutate({
            name: data.name!,
            type: data.type || 'variable',
            icon: data.icon || undefined,
            color: data.color || undefined,
        }, {
            onSuccess: (newCategory) => {
                if (onSuccess) {
                    // We assume the mutation returns the created category. 
                    // Let's check useCreateCategory implementation just in case.
                    // If it doesn't return the category, we might need to handle this differently.
                    // In categories.service.ts, createCategory returns the created Category.
                    onSuccess(newCategory.id);
                }
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[170] sm:flex sm:items-center sm:justify-center p-0 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <Card
                className={cn(
                    // Form Factor & Positioning
                    "fixed top-10 bottom-24 left-4 right-4",
                    "sm:relative sm:top-auto sm:bottom-auto sm:left-auto sm:right-auto sm:w-full sm:max-w-lg sm:h-auto",
                    // Layout
                    "flex flex-col transform overflow-hidden sm:overflow-visible p-0",
                    // Styling & Animations
                    "rounded-2xl bg-white shadow-2xl transition-all dark:bg-brand-surface",
                    "animate-in zoom-in-95 duration-200"
                )}
            >
                <CardHeader className="shrink-0 flex flex-row items-center justify-between border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800">
                    <CardTitle className="text-lg md:text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 flex-none">
                        Add Category
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        <ModalHeaderActions
                            onCancel={onClose}
                            formId="category-form-modal"
                        />
                    </div>
                </CardHeader>
                <div className="flex flex-col sm:overflow-visible overflow-y-auto w-full md:h-auto min-h-0">
                    <div className="p-4 sm:p-6 pb-12 sm:pb-6 space-y-6 flex-1">
                        <CategoryForm
                            id="category-form-modal"
                            initialData={{ name: initialName, type: initialType }}
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                            isLoading={createMutation.isPending}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
