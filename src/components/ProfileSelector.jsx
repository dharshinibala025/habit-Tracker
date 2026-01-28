import React, { useState, useEffect } from 'react';
import { User, Plus, ArrowRight } from 'lucide-react';
import * as storage from '../utils/localStorage';

const ProfileSelector = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        try {
            const data = storage.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        try {
            const newUser = storage.createUser(newUserName.trim());
            setUsers([...users, newUser]);
            setNewUserName('');
            setIsCreating(false);
            onSelectUser(newUser);
        } catch (err) {
            console.error('Failed to create user:', err);
        }
    };

    const handleDeleteUser = (userId, userName) => {
        if (confirm(`Are you sure you want to delete "${userName}"?\n\nThis will permanently delete all their habits, tasks, exams, and study plans.`)) {
            try {
                storage.deleteUser(userId);
                setUsers(users.filter(u => u._id !== userId));
            } catch (err) {
                console.error('Failed to delete user:', err);
            }
        }
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

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                    {users.map(user => (
                        <div
                            key={user._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1.25rem',
                                background: 'var(--bg-subtle)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '16px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <button
                                onClick={() => onSelectUser(user)}
                                className="btn"
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 0,
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.1rem',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.parentElement.style.transform = 'translateY(-2px)';
                                    e.currentTarget.parentElement.style.borderColor = 'var(--primary)';
                                    e.currentTarget.parentElement.style.boxShadow = 'var(--shadow-sm)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.parentElement.style.transform = 'none';
                                    e.currentTarget.parentElement.style.borderColor = 'var(--border-light)';
                                    e.currentTarget.parentElement.style.boxShadow = 'none';
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
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    {user.name}
                                </span>
                                <ArrowRight size={20} className="text-muted" />
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                className="btn"
                                style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.5rem',
                                    background: 'transparent',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#fee';
                                    e.currentTarget.style.borderColor = '#f44';
                                    e.currentTarget.style.color = '#f44';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'var(--border-light)';
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                }}
                                title="Delete user"
                            >
                                <User size={16} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                    ))}

                    {users.length === 0 && !isCreating && (
                        <div style={{ padding: '2rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No profiles yet. Create your first one!
                        </div>
                    )}
                </div>

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
                                onClick={() => setIsCreating(false)}
                                className="btn"
                                style={{ flex: 1, padding: '1rem', background: 'var(--bg-subtle)' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '1rem', background: 'var(--primary)' }}
                                disabled={!newUserName.trim()}
                            >
                                Start Tracking
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfileSelector;
