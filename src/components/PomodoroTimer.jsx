import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const PomodoroTimer = ({ onSessionComplete }) => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const [settings, setSettings] = useState({
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsUntilLongBreak: 4
    });

    const intervalRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        handleTimerComplete();
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, minutes, seconds]);

    const handleTimerComplete = () => {
        setIsActive(false);

        if (!isBreak) {
            const newSessionsCompleted = sessionsCompleted + 1;
            setSessionsCompleted(newSessionsCompleted);

            if (onSessionComplete) {
                onSessionComplete({ type: 'work', duration: settings.workDuration });
            }

            // Start break
            const isLongBreak = newSessionsCompleted % settings.sessionsUntilLongBreak === 0;
            const breakDuration = isLongBreak ? settings.longBreak : settings.shortBreak;
            setMinutes(breakDuration);
            setSeconds(0);
            setIsBreak(true);
        } else {
            // Break complete, start work session
            setMinutes(settings.workDuration);
            setSeconds(0);
            setIsBreak(false);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(isBreak ? settings.shortBreak : settings.workDuration);
        setSeconds(0);
    };

    const formatTime = (mins, secs) => {
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = isBreak
        ? ((settings.shortBreak * 60 - (minutes * 60 + seconds)) / (settings.shortBreak * 60)) * 100
        : ((settings.workDuration * 60 - (minutes * 60 + seconds)) / (settings.workDuration * 60)) * 100;

    return (
        <div className="pomodoro-timer">
            <div className="timer-header">
                <div className="timer-mode">
                    {isBreak ? (
                        <>
                            <Coffee size={20} />
                            <span>Break Time</span>
                        </>
                    ) : (
                        <>
                            <Brain size={20} />
                            <span>Focus Time</span>
                        </>
                    )}
                </div>
                <div className="sessions-count">
                    <span className="sessions-number">{sessionsCompleted}</span>
                    <span className="sessions-label">sessions</span>
                </div>
            </div>

            <div className="timer-display">
                <svg className="timer-circle" viewBox="0 0 200 200">
                    <circle
                        className="timer-circle-bg"
                        cx="100"
                        cy="100"
                        r="90"
                    />
                    <circle
                        className="timer-circle-progress"
                        cx="100"
                        cy="100"
                        r="90"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 90}`,
                            strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`
                        }}
                    />
                </svg>
                <div className="timer-time">
                    {formatTime(minutes, seconds)}
                </div>
            </div>

            <div className="timer-controls">
                <button onClick={toggleTimer} className="btn-timer btn-timer-primary">
                    {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={resetTimer} className="btn-timer btn-timer-secondary">
                    <RotateCcw size={20} />
                </button>
            </div>

            <style jsx>{`
        .pomodoro-timer {
          padding: 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          text-align: center;
        }

        .timer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .timer-mode {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--primary);
          font-size: 1.1rem;
        }

        .sessions-count {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sessions-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          font-family: var(--font-serif);
        }

        .sessions-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .timer-display {
          position: relative;
          width: 250px;
          height: 250px;
          margin: 0 auto 2rem;
        }

        .timer-circle {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .timer-circle-bg {
          fill: none;
          stroke: var(--bg-subtle);
          stroke-width: 8;
        }

        .timer-circle-progress {
          fill: none;
          stroke: var(--primary);
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s linear;
        }

        .timer-time {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          font-weight: 700;
          font-family: var(--font-serif);
          color: var(--text-main);
        }

        .timer-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-timer {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .btn-timer-primary {
          width: 64px;
          height: 64px;
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
        }

        .btn-timer-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(var(--primary-rgb), 0.4);
        }

        .btn-timer-secondary {
          width: 48px;
          height: 48px;
          background: var(--bg-subtle);
          color: var(--text-muted);
        }

        .btn-timer-secondary:hover {
          background: var(--border-strong);
          color: var(--text-main);
        }
      `}</style>
        </div>
    );
};

PomodoroTimer.propTypes = {
    onSessionComplete: PropTypes.func
};

export default PomodoroTimer;
