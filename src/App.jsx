import React, { useState, useEffect } from 'react';
import SpreadsheetHeader from './components/SpreadsheetHeader';
import MonthlyView from './components/MonthlyView';
import SpecialTasksSidebar from './components/SpecialTasksSidebar';
import AddHabitForm from './components/AddHabitForm';
import ExamScheduler from './components/ExamScheduler';
import PunishmentWidget from './components/PunishmentWidget';
import StudyPlan from './components/StudyPlan';
import { getTodayISO } from './utils/dateUtils';

const STORAGE_KEY = 'habitflow_data_v1';

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

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
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <SpreadsheetHeader habits={habits} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Main Tracker */}
        <div>
          <MonthlyView habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />

          <div style={{ marginTop: '2rem' }}>
            <AddHabitForm onAdd={addHabit} />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <SpecialTasksSidebar />
            </div>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <ExamScheduler />
            </div>
            <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
              <StudyPlan />
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
