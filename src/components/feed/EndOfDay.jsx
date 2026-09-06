import React, { useState, useEffect } from 'react';

const CAUGHT_UP_MESSAGES = [
  "You're all caught up ☕",
  "That's everything important for today.",
  "You've reached the end of today's internet.",
  "No more cards for today.",
  "Today's briefing is complete.",
  "You made it through the day.",
  "That's a wrap for today.",
];

export default function EndOfDay({ day, storyCount, sourceCount, onExplorePrevious, hasPreviousDay }) {
  const [message, setMessage] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const idx = Math.floor(Math.random() * CAUGHT_UP_MESSAGES.length);
    setMessage(CAUGHT_UP_MESSAGES[idx]);
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, [day?.id]);

  return (
    <div className={`end-of-day ${showContent ? 'visible' : ''}`}>
      <div className="end-of-day-divider">
        <span />
        <svg className="end-of-day-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
        <span />
      </div>

      <div className="end-of-day-content">
        <h3 className="end-of-day-message">{message}</h3>
        <p className="end-of-day-subtitle">
          That's everything important from {day?.displayDate || day?.date}.
        </p>

        <div className="end-of-day-stats">
          <div className="end-of-day-stat">
            <span className="end-of-day-stat-value">{storyCount}</span>
            <span className="end-of-day-stat-label">stories</span>
          </div>
          <div className="end-of-day-stat">
            <span className="end-of-day-stat-value">{sourceCount}</span>
            <span className="end-of-day-stat-label">sources</span>
          </div>
          <div className="end-of-day-stat">
            <span className="end-of-day-stat-value">3</span>
            <span className="end-of-day-stat-label">trends</span>
          </div>
        </div>

        <p className="end-of-day-breathe">Take a breath.</p>

        <div className="end-of-day-actions">
          <button className="end-of-day-btn primary">
            Review today's highlights
          </button>
          {hasPreviousDay && (
            <button className="end-of-day-btn secondary" onClick={onExplorePrevious}>
              Explore yesterday →
            </button>
          )}
          <button className="end-of-day-btn secondary">
            View this week's trends
          </button>
        </div>
      </div>

      {hasPreviousDay && (
        <div className="boomerang-transition">
          <div className="boomerang-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
          </div>
          <span>Continue scrolling into yesterday?</span>
        </div>
      )}
    </div>
  );
}
