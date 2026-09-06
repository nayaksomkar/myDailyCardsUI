import React from 'react';

export default function TopBar({ activeTab, onTabChange, onSearch, onMenu }) {
  return (
    <header className="top-bar">
      <div className="top-bar-content">
        <button className="top-bar-menu" onClick={onMenu} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="top-bar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">myDailyCards</span>
        </div>

        <nav className="top-bar-tabs">
          <button
            className={`top-bar-tab ${activeTab === 'foryou' ? 'active' : ''}`}
            onClick={() => onTabChange('foryou')}
          >
            For You
          </button>
          <button
            className={`top-bar-tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => onTabChange('following')}
          >
            Following
          </button>
          <button
            className={`top-bar-tab ${activeTab === 'latest' ? 'active' : ''}`}
            onClick={() => onTabChange('latest')}
          >
            Latest
          </button>
        </nav>

        <div className="top-bar-actions">
          <button className="top-bar-btn" onClick={onSearch} aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="top-bar-tabs-mobile" aria-label="Feed tabs">
        <button
          className={`top-bar-tab ${activeTab === 'foryou' ? 'active' : ''}`}
          onClick={() => onTabChange('foryou')}
        >
          For You
        </button>
        <button
          className={`top-bar-tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => onTabChange('following')}
        >
          Following
        </button>
        <button
          className={`top-bar-tab ${activeTab === 'latest' ? 'active' : ''}`}
          onClick={() => onTabChange('latest')}
        >
          Latest
        </button>
      </nav>
    </header>
  );
}
