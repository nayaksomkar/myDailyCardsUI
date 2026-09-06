import React from 'react';

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${activePage === 'feed' ? 'active' : ''}`}
        onClick={() => onNavigate('feed')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
        <span>Home</span>
      </button>
      <button
        className={`bottom-nav-item ${activePage === 'discover' ? 'active' : ''}`}
        onClick={() => onNavigate('discover')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
        </svg>
        <span>Discover</span>
      </button>
      <button
        className={`bottom-nav-item ${activePage === 'trends' ? 'active' : ''}`}
        onClick={() => onNavigate('trends')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
          <polyline points="17,6 23,6 23,12" />
        </svg>
        <span>Trends</span>
      </button>
      <button
        className={`bottom-nav-item ${activePage === 'chat' ? 'active' : ''}`}
        onClick={() => onNavigate('chat')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span>Chat</span>
      </button>
      <button
        className={`bottom-nav-item ${activePage === 'saved' ? 'active' : ''}`}
        onClick={() => onNavigate('saved')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
        <span>Saved</span>
      </button>
    </nav>
  );
}
