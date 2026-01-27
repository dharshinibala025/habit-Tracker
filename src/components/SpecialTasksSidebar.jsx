import React, { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';

const STORAGE_KEY_TASKS = 'habitflow_special_tasks';

const SpecialTasksSidebar = () => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_TASKS);
        return saved ? JSON.parse(saved) : [{ id: 1, text: '', done: false }];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    }, [tasks]);

    const handleChange = (id, text) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    };

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const addTask = () => {
        const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
        setTasks([...tasks, { id: newId, text: '', done: false }]);
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="special-header" style={{ marginBottom: '1rem' }}>
                TODAY'S SPECIAL TASKS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tasks.map(task => (
                    <div key={task.id} className={`special-task-card ${task.done ? 'done' : ''}`}>
                        <button
                            className="btn"
                            style={{
                                minWidth: '22px',
                                height: '22px',
                                border: '2px solid var(--border-strong)',
                                borderRadius: '6px',
                                background: task.done ? 'var(--success)' : 'transparent',
                                borderColor: task.done ? 'var(--success)' : 'var(--border-strong)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 0,
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onClick={() => toggleTask(task.id)}
                        >
                            {task.done && <Check size={14} color="white" strokeWidth={4} />}
                        </button>

                        <input
                            className="task-card-input"
                            value={task.text}
                            placeholder="Add a new task..."
                            onChange={(e) => handleChange(task.id, e.target.value)}
                            style={{
                                textDecoration: task.done ? 'line-through' : 'none',
                                color: task.done ? 'var(--text-muted)' : 'inherit'
                            }}
                        />

                        <button onClick={() => deleteTask(task.id)} className="btn-icon delete-task-btn">
                            <X size={16} />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addTask}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '1rem', background: 'var(--bg-card)',
                        border: '1px dashed var(--primary)', borderRadius: '12px',
                        color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.2s', width: '100%', justifyContent: 'center'
                    }}
                    onMouseEnter={e => { e.target.style.background = 'var(--bg-subtle)' }}
                    onMouseLeave={e => { e.target.style.background = 'var(--bg-card)' }}
                >
                    <Plus size={18} />
                    <span>Add New Task</span>
                </button>
            </div>
        </div>
    );
};

export default SpecialTasksSidebar;
