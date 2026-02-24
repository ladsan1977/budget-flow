import { useState, useMemo } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../../hooks/useCategoryMutations';
import type { Category } from '../../../types';

export function useCategoryLogic() {
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

    const closeDeleteModal = () => {
        setCategoryToDelete(null);
    };

    const closeFormModal = () => {
        setIsModalOpen(false);
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

    return {
        state: {
            categories: sortedCategories,
            isLoading,
            error,
            isModalOpen,
            editingCategory,
            categoryToDelete,
            isSaving: createMutation.isPending || updateMutation.isPending
        },
        actions: {
            refetch,
            handleOpenCreate,
            handleOpenEdit,
            handleDelete,
            confirmDelete,
            closeDeleteModal,
            closeFormModal,
            handleSubmit,
            setIsModalOpen
        }
    };
}
