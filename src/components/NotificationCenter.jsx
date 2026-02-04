import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bell, X, Check, AlertCircle, Trophy, Users } from 'lucide-react';

const NotificationCenter = ({ notifications = [], onMarkAsRead, onDismiss }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'achievement':
                return <Trophy size={20} className="notification-icon achievement" />;
            case 'friend_request':
                return <Users size={20} className="notification-icon social" />;
            case 'streak_warning':
                return <AlertCircle size={20} className="notification-icon warning" />;
            default:
                return <Bell size={20} className="notification-icon default" />;
        }
    };

    return (
        <div className="notification-center">
            <button
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <button onClick={() => setIsOpen(false)} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-state">
                                <Bell size={48} className="empty-icon" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                >
                                    {getNotificationIcon(notification.type)}
                                    <div className="notification-content">
                                        <h4>{notification.title}</h4>
                                        <p>{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.read && (
                                            <button
                                                onClick={() => onMarkAsRead(notification.id)}
                                                className="action-btn"
                                                title="Mark as read"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDismiss(notification.id)}
                                            className="action-btn"
                                            title="Dismiss"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
        .notification-center {
          position: relative;
        }

        .notification-trigger {
          position: relative;
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          color: var(--text-main);
          transition: all var(--transition-base);
        }

        .notification-trigger:hover {
          background: var(--bg-subtle);
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: var(--error);
          color: white;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 400px;
          max-height: 500px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .notification-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .close-btn {
          padding: 0.25rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--text-muted);
          transition: all var(--transition-base);
        }

        .close-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-main);
        }

        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .empty-state {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-icon {
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .notification-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          transition: background var(--transition-base);
        }

        .notification-item:hover {
          background: var(--bg-subtle);
        }

        .notification-item.unread {
          background: var(--primary-light);
        }

        .notification-icon {
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .notification-icon.achievement {
          color: #f59e0b;
        }

        .notification-icon.social {
          color: #3b82f6;
        }

        .notification-icon.warning {
          color: #ef4444;
        }

        .notification-icon.default {
          color: var(--text-muted);
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .notification-content p {
          margin: 0 0 0.5rem 0;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .notification-actions {
          display: flex;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .action-btn {
          padding: 0.25rem;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--text-muted);
          transition: all var(--transition-base);
        }

        .action-btn:hover {
          background: var(--bg-card);
          color: var(--text-main);
        }
      `}</style>
        </div>
    );
};

NotificationCenter.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        read: PropTypes.bool,
        createdAt: PropTypes.string
    })),
    onMarkAsRead: PropTypes.func,
    onDismiss: PropTypes.func
};

export default NotificationCenter;
