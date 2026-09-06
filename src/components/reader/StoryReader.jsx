import React from 'react';
import { getStoryById, getCategoryById } from '../../services/data';
import SourceAvatar from '../shared/SourceAvatar';

export default function StoryReader({ storyId, onClose, onExplain, onComment }) {
  const story = getStoryById(storyId);
  if (!story) return null;

  const category = getCategoryById(story.category);
  const summary = story.aiSummary;

  return (
    <div className="story-reader">
      <div className="story-reader-backdrop" onClick={onClose} />
      <div className="story-reader-panel">
        <button className="story-reader-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="story-reader-scroll">
          <div className={`story-reader-hero gradient-${story.category || 'default'}`} />

          <div className="story-reader-content">
            <div className="story-reader-source">
              <SourceAvatar name={story.sources?.[0]?.name} size="lg" />
              <div className="story-reader-source-info">
                <span className="story-reader-source-name">{story.sources?.[0]?.name}</span>
                <span className="story-reader-source-meta">
                  {category?.name} · {story.readingTime || '3 min read'}
                </span>
              </div>
            </div>

            <h1 className="story-reader-title">{story.title}</h1>
            {story.subtitle && <p className="story-reader-subtitle">{story.subtitle}</p>}

            {summary?.generated && (
              <div className="story-reader-ai">
                <div className="story-reader-ai-header">
                  <span className="ai-summary-icon">✦</span>
                  <span>AI SUMMARY</span>
                </div>
                <p>{story.shortSummary || story.summary}</p>
                {summary.keyPoints?.length > 0 && (
                  <ul className="story-reader-keypoints">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
                <div className="story-reader-ai-footer">
                  <span>Based on {story.sourceCount || story.sources?.length} sources</span>
                  {summary.confidence && (
                    <span>{Math.round(summary.confidence * 100)}% confidence</span>
                  )}
                </div>
              </div>
            )}

            <div className="story-reader-summary">
              <h3>What sources say</h3>
              <p>{story.summary}</p>
            </div>

            {story.keywords?.length > 0 && (
              <div className="story-reader-keywords">
                {story.keywords.map((kw) => (
                  <span key={kw} className="story-reader-keyword">#{kw}</span>
                ))}
              </div>
            )}

            <div className="story-reader-sources">
              <h3>Sources ({story.sources?.length || 0})</h3>
              <div className="story-reader-source-list">
                {story.sources?.map((src) => (
                  <a
                    key={src.id}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="story-reader-source-item"
                  >
                    <SourceAvatar name={src.name} size="sm" />
                    <div>
                      <span className="story-reader-source-item-name">{src.name}</span>
                      <span className="story-reader-source-item-domain">{src.domain}</span>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="story-reader-actions">
              <button className="story-reader-explain" onClick={() => onExplain(story.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                </svg>
                Explain this
              </button>
              <button className="story-reader-discuss" onClick={() => onComment(story.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Discuss
              </button>
            </div>

            {story.sources?.[0]?.url && (
              <a
                href={story.sources[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="story-reader-original"
              >
                Read original
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
