import { QueryErrorFallback } from '../../components/ui/QueryErrorFallback';
import { DashboardSkeleton } from '../../components/ui/DashboardSkeleton';
import { useDashboardLogic } from './hooks/useDashboardLogic';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { DashboardDesktop } from './components/DashboardDesktop';
import { DashboardMobile } from './components/DashboardMobile';
import { useTransactionModal } from '../../context/TransactionModalContext';

export default function DashboardPage() {
    const {
        stats,
        isEmptyState,
        isFirstTimeUser,
        incomeMomChange,
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
    const { isOpen: isTransactionModalOpen } = useTransactionModal();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <QueryErrorFallback error={error as Error} resetErrorBoundary={refetch} />;
    }

    if (!stats) {
        return null;
    }

    const isLocked = isEmptyState;
    // Show the onboarding overlay for ANY empty month so the user knows there
    // is no data. The overlay itself adapts its content based on isFirstTimeUser:
    // - true  → full setup tutorial (new user, no escape needed)
    // - false → lightweight "no data" panel with a ← Go back button
    const shouldShowOnboarding = isEmptyState && !isTransactionModalOpen;

    const viewProps = {
        stats,
        isEmptyState,
        isFirstTimeUser,
        incomeMomChange,
        variableBreakdown,
        overallBudgetUsagePercentage,
        gaugeColor,
        gaugeStroke,
        flowComposition,
        monthName,
        year,
        isLocked,
        shouldShowOnboarding
    };

    return isMobile ? (
        <DashboardMobile {...viewProps} />
    ) : (
        <DashboardDesktop {...viewProps} />
    );
}
