import React, { useState, useEffect } from 'react';
import { Check, Plus, X } from 'lucide-react';
import * as storage from '../utils/localStorage';

const SpecialTasksSidebar = ({ userId }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, [userId]);

    const loadTasks = () => {
        try {
            const data = storage.getTasks(userId);
            setTasks(data);
        } catch (err) {
            console.error('Failed to load tasks:', err);
        }
    };

    const handleChange = (id, text) => {
        setTasks(prev => prev.map(t => t._id === id ? { ...t, text } : t));
        try {
            storage.updateTask(userId, id, text);
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t._id === id ? { ...t, done: !t.done } : t));
        try {
            storage.toggleTask(userId, id);
        } catch (err) {
            console.error('Failed to toggle task:', err);
            loadTasks();
        }
    };

    const addTask = () => {
        try {
            const newTask = storage.createTask(userId, '');
            setTasks([...tasks, newTask]);
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    };

    const deleteTask = (id) => {
        try {
            storage.deleteTask(userId, id);
            setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="special-header" style={{ marginBottom: '1rem' }}>
                TODAY'S SPECIAL TASKS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tasks.map(task => (
                    <div key={task._id} className={`special-task-card ${task.done ? 'done' : ''}`}>
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
                            onClick={() => toggleTask(task._id)}
                        >
                            {task.done && <Check size={14} color="white" strokeWidth={4} />}
                        </button>

                        <input
                            className="task-card-input"
                            value={task.text}
                            placeholder="Add a new task..."
                            onChange={(e) => handleChange(task._id, e.target.value)}
                            style={{
                                textDecoration: task.done ? 'line-through' : 'none',
                                color: task.done ? 'var(--text-muted)' : 'inherit'
                            }}
                        />

                        <button onClick={() => deleteTask(task._id)} className="btn-icon delete-task-btn">
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
