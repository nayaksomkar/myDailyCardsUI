import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { loadData, getDays, getDayById, getStories, getStoryById, filterStories } from './services/data';
import useInteractions from './hooks/useInteractions';

import TopBar from './components/navigation/TopBar';
import BottomNav from './components/navigation/BottomNav';
import Sidebar from './components/navigation/Sidebar';
import DaySelector from './components/navigation/DaySelector';
import SocialFeed from './components/feed/SocialFeed';
import DiscussionDrawer from './components/discussion/DiscussionDrawer';
import ExplainSheet from './components/explain/ExplainSheet';
import StoryReader from './components/reader/StoryReader';
import DiscoverPage from './components/pages/DiscoverPage';
import TrendsPage from './components/pages/TrendsPage';
import ChatPage from './components/pages/ChatPage';
import SavedPage from './components/pages/SavedPage';
import SearchOverlay from './components/shared/SearchOverlay';
import ServiceStatus from './components/shared/ServiceStatus';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activePage, setActivePage] = useState('feed');
  const [activeTab, setActiveTab] = useState('foryou');
  const [currentDayId, setCurrentDayId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [explainStoryId, setExplainStoryId] = useState(null);
  const [discussionStoryId, setDiscussionStoryId] = useState(null);

  const { toggleLike, toggleSave, isLiked, isSaved, savedIds } = useInteractions();

  useEffect(() => {
    let cancelled = false;
    async function init() {
      await loadData();
      if (cancelled) return;
      setDataLoaded(true);
      const days = getDays();
      if (days.length > 0) {
        setCurrentDayId(days[0].id);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const days = useMemo(() => getDays(), [dataLoaded]);
  const currentDay = useMemo(() => getDayById(currentDayId), [currentDayId]);

  const stories = useMemo(() => {
    if (!currentDayId) return [];
    return getStories(currentDayId);
  }, [currentDayId]);

  const currentDayIndex = days.findIndex((d) => d.id === currentDayId);
  const hasPreviousDay = currentDayIndex < days.length - 1;

  const handleSelectDay = useCallback((dayId) => {
    setCurrentDayId(dayId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExplorePrevious = useCallback(() => {
    if (hasPreviousDay) {
      handleSelectDay(days[currentDayIndex + 1].id);
    }
  }, [hasPreviousDay, currentDayIndex, days, handleSelectDay]);

  const handleReadMore = useCallback((storyId) => {
    setSelectedStoryId(storyId);
  }, []);

  const handleExplain = useCallback((storyId) => {
    setExplainStoryId(storyId);
  }, []);

  const handleComment = useCallback((storyId) => {
    setDiscussionStoryId(storyId);
  }, []);

  const handleNavigate = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!dataLoaded) {
    return (
      <div className="app-loading">
        <div className="app-loading-inner">
          <span className="app-loading-icon">✦</span>
          <h1>myDailyCards</h1>
          <p>Your daily internet, one card at a time.</p>
          <div className="app-loading-bar">
            <div className="app-loading-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSearch={() => setSearchOpen(true)}
      />

      <div className="app-body">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          days={days}
          currentDayId={currentDayId}
          onSelectDay={handleSelectDay}
        />

        <main className="app-main">
          {activePage === 'feed' && (
            <>
              <DaySelector
                days={days}
                currentDayId={currentDayId}
                onSelectDay={handleSelectDay}
              />
              <SocialFeed
                stories={stories}
                currentDay={currentDay}
                isLiked={isLiked}
                isSaved={isSaved}
                onToggleLike={toggleLike}
                onToggleSave={toggleSave}
                onShare={() => {}}
                onComment={handleComment}
                onExplain={handleExplain}
                onOpenSources={handleReadMore}
                onReadMore={handleReadMore}
                onExplorePrevious={handleExplorePrevious}
                hasPreviousDay={hasPreviousDay}
              />
            </>
          )}

          {activePage === 'discover' && (
            <DiscoverPage onReadMore={handleReadMore} />
          )}

          {activePage === 'trends' && (
            <TrendsPage />
          )}

          {activePage === 'chat' && (
            <ChatPage onReadMore={handleReadMore} />
          )}

          {activePage === 'saved' && (
            <SavedPage
              savedIds={savedIds}
              onReadMore={handleReadMore}
              onRemove={toggleSave}
            />
          )}
        </main>

        <aside className="app-right-rail">
          <div className="right-rail-content">
            <div className="right-rail-section">
              <h4>Today's pulse</h4>
              <div className="pulse-mini">
                <div className="pulse-mini-item">
                  <span>AI</span>
                  <span className="up">↑ 32%</span>
                </div>
                <div className="pulse-mini-item">
                  <span>Startups</span>
                  <span className="up">↑ 18%</span>
                </div>
                <div className="pulse-mini-item">
                  <span>Finance</span>
                  <span className="stable">→ 4%</span>
                </div>
              </div>
            </div>

            <div className="right-rail-section">
              <h4>Daily progress</h4>
              <div className="daily-progress">
                <span>{stories.length} / {stories.length} cards</span>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="right-rail-section">
              <ServiceStatus />
            </div>

            <div className="right-rail-footer">
              <span className="demo-badge">DEMO</span>
              <span>Sample daily intelligence</span>
            </div>
          </div>
        </aside>
      </div>

      <BottomNav activePage={activePage} onNavigate={handleNavigate} />

      <DiscussionDrawer
        isOpen={!!discussionStoryId}
        onClose={() => setDiscussionStoryId(null)}
        story={discussionStoryId ? getStoryById(discussionStoryId) : null}
      />

      <ExplainSheet
        isOpen={!!explainStoryId}
        onClose={() => setExplainStoryId(null)}
        story={explainStoryId ? getStoryById(explainStoryId) : null}
      />

      {selectedStoryId && (
        <StoryReader
          storyId={selectedStoryId}
          onClose={() => setSelectedStoryId(null)}
          onExplain={(id) => {
            setSelectedStoryId(null);
            setExplainStoryId(id);
          }}
          onComment={(id) => {
            setSelectedStoryId(null);
            setDiscussionStoryId(id);
          }}
        />
      )}

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onReadMore={(id) => {
          setSearchOpen(false);
          handleReadMore(id);
        }}
      />
    </div>
  );
}
