import React, { useState, useEffect } from 'react';
import { User, Plus, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const ProfileSelector = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to connect to backend. Please ensure the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const newUser = await api.createUser(newUserName.trim());
            setUsers([...users, newUser]);
            setNewUserName('');
            setIsCreating(false);
            onSelectUser(newUser);
        } catch (err) {
            console.error('Failed to create user:', err);
            setError('Failed to create user. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputClick = () => {
        // Optional: Provide feedback if user clicks user name text excessively
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--bg-app)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'var(--bg-card)',
                padding: '3rem',
                borderRadius: '24px',
                border: '1px solid var(--border-strong)',
                boxShadow: 'var(--shadow-md)',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'var(--primary-light)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)',
                        marginBottom: '1rem'
                    }}>
                        <User size={32} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p className="text-muted">Who is focusing today?</p>
                </div>

                {error && (
                    <div style={{
                        color: 'var(--danger)',
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                {isLoading && !isCreating && (
                    <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Loading profiles...</div>
                )}

                {!isLoading && (
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                        {Array.isArray(users) && users.length > 0 && users.map(user => (
                            <button
                                key={user.id || user._id}
                                onClick={() => onSelectUser(user)}
                                className="btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.25rem',
                                    background: 'var(--bg-subtle)',
                                    border: '1px solid var(--border-light)',
                                    fontSize: '1.1rem',
                                    borderRadius: '16px',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 500 }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: '50%', background: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.9rem', fontWeight: 700,
                                        color: 'var(--primary)'
                                    }}>
                                        {user.name && user.name[0] ? user.name[0].toUpperCase() : '?'}
                                    </div>
                                    {user.name}
                                </span>
                                <ArrowRight size={20} className="text-muted" />
                            </button>
                        ))}

                        {(!Array.isArray(users) || users.length === 0) && !isCreating && (
                            <div style={{ padding: '2rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                {error ? 'Unable to load profiles.' : 'No profiles yet. Create your first one!'}
                            </div>
                        )}
                    </div>
                )}

                {!isCreating ? (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            border: '2px dashed var(--border-strong)',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            fontSize: '1rem', fontWeight: 500
                        }}
                    >
                        <Plus size={20} />
                        Create New Profile
                    </button>
                ) : (
                    <form onSubmit={handleCreateUser} className="animate-fade-in">
                        <div style={{ position: 'relative' }}>
                            <input
                                autoFocus
                                placeholder="Enter your name..."
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="input-underline"
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => { setIsCreating(false); setError(null); }}
                                className="btn"
                                style={{ flex: 1, padding: '1rem', background: 'var(--bg-subtle)' }}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1rem', background: 'var(--primary)', opacity: isLoading ? 0.7 : 1 }}
                                disabled={!newUserName.trim() || isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Start Tracking'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfileSelector;
