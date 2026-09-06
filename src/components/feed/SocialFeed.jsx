import React, { useRef, useEffect, useState } from 'react';
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

  const totalSources = new Set(stories.flatMap((s) => s.sources?.map((src) => src.id) || [])).size;

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
