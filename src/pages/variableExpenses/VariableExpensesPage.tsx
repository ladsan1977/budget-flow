import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useVariableExpensesLogic } from './hooks/useVariableExpensesLogic';
import { VariableExpensesDesktop } from './components/VariableExpensesDesktop';
import { VariableExpensesMobile } from './components/VariableExpensesMobile';
import { TransactionModal } from '../../components/transactions/TransactionModal';

export default function VariableCostsPage() {
    const isMobile = useIsMobile();
    const logic = useVariableExpensesLogic();

    if (logic.state.limitLoading) {
        return null; // Could show a spinner or skeleton here
    }

    return (
        <>
            {isMobile ? (
                <VariableExpensesMobile {...logic} />
            ) : (
                <VariableExpensesDesktop {...logic} />
            )}

            <TransactionModal
                isOpen={logic.modals.isAddModalOpen}
                onClose={() => logic.modals.setIsAddModalOpen(false)}
                initialType="variable"
                lockType={true}
            />
        </>
    );
}
