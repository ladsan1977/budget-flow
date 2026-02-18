import { useQuery } from '@tanstack/react-query';
import { calculateDashboardStats } from '../services/supabaseData';

export function useDashboardStats(currentDate: Date) {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    return useQuery({
        queryKey: ['dashboard-stats', year, month],
        queryFn: () => calculateDashboardStats(currentDate),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
