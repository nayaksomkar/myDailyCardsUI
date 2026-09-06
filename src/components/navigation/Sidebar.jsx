import React from 'react';
import { getCategories } from '../../services/data';
import useServiceHealth from '../../hooks/useServiceHealth';

export default function Sidebar({ activePage, onNavigate, days, currentDayId, onSelectDay, onClose }) {
  const categories = getCategories();
  const { services, onlineCount, total, loading } = useServiceHealth();
  const overall = loading ? 'checking' : (onlineCount === total ? 'online' : (onlineCount === 0 ? 'offline' : 'slow'));

  return (
    <aside className="sidebar">
      {onClose && (
        <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">✦</span>
        <span className="sidebar-brand-name">myDailyCards</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${activePage === 'feed' ? 'active' : ''}`}
          onClick={() => onNavigate('feed')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Home
        </button>
        <button
          className={`sidebar-nav-item ${activePage === 'discover' ? 'active' : ''}`}
          onClick={() => onNavigate('discover')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
          </svg>
          Discover
        </button>
        <button
          className={`sidebar-nav-item ${activePage === 'trends' ? 'active' : ''}`}
          onClick={() => onNavigate('trends')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
          </svg>
          Trending
        </button>
        <button
          className={`sidebar-nav-item ${activePage === 'saved' ? 'active' : ''}`}
          onClick={() => onNavigate('saved')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          Saved
        </button>
        <button
          className={`sidebar-nav-item ${activePage === 'chat' ? 'active' : ''}`}
          onClick={() => onNavigate('chat')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          Chat
        </button>
      </nav>

      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Categories</h4>
        <div className="sidebar-categories">
          {categories.map((cat) => (
            <button key={cat.id} className="sidebar-category">
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4 className="sidebar-section-title">This Week</h4>
        <div className="sidebar-days">
          {days.map((day) => (
            <button
              key={day.id}
              className={`sidebar-day ${day.id === currentDayId ? 'active' : ''}`}
              onClick={() => {
                onSelectDay(day.id);
                onNavigate('feed');
              }}
            >
              {day.label || day.displayDate}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section sidebar-services">
        <h4 className="sidebar-section-title">Services</h4>
        <div className="service-status-mini">
          <span className={`service-dot ${overall}`} />
          <span>{loading ? 'Checking…' : `${onlineCount}/${total} online`}</span>
        </div>
        <div className="sidebar-service-list">
          {services.map((s) => (
            <div key={s.id} className="sidebar-service-row">
              <span className={`service-dot ${s.status}`} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
