import React, { useState } from 'react';
import { format, parseISO, addMonths, subMonths, getDaysInMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react';
import { getMonthDays, getTodayISO, calculateMaxStreakInRange } from '../utils/dateUtils';

import { getDailyQuote } from '../utils/quoteUtils';

const MonthlyView = ({ habits, onToggle, onDelete }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const monthDays = getMonthDays(currentMonth);
    const today = getTodayISO();
    const totalDaysInMonth = getDaysInMonth(currentMonth);
    const dailyQuote = getDailyQuote();

    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

    return (
        <div>
            {/* Controls & Daily Quote */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                {/* Controls */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    width: '240px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ borderBottom: '1px solid var(--border-light)', padding: '0.75rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={prevMonth} className="btn-icon"><ChevronLeft size={18} /></button>
                            <span>{format(currentMonth, 'MMMM yyyy')}</span>
                            <button onClick={nextMonth} className="btn-icon"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* Daily Quote Box */}
                <div style={{
                    // Reduced width configuration
                    flex: '0 1 auto',
                    maxWidth: '700px',
                    width: '100%',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--primary-light)',
                    borderRadius: '12px',
                    padding: '0.75rem 1.5rem',
                    color: 'var(--primary-dark)',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-serif)',
                    display: 'flex', alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <span style={{ fontWeight: 600, marginRight: '0.5rem', fontStyle: 'normal', color: 'var(--primary)' }}>Quotes:</span>
                    "{dailyQuote}"
                </div>
            </div>

            <div className="spreadsheet-container">
                <table className="sheet-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', minWidth: '180px', position: 'sticky', left: 0, zIndex: 20, borderRight: '1px solid var(--border-strong)' }}>HABIT</th>
                            {monthDays.map(day => {
                                const isToday = day === today;
                                return (
                                    <th key={day} style={{
                                        minWidth: '32px',
                                        background: isToday ? 'var(--primary)' : 'transparent',
                                        color: isToday ? 'white' : 'inherit',
                                        borderRadius: isToday ? '6px 6px 0 0' : '0'
                                    }}>
                                        <div style={{ fontSize: '0.65rem', marginBottom: '2px', fontWeight: 500, opacity: isToday ? 0.9 : 1 }}>{format(parseISO(day), 'EEEEE')}</div>
                                        {format(parseISO(day), 'd')}
                                    </th>
                                );
                            })}
                            <th style={{ minWidth: '60px', borderLeft: '1px solid var(--border-strong)' }}>STREAK</th>
                            <th style={{ minWidth: '80px' }}>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map(habit => {
                            const maxStreak = calculateMaxStreakInRange(habit.completedDates, monthDays);
                            const daysCompletedInMonth = habit.completedDates.filter(d => monthDays.includes(d)).length;
                            const percent = Math.round((daysCompletedInMonth / totalDaysInMonth) * 100);

                            return (
                                <tr key={habit.id} className="habit-row">
                                    <td className="name-col" style={{ position: 'sticky', left: 0, zIndex: 10, borderRight: '1px solid var(--border-strong)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>{habit.name}</span>
                                            <button
                                                className="delete-habit-btn"
                                                onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }}
                                                title="Delete Habit"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    {monthDays.map(dateStr => {
                                        const isCompleted = habit.completedDates.includes(dateStr);
                                        const isToday = dateStr === today;
                                        return (
                                            <td key={dateStr} style={{
                                                background: isToday ? 'var(--primary-light)' : 'inherit',
                                                borderLeft: isToday ? '1px solid var(--primary)' : 'none',
                                                borderRight: isToday ? '1px solid var(--primary)' : 'none'
                                            }}>
                                                <button
                                                    className={`check-btn ${isCompleted ? 'checked' : ''}`}
                                                    onClick={() => onToggle(habit.id, dateStr)}
                                                >
                                                    {isCompleted && <Check size={16} strokeWidth={3} />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                    <td className="stat-col" style={{ borderLeft: '1px solid var(--border-strong)' }}>{maxStreak}</td>
                                    <td className="stat-col" style={{ color: percent >= 75 ? 'var(--success)' : 'inherit' }}>{percent}%</td>
                                </tr>
                            );
                        })}

                        {/* Daily Percentage Row */}
                        <tr style={{ background: '#F9FAFB', borderTop: '2px solid var(--border-strong)', fontWeight: 600 }}>
                            <td style={{ padding: '0.5rem', textAlign: 'right', position: 'sticky', left: 0, background: '#F9FAFB', borderRight: '1px solid var(--border-strong)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>DAILY AVG</td>
                            {monthDays.map(day => {
                                if (habits.length === 0) return <td key={day}>-</td>;
                                const completedThatDay = habits.filter(h => h.completedDates.includes(day)).length;
                                const dayPercent = Math.round((completedThatDay / habits.length) * 100);
                                return <td key={day} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{dayPercent}%</td>;
                            })}
                            <td colSpan={2}></td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyView;
