import React, { useState } from 'react';
import { Skull, RefreshCw, XCircle } from 'lucide-react';
import { punishments } from '../data/punishments';

const PunishmentWidget = () => {
    const [currentPunishment, setCurrentPunishment] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const spinWheel = () => {
        setIsSpinning(true);
        setCurrentPunishment(null);

        // Simple spin effect
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * punishments.length);
            setCurrentPunishment(punishments[randomIndex]);
            setIsSpinning(false);
        }, 800);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="special-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444' }}>
                <Skull size={20} />
                BESTIE PENALTY JAR
            </div>

            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                minHeight: '200px',
                justifyContent: 'center'
            }}>
                {!currentPunishment && !isSpinning && (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>😈</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            Did you miss a habit today? <br /> The jar demands justice!
                        </p>
                    </>
                )}

                {isSpinning && (
                    <div style={{ animation: 'spin 1s linear infinite' }}>
                        <RefreshCw size={40} color="var(--primary)" />
                    </div>
                )}

                {currentPunishment && (
                    <div className="animate-fade-in">
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎭</div>
                        <p style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            lineHeight: 1.4
                        }}>
                            "{currentPunishment}"
                        </p>
                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            (Better luck next time!)
                        </div>
                    </div>
                )}

                <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="btn"
                    style={{
                        marginTop: '1rem',
                        background: '#FEF2F2',
                        color: '#EF4444',
                        border: '1px solid #FECACA',
                        padding: '0.75rem 1.5rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        justifyContent: 'center',
                        opacity: isSpinning ? 0.7 : 1
                    }}
                >
                    {isSpinning ? 'Deciding Fate...' : (currentPunishment ? 'Spin Again' : 'Accept Punishment')}
                </button>
            </div>
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default PunishmentWidget;
