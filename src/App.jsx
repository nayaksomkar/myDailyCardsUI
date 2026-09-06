import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  loadData,
  getDays,
  getDayById,
  getStories,
  getStoryById,
  getCategories,
  getCategoryById,
  getKeywords,
  getStoryClusters,
  getStoryClusterById,
  getSampleChat,
  getSources,
  getAllStories,
  filterStories,
} from './services/data';
import useLocalStorage from './hooks/useLocalStorage';

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentDayId, setCurrentDayId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [bookmarks, setBookmarks] = useLocalStorage('myDailyCards_bookmarks', []);
  const [readStories, setReadStories] = useLocalStorage('myDailyCards_read', []);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [explainId, setExplainId] = useState(null);
  const [explainType, setExplainType] = useState('story');
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('myDailyCards_theme', false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [sources, setSources] = useState([]);

  const cardsGridRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      await loadData();
      if (cancelled) return;
      setDataLoaded(true);
      const days = getDays();
      if (days.length > 0 && !currentDayId) {
        setCurrentDayId(days[0].id);
      }
      setSources(getSources());
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const days = useMemo(() => getDays(), [dataLoaded]);

  const filteredStories = useMemo(() => {
    if (!dataLoaded) return [];
    return filterStories({
      dayId: currentDayId,
      category: activeCategory,
      keywords: activeKeywords,
      search: searchQuery,
      sourceType: selectedSource === 'all' ? null : selectedSource,
    });
  }, [dataLoaded, currentDayId, activeCategory, activeKeywords, searchQuery, selectedSource]);

  const relevantClusters = useMemo(() => {
    const storyIds = new Set(filteredStories.map((s) => s.id));
    return getStoryClusters().filter((c) => c.storyIds.some((id) => storyIds.has(id)));
  }, [filteredStories]);

  const clusteredStoryIds = useMemo(() => {
    const ids = new Set();
    relevantClusters.forEach((c) => c.storyIds.forEach((id) => ids.add(id)));
    return ids;
  }, [relevantClusters]);

  const currentDay = useMemo(() => getDayById(currentDayId), [currentDayId]);

  const toggleTheme = useCallback(() => {
    setIsDarkTheme((prev) => !prev);
  }, [setIsDarkTheme]);

  const toggleBookmarks = useCallback(() => {
    setIsBookmarksOpen((prev) => !prev);
  }, [setIsBookmarksOpen]);

  const selectDay = useCallback(
    (dayId) => {
      setCurrentDayId(dayId);
      setActiveCategory('all');
      setActiveKeywords([]);
      setSearchQuery('');
      setSelectedSource('all');
    },
    []
  );

  const handleCategoryClick = useCallback((filter) => {
    setActiveCategory((prev) => (filter === prev ? 'all' : filter));
  }, []);

  const handleKeywordClick = useCallback((kw) => {
    if (kw === 'all') {
      setActiveKeywords([]);
    } else {
      setActiveKeywords((prev) =>
        prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
      );
    }
  }, []);

  const toggleBookmark = useCallback((storyId) => {
    setBookmarks((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  }, [setBookmarks]);

  const toggleBookmarkCluster = useCallback(
    (cluster) => {
      const allIds = cluster.storyIds || [];
      setBookmarks((prev) => {
        const allBookmarked = allIds.every((id) => prev.includes(id));
        if (allBookmarked) {
          return prev.filter((id) => !allIds.includes(id));
        }
        const next = new Set(prev);
        allIds.forEach((id) => next.add(id));
        return Array.from(next);
      });
    },
    [setBookmarks]
  );

  const openDetail = useCallback(
    (storyId) => {
      setReadStories((prev) => (prev.includes(storyId) ? prev : [...prev, storyId]));
      setSelectedStoryId(storyId);
    },
    [setReadStories]
  );

  const closeDetail = useCallback(() => {
    setSelectedStoryId(null);
  }, []);

  const openExplain = useCallback((id, type = 'story') => {
    setExplainId(id);
    setExplainType(type);
  }, []);

  const closeExplain = useCallback(() => {
    setExplainId(null);
    setExplainType('story');
  }, []);

  const clearFilters = useCallback(() => {
    setActiveCategory('all');
    setActiveKeywords([]);
    setSearchQuery('');
    setSelectedSource('all');
  }, []);

  const selectedStory = useMemo(() => {
    if (!selectedStoryId) return null;
    return getStoryById(selectedStoryId);
  }, [selectedStoryId]);

  const explainData = useMemo(() => {
    if (!explainId) return null;
    if (explainType === 'cluster') {
      return getStoryClusterById(explainId)?.explain || null;
    }
    return getStoryById(explainId)?.explain || null;
  }, [explainId, explainType]);

  const chatMessages = useMemo(() => {
    const chat = getSampleChat();
    const conversation = chat.conversations?.[0];
    return conversation?.messages || [];
  }, [dataLoaded]);

  const explainSources = useMemo(() => {
    if (!explainId || explainType !== 'story') return [];
    const story = getStoryById(explainId);
    return story?.sources || [];
  }, [explainId, explainType]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (explainId) closeExplain();
        else if (selectedStoryId) closeDetail();
        else if (isBookmarksOpen) setIsBookmarksOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [explainId, selectedStoryId, isBookmarksOpen, closeExplain, closeDetail]);

  if (!dataLoaded) {
    return (
      <div className="loading-state">
        <div className="loading-skeleton" style={{ height: '200px', marginBottom: '20px' }} />
        <div className="loading-skeleton" style={{ height: '200px', marginBottom: '20px' }} />
        <div className="loading-skeleton" style={{ height: '200px' }} />
      </div>
    );
  }

  return (
    <div id="app">
      <Header
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        bookmarkCount={bookmarks.length}
        toggleBookmarks={toggleBookmarks}
      />

      <Controls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        activeKeywords={activeKeywords}
        onKeywordClick={handleKeywordClick}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        sources={sources}
      />

      <Timeline days={days} currentDayId={currentDayId} onSelectDay={selectDay} />

      <main className="main-content">
        <div className="content-header">
          <h2 className="section-title">
            {currentDay ? `${currentDay.displayDate || currentDay.date} Briefing` : 'Briefing'}
          </h2>
          <div className="content-meta">
            {filteredStories.length} story{filteredStories.length !== 1 ? 'ies' : ''}
          </div>
        </div>

        <div className="cards-grid" ref={cardsGridRef}>
          {relevantClusters.map((cluster) => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              isBookmarked={cluster.storyIds.every((id) => bookmarks.includes(id))}
              onToggleBookmark={() => toggleBookmarkCluster(cluster)}
              onExplain={() => openExplain(cluster.id, 'cluster')}
            />
          ))}

          {filteredStories
            .filter((story) => !clusteredStoryIds.has(story.id))
            .map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isRead={readStories.includes(story.id)}
                isBookmarked={bookmarks.includes(story.id)}
                onToggleBookmark={() => toggleBookmark(story.id)}
                onOpenDetail={() => openDetail(story.id)}
                onExplain={() => openExplain(story.id, 'story')}
              />
            ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p>No stories match your filters.</p>
            <button className="btn-secondary" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </main>

      {selectedStory && (
        <DetailOverlay story={selectedStory} onClose={closeDetail} onExplain={() => openExplain(selectedStory.id, 'story')} />
      )}

      {explainData && (
        <ExplainOverlay
          data={explainData}
          chatMessages={chatMessages}
          sources={explainSources}
          onClose={closeExplain}
        />
      )}

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onOpenStory={(id) => {
          setIsBookmarksOpen(false);
          openDetail(id);
        }}
      />
    </div>
  );
}

function Header({ isDarkTheme, toggleTheme, bookmarkCount, toggleBookmarks }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand">
          <h1>myDailyCards</h1>
          <span className="tagline">Your daily briefing</span>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <button className="bookmarks-toggle" onClick={toggleBookmarks} aria-label="Bookmarks">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <span className="bookmark-count" style={{ opacity: bookmarkCount > 0 ? 1 : 0, transform: bookmarkCount > 0 ? 'scale(1)' : 'scale(0.8)' }}>
              {bookmarkCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Controls({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryClick,
  activeKeywords,
  onKeywordClick,
  selectedSource,
  onSourceChange,
  sources,
}) {
  const categories = getCategories();
  const keywords = getKeywords();

  return (
    <div className="controls-bar">
      <div className="search-container">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search headlines, topics, sources..."
          autocomplete="off"
        />
        <button
          className="search-clear"
          onClick={() => onSearchChange('')}
          style={{ display: searchQuery ? 'block' : 'none' }}
          aria-label="Clear search"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="filter-tags">
        <button className={`filter-tag ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => onCategoryClick('all')}>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-tag ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="filter-tags">
        <button
          className={`filter-tag ${activeKeywords.length === 0 ? 'active' : ''}`}
          onClick={() => onKeywordClick('all')}
        >
          All Topics
        </button>
        {keywords.map((kw) => (
          <button
            key={kw}
            className={`filter-tag ${activeKeywords.includes(kw) ? 'active' : ''}`}
            onClick={() => onKeywordClick(kw)}
          >
            {kw}
          </button>
        ))}
      </div>

      <div className="source-filters">
        <select value={selectedSource} onChange={(e) => onSourceChange(e.target.value)} aria-label="Filter by source">
          <option value="all">All Sources</option>
          {sources.map((src) => (
            <option key={src.id} value={src.type || src.name}>
              {src.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Timeline({ days, currentDayId, onSelectDay }) {
  return (
    <div className="timeline">
      <div className="timeline-track">
        <div className="timeline-days">
          {days.map((day) => (
            <button
              key={day.id}
              className={`day-chip ${day.id === currentDayId ? 'active' : ''}`}
              onClick={() => onSelectDay(day.id)}
            >
              <span className="day-name">{day.label || day.date}</span>
              <span className="day-date">{formatDate(day.date)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="day-indicator">
        <span className="day-name">{days.find((d) => d.id === currentDayId)?.label || ''}</span>
        <span className="day-date">{days.find((d) => d.id === currentDayId)?.displayDate || ''}</span>
      </div>
    </div>
  );
}

function StoryCard({ story, isRead, isBookmarked, onToggleBookmark, onOpenDetail, onExplain }) {
  const category = getCategoryById(story.category);
  const primarySource = (story.sources || [])[0];

  return (
    <div className={`card fade-in ${isRead ? 'read' : ''}`}>
      <div className="card-header">
        <span className="card-category">{category ? category.name : story.category}</span>
        <div className="card-actions">
          <button
            className={`card-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            aria-label="Bookmark"
          >
            <svg viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="card-title">{escapeHtml(story.title)}</h3>
      <p className="card-summary">{escapeHtml(story.shortSummary || story.summary || '')}</p>
      <div className="card-meta">
        <div className="card-source">
          <div className="source-avatar">{getInitials(primarySource?.name)}</div>
          <span>{escapeHtml(primarySource?.name)}</span>
        </div>
        <span className="card-time">{formatTime(primarySource?.publishedAt)}</span>
      </div>
      <button className="card-explain-btn" onClick={(e) => { e.stopPropagation(); onExplain(); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
        Explain this
      </button>
    </div>
  );
}

function ClusterCard({ cluster, isBookmarked, onToggleBookmark, onExplain }) {
  const clusterStories = cluster.storyIds.map((id) => getStoryById(id)).filter(Boolean);
  const sourcesMap = new Map();
  clusterStories.forEach((s) => (s.sources || []).forEach((src) => sourcesMap.set(src.id, src)));

  return (
    <div className="card cluster-card fade-in">
      <div className="card-header">
        <span className="cluster-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          {cluster.sourceCount || sourcesMap.size} sources
        </span>
        <div className="card-actions">
          <button
            className={`card-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            aria-label="Bookmark cluster"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="card-title">{escapeHtml(cluster.title)}</h3>
      <p className="card-summary">{escapeHtml(cluster.aiSummary || '')}</p>
      <div className="cluster-sources">
        {Array.from(sourcesMap.values())
          .slice(0, 5)
          .map((s) => (
            <div key={s.id} className="cluster-source-dot" title={escapeHtml(s.name)}>
              {getInitials(s.name)}
            </div>
          ))}
      </div>
      <button className="card-explain-btn" onClick={(e) => { e.stopPropagation(); onExplain(); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
        Explain this
      </button>
    </div>
  );
}

function DetailOverlay({ story, onClose, onExplain }) {
  const category = getCategoryById(story.category);
  const sources = story.sources || [];

  return (
    <div className="detail-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="detail-panel">
        <button className="detail-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="detail-content">
          <span className="detail-category">{category ? category.name : story.category}</span>
          <h2 className="detail-title">{escapeHtml(story.title)}</h2>
          <p className="detail-summary">{escapeHtml(story.summary || story.shortSummary || '')}</p>
          {story.aiSummary?.keyPoints && (
            <div className="detail-key-points">
              <h4>Key Points</h4>
              <ul>
                {story.aiSummary.keyPoints.map((p) => (
                  <li key={p}>{escapeHtml(p)}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="detail-source">
            <div className="source-info">
              <div className="source-avatar">{getInitials(sources[0]?.name)}</div>
              <div className="source-details">
                <span className="source-name">{escapeHtml(sources[0]?.name)}</span>
                <span className="source-time">
                  {formatTime(sources[0]?.publishedAt)} · {sources.length} source{sources.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            {sources[0]?.url && (
              <a
                className="source-link"
                href={sources[0].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read original
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </div>
          <button className="detail-explain-btn" onClick={onExplain}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
            Explain this
          </button>
        </div>
      </div>
    </div>
  );
}

function ExplainOverlay({ data, chatMessages, sources, onClose }) {
  if (!data) return null;

  return (
    <div className="explain-panel open">
      <div className="explain-header">
        <h3>Explain this</h3>
        <button className="explain-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="explain-body">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`explain-message ${msg.role}`}>
            {escapeHtml(msg.content)}
          </div>
        ))}
        <div className="explain-message user">{escapeHtml(data.title || 'Why this matters')}</div>
        <div className="explain-message assistant">
          <strong>{escapeHtml(data.title || 'Why this matters')}</strong>
          <br />
          {escapeHtml(data.answer || '')}
        </div>
        {data.evidence?.length > 0 && (
          <div className="explain-sources">
            <h5>Evidence</h5>
            <div className="explain-source-list">
              {data.evidence.map((e, i) => (
                <div key={i} className="explain-source-item">
                  • {escapeHtml(e)}
                </div>
              ))}
            </div>
          </div>
        )}
        {sources.length > 0 && (
          <div className="explain-sources">
            <h5>Sources used</h5>
            <div className="explain-source-list">
              {sources.map((s) => (
                <div key={s.id} className="explain-source-item">
                  <div className="source-avatar">{getInitials(s.name)}</div>
                  {escapeHtml(s.name)}{' '}
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    ({escapeHtml(s.domain)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarksDrawer({ isOpen, onClose, bookmarks, onOpenStory }) {
  return (
    <>
      <div className={`bookmarks-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`bookmarks-panel ${isOpen ? 'open' : ''}`}>
        <div className="bookmarks-header">
          <h3>Bookmarks</h3>
          <button className="bookmarks-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="bookmarks-list">
          {bookmarks.map((id) => {
            const story = getStoryById(id);
            if (!story) return null;
            return (
              <div
                key={id}
                className="bookmark-item fade-in"
                onClick={() => onOpenStory(id)}
              >
                <div className="bookmark-item-title">{escapeHtml(story.title)}</div>
                <div className="bookmark-item-meta">
                  {escapeHtml(getCategoryById(story.category)?.name || story.category)} ·{' '}
                  {formatTime(story.sources?.[0]?.publishedAt)}
                </div>
              </div>
            );
          })}
        </div>
        {bookmarks.length === 0 && (
          <div className="bookmarks-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0111.186 0z" />
            </svg>
            <p>No bookmarks yet</p>
          </div>
        )}
      </div>
    </>
  );
}
