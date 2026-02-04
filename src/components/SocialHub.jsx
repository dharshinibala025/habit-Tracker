import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Users, Trophy, Globe } from 'lucide-react';
import FriendList from './FriendList';
import ChallengeCard from './ChallengeCard';
import { api } from '../services/api';

const SocialHub = ({ currentUserId, onPointAward }) => {
    const [activeTab, setActiveTab] = useState('friends');
    const [friendsData, setFriendsData] = useState({ friends: [], requests: [] });
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'friends') {
                const data = await api.getFriends(currentUserId);
                setFriendsData(data);
            } else {
                const data = await api.getChallenges();
                setChallenges(data);
            }
        } catch (err) {
            console.error('Failed to load social data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab, currentUserId]);

    const handleJoinChallenge = async (challengeId) => {
        try {
            await api.joinChallenge(challengeId, currentUserId);
            // Refresh challenges
            const data = await api.getChallenges();
            setChallenges(data);
            alert('Successfully joined the challenge!');
            if (onPointAward) onPointAward('challenge_joined');
        } catch (err) {
            alert('Failed to join challenge');
        }
    };

    return (
        <div className="social-hub">
            <div className="hub-header">
                <h2><Globe size={28} /> Social Hub</h2>
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                        onClick={() => setActiveTab('friends')}
                    >
                        <Users size={18} /> Friends
                        {friendsData.requests.length > 0 && (
                            <span className="badge">{friendsData.requests.length}</span>
                        )}
                    </button>
                    <button
                        className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
                        onClick={() => setActiveTab('challenges')}
                    >
                        <Trophy size={18} /> Challenges
                    </button>
                </div>
            </div>

            <div className="hub-content">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {activeTab === 'friends' ? (
                            <FriendList
                                friends={friendsData.friends}
                                requests={friendsData.requests}
                                currentUserId={currentUserId}
                                onUpdate={loadData}
                                onPointAward={onPointAward}
                            />
                        ) : (
                            <div className="challenges-grid">
                                {challenges.length === 0 ? (
                                    <p className="empty-state">No active challenges found. Check back later!</p>
                                ) : (
                                    challenges.map(challenge => (
                                        <ChallengeCard
                                            key={challenge._id}
                                            challenge={challenge}
                                            currentUserId={currentUserId}
                                            onJoin={handleJoinChallenge}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
                .social-hub {
                    padding: 0 1rem;
                }

                .hub-header {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .hub-header h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 0;
                    color: var(--text-main);
                }

                .tabs {
                    display: flex;
                    background: var(--bg-card);
                    padding: 0.25rem;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-light);
                    width: fit-content;
                }

                .tab {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    font-weight: 600;
                    cursor: pointer;
                    border-radius: var(--radius-md);
                    transition: all var(--transition-base);
                    position: relative;
                }

                .tab.active {
                    background: var(--bg-subtle);
                    color: var(--primary);
                }

                .badge {
                    background: var(--error);
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.1rem 0.4rem;
                    border-radius: var(--radius-full);
                    position: absolute;
                    top: 0.25rem;
                    right: 0.25rem;
                }

                .challenges-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .loading {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-muted);
                }

                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 3rem;
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    border: 1px dashed var(--border-light);
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
};

SocialHub.propTypes = {
    currentUserId: PropTypes.string.isRequired,
    onPointAward: PropTypes.func
};

export default SocialHub;
