import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showPrompt || localStorage.getItem('pwa-install-dismissed')) {
        return null;
    }

    return (
        <div className="install-prompt">
            <div className="install-content">
                <Download size={24} className="install-icon" />
                <div className="install-text">
                    <h4>Install HabitFlow</h4>
                    <p>Install our app for quick access and offline use</p>
                </div>
            </div>
            <div className="install-actions">
                <button onClick={handleInstall} className="btn-install">
                    Install
                </button>
                <button onClick={handleDismiss} className="btn-dismiss">
                    Not now
                </button>
            </div>

            <style jsx>{`
        .install-prompt {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          max-width: 500px;
          width: calc(100% - 2rem);
          padding: 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .install-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .install-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .install-text h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .install-text p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .install-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-install,
        .btn-dismiss {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .btn-install {
          background: var(--primary);
          color: white;
        }

        .btn-install:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .btn-dismiss {
          background: var(--bg-subtle);
          color: var(--text-muted);
        }

        .btn-dismiss:hover {
          background: var(--border-strong);
        }
      `}</style>
        </div>
    );
};

export default InstallPrompt;
