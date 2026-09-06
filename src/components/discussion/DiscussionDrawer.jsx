import React, { useState } from 'react';
import SourceAvatar from '../shared/SourceAvatar';

export default function DiscussionDrawer({ isOpen, onClose, story }) {
  const [sortBy, setSortBy] = useState('top');

  if (!isOpen || !story) return null;

  const discussion = story.discussion || [];
  const sortedDiscussion = [...discussion].sort((a, b) => {
    if (sortBy === 'top') return b.likes - a.likes;
    if (sortBy === 'newest') return 0; // already in order
    return b.likes - a.likes;
  });

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`discussion-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-handle" />
          <h3>Discussion</h3>
          <span className="discussion-count">{discussion.length} comments</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="discussion-sort">
          <button
            className={`sort-btn ${sortBy === 'top' ? 'active' : ''}`}
            onClick={() => setSortBy('top')}
          >
            Top
          </button>
          <button
            className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
            onClick={() => setSortBy('newest')}
          >
            Newest
          </button>
          <button
            className={`sort-btn ${sortBy === 'relevant' ? 'active' : ''}`}
            onClick={() => setSortBy('relevant')}
          >
            Most relevant
          </button>
        </div>

        <div className="discussion-list">
          {sortedDiscussion.map((comment, idx) => (
            <div key={idx} className="comment-item">
              <SourceAvatar name={comment.user} size="sm" />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-user">@{comment.user}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <div className="comment-actions">
                  <button className="comment-like">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    {comment.likes}
                  </button>
                  <button className="comment-reply">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="discussion-input">
          <input type="text" placeholder="Add to the discussion..." />
          <button className="discussion-send" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
