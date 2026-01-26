import React, { useState } from 'react';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, getTodayISO } from '../utils/dateUtils';

const MonthlyView = ({ habits, onToggle }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const monthDays = getMonthDays(currentMonth);
    const today = getTodayISO();

    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
    const resetToToday = () => setCurrentMonth(new Date());

    if (habits.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No habits to display. Add some habits in the Daily View first.
            </div>
        );
    }

    return (
        <div className="card monthly-container" style={{ position: 'relative' }}>

            {/* Month Navigation Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, left: 0, background: 'var(--bg-card)', zIndex: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h3 className="text-h2" style={{ fontSize: '1.25rem' }}>{format(currentMonth, 'MMMM yyyy')}</h3>
                    <button onClick={resetToToday} className="btn text-sm" style={{ padding: '0.25rem 0.5rem', background: 'var(--border-light)', color: 'var(--text-muted)' }}>Today</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={prevMonth} className="btn-icon" style={{ border: '1px solid var(--border-light)', borderRadius: '0.25rem' }}><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="btn-icon" style={{ border: '1px solid var(--border-light)', borderRadius: '0.25rem' }}><ChevronRight size={20} /></button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="monthly-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', minWidth: '150px', position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 10 }}>Habit</th>
                            {monthDays.map(day => (
                                <th key={day} style={{ minWidth: '40px', color: day === today ? 'var(--primary)' : 'inherit' }}>
                                    {format(parseISO(day), 'd')}
                                    <div style={{ fontSize: '0.65rem', fontWeight: 400 }}>{format(parseISO(day), 'EEEEE')}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map(habit => (
                            <tr key={habit.id}>
                                <td style={{ textAlign: 'left', fontWeight: 500, position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 10 }}>{habit.name}</td>
                                {monthDays.map(dateStr => {
                                    const isCompleted = habit.completedDates.includes(dateStr);
                                    // Allow toggling for any day (or restrict to past? for now allow all)
                                    return (
                                        <td key={dateStr} style={{ padding: '0.25rem' }}>
                                            <button
                                                className={`monthly-cell-btn ${isCompleted ? 'active' : ''}`}
                                                onClick={() => onToggle(habit.id, dateStr)}
                                                title={`${habit.name} - ${dateStr}`}
                                            >
                                                {isCompleted && <Check size={14} strokeWidth={4} />}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyView;
