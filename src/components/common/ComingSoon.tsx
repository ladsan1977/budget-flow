import { useNavigate } from '@tanstack/react-router';
import { Rocket, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface ComingSoonProps {
    title?: string;
    description?: string;
    icon?: 'rocket' | 'sparkles';
}

export function ComingSoon({
    title = 'Coming Soon',
    description = "We're working hard on something awesome! Check back later.",
    icon = 'rocket'
}: ComingSoonProps) {
    const navigate = useNavigate();

    const IconComponent = icon === 'rocket' ? Rocket : Sparkles;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mb-10 group">
                <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-3xl group-hover:bg-brand-500/30 transition-colors duration-500 animate-pulse" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-brand-surface dark:shadow-none transition-transform duration-500 group-hover:scale-110">
                    <IconComponent className="h-14 w-14 text-brand-500 dark:text-brand-400 group-hover:animate-bounce" />
                    {icon === 'rocket' && (
                        <div className="absolute -bottom-2 -right-2 text-2xl group-hover:animate-ping delay-150">
                            ✨
                        </div>
                    )}
                </div>
            </div>

            <h2 className="mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                {title}
            </h2>

            <p className="mb-10 max-w-lg text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
            </p>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                    className="gap-2 rounded-full px-6 transition-all hover:-translate-x-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
}
