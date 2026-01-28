import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Clock, BookOpen, Beaker, Plus } from 'lucide-react';
import { format, differenceInDays, parseISO, isPast, isSameDay } from 'date-fns';
import * as storage from '../utils/localStorage';

const ExamScheduler = ({ userId }) => {
    const [exams, setExams] = useState([]);

    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('Exam'); // 'Exam' or 'Practical'

    useEffect(() => {
        loadExams();
    }, [userId]);

    const loadExams = () => {
        try {
            const data = storage.getExams(userId);
            setExams(data);
        } catch (err) {
            console.error('Failed to load exams:', err);
        }
    };

    const addExam = (e) => {
        e.preventDefault();
        if (!subject || !date) return;

        try {
            const newExam = storage.createExam(userId, subject, date, type);
            setExams([...exams, newExam].sort((a, b) => new Date(a.date) - new Date(b.date)));
            setSubject('');
            setDate('');
            setType('Exam');
        } catch (err) {
            console.error('Failed to add exam:', err);
        }
    };

    const deleteExam = (id) => {
        try {
            storage.deleteExam(userId, id);
            setExams(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            console.error('Failed to delete exam:', err);
        }
    };

    const getDaysRemaining = (examDate) => {
        const today = new Date();
        const target = parseISO(examDate);

        if (isSameDay(today, target)) return 'Today';
        if (isPast(target)) return 'Done';

        const days = differenceInDays(target, today);
        return `${days} Days`;
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="special-header" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} />
                EXAM & PRACTICAL SCHEDULER
            </div>

            {/* Input Form */}
            <form onSubmit={addExam} style={{
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
                        placeholder="Subject Name"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    />

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="date"
                            className="input-underline"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                        />
                        <select
                            className="input-underline"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                        >
                            <option value="Exam">Exam</option>
                            <option value="Practical">Practical</option>
                        </select>
                    </div>

                    <button type="submit" className="btn" style={{
                        marginTop: '0.5rem',
                        background: 'var(--text-main)',
                        color: 'white',
                        padding: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 500
                    }}>
                        Add Schedule
                    </button>
                </div>
            </form>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {exams.map(exam => {
                    const status = getDaysRemaining(exam.date);
                    const isUrgent = status !== 'Done' && (status === 'Today' || parseInt(status) <= 3);

                    return (
                        <div key={exam._id} className="exam-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className={`type - badge ${exam.type.toLowerCase()} `}>
                                        {exam.type === 'Exam' ? <BookOpen size={10} /> : <Beaker size={10} />}
                                        {exam.type}
                                    </span>
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exam.subject}</span>
                                </div>
                                <button onClick={() => deleteExam(exam._id)} className="btn-icon delete-task-btn">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={12} />
                                    {format(parseISO(exam.date), 'MMM d, yyyy')}
                                </div>
                                <div className={`countdown - badge ${isUrgent ? 'urgent' : ''} ${status === 'Done' ? 'done' : ''} `}>
                                    <Clock size={10} />
                                    {status}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {exams.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        No upcoming exams. Stay prepared!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamScheduler;
