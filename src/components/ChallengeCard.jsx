import React from 'react';
import PropTypes from 'prop-types';
import { Trophy, Calendar, Users, Target, ArrowRight } from 'lucide-react';

const ChallengeCard = ({ challenge, currentUserId, onJoin }) => {
    const isJoined = challenge.participants.some(p => p.userId === currentUserId || p.userId?._id === currentUserId);
    const participantCount = challenge.participants.length;

    // Calculate days remaining
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className={`challenge-card ${isJoined ? 'joined' : ''}`}>
            <div className="card-header">
                <div className="icon-wrapper">
                    <Trophy size={20} />
                </div>
                {isJoined && <span className="joined-badge">Joined</span>}
            </div>

            <h3 className="challenge-title">{challenge.name}</h3>
            <p className="challenge-desc">{challenge.description}</p>

            <div className="challenge-meta">
                <div className="meta-item">
                    <Target size={14} />
                    <span>{challenge.goal.value} {challenge.goal.type}</span>
                </div>
                <div className="meta-item">
                    <Users size={14} />
                    <span>{participantCount} participants</span>
                </div>
                <div className="meta-item">
                    <Calendar size={14} />
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                </div>
            </div>

            {!isJoined ? (
                <button
                    className="btn-join"
                    onClick={() => onJoin(challenge._id)}
                    disabled={daysLeft < 0}
                >
                    Join Challenge
                    <ArrowRight size={16} />
                </button>
            ) : (
                <div className="progress-status">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '0%' }}></div> {/* TODO: Real progress */}
                    </div>
                    <span>0% Complete</span>
                </div>
            )}

            <style jsx>{`
                .challenge-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    transition: all var(--transition-base);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .challenge-card:hover {
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                }

                .challenge-card.joined {
                    border-color: var(--primary);
                    background: linear-gradient(to bottom right, var(--bg-card), rgba(var(--primary-rgb), 0.05));
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .icon-wrapper {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-subtle);
                    border-radius: var(--radius-md);
                    color: var(--warning);
                }

                .joined-badge {
                    padding: 0.25rem 0.75rem;
                    background: var(--primary-light);
                    color: var(--primary);
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .challenge-title {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--text-main);
                }

                .challenge-desc {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                .challenge-meta {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-light);
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .btn-join {
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    cursor: pointer;
                    transition: background var(--transition-base);
                }

                .btn-join:hover {
                    background: var(--primary-dark);
                }
                
                .btn-join:disabled {
                    background: var(--text-muted);
                    cursor: not-allowed;
                }

                .progress-status {
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.875rem;
                    color: var(--primary);
                    font-weight: 500;
                }
                
                .progress-bar {
                    flex: 1;
                    height: 6px;
                    background: var(--bg-subtle);
                    border-radius: var(--radius-full);
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: var(--primary);
                    border-radius: var(--radius-full);
                }
            `}</style>
        </div>
    );
};

ChallengeCard.propTypes = {
    challenge: PropTypes.object.isRequired,
    currentUserId: PropTypes.string.isRequired,
    onJoin: PropTypes.func.isRequired
};

export default ChallengeCard;
