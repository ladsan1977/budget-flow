import { createContext, useContext, useState, type ReactNode } from 'react';

interface DateContextType {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    // Helper to jump to today or reset
    resetDate: () => void;
    // Formatted strings for UI
    monthName: string;
    year: number;
    // Navigation
    previousMonth: () => void;
    nextMonth: () => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
    // Default to current date
    const [currentDate, setCurrentDate] = useState(new Date());

    const resetDate = () => setCurrentDate(new Date());

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();

    const previousMonth = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const nextMonth = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    return (
        <DateContext.Provider value={{
            currentDate,
            setCurrentDate,
            resetDate,
            monthName,
            year,
            previousMonth,
            nextMonth
        }}>
            {children}
        </DateContext.Provider>
    );
}

export function useDate() {
    const context = useContext(DateContext);
    if (context === undefined) {
        throw new Error('useDate must be used within a DateProvider');
    }
    return context;
}
