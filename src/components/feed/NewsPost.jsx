import React, { useState } from 'react';
import PostSource from './PostSource';
import PostActions from './PostActions';
import AISummary from './AISummary';

export default function NewsPost({
  story,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShare,
  onComment,
  onExplain,
  onOpenSources,
  onReadMore,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = story.image && !imageError;

  return (
    <article className="news-post">
      <PostSource story={story} />

      {hasImage && (
        <div className="post-image-container">
          <div className={`post-image-skeleton ${imageLoaded ? 'hidden' : ''}`} />
          <img
            src={story.image}
            alt={story.title}
            className={`post-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      <div className="post-content">
        <h3 className="post-title" onClick={() => onReadMore(story.id)}>
          {story.title}
        </h3>

        <AISummary story={story} />

        {story.keywords?.length > 0 && (
          <div className="post-keywords">
            {story.keywords.slice(0, 4).map((kw) => (
              <span key={kw} className="post-keyword">#{kw}</span>
            ))}
          </div>
        )}

        <div className="post-meta-row">
          <span>{story.readingTime || '3 min read'}</span>
          <span className="post-meta-dot">·</span>
          <span>{story.sourceCount || story.sources?.length || 0} sources</span>
        </div>
      </div>

      <PostActions
        story={story}
        isLiked={isLiked}
        isSaved={isSaved}
        onToggleLike={onToggleLike}
        onToggleSave={onToggleSave}
        onComment={onComment}
        onShare={onShare}
      />

      <div className="post-explain-row">
        <button className="explain-btn" onClick={() => onExplain(story.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
          Explain this
        </button>
        <button className="sources-link" onClick={() => onOpenSources(story.id)}>
          Sources →
        </button>
      </div>
    </article>
  );
}
