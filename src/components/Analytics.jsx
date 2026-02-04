import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart3, TrendingUp, Calendar, Award, Zap } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = ({ habits = [] }) => {
    const [stats, setStats] = useState({
        totalCompletions: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        bestDay: 'N/A'
    });

    const [chartsData, setChartsData] = useState(null);

    useEffect(() => {
        calculateStats();
    }, [habits]);

    const calculateStats = () => {
        let totalCompletions = 0;
        let longestStreak = 0;
        const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }; // Sun-Sat

        // Only calculate positive stats from positive habits
        const positiveHabits = habits.filter(h => h.type !== 'negative');

        positiveHabits.forEach(habit => {
            const completed = habit.completedDates || [];
            totalCompletions += completed.length;

            // Count completions by day of week
            completed.forEach(dateStr => {
                const day = new Date(dateStr).getDay();
                dayCounts[day]++;
            });

            const streak = calculateStreak(completed);
            if (streak > longestStreak) longestStreak = streak;
        });

        const completionRate = positiveHabits.length > 0
            ? (totalCompletions / (positiveHabits.length * 30)) * 100 // Approximation
            : 0;

        // Determine best day
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let maxCount = -1;
        let bestDayIndex = -1;
        Object.entries(dayCounts).forEach(([day, count]) => {
            if (count > maxCount) {
                maxCount = count;
                bestDayIndex = parseInt(day);
            }
        });

        setStats({
            totalCompletions,
            currentStreak: longestStreak, // Ideally needs proper global streak logic
            longestStreak,
            completionRate: Math.round(completionRate),
            bestDay: bestDayIndex !== -1 ? days[bestDayIndex] : 'N/A'
        });

        prepareCharts(dayCounts);
    };

    const calculateStreak = (dates) => {
        if (!dates || dates.length === 0) return 0;
        const sortedDates = [...dates].sort().reverse();
        let streak = 0;
        const today = new Date().toISOString().split('T')[0];

        // Basic streak logic check (same as before)
        // Note: Ideally extract this to utils/gamification.js for DRY
        if (sortedDates[0] === today || sortedDates[0] === getPreviousDate(today)) {
            streak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
                if (isConsecutive(sortedDates[i - 1], sortedDates[i])) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        return streak;
    };

    const getPreviousDate = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    };

    const isConsecutive = (date1, date2) => {
        return getPreviousDate(date1) === date2;
    };

    const prepareCharts = (dayCounts) => {
        // 1. Last 7 Days Trend
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const positiveHabits = habits.filter(h => h.type !== 'negative');

        const trendData = last7Days.map(date => {
            return positiveHabits.filter(h => h.completedDates?.includes(date)).length;
        });

        // 2. Weekly Performance (Bar)
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData = Object.values(dayCounts);

        // 3. Habit Efficiency (Horizontal Bar)
        // Sort habits by completion count desc
        const sortedHabits = [...positiveHabits].sort((a, b) => (b.completedDates?.length || 0) - (a.completedDates?.length || 0));
        const topHabits = sortedHabits.slice(0, 5); // Show top 5

        setChartsData({
            trend: {
                labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Daily Completions',
                    data: trendData,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            weekly: {
                labels: dayLabels,
                datasets: [{
                    label: 'Total Completions',
                    data: weeklyData,
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderRadius: 4
                }]
            },
            efficiency: {
                labels: topHabits.map(h => h.name),
                datasets: [{
                    label: 'Times Completed',
                    data: topHabits.map(h => h.completedDates?.length || 0),
                    backgroundColor: 'rgba(245, 158, 11, 0.6)',
                    borderRadius: 4,
                    indexAxis: 'y'
                }]
            }
        });
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
    };

    const efficiencyOptions = {
        ...commonOptions,
        indexAxis: 'y'
    };

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <BarChart3 size={32} />
                <h2>Analytics Dashboard</h2>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon icon-primary">
                        <Award size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalCompletions}</h3>
                        <p>Total Completions</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon icon-success">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.currentStreak}</h3>
                        <p>Longest Streak</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon icon-warning">
                        <Zap size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.bestDay}</h3>
                        <p>Best Performance Day</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon icon-info">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.completionRate}%</h3>
                        <p>Monthly Consistency</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Last 7 Days Activity</h3>
                    <div className="chart-wrapper">
                        {chartsData && <Line data={chartsData.trend} options={commonOptions} />}
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Weekly Performance</h3>
                    <div className="chart-wrapper">
                        {chartsData && <Bar data={chartsData.weekly} options={commonOptions} />}
                    </div>
                </div>

                <div className="chart-container full-width">
                    <h3>Top Performing Habits</h3>
                    <div className="chart-wrapper">
                        {chartsData && <Bar data={chartsData.efficiency} options={efficiencyOptions} />}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .analytics-dashboard {
          padding: 2rem;
        }

        .analytics-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .analytics-header h2 {
          margin: 0;
          font-size: 1.75rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-icon {
          padding: 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon-primary { background: var(--primary-light); color: var(--primary); }
        .icon-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .icon-info { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

        .stat-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat-content p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
        }

        .chart-container {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        
        .chart-container.full-width {
            grid-column: 1 / -1;
        }

        .chart-container h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .chart-wrapper {
          height: 300px;
          position: relative;
        }
        
        @media (max-width: 768px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
        </div>
    );
};

Analytics.propTypes = {
    habits: PropTypes.array
};

export default Analytics;
