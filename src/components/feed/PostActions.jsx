import React, { useState } from 'react';

export default function PostActions({ story, isLiked, isSaved, onToggleLike, onToggleSave, onShare }) {
  const [shared, setShared] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes || 0);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    onToggleLike(story.id);
  };

  const handleShare = () => {
    setShared(true);
    onShare(story.id);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="post-actions">
      <button
        className={`post-action-btn ${liked ? 'liked' : ''}`}
        onClick={handleLike}
        aria-label="Like"
      >
        <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        <span>{likeCount}</span>
      </button>

      <button
        className={`post-action-btn ${shared ? 'shared' : ''}`}
        onClick={handleShare}
        aria-label="Share"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{shared ? 'Copied!' : story.shares || 0}</span>
      </button>

      <button
        className={`post-action-btn save-btn ${isSaved ? 'saved' : ''}`}
        onClick={() => onToggleSave(story.id)}
        aria-label="Save"
      >
        <svg viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </button>
    </div>
  );
}
