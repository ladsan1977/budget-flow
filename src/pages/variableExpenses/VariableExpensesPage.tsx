import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useVariableExpensesLogic } from './hooks/useVariableExpensesLogic';
import { VariableExpensesDesktop } from './components/VariableExpensesDesktop';
import { VariableExpensesMobile } from './components/VariableExpensesMobile';

export default function VariableCostsPage() {
    const isMobile = useIsMobile();
    const logic = useVariableExpensesLogic();

    if (logic.state.limitLoading) {
        return null; // Could show a spinner or skeleton here
    }

    if (isMobile) {
        return <VariableExpensesMobile {...logic} />;
    }

    return <VariableExpensesDesktop {...logic} />;
}
