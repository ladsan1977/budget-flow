import { MobileDataCard } from '../../../components/ui/MobileDataCard';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Edit2, X, Star } from 'lucide-react';
import type { Account } from '../../../types';

interface AccountMobileProps {
    accounts: Account[];
    onEdit: (account: Account) => void;
    onDelete: (id: string) => void;
}

const getBadgeVariant = (type: string) => {
    switch (type) {
        case 'bank': return 'primary';
        case 'cash': return 'success';
        default: return 'outline';
    }
};

export function AccountMobile({ accounts, onEdit, onDelete }: AccountMobileProps) {
    if (accounts.length === 0) {
        return (
            <div className="flex flex-col gap-3">
                <div className="p-8 text-center text-slate-500 bg-white dark:bg-brand-surface rounded-xl border border-slate-200 dark:border-slate-800">
                    No accounts found. Try adding a new one.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {accounts.map((account) => {
                return (
                    <MobileDataCard
                        key={account.id}
                        icon={
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
                            >
                                {/* We can show a star if it's default */}
                                {account.isDefault ? (
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                ) : (
                                    <div className="text-xs font-bold">{account.name.charAt(0).toUpperCase()}</div>
                                )}
                            </div>
                        }
                        categoryName={account.isDefault ? "Primary Account" : "Account"}
                        description={account.name}
                        statusNode={
                            <Badge variant={getBadgeVariant(account.type)} className="text-[10px] px-2 py-0.5 uppercase">
                                {account.type}
                            </Badge>
                        }
                        actions={
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-brand-primary"
                                    onClick={() => onEdit(account)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                    onClick={() => onDelete(account.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        }
                    />
                );
            })}
        </div>
    );
}
