import React, { useEffect, useState } from 'react';
import { getTodayISO } from '../utils/dateUtils';
import { triggerConfetti } from '../utils/confetti';
import { Trophy } from 'lucide-react';

const DailyProgress = ({ habits }) => {
    const today = getTodayISO();
    const [prevPercent, setPrevPercent] = useState(0);

    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;

    const percentage = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

    useEffect(() => {
        if (percentage === 100 && prevPercent < 100 && totalHabits > 0) {
            triggerConfetti();
        }
        setPrevPercent(percentage);
    }, [percentage, prevPercent, totalHabits]);

    if (totalHabits === 0) return null;

    return (
        <div style={{
            background: 'white',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                    background: percentage === 100 ? '#FEF3C7' : '#EFF6FF',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    color: percentage === 100 ? '#D97706' : 'var(--primary)'
                }}>
                    <Trophy size={20} />
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Daily Goal</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                        {percentage}%
                    </div>
                </div>
            </div>

            {/* Progress Bar Visual */}
            <div style={{ width: '120px', height: '6px', background: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                    style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: percentage === 100 ? 'var(--success)' : 'var(--primary)',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
            </div>
        </div>
    );
};

export default DailyProgress;
