import React, { useState, useEffect } from 'react';
import { Home, BarChart3, Settings as SettingsIcon, Trophy, LogOut, Users } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import SpreadsheetHeader from './components/SpreadsheetHeader';
import MonthlyView from './components/MonthlyView';
import SpecialTasksSidebar from './components/SpecialTasksSidebar';
import AddHabitForm from './components/AddHabitForm';
import ExamScheduler from './components/ExamScheduler';
import PunishmentWidget from './components/PunishmentWidget';
import StudyPlan from './components/StudyPlan';
import ProfileSelector from './components/ProfileSelector';
import Analytics from './components/Analytics';
import SettingsPage from './components/SettingsPage';
import LevelProgress from './components/LevelProgress';
import AchievementsList from './components/AchievementsList';
import SocialHub from './components/SocialHub';
import MotivationalWidget from './components/MotivationalWidget';
import NotificationCenter from './components/NotificationCenter';
import InstallPrompt from './components/InstallPrompt';
import PomodoroTimer from './components/PomodoroTimer';
import { getTodayISO } from './utils/dateUtils';
import { api } from './services/api';
import { calculatePoints, checkAchievements, getStreakInfo } from './utils/gamification';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('habitflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [habits, setHabits] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // home, analytics, achievements, settings
  const [notifications, setNotifications] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  // Load habits when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('habitflow_current_user', JSON.stringify(currentUser));
      loadHabits();
      loadUserData();
    } else {
      localStorage.removeItem('habitflow_current_user');
      setHabits([]);
    }
  }, [currentUser]);

  const loadHabits = async () => {
    if (!currentUser) return;
    try {
      const data = await api.getHabits(currentUser._id);
      setHabits(data);
    } catch (err) {
      console.error('Failed to load habits:', err);
    }
  };

  const loadUserData = async () => {
    if (!currentUser) return;
    try {
      // Load user points and achievements
      const userData = await api.getUser(currentUser._id);
      setUserPoints(userData.points || 0);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const processAchievements = async (currentHabits) => {
    if (!currentUser) return;

    // 1. Calculate Habit Data for Achievement Check
    const totalCompletions = currentHabits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0);

    // Global Streak Calculation
    const allDates = new Set();
    currentHabits.forEach(h => h.completedDates?.forEach(d => allDates.add(d)));
    const uniqueDates = Array.from(allDates);
    const { longestStreak } = getStreakInfo(uniqueDates);

    const habitData = {
      totalHabits: currentHabits.length,
      totalCompletions,
      longestStreak,
      perfectDays: 0 // Placeholder
    };

    // 2. Check for NEW achievements
    const newAchievements = checkAchievements(currentUser, habitData);

    if (newAchievements.length > 0) {
      // 3. Notify User
      newAchievements.forEach(ach => {
        setNotifications(prev => [...prev, {
          id: Date.now() + Math.random(),
          message: `Achievement Unlocked: ${ach.name}!`,
          read: false,
          type: 'achievement'
        }]);
      });

      // 4. Update Backend
      const newIds = newAchievements.map(a => a.id);
      const updatedAchievements = [...(currentUser.achievements || []), ...newIds];

      // Optimistic Update
      setCurrentUser(prev => ({
        ...prev,
        achievements: updatedAchievements
      }));

      try {
        await api.updateUser(currentUser._id, { achievements: updatedAchievements });
      } catch (err) {
        console.error('Failed to save achievements', err);
      }
    }
  };

  const addHabit = async (habitData) => {
    try {
      const newHabit = await api.createHabit(currentUser._id, habitData);
      const updatedHabits = [newHabit, ...habits];
      setHabits(updatedHabits);

      // Award points for creating habit
      const points = calculatePoints('habit_created');
      updateUserPoints(points);

      // Check Achievements
      processAchievements(updatedHabits);
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const toggleHabit = async (id, date = null) => {
    const targetDate = date || getTodayISO();
    let updatedHabits = [];

    // Optimistic UI Update & Capture Updated State
    setHabits(prev => {
      const next = prev.map(habit => {
        if (habit._id === id) {
          const isCompleted = habit.completedDates.includes(targetDate);
          let newDates;
          if (isCompleted) {
            newDates = habit.completedDates.filter(d => d !== targetDate);
          } else {
            newDates = [...habit.completedDates, targetDate];
            // Award points for completing habit
            const points = calculatePoints('habit_completed');
            updateUserPoints(points);
          }
          return { ...habit, completedDates: newDates };
        }
        return habit;
      });
      updatedHabits = next;
      return next;
    });

    // API Call
    try {
      await api.toggleHabit(id, targetDate);
      processAchievements(updatedHabits);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      loadHabits(); // Revert on error
    }
  };

  const deleteHabit = async (id) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      try {
        await api.deleteHabit(id);
        const updated = habits.filter(h => h._id !== id);
        setHabits(updated);
        processAchievements(updated);
      } catch (err) {
        console.error('Failed to delete habit:', err);
      }
    }
  };

  const updateUserPoints = (points) => {
    setUserPoints(prev => prev + points);
    // TODO: Update backend with new points
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleNotificationDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!currentUser) {
    return <ProfileSelector onSelectUser={setCurrentUser} />;
  }

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-brand">
          <h1 className="app-title">HabitFlow</h1>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button
            className={`nav-tab ${currentView === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentView('analytics')}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
          <button
            className={`nav-tab ${currentView === 'achievements' ? 'active' : ''}`}
            onClick={() => setCurrentView('achievements')}
          >
            <Trophy size={20} />
            <span>Achievements</span>
          </button>
          <button
            className={`nav-tab ${currentView === 'social' ? 'active' : ''}`}
            onClick={() => setCurrentView('social')}
          >
            <Users size={20} />
            <span>Social</span>
          </button>
          <button
            className={`nav-tab ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </button>
        </div>

        <div className="nav-actions">
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={handleNotificationRead}
            onDismiss={handleNotificationDismiss}
          />
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'home' && (
          <div className="container fade-in">
            {/* Gamification Section */}
            <div className="gamification-bar">
              <LevelProgress points={userPoints} />
              <MotivationalWidget variant="daily" />
            </div>

            <SpreadsheetHeader habits={habits} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <MonthlyView habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />

                <div style={{ marginTop: '2rem' }}>
                  <AddHabitForm onAdd={addHabit} />
                </div>

                <div key={currentUser._id} style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <SpecialTasksSidebar userId={currentUser._id} />
                  <ExamScheduler userId={currentUser._id} />
                  <StudyPlan userId={currentUser._id} />
                  <PunishmentWidget />
                  <PomodoroTimer onSessionComplete={(data) => {
                    const points = calculatePoints('study_session');
                    updateUserPoints(points);
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'analytics' && (
          <div className="fade-in">
            <Analytics habits={habits} />
          </div>
        )}

        {currentView === 'social' && (
          <div className="container fade-in">
            <SocialHub
              currentUserId={currentUser._id}
              onPointAward={(action) => {
                const points = calculatePoints(action);
                updateUserPoints(points);
              }}
            />
          </div>
        )}

        {currentView === 'achievements' && (
          <div className="container fade-in">
            <div className="achievements-header">
              <Trophy size={32} />
              <h2>Achievements</h2>
            </div>
            <div className="achievements-content">
              <LevelProgress points={userPoints} showDetails={true} />

              <div style={{ marginTop: '2rem' }}>
                <AchievementsList
                  unlocked={currentUser.achievements || []}
                  habits={habits}
                  stats={{
                    totalCompletions: habits.reduce((acc, h) => acc + (h.completedDates?.length || 0), 0),
                    longestStreak: Math.max(...habits.map(h => {
                      // Pass 0 or simplified streak as we don't have easy access to global streak here without recalculation
                      // Ideally move streak calculation to a hook or context
                      return 0;
                    }), 0)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="fade-in">
            <SettingsPage user={currentUser} onUpdateUser={setCurrentUser} />
          </div>
        )}
      </main>

      {/* PWA Install Prompt */}
      <InstallPrompt />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: var(--bg-app);
        }

        .top-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-brand .app-title {
          margin: 0;
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-tabs {
          display: flex;
          gap: 0.5rem;
          flex: 1;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-muted);
          transition: all var(--transition-base);
        }

        .nav-tab:hover {
          background: var(--bg-subtle);
          color: var(--text-main);
        }

        .nav-tab.active {
          background: var(--primary);
          color: white;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: var(--bg-subtle);
          border-radius: var(--radius-md);
        }

        .user-name {
          font-weight: 600;
          color: var(--primary);
        }

        .btn-logout {
          padding: 0.25rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--text-muted);
          transition: all var(--transition-base);
        }

        .btn-logout:hover {
          color: var(--error);
        }

        .main-content {
          padding-bottom: 4rem;
        }

        .gamification-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .achievements-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .achievements-header h2 {
          margin: 0;
          font-size: 2rem;
        }

        .achievements-content {
          max-width: 600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .top-nav {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }

          .nav-tabs {
            overflow-x: auto;
          }

          .nav-tab span {
            display: none;
          }

          .gamification-bar {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
