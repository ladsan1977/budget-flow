import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { CurrencyInput } from '../../../components/ui/CurrencyInput';
import { Edit2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import type { useVariableExpensesLogic } from '../hooks/useVariableExpensesLogic';

type LogicData = ReturnType<typeof useVariableExpensesLogic>;

interface VariableBudgetEditorProps {
    globalLimit: LogicData['data']['globalLimit'];
    state: LogicData['state'];
    actions: LogicData['actions'];
    className?: string;
}

export function VariableBudgetEditor({ globalLimit, state, actions, className }: VariableBudgetEditorProps) {
    const { isEditingLimit, tempLimit } = state;
    const { setIsEditingLimit, setTempLimit, handleSaveLimit, updateBudgetMutation } = actions;

    return (
        <Card className={`bg-white border-slate-200 dark:bg-brand-surface dark:border-slate-800 shadow-sm relative overflow-hidden ${className ?? ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Monthly Goal
                </CardTitle>
                {isEditingLimit ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingLimit(false)} disabled={updateBudgetMutation.isPending}>Cancel</Button>
                        <Button size="sm" onClick={handleSaveLimit} disabled={updateBudgetMutation.isPending}>
                            {updateBudgetMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                ) : (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                        setTempLimit(globalLimit);
                        setIsEditingLimit(true);
                    }}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit Limit</span>
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditingLimit ? (
                    <CurrencyInput
                        value={tempLimit}
                        onChange={setTempLimit}
                        autoFocus
                        className="text-4xl font-bold py-1 border-0 border-b border-slate-300 rounded-none focus-visible:ring-0 focus-visible:border-brand-primary"
                    />
                ) : (
                    <div className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(globalLimit)}
                    </div>
                )}
                <p className="text-xs text-slate-500 mt-2">
                    Total allowed for all variable categories this month.
                </p>
            </CardContent>
        </Card>
    );
}
