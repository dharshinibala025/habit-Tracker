import React from 'react';
import PropTypes from 'prop-types';
import { Lock, Award, Star } from 'lucide-react';
import { achievementDefinitions } from '../data/achievements';

const AchievementsList = ({ unlocked = [], habits = [], stats = {} }) => {
    // Helper to get icon component
    // Using simple text/emoji for now as per definitions, or could add mapping

    // Calculate progress for specific achievements
    const getProgress = (achievementId) => {
        if (unlocked.includes(achievementId)) return 100;

        // Logic to calculate partial progress
        // This relies on the same stats logic as checkAchievements
        let current = 0;
        let target = 0;

        switch (achievementId) {
            case 'habits_10':
                current = habits.length;
                target = 10;
                break;
            case 'habits_25':
                current = habits.length;
                target = 25;
                break;
            case 'completions_100':
                current = stats.totalCompletions || 0;
                target = 100;
                break;
            case 'completions_500':
                current = stats.totalCompletions || 0;
                target = 500;
                break;
            case 'day_3_streak':
                current = stats.longestStreak || 0;
                target = 3;
                break;
            case 'week_streak':
                current = stats.longestStreak || 0;
                target = 7;
                break;
            case 'month_streak':
                current = stats.longestStreak || 0;
                target = 30;
                break;
            // Add other cases as needed
            default:
                return 0;
        }
        return Math.min(Math.round((current / target) * 100), 100);
    };

    return (
        <div className="achievements-grid">
            {Object.values(achievementDefinitions).map((achievement) => {
                const isUnlocked = unlocked.includes(achievement.id);
                const progress = getProgress(achievement.id);

                return (
                    <div
                        key={achievement.id}
                        className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                    >
                        <div className="achievement-icon-wrapper">
                            {isUnlocked ? (
                                <div className="achievement-icon">{achievement.icon}</div>
                            ) : (
                                <Lock size={24} className="lock-icon" />
                            )}
                        </div>
                        <div className="achievement-info">
                            <h4>{achievement.name}</h4>
                            <p>{achievement.description}</p>

                            {!isUnlocked && progress > 0 && (
                                <div className="achievement-progress">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            )}

                            {isUnlocked && (
                                <div className="achievement-date">
                                    <Award size={12} style={{ marginRight: 4 }} />
                                    Unlocked
                                </div>
                            )}
                        </div>
                        <div className="achievement-points">
                            <Star size={12} fill="currentColor" />
                            <span>{achievement.points}</span>
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                }

                .achievement-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-card);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    transition: all var(--transition-base);
                    position: relative;
                    overflow: hidden;
                }

                .achievement-card.unlocked {
                    border-color: var(--primary-light);
                    background: linear-gradient(to right bottom, var(--bg-card), rgba(var(--primary-rgb), 0.05));
                }

                .achievement-card.locked {
                    opacity: 0.7;
                    filter: grayscale(0.8);
                }

                .achievement-icon-wrapper {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-subtle);
                    border-radius: 50%;
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .achievement-card.unlocked .achievement-icon-wrapper {
                    background: var(--primary-light);
                    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.2);
                }

                .achievement-info {
                    flex: 1;
                    min-width: 0;
                }

                .achievement-info h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1rem;
                    color: var(--text-main);
                }

                .achievement-info p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    line-height: 1.3;
                }

                .achievement-progress {
                    margin-top: 0.5rem;
                    height: 4px;
                    background: var(--bg-subtle);
                    border-radius: 2px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--primary);
                    border-radius: 2px;
                }

                .achievement-date {
                    display: flex;
                    align-items: center;
                    margin-top: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--success);
                    font-weight: 600;
                }

                .achievement-points {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    background: var(--bg-subtle);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--warning);
                }
            `}</style>
        </div>
    );
};

AchievementsList.propTypes = {
    unlocked: PropTypes.array,
    habits: PropTypes.array,
    stats: PropTypes.object
};

export default AchievementsList;
