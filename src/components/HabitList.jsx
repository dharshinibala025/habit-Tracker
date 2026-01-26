import React from 'react';
import HabitCard from './HabitCard';

const HabitList = ({ habits, onToggle, onDelete }) => {
    if (!habits || habits.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-light)' }}>
                <h3 className="text-h2" style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>No habits yet</h3>
                <p className="text-muted" style={{ marginTop: '0.5rem' }}>Start small. Add your first habit today.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {habits.map(habit => (
                <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default HabitList;
