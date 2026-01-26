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
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', justifyContent: 'center', borderStyle: 'dashed', background: 'transparent', color: 'var(--primary)', border: '2px dashed var(--border-light)' }}
            >
                <Plus size={20} /> Add New Habit
            </button>
        );
    }

    return (
        <div className="card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '2px solid var(--primary-light)' }}>
            <h3 className="text-h2" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>New Habit</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="text-sm text-muted">Habit Name</label>
                    <input
                        autoFocus
                        type="text"
                        className="input"
                        placeholder="e.g., Read 30 mins"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="text-sm text-muted">Description (Optional)</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="e.g., Before bed time"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Habit</button>
                    <button
                        type="button"
                        className="btn"
                        style={{ background: 'var(--bg-app)', color: 'var(--text-muted)' }}
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddHabitForm;
