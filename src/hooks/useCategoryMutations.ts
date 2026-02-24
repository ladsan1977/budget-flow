import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory, updateCategory, deleteCategory } from '../services/categories.service';
import type { Category } from '../types';
import { toast } from 'sonner';

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
            createCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to create category:', error);
            toast.error(`Failed to create category: ${error.message}`);
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
            updateCategory(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to update category:', error);
            toast.error(`Failed to update category: ${error.message}`);
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to delete category:', error);
            toast.error(`Failed to delete category: ${error.message}`);
        },
    });
}
