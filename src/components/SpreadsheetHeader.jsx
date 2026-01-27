import React from 'react';
import DailyProgress from './DailyProgress';

const SpreadsheetHeader = ({ habits }) => {
    return (
        <div style={{ marginBottom: '2rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Main Title */}
            <div>
                <h1 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '2.5rem',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1
                }}>
                    Habit Tracker
                </h1>
                <p className="text-muted" style={{ marginTop: '0.25rem' }}>Track your daily progress.</p>
            </div>

            {/* Daily Progress Widget */}
            <DailyProgress habits={habits} />
        </div>
    );
};

export default SpreadsheetHeader;
