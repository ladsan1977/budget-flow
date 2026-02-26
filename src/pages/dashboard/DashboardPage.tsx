import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { DashboardSkeleton } from '../../components/ui/DashboardSkeleton';
import { useDashboardLogic } from './hooks/useDashboardLogic';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { DashboardDesktop } from './components/DashboardDesktop';
import { DashboardMobile } from './components/DashboardMobile';

export default function DashboardPage() {
    const {
        stats,
        variableBreakdown,
        overallBudgetUsagePercentage,
        gaugeColor,
        gaugeStroke,
        flowComposition,
        isLoading,
        error,
        refetch,
        monthName,
        year
    } = useDashboardLogic();
    const isMobile = useIsMobile();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <QueryErrorFallback error={error as Error} resetErrorBoundary={refetch} />;
    }

    if (!stats) {
        return null;
    }

    const viewProps = {
        stats,
        variableBreakdown,
        overallBudgetUsagePercentage,
        gaugeColor,
        gaugeStroke,
        flowComposition,
        monthName,
        year
    };

    return isMobile ? (
        <DashboardMobile {...viewProps} />
    ) : (
        <DashboardDesktop {...viewProps} />
    );
}
