import React from 'react';
import { Trophy, Activity, Calendar } from 'lucide-react';
import { getCompletionPercentage, getTodayISO } from '../utils/dateUtils';

const StatsOverview = ({ habits }) => {
    const completionRate = getCompletionPercentage(habits);

    // Calculate total perfect days (days where all habits were done) - simplistic version
    // For now, let's just show total active habits and average streak
    const totalHabits = habits.length;

    if (totalHabits === 0) return null;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-muted text-sm">Today's Progress</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span className="text-h2" style={{ color: 'var(--primary)' }}>{completionRate}%</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)' }}>
                    <Trophy size={24} />
                </div>
                <div>
                    <p className="text-muted text-sm">Active Habits</p>
                    <span className="text-h2" style={{ color: 'var(--success)' }}>{totalHabits}</span>
                </div>
            </div>

        </div>
    );
};

export default StatsOverview;
