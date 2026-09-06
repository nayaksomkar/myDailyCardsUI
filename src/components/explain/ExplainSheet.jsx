import React, { useState } from 'react';
import SourceAvatar from '../shared/SourceAvatar';

export default function ExplainSheet({ isOpen, onClose, story }) {
  const [followUp, setFollowUp] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);

  if (!isOpen || !story) return null;

  const explain = story.explain;
  const summary = story.aiSummary;

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`explain-sheet ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-handle" />
          <h3>✦ Explain this</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="explain-content">
          <div className="explain-question">
            <span className="explain-label">Question</span>
            <p>Why does this story matter?</p>
          </div>

          <div className="explain-answer">
            <div className="explain-answer-header">
              <span className="explain-icon">✦</span>
              <span className="explain-answer-title">{explain?.title || 'Why this matters'}</span>
            </div>
            <p className="explain-answer-text">{explain?.answer || summary?.keyPoints?.join(' ')}</p>
          </div>

          {explain?.evidence?.length > 0 && (
            <div className="explain-evidence">
              <h4>Evidence</h4>
              <ul>
                {explain.evidence.map((e, i) => (
                  <li key={i}>• {e}</li>
                ))}
              </ul>
            </div>
          )}

          {summary?.confidence && (
            <div className="explain-confidence">
              <span className="confidence-badge">
                {Math.round(summary.confidence * 100)}% confidence
              </span>
              <span className="sources-count">
                Based on {story.sourceCount || story.sources?.length || 0} sources
              </span>
            </div>
          )}

          {story.sources?.length > 0 && (
            <div className="explain-sources">
              <h4>Sources used</h4>
              <div className="explain-source-list">
                {story.sources.map((src) => (
                  <div key={src.id} className="explain-source-item">
                    <SourceAvatar name={src.name} size="sm" />
                    <div>
                      <span className="explain-source-name">{src.name}</span>
                      <span className="explain-source-domain">{src.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showFollowUp ? (
            <button className="follow-up-btn" onClick={() => setShowFollowUp(true)}>
              Ask a follow-up...
            </button>
          ) : (
            <div className="follow-up-input">
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Ask about this story..."
                autoFocus
              />
              <button className="follow-up-send" aria-label="Send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22,2 15,22 11,13 2,9" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
