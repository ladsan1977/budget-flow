import { Moon, Sun, Bell, Plus, Calendar, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { useTheme } from '../theme-provider'
import { useDate } from '../../context/DateContext'

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { theme, setTheme } = useTheme()
    const { currentDate, monthName, year, setCurrentDate, previousMonth, nextMonth } = useDate()

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return
        const [y, m] = e.target.value.split('-').map(Number)
        setCurrentDate(new Date(y, m - 1, 1))
    }

    // Format current date to YYYY-MM for input value
    const inputValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-brand-surface/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Date Selector */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
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
            </div>

            <div className="flex items-center gap-4">
                <Button variant="primary" size="sm" className="gap-2 shadow-lg shadow-brand-primary/20">
                    <Plus className="w-4 h-4" />
                    <span>Quick-Add</span>
                </Button>

                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="w-5 h-5 text-slate-500 hover:text-brand-primary transition-colors" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    )
}
