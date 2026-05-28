import { useState, useMemo } from 'react';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
}

function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getNextMonth(month, year) {
    return month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
}

function CalendarMonth({ year, month, todayStr, startDate, endDate, hoveredDate, onDayClick, onDayHover, onDayLeave, readOnly = false }) {
    const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
    const firstDay = useMemo(() => getFirstDayOfWeek(year, month), [year, month]);

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    }, [firstDay, daysInMonth]);

    const getDayClass = (day) => {
        if (!day) return 'calendar-day empty';
        const dateStr = formatDate(year, month, day);
        const isPast = !readOnly && dateStr < todayStr;
        const isStart = startDate && dateStr === startDate;
        const isEnd = endDate && dateStr === endDate;
        const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
        const isHoveredRange = startDate && !endDate && hoveredDate && dateStr > startDate && dateStr <= hoveredDate;

        let classes = 'calendar-day';
        if (isPast) classes += ' past';
        if (isStart) classes += ' start';
        if (isEnd) classes += ' end';
        if (isInRange) classes += ' in-range';
        if (isHoveredRange) classes += ' hovered-range';
        if (isStart && isEnd) classes += ' single';
        return classes;
    };

    return (
        <div className="calendar-month">
            <div className="calendar-month-header">{MONTHS[month]} {year}</div>
            <div className="calendar-days-header">
                {DAYS.map(d => (
                    <span key={d} className="calendar-day-name">{d}</span>
                ))}
            </div>
            <div className="calendar-grid">
                {calendarDays.map((day, i) => (
                    <button
                        key={i}
                        className={getDayClass(day)}
                        onClick={() => onDayClick(day, year, month)}
                        onMouseEnter={() => day && !readOnly && onDayHover(formatDate(year, month, day))}
                        onMouseLeave={onDayLeave}
                        disabled={!day || (!readOnly && formatDate(year, month, day) < todayStr)}
                        type="button"
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
}

function getInitialViewDate(startDate) {
    if (!startDate) return new Date();
    const [year, month] = startDate.split('-').map(Number);
    if (!year || !month) return new Date();
    return new Date(year, month - 1, 1);
}

export default function InlineCalendar({ startDate, endDate, onStartDateChange, onEndDateChange, readOnly = false }) {
    const today = new Date();
    const initialViewDate = getInitialViewDate(startDate);
    const [currentMonth, setCurrentMonth] = useState(initialViewDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialViewDate.getFullYear());
    const [hoveredDate, setHoveredDate] = useState(null);

    const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    const next = getNextMonth(currentMonth, currentYear);

    const handleDayClick = (day, year, month) => {
        if (!day) return;
        if (readOnly) return;
        const dateStr = formatDate(year, month, day);
        if (dateStr < todayStr) return;

        if (!startDate || (startDate && endDate)) {
            onStartDateChange(dateStr);
            onEndDateChange('');
        } else if (dateStr > startDate) {
            onEndDateChange(dateStr);
        } else {
            onStartDateChange(dateStr);
            onEndDateChange('');
        }
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (next.month === 11) {
            setCurrentMonth(0);
            setCurrentYear(next.year + 1);
        } else {
            setCurrentMonth(next.month);
            setCurrentYear(next.year);
        }
    };

    return (
        <div className={`inline-calendar ${readOnly ? 'read-only' : ''}`}>
            <div className="calendar-header">
                <button className="calendar-nav" onClick={handlePrevMonth} type="button">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span className="calendar-month-year">
                    {MONTHS[currentMonth]} {currentYear}
                </span>
                <button className="calendar-nav" onClick={handleNextMonth} type="button">
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div className="calendar-months-row">
                <CalendarMonth
                    year={currentYear}
                    month={currentMonth}
                    todayStr={todayStr}
                    startDate={startDate}
                    endDate={endDate}
                    hoveredDate={hoveredDate}
                    onDayClick={handleDayClick}
                    onDayHover={setHoveredDate}
                    onDayLeave={() => setHoveredDate(null)}
                    readOnly={readOnly}
                />
                <CalendarMonth
                    year={next.year}
                    month={next.month}
                    todayStr={todayStr}
                    startDate={startDate}
                    endDate={endDate}
                    hoveredDate={hoveredDate}
                    onDayClick={handleDayClick}
                    onDayHover={setHoveredDate}
                    onDayLeave={() => setHoveredDate(null)}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
}
