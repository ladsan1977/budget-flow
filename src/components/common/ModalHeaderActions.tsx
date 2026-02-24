import { Button } from '../ui/Button';
import { X, Check } from 'lucide-react';

interface ModalHeaderActionsProps {
    onCancel: () => void;
    formId?: string;
    onSubmit?: () => void;
}

export function ModalHeaderActions({ onCancel, formId, onSubmit }: ModalHeaderActionsProps) {
    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit();
        } else if (formId) {
            const form = document.getElementById(formId) as HTMLFormElement;
            if (form) form.requestSubmit();
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Mobile Header Buttons */}
            <div className="flex sm:hidden items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                    <X className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    onClick={handleSubmit}
                    className="h-8 w-8 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm"
                >
                    <Check className="h-4 w-4" />
                </Button>
            </div>

            {/* Desktop Header Close Button */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="hidden sm:inline-flex -mr-2 shrink-0"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
