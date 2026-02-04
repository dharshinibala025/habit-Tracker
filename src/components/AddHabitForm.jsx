import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AddHabitForm = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('positive');
    const [goal, setGoal] = useState(1);
    const [unit, setUnit] = useState('times');
    const [frequencyType, setFrequencyType] = useState('daily');
    const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({
            name,
            description,
            type,
            goal: parseInt(goal),
            unit,
            frequency: {
                type: frequencyType,
                days: frequencyType === 'specific_days' ? selectedDays : [],
                repeatEvery: 1
            }
        });
        setName('');
        setDescription('');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="btn"
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    justifyContent: 'center',
                    background: 'white',
                    color: 'var(--primary)',
                    border: '1px dashed var(--border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    marginTop: '1rem',
                    transition: 'all 0.2s'
                }}
            >
                <Plus size={18} /> Add New Habit Row
            </button>
        );
    }

    return (
        <div className="animate-fade-in" style={{
            background: 'white',
            border: '1px solid var(--border-strong)',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-md)',
            marginTop: '1rem'
        }}>
            <h3 style={{
                fontSize: '1.125rem',
                marginBottom: '1.5rem',
                color: 'var(--text-main)',
                fontWeight: 600
            }}>
                New Habit
            </h3>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Basic Info */}
                    <div className="form-group">
                        <label>Habit Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g., Read 30 mins"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g., Before bed time"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Habit Settings */}
                    <div className="form-group">
                        <label>Type</label>
                        <div className="radio-group">
                            <button
                                type="button"
                                className={`radio-btn ${type === 'positive' ? 'active' : ''}`}
                                onClick={() => setType('positive')}
                            >
                                Build (+)
                            </button>
                            <button
                                type="button"
                                className={`radio-btn ${type === 'negative' ? 'active bad' : ''}`}
                                onClick={() => setType('negative')}
                            >
                                Quit (-)
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Goal</label>
                        <div className="input-group">
                            <input
                                type="number"
                                min="1"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                style={{ width: '80px' }}
                            />
                            <input
                                type="text"
                                placeholder="Unit (e.g., mins)"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Frequency */}
                    <div className="form-group full-width">
                        <label>Frequency</label>
                        <select
                            value={frequencyType}
                            onChange={(e) => setFrequencyType(e.target.value)}
                            className="select-input"
                        >
                            <option value="daily">Every Day</option>
                            <option value="specific_days">Specific Days</option>
                        </select>

                        {frequencyType === 'specific_days' && (
                            <div className="days-selector">
                                {days.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`day-btn ${selectedDays.includes(day) ? 'selected' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day[0]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <style jsx>{`
                    .form-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1.5rem;
                        margin-bottom: 2rem;
                    }
                    .full-width { grid-column: 1 / -1; }
                    
                    .form-group label {
                        display: block;
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: var(--text-muted);
                        margin-bottom: 0.5rem;
                    }
                    
                    input, select {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid var(--border-light);
                        border-radius: var(--radius-md);
                        background: var(--bg-subtle);
                        color: var(--text-main);
                    }

                    .radio-group {
                        display: flex;
                        gap: 0.5rem;
                    }

                    .radio-btn {
                        flex: 1;
                        padding: 0.5rem;
                        border: 1px solid var(--border-light);
                        background: transparent;
                        border-radius: var(--radius-md);
                        cursor: pointer;
                        color: var(--text-muted);
                    }
                    
                    .radio-btn.active {
                        background: var(--primary-light);
                        border-color: var(--primary);
                        color: var(--primary);
                        font-weight: 600;
                    }

                    .radio-btn.active.bad {
                        background: var(--error-light);
                        border-color: var(--error);
                        color: var(--error);
                    }

                    .input-group {
                        display: flex;
                        gap: 0.5rem;
                    }

                    .days-selector {
                        display: flex;
                        gap: 0.5rem;
                        margin-top: 0.75rem;
                    }

                    .day-btn {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        border: 1px solid var(--border-light);
                        background: transparent;
                        color: var(--text-muted);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 600;
                        font-size: 0.8rem;
                    }

                    .day-btn.selected {
                        background: var(--primary);
                        color: white;
                        border-color: var(--primary);
                    }
                `}</style>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        type="button"
                        className="btn"
                        style={{ color: 'var(--text-muted)', background: 'transparent' }}
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn"
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            fontWeight: 500
                        }}
                    >
                        Save Habit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddHabitForm;
