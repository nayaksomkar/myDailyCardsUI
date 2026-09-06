import React from 'react';
import { getStoryById, getCategoryById } from '../../services/data';
import SourceAvatar from '../shared/SourceAvatar';

export default function SavedPage({ savedIds, onReadMore, onRemove }) {
  const stories = savedIds.map((id) => getStoryById(id)).filter(Boolean);

  if (stories.length === 0) {
    return (
      <div className="saved-page">
        <div className="saved-header">
          <h2>Saved</h2>
          <p>Your bookmarked stories</p>
        </div>
        <div className="saved-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <h3>No saved stories yet</h3>
          <p>Tap the bookmark icon on any story to save it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h2>Saved</h2>
        <p>{stories.length} bookmarked stories</p>
      </div>

      <div className="saved-grid">
        {stories.map((story) => {
          const category = getCategoryById(story.category);
          return (
            <div key={story.id} className="saved-card" onClick={() => onReadMore(story.id)}>
              {story.image && (
                <div className="saved-card-image">
                  <img src={story.image} alt={story.title} loading="lazy" />
                </div>
              )}
              <div className="saved-card-content">
                <div className="saved-card-header">
                  <span className="saved-card-category">{category?.name || story.category}</span>
                  <button
                    className="saved-card-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(story.id);
                    }}
                  >
                    ×
                  </button>
                </div>
                <h4 className="saved-card-title">{story.title}</h4>
                <div className="saved-card-footer">
                  <SourceAvatar name={story.sources?.[0]?.name} size="xs" />
                  <span>{story.sources?.[0]?.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
