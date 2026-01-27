import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AddHabitForm = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({ name, description });
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
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <label className="text-sm text-muted" style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Habit Name</label>
                        <input
                            autoFocus
                            type="text"
                            className="input-underline"
                            placeholder="e.g., Read 30 mins"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted" style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Description (Optional)</label>
                        <input
                            type="text"
                            className="input-underline"
                            placeholder="e.g., Before bed time"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

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
