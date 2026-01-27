import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Trash2, Clock, CheckCircle } from 'lucide-react';
import { format, differenceInDays, parseISO, isPast, isSameDay } from 'date-fns';

const STUDY_PLAN_KEY = 'habitflow_study_plan';

const StudyPlan = () => {
    const [plans, setPlans] = useState(() => {
        const saved = localStorage.getItem(STUDY_PLAN_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        localStorage.setItem(STUDY_PLAN_KEY, JSON.stringify(plans));
    }, [plans]);

    const addPlan = (e) => {
        e.preventDefault();
        if (!subject || !topic || !date) return;

        const newPlan = {
            id: crypto.randomUUID(),
            subject,
            topic,
            date,
            completed: false
        };

        setPlans(prev => [...prev, newPlan].sort((a, b) => new Date(a.date) - new Date(b.date)));
        setSubject('');
        setTopic('');
        setDate('');
    };

    const toggleComplete = (id) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
    };

    const deletePlan = (id) => {
        setPlans(prev => prev.filter(p => p.id !== id));
    };

    const getStatus = (planDate, completed) => {
        if (completed) return 'Completed';
        const today = new Date();
        const target = parseISO(planDate);

        if (isSameDay(today, target)) return 'Today';
        if (isPast(target)) return 'Overdue';

        const days = differenceInDays(target, today);
        return `${days} Days`;
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="special-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} />
                STUDY PLAN
            </div>

            {/* Input Form */}
            <form onSubmit={addPlan} style={{
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                marginBottom: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                        className="input-underline"
                        placeholder="Subject (e.g., Math)"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    />
                    <input
                        className="input-underline"
                        placeholder="Topic to Cover"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    />
                    <input
                        type="date"
                        className="input-underline"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                    />

                    <button type="submit" className="btn" style={{
                        marginTop: '0.5rem',
                        background: 'var(--text-main)',
                        color: 'white',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 500
                    }}>
                        Add to Plan
                    </button>
                </div>
            </form>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plans.map(plan => {
                    const status = getStatus(plan.date, plan.completed);
                    const isUrgent = !plan.completed && status !== 'Overdue' && (status === 'Today' || parseInt(status) <= 2);
                    const isOverdue = status === 'Overdue';

                    return (
                        <div key={plan.id} className="exam-card" style={{ opacity: plan.completed ? 0.7 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => toggleComplete(plan.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            color: plan.completed ? 'var(--success)' : 'var(--text-muted)'
                                        }}
                                    >
                                        <CheckCircle size={18} fill={plan.completed ? "currentColor" : "none"} />
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: plan.completed ? 'line-through' : 'none' }}>
                                            {plan.subject}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{plan.topic}</span>
                                    </div>
                                </div>
                                <button onClick={() => deletePlan(plan.id)} className="btn-icon delete-task-btn">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={12} />
                                    {format(parseISO(plan.date), 'MMM d')}
                                </div>
                                <div className={`countdown-badge ${isUrgent ? 'urgent' : ''} ${plan.completed ? 'done' : ''} ${isOverdue ? 'urgent' : ''}`}
                                    style={isOverdue ? { background: '#FEF2F2', color: '#DC2626' } : {}}>
                                    <Clock size={10} />
                                    {status}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {plans.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        No study plans yet. Add one above!
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPlan;
