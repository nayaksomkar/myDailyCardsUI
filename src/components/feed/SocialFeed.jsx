import React, { useRef, useEffect, useState, useCallback } from 'react';
import NewsPost from './NewsPost';
import EndOfDay from './EndOfDay';

export default function SocialFeed({
  stories,
  currentDay,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShare,
  onExplain,
  onOpenSources,
  onReadMore,
  onExplorePrevious,
  hasPreviousDay,
}) {
  const feedRef = useRef(null);
  const [readProgress, setReadProgress] = useState(0);
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setReadProgress(Math.min(progress, 1));

      if (progress > 0.85 && stories.length > 0) {
        setShowEndOfDay(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stories.length]);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (diff > threshold && currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, stories.length]);

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, stories.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const totalSources = new Set(stories.flatMap((s) => s.sources?.map((src) => src.id) || [])).size;

  if (isMobile && stories.length > 0) {
    const currentStory = stories[currentIndex];
    return (
      <div className="social-feed" ref={feedRef}>
        <div className="feed-progress">
          <div className="feed-progress-bar" style={{ width: `${readProgress * 100}%` }} />
        </div>

        <div className="feed-header">
          <div className="feed-greeting">
            <h2>{currentDay?.label === 'Today' ? 'Good morning' : currentDay?.label}</h2>
            <p>{currentDay?.displayDate || currentDay?.date}</p>
          </div>
          <div className="feed-stats">
            <span>{stories.length} stories</span>
            <span className="feed-stats-dot">·</span>
            <span>{totalSources} sources</span>
          </div>
        </div>

        <div
          className="swipe-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="swipe-card-wrapper">
            <NewsPost
              key={currentStory.id}
              story={currentStory}
              isLiked={isLiked(currentStory.id)}
              isSaved={isSaved(currentStory.id)}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
              onShare={onShare}
              onExplain={onExplain}
              onOpenSources={onOpenSources}
              onReadMore={onReadMore}
            />
          </div>

          <div className="swipe-dots">
            {stories.map((_, i) => (
              <button
                key={i}
                className={`swipe-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to story ${i + 1}`}
              />
            ))}
          </div>

          <div className="swipe-hint">
            {currentIndex < stories.length - 1 ? 'Swipe up for next' : 'Last card'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-feed" ref={feedRef}>
      <div className="feed-progress">
        <div className="feed-progress-bar" style={{ width: `${readProgress * 100}%` }} />
      </div>

      <div className="feed-header">
        <div className="feed-greeting">
          <h2>{currentDay?.label === 'Today' ? 'Good morning' : currentDay?.label}</h2>
          <p>{currentDay?.displayDate || currentDay?.date}</p>
        </div>
        <div className="feed-stats">
          <span>{stories.length} stories</span>
          <span className="feed-stats-dot">·</span>
          <span>{totalSources} sources</span>
        </div>
      </div>

      <div className="feed-posts">
        {stories.map((story) => (
          <NewsPost
            key={story.id}
            story={story}
            isLiked={isLiked(story.id)}
            isSaved={isSaved(story.id)}
            onToggleLike={onToggleLike}
            onToggleSave={onToggleSave}
            onShare={onShare}
            onExplain={onExplain}
            onOpenSources={onOpenSources}
            onReadMore={onReadMore}
          />
        ))}
      </div>

      {showEndOfDay && (
        <EndOfDay
          day={currentDay}
          storyCount={stories.length}
          sourceCount={totalSources}
          onExplorePrevious={onExplorePrevious}
          hasPreviousDay={hasPreviousDay}
        />
      )}
    </div>
  );
}
