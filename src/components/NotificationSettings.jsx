import React, { useState } from 'react';
import { Bell, Mail, Clock, ShieldAlert, Plus, X } from 'lucide-react';
import { api } from '../services/api';

const NotificationSettings = ({ user, onUpdateUser }) => {
    const [preferences, setPreferences] = useState(user.notificationPreferences || {
        email: true,
        push: true,
        dailySummary: true,
        streakWarnings: true
    });
    const [reminderTimes, setReminderTimes] = useState(user.reminderTimes || []);
    const [newTime, setNewTime] = useState('09:00');
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = async (key) => {
        const newPrefs = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPrefs);

        // Auto-save on toggle
        try {
            const updated = await api.updateUser(user._id, { notificationPreferences: newPrefs });
            onUpdateUser(updated);
        } catch (err) {
            console.error('Failed to update preferences', err);
        }
    };

    const addReminderTime = async () => {
        if (reminderTimes.includes(newTime)) return;
        const newTimes = [...reminderTimes, newTime].sort();
        setReminderTimes(newTimes);

        try {
            await api.updateUser(user._id, { reminderTimes: newTimes });
            // onUpdateUser handled by parent reload or optimistic? 
            // Better to update parent
        } catch (err) {
            console.error('Failed to add time', err);
        }
    };

    const removeReminderTime = async (time) => {
        const newTimes = reminderTimes.filter(t => t !== time);
        setReminderTimes(newTimes);

        try {
            await api.updateUser(user._id, { reminderTimes: newTimes });
        } catch (err) {
            console.error('Failed to remove time', err);
        }
    };

    const requestPushPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification('Notifications Enabled', {
                body: 'You will now receive alerts from HabitFlow!',
                icon: '/icon.png' // Make sure an icon exists or remove
            });
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <Bell size={20} /> Notification Preferences
            </h3>

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                {/* Toggles */}
                <div style={{ padding: '1.5rem', display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: '#6366f1' }}>
                                <Mail size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>Email Notifications</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Daily summaries and progress reports</div>
                            </div>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={preferences.email} onChange={() => handleToggle('email')} />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>Streak Rescue</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Get warned before you lose a streak</div>
                            </div>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={preferences.streakWarnings} onChange={() => handleToggle('streakWarnings')} />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: '#f59e0b' }}>
                                <Bell size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>Push Notifications</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Browser alerts when app is open</div>
                            </div>
                        </div>
                        <button onClick={requestPushPermission} className="btn-sm" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                            Test / Enable
                        </button>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Clock size={16} className="text-muted" />
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Daily Reminders</h4>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {reminderTimes.map(time => (
                            <div key={time} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 0.75rem', background: 'var(--bg-subtle)',
                                borderRadius: '20px', fontSize: '0.9rem', border: '1px solid var(--border-light)'
                            }}>
                                <span>{time}</span>
                                <button onClick={() => removeReminderTime(time)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            style={{
                                padding: '0.5rem', borderRadius: '8px',
                                border: '1px solid var(--border-strong)', background: 'var(--bg-app)', color: 'var(--text-main)'
                            }}
                        />
                        <button onClick={addReminderTime} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={16} /> Add Time
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: var(--bg-subtle);
                    border: 1px solid var(--border-strong);
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 2px;
                    bottom: 2px;
                    background-color: var(--text-muted);
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--primary);
                    border-color: var(--primary);
                }
                input:checked + .slider:before {
                    transform: translateX(24px);
                    background-color: white;
                }
                .slider.round {
                    border-radius: 24px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
                .btn-sm {
                   background: var(--bg-subtle);
                   border: 1px solid var(--border-strong);
                   color: var(--text-main);
                   border-radius: 6px;
                   cursor: pointer; 
                }
            `}</style>
        </div>
    );
};

export default NotificationSettings;
