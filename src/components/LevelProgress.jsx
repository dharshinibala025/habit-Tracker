import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Star, TrendingUp } from 'lucide-react';
import { getLevelProgress } from '../utils/gamification';

const LevelProgress = ({ points, showDetails = true }) => {
  const [progress, setProgress] = useState(0);
  const levelInfo = getLevelProgress(points);

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setProgress(levelInfo.progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [levelInfo.progress]);

  return (
    <div className="level-progress-container">
      <div className="level-header">
        <div className="level-badge">
          <Star size={20} fill="currentColor" className="level-icon" />
          <span className="level-number">Level {levelInfo.level}</span>
        </div>
        {showDetails && (
          <div className="points-display">
            <TrendingUp size={16} />
            <span>{points.toLocaleString()} points</span>
          </div>
        )}
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          >
            <div className="progress-shimmer"></div>
          </div>
        </div>
        {showDetails && levelInfo.nextLevelPoints && (
          <div className="progress-text">
            <span>{levelInfo.pointsToNext} points to Level {levelInfo.level + 1}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .level-progress-container {
          padding: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .level-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .level-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-subtle);
          color: var(--text-main);
          border: 2px solid var(--primary);
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: var(--shadow-sm);
        }

        .level-icon {
          color: #fbbf24;
        }

        .level-number {
          font-family: var(--font-serif);
        }

        .points-display {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .progress-bar-container {
          width: 100%;
        }

        .progress-bar-bg {
          width: 100%;
          height: 12px;
          background: var(--bg-subtle);
          border-radius: var(--radius-full);
          overflow: hidden;
          position: relative;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: var(--radius-full);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .progress-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          100% {
            left: 100%;
          }
        }

        .progress-text {
          margin-top: 0.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

LevelProgress.propTypes = {
  points: PropTypes.number.isRequired,
  showDetails: PropTypes.bool
};

export default LevelProgress;
