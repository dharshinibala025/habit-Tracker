import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UserPlus, UserCheck, X, Search, Users } from 'lucide-react';
import { api } from '../services/api';

const FriendList = ({ friends = [], requests = [], currentUserId, onUpdate, onPointAward }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSendRequest = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await api.sendFriendRequest(currentUserId, email);
            if (res.message) {
                setMessage({ text: 'Request sent successfully!', type: 'success' });
                setEmail('');
                // Optional: Award points for sending request? Or only on accept?
                // Let's award for sending for now to encourage activity
                if (onPointAward) onPointAward('friend_added');
            }
        } catch (err) {
            setMessage({ text: 'Failed to send request. Check email.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await api.acceptFriendRequest(currentUserId, requestId);
            onUpdate(); // Refresh list
            if (onPointAward) onPointAward('friend_added');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="friend-list-container">
            {/* Add Friend Section */}
            <div className="section add-friend">
                <h3><UserPlus size={20} /> Add Friend</h3>
                <form onSubmit={handleSendRequest} className="search-form">
                    <div className="input-group">
                        <Search size={16} className="search-icon" />
                        <input
                            type="email"
                            placeholder="Enter friend's email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="friend-input"
                        />
                    </div>
                    <button type="submit" className="btn-add" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
                {message.text && (
                    <p className={`message ${message.type}`}>{message.text}</p>
                )}
            </div>

            {/* Friend Requests */}
            {requests.length > 0 && (
                <div className="section requests-section">
                    <h3>Pending Requests ({requests.length})</h3>
                    <div className="requests-list">
                        {requests.map(req => (
                            <div key={req._id} className="request-card">
                                <div className="user-info">
                                    <span className="user-avatar">{req.name[0]}</span>
                                    <div>
                                        <p className="name">{req.name}</p>
                                        <p className="email">{req.email}</p>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleAccept(req._id)} className="btn-accept">
                                        <UserCheck size={16} /> Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List */}
            <div className="section list-section">
                <h3><Users size={20} /> My Friends ({friends.length})</h3>
                {friends.length === 0 ? (
                    <p className="empty-state">No friends yet. Add someone to start!</p>
                ) : (
                    <div className="friends-grid">
                        {friends.map(friend => (
                            <div key={friend._id} className="friend-card">
                                <div className="friend-avatar">{friend.name[0]}</div>
                                <div className="friend-info">
                                    <h4>{friend.name}</h4>
                                    <p>Level {friend.level || 1}</p>
                                    <div className="points-badge">
                                        {friend.points || 0} pts
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .friend-list-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .section h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                    color: var(--text-main);
                }

                .search-form {
                    display: flex;
                    gap: 0.5rem;
                }

                .input-group {
                    position: relative;
                    flex: 1;
                }

                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .friend-input {
                    width: 100%;
                    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    background: var(--bg-subtle);
                    color: var(--text-main);
                }

                .btn-add {
                    padding: 0.75rem 1.5rem;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    cursor: pointer;
                }

                .message {
                    margin: 0.5rem 0 0 0;
                    font-size: 0.875rem;
                }
                .message.success { color: var(--success); }
                .message.error { color: var(--error); }

                .requests-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .request-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: var(--bg-card);
                    border: 1px solid var(--warning);
                    border-radius: var(--radius-md);
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-avatar, .friend-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-light);
                    color: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }

                .name { margin: 0; font-weight: 600; }
                .email { margin: 0; font-size: 0.8rem; color: var(--text-muted); }

                .btn-accept {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: var(--success);
                    color: white;
                    border: none;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                }

                .friends-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .friend-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg-card);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                }

                .friend-info h4 { margin: 0; font-size: 1rem; }
                .friend-info p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }

                .points-badge {
                    margin-top: 0.25rem;
                    display: inline-block;
                    padding: 0.1rem 0.5rem;
                    background: var(--bg-subtle);
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--warning);
                }

                .empty-state {
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
};

FriendList.propTypes = {
    friends: PropTypes.array,
    requests: PropTypes.array,
    currentUserId: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onPointAward: PropTypes.func
};

export default FriendList;
