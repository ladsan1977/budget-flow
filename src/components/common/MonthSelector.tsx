import { useDate } from '../../context/DateContext'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '../ui/Button'

export function MonthSelector() {
    const { currentDate, monthName, year, setCurrentDate, previousMonth, nextMonth } = useDate()

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return
        const [y, m] = e.target.value.split('-').map(Number)
        setCurrentDate(new Date(y, m - 1, 1))
    }

    // Format current date to YYYY-MM for input value
    const inputValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

    return (
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="relative flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors group">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[100px] text-center select-none">
                    {monthName} {year}
                </span>
                <input
                    type="month"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    value={inputValue}
                    onChange={handleDateChange}
                    aria-label="Select Month and Year"
                />
            </div>

            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    )
}
