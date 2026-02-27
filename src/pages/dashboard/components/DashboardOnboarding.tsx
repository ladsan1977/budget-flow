import { useEffect } from 'react';
import { DollarSign, CreditCard, Coins, Activity, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useTransactionModal } from '../../../context/TransactionModalContext';
import { useDate } from '../../../context/DateContext';
import { useAuth } from '../../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

interface DashboardOnboardingProps {
    isMobile?: boolean;
    /** true  = brand-new user with no transactions anywhere → hide "Go back" button
     *  false = existing user on an empty month → show "Go back to [last active month]" */
    isFirstTimeUser?: boolean;
}

export function DashboardOnboarding({ isMobile = false, isFirstTimeUser = true }: DashboardOnboardingProps) {
    const { isOpen, openModal } = useTransactionModal();
    const { setCurrentDate } = useDate();
    const { user } = useAuth();

    // Fetch the most recent month that has at least one transaction.
    // Only runs for existing users (isFirstTimeUser = false) so new users pay
    // zero cost. The result drives the "Go back" button label and destination.
    const { data: lastActiveDate } = useQuery<Date | null, Error>({
        queryKey: ['transactions', 'last-active-date', user?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('transactions')
                .select('date')
                .order('date', { ascending: false })
                .limit(1)
                .single();
            if (!data?.date) return null;
            const d = new Date(data.date);
            return new Date(d.getFullYear(), d.getMonth(), 1);
        },
        enabled: !!user && !isFirstTimeUser,
        staleTime: 5 * 60 * 1000,
    });

    const lastMonthLabel = lastActiveDate
        ? lastActiveDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null;

    const handleGoBack = () => {
        if (lastActiveDate) setCurrentDate(lastActiveDate);
    };

    // Lock body scroll while the overlay is visible
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    if (isOpen) return null;

    const steps = [
        {
            icon: DollarSign,
            title: '1. Register Income',
            description: 'First, add your salary or main income. This is the foundation of your monthly flow.',
            iconColor: 'text-brand-success',
            iconBg: 'bg-brand-success/10'
        },
        {
            icon: CreditCard,
            title: '2. Fixed Obligations',
            description: 'List your recurring bills (Rent, Utilities, etc.) in the Fixed Expenses page to know your committed costs.',
            iconColor: 'text-brand-primary',
            iconBg: 'bg-brand-primary/10'
        },
        {
            icon: Coins,
            title: '3. Set Daily Budget',
            description: 'Define how much you want to spend on day-to-day items in the Daily Budget section.',
            iconColor: 'text-brand-warning',
            iconBg: 'bg-brand-warning/10'
        },
        {
            icon: Activity,
            title: '4. Real-time Health',
            description: 'Once done, your "Net Flow Health" gauge will show you exactly how much "safe-to-spend" money you have left.',
            iconColor: 'text-slate-500',
            iconBg: 'bg-slate-500/10'
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl animate-in fade-in duration-500 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 flex flex-col gap-8">

                {/* Header */}
                <div className="text-center flex flex-col items-center">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold tracking-wide uppercase">
                        Getting Started • 4 Steps to complete
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
                        Master Your Cash Flow
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                        Complete these 4 steps to visualize your financial health and unlock the full power of your dashboard.
                    </p>
                </div>

                {/* Steps grid */}
                <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-2 lg:grid-cols-4 gap-4"}>
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <Card key={index} className="border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-none">
                                <CardHeader className={isMobile ? "pb-2 flex flex-row items-center gap-4 space-y-0" : "pb-2"}>
                                    <div className={`p-3 rounded-full w-fit ${step.iconBg} ${isMobile ? "" : "mb-4"}`}>
                                        <Icon className={`w-6 h-6 ${step.iconColor}`} />
                                    </div>
                                    <div>
                                        {isMobile && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Step {index + 1}</div>}
                                        <CardTitle className="text-lg">{isMobile ? step.title.replace(/^\d+\.\s*/, '') : step.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA row — primary action always visible; go-back only for returning users */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                    {/* "Go back" — only shown when the user has transactions in another month */}
                    {!isFirstTimeUser && lastMonthLabel && (
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleGoBack}
                            className="w-full sm:w-auto gap-2 py-6 px-8 h-auto rounded-xl"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to {lastMonthLabel}
                        </Button>
                    )}

                    <Button
                        size="lg"
                        onClick={() => openModal({ initialType: 'income' })}
                        className="w-full sm:w-auto text-xl py-6 px-12 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        Register Your First Income
                    </Button>
                </div>
            </Card>
        </div>
    );
}
