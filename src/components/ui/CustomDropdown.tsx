import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DropdownOption {
    id: string;
    label: string;
    icon?: React.ElementType;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: React.ElementType;
    className?: string;
}

export function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    icon: GlobalIcon,
    className
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value) || options[0];
    const ActiveIcon = selectedOption?.icon || GlobalIcon;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative shrink-0", className)} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between rounded-lg border bg-white dark:bg-slate-800 py-2 px-3 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand-primary",
                    isOpen
                        ? "border-brand-primary ring-1 ring-brand-primary text-slate-900 dark:text-slate-100"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                )}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {ActiveIcon && <ActiveIcon className="h-4 w-4 shrink-0 text-brand-primary/80" />}
                    <span className="truncate text-sm font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown className={cn(
                    "ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                    isOpen && "rotate-180 text-brand-primary"
                )} />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                    {options.map((opt) => {
                        const OptionIcon = opt.icon;
                        const isSelected = value === opt.id;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                    onChange(opt.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "relative flex w-full items-center gap-2 rounded-md py-2 pl-3 pr-9 text-sm outline-none transition-colors",
                                    isSelected
                                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                )}
                            >
                                {OptionIcon && (
                                    <OptionIcon className={cn(
                                        "h-4 w-4 shrink-0",
                                        isSelected ? "text-brand-primary" : "text-slate-400 dark:text-slate-500"
                                    )} />
                                )}
                                <span className="truncate">{opt.label}</span>
                                {isSelected && (
                                    <span className="absolute right-3 flex h-full items-center justify-center text-brand-primary">
                                        <Check className="h-4 w-4" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
