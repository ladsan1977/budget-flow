import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { Plus, X, Edit2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useCategoryMutations';
import { CategoryForm } from '../../components/categories/CategoryForm';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { Category } from '../../types';
import { resolveColor } from '../../lib/colors';
import { Badge } from '../../components/ui/Badge';

export default function CategoryPage() {
    const { data: categories = [], isLoading, error, refetch } = useCategories();

    const sortedCategories = useMemo(() => {
        const typeOrder: Record<string, number> = {
            'income': 1,
            'fixed': 2,
            'variable': 3
        };

        return [...categories].sort((a, b) => {
            if (a.type !== b.type) {
                return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
            }
            return a.name.localeCompare(b.name);
        });
    }, [categories]);

    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    if (error) {
        return <QueryErrorFallback error={error} resetErrorBoundary={refetch} title="Failed to load categories" />;
    }

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setCategoryToDelete(id);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            deleteMutation.mutate(categoryToDelete);
            setCategoryToDelete(null);
        }
    };

    const handleSubmit = (data: Partial<Category>) => {
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, updates: data }, {
                onSuccess: () => setIsModalOpen(false)
            });
        } else {
            createMutation.mutate(data as unknown as Omit<Category, 'id'>, {
                onSuccess: () => setIsModalOpen(false)
            });
        }
    };

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'income': return 'success';
            case 'variable': return 'warning';
            case 'fixed': return 'primary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Categories
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage your incoming and outgoing categories.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleOpenCreate} className="gap-2 shadow-lg shadow-brand-primary/20">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-slate-500">Loading categories...</div>
            ) : (
                <Card className="overflow-hidden border-slate-200 shadow-sm dark:border-slate-800 dark:bg-brand-surface flex flex-col max-h-[600px]">
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
                                {sortedCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                            No categories found. Try adding a new one.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedCategories.map((category) => {
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
                                                            onClick={() => handleOpenEdit(category)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                                            onClick={() => handleDelete(category.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <Card className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl transition-all dark:bg-brand-surface animate-in fade-in zoom-in-95 duration-200">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                            <CardTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="-mr-2">
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <div className="p-6">
                            <CategoryForm
                                initialData={editingCategory || undefined}
                                onSubmit={handleSubmit}
                                onCancel={() => setIsModalOpen(false)}
                                isLoading={createMutation.isPending || updateMutation.isPending}
                            />
                        </div>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Yes, delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
