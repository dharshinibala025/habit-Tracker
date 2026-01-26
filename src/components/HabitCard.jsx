import { Check, Trash2, Flame } from 'lucide-react';
import { getTodayISO, calculateStreak, getLast7Days } from '../utils/dateUtils';

const HabitCard = ({ habit, onToggle, onDelete }) => {
    const today = getTodayISO();
    const isCompletedToday = habit.completedDates.includes(today);
    const streak = calculateStreak(habit.completedDates);
    const last7Days = getLast7Days();

    return (
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    {/* Checkbox / Button */}
                    <button
                        onClick={() => onToggle(habit.id)}
                        className={`btn ${isCompletedToday ? '' : ''}`}
                        style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            padding: 0,
                            border: isCompletedToday ? 'none' : '2px solid var(--border-light)',
                            background: isCompletedToday ? 'var(--success)' : 'transparent',
                            color: 'white',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isCompletedToday ? 'scale(1.05)' : 'scale(1)',
                        }}
                        aria-label={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
                    >
                        {isCompletedToday && <Check size={24} strokeWidth={3} />}
                    </button>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isCompletedToday ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isCompletedToday ? 'line-through' : 'none', transition: 'color 0.2s' }}>
                            {habit.name}
                        </h3>
                        {habit.description && (
                            <p className="text-sm text-muted" style={{ marginTop: '0.25rem' }}>{habit.description}</p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Streak Counter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: streak > 0 ? '#F59E0B' : 'var(--text-muted)' }} title="Current Streak">
                        <Flame size={20} fill={streak > 0 ? '#F59E0B' : 'none'} />
                        <span style={{ fontWeight: 600 }}>{streak}</span>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(habit.id)}
                        className="btn-icon btn-delete"
                        aria-label="Delete habit"
                        style={{ borderRadius: '0.5rem', transition: 'all 0.2s' }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Weekly Visualizer */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--bg-app)', width: '100%' }}>
                <span className="text-sm text-muted" style={{ marginRight: 'auto', fontSize: '0.75rem' }}>Last 7 Days</span>
                <div className="weekly-dots">
                    {last7Days.map(date => {
                        const isDone = habit.completedDates.includes(date);
                        return (
                            <div
                                key={date}
                                className={`dot ${isDone ? 'completed' : ''}`}
                                title={date}
                            />
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default HabitCard;
