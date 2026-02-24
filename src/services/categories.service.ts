import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { Category } from '../types';
import { requireUser, handleSupabaseError } from './base';
import { mapCategory } from './mappers';

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

/**
 * Fetch all categories for the current user
 */
export const fetchCategories = async (): Promise<Category[]> => {
    const userId = await requireUser();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

    if (error) {
        handleSupabaseError(error, 'Failed to fetch categories');
    }

    return (data || []).map(mapCategory);
};

/**
 * Create a new category
 */
export const createCategory = async (
    category: Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Category> => {
    const userId = await requireUser();

    const payload: CategoryInsert = {
        id: crypto.randomUUID(),
        name: category.name,
        type: category.type,
        icon: category.icon || null,
        color: category.color || null,
        user_id: userId,
    };

    const { data, error } = await supabase
        .from('categories')
        .insert(payload)
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to create category');
    }

    return mapCategory(data!);
};

/**
 * Update an existing category
 */
export const updateCategory = async (
    id: string,
    updates: Partial<Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Category> => {
    const userId = await requireUser();

    const updateData: CategoryUpdate = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.icon !== undefined) updateData.icon = updates.icon || null;
    if (updates.color !== undefined) updateData.color = updates.color || null;

    const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        handleSupabaseError(error, 'Failed to update category');
    }

    return mapCategory(data!);
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
    const userId = await requireUser();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        handleSupabaseError(error, 'Failed to delete category');
    }
};
