import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Quote } from 'lucide-react';
import { getDailyQuote, getRandomQuote } from '../data/motivationalQuotes';

const MotivationalWidget = ({ category = 'general', variant = 'daily' }) => {
    const [quote, setQuote] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const selectedQuote = variant === 'daily' ? getDailyQuote() : getRandomQuote(category);
        setQuote(selectedQuote);

        // Fade in animation
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [category, variant]);

    if (!quote) return null;

    return (
        <div className={`motivational-widget ${isVisible ? 'visible' : ''}`}>
            <div className="quote-icon">
                <Quote size={24} />
            </div>
            <div className="quote-content">
                <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
                <p className="quote-author">— {quote.author}</p>
            </div>

            <style jsx>{`
        .motivational-widget {
          position: relative;
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--primary-light), var(--bg-card));
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.5s ease-out;
        }

        .motivational-widget.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .quote-icon {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: var(--primary);
          opacity: 0.3;
        }

        .quote-content {
          margin-left: 2rem;
        }

        .quote-text {
          font-size: 1rem;
          font-style: italic;
          color: var(--text-main);
          line-height: 1.6;
          margin: 0 0 0.5rem 0;
          font-family: var(--font-serif);
        }

        .quote-author {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 600;
          margin: 0;
          text-align: right;
        }
      `}</style>
        </div>
    );
};

MotivationalWidget.propTypes = {
    category: PropTypes.oneOf(['general', 'streak', 'motivation', 'achievement', 'study']),
    variant: PropTypes.oneOf(['daily', 'random'])
};

export default MotivationalWidget;
