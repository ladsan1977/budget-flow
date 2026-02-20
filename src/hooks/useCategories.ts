import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../services/supabaseData';
import type { Category } from '../types';
import { useAuth } from '../context/AuthContext';

export function useCategories() {
    const { user } = useAuth();
    return useQuery<Category[], Error>({
        queryKey: ['categories', user?.id],
        queryFn: fetchCategories,
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}
