import React, { useState, useEffect } from 'react';
import SpreadsheetHeader from './components/SpreadsheetHeader';
import MonthlyView from './components/MonthlyView';
import SpecialTasksSidebar from './components/SpecialTasksSidebar';
import AddHabitForm from './components/AddHabitForm';
import ExamScheduler from './components/ExamScheduler';
import PunishmentWidget from './components/PunishmentWidget';
import StudyPlan from './components/StudyPlan';
import ProfileSelector from './components/ProfileSelector';
import { getTodayISO } from './utils/dateUtils';
import { LogOut } from 'lucide-react';
import * as storage from './utils/localStorage';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('habitflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [habits, setHabits] = useState([]);

  // Load habits when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('habitflow_current_user', JSON.stringify(currentUser));
      loadHabits();
    } else {
      localStorage.removeItem('habitflow_current_user');
      setHabits([]);
    }
  }, [currentUser]);

  const loadHabits = () => {
    if (!currentUser) return;
    try {
      const data = storage.getHabits(currentUser._id);
      setHabits(data);
    } catch (err) {
      console.error('Failed to load habits:', err);
    }
  };

  const addHabit = ({ name, description }) => {
    try {
      const newHabit = storage.createHabit(currentUser._id, name, description);
      setHabits(prev => [newHabit, ...prev]);
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const toggleHabit = (id, date = null) => {
    const targetDate = date || getTodayISO();

    try {
      storage.toggleHabit(currentUser._id, id, targetDate);
      // Update UI
      setHabits(prev => prev.map(habit => {
        if (habit._id === id) {
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
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      loadHabits(); // Reload on error
    }
  };

  const deleteHabit = (id) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      try {
        storage.deleteHabit(currentUser._id, id);
        setHabits(prev => prev.filter(h => h._id !== id));
      } catch (err) {
        console.error('Failed to delete habit:', err);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <ProfileSelector onSelectUser={setCurrentUser} />;
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <span>Welcome, </span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{currentUser.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--bg-subtle)', padding: '0.5rem 1rem', fontSize: '0.9rem'
          }}
        >
          <LogOut size={16} />
          Switch Profile
        </button>
      </div>

      <SpreadsheetHeader habits={habits} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Main Tracker */}
        <div>
          <MonthlyView habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />

          <div style={{ marginTop: '2rem' }}>
            <AddHabitForm onAdd={addHabit} />
          </div>

          {/* Key prop ensures components remount when userId changes, forcing them to reload their specific localStorage data */}
          <div key={currentUser._id} style={{ marginTop: '2rem', display: 'flex', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <SpecialTasksSidebar userId={currentUser._id} />
            </div>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <ExamScheduler userId={currentUser._id} />
            </div>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <StudyPlan userId={currentUser._id} />
            </div>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <PunishmentWidget />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
