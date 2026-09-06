import React from 'react';
import PostSource from './PostSource';
import PostActions from './PostActions';
import AISummary from './AISummary';

const categoryGradients = {
  ai: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  technology: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
  startups: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  business: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  finance: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
  science: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
  sports: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
  world: 'linear-gradient(135deg, #FFD194 0%, #FF7D6A 100%)',
};

export default function NewsPost({
  story,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onShare,
  onExplain,
  onOpenSources,
  onReadMore,
}) {
  const gradient = categoryGradients[story.category] || categoryGradients.technology;

  return (
    <article className="news-post">
      <div className="post-card-gradient" style={{ background: gradient }} />
      <PostSource story={story} />

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
