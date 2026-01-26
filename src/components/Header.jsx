import React from 'react';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';

const Header = () => {
    return (
        <header className="test-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}>
                    <CheckCircle color="white" size={24} />
                </div>
                <div>
                    <h1 className="text-h2" style={{ lineHeight: '1.2' }}>HabitFlow</h1>
                    <p className="text-muted text-sm">Build better habits, day by day</p>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <h2 className="text-h2" style={{ fontSize: '1.25rem' }}>{format(new Date(), 'EEEE')}</h2>
                <p className="text-muted text-sm">{format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
        </header>
    );
};

export default Header;
