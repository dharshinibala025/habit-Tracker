import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AddHabitForm from './components/AddHabitForm';
import HabitList from './components/HabitList';
import MonthlyView from './components/MonthlyView';
import { getTodayISO } from './utils/dateUtils';
import { LayoutGrid, Calendar } from 'lucide-react';

const STORAGE_KEY = 'habitflow_data_v1';

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState('daily'); // 'daily' or 'monthly'

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = ({ name, description }) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      completedDates: []
    };
    setHabits(prev => [newHabit, ...prev]);
  };

  const toggleHabit = (id, date = null) => {
    // If date is provided, use it. Otherwise use today.
    const targetDate = date || getTodayISO();

    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(targetDate);
        let newDates;
        if (isCompleted) {
          newDates = habit.completedDates.filter(d => d !== targetDate);
        } else {
          newDates = [...habit.completedDates, targetDate];
        }
        return { ...habit, completedDates: newDates };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <div className="container animate-fade-in">
      <Header />
      <StatsOverview habits={habits} />

      <main>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '0.25rem', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => setView('daily')}
              className="btn"
              style={{
                background: view === 'daily' ? 'var(--primary)' : 'transparent',
                color: view === 'daily' ? 'white' : 'var(--text-muted)',
                boxShadow: view === 'daily' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <LayoutGrid size={18} /> Daily
            </button>
            <button
              onClick={() => setView('monthly')}
              className="btn"
              style={{
                background: view === 'monthly' ? 'var(--primary)' : 'transparent',
                color: view === 'monthly' ? 'white' : 'var(--text-muted)',
                boxShadow: view === 'monthly' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Calendar size={18} /> Monthly
            </button>
          </div>
        </div>

        {view === 'daily' ? (
          <>
            <AddHabitForm onAdd={addHabit} />
            <div style={{ marginTop: '2rem' }}>
              <HabitList
                habits={habits}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
              />
            </div>
          </>
        ) : (
          <MonthlyView habits={habits} onToggle={toggleHabit} />
        )}
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>&copy; {new Date().getFullYear()} HabitFlow</p>
      </footer>
    </div>
  );
}

export default App;
