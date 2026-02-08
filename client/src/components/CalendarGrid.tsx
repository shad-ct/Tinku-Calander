import { useState, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { getEvents } from '../services/api';
import DayModal from './DayModal';

interface Event {
    _id: string;
    title: string;
    start: string; // ISO date string
    location?: string;
    imageUrl?: string;
}

export default function CalendarGrid() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await getEvents();
            setEvents(res.data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(new Date(event.start), day));
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors"
                >
                    Today
                </button>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                {weekDays.map(day => (
                    <div key={day} className="py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {day.slice(0, 3)}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            {loading ? (
                <div className="h-64 sm:h-96 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Loading Events...
                </div>
            ) : (
                <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 dark:bg-gray-700 gap-px border-b border-gray-100 dark:border-gray-700">
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const dayEvents = getEventsForDay(day);
                        const isTodayDate = isToday(day);

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => setSelectedDate(day)}
                                className={clsx(
                                    "min-h-[80px] sm:min-h-[140px] bg-white dark:bg-gray-800 p-1 sm:p-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 relative group flex flex-col gap-1",
                                    !isCurrentMonth && "bg-gray-50/30 dark:bg-gray-900/40 text-gray-400 dark:text-gray-600"
                                )}
                            >
                                <div className="flex justify-center sm:justify-between items-start">
                                    <span className={clsx(
                                        "text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full",
                                        isTodayDate
                                            ? "bg-indigo-600 text-white shadow-md relative z-10"
                                            : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {/* Event Count Badge (Desktop only) */}
                                    {dayEvents.length > 0 && (
                                        <span className="hidden sm:flex text-xs font-bold text-indigo-500 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded-full">
                                            {dayEvents.length}
                                        </span>
                                    )}
                                </div>

                                {/* Mobile Event Indicators (Dots) */}
                                <div className="sm:hidden flex gap-1 justify-center mt-1 flex-wrap content-start">
                                    {dayEvents.slice(0, 4).map(event => (
                                        <div
                                            key={event._id}
                                            className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
                                        />
                                    ))}
                                    {dayEvents.length > 4 && (
                                        <span className="text-[8px] text-gray-400 dark:text-gray-500 leading-none">+</span>
                                    )}
                                </div>

                                {/* Desktop Event Items (Text) */}
                                <div className="hidden sm:flex flex-1 flex-col gap-1 mt-1 overflow-y-auto custom-scrollbar">
                                    {dayEvents.slice(0, 3).map(event => (
                                        <div
                                            key={event._id}
                                            className="text-xs px-1.5 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800 truncate font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                            title={event.title}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[10px] text-gray-400 dark:text-gray-500 pl-1">
                                            + {dayEvents.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedDate && (
                <DayModal
                    date={selectedDate}
                    events={getEventsForDay(selectedDate)}
                    onClose={() => setSelectedDate(null)}
                    refreshEvents={fetchEvents}
                />
            )}
        </div>
    );
}
