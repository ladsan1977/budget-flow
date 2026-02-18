import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../services/supabaseData';
import type { Category } from '../types';

export function useCategories() {
    return useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}
