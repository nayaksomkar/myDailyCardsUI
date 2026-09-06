import React, { useState, useEffect, useRef } from 'react';
import { filterStories, getCategoryById } from '../../services/data';
import SourceAvatar from './SourceAvatar';

export default function SearchOverlay({ isOpen, onClose, onReadMore }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const found = filterStories({ search: query });
      setResults(found.slice(0, 10));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-overlay-backdrop" onClick={onClose} />
      <div className="search-overlay-panel">
        <div className="search-overlay-header">
          <div className="search-input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines, topics, sources..."
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')}>
                ×
              </button>
            )}
          </div>
          <button className="search-close" onClick={onClose}>
            Cancel
          </button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            <div className="search-results-header">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </div>
            <div className="search-results-list">
              {results.map((story) => {
                const category = getCategoryById(story.category);
                return (
                  <div
                    key={story.id}
                    className="search-result-item"
                    onClick={() => {
                      onReadMore(story.id);
                      onClose();
                    }}
                  >
                    <SourceAvatar name={story.sources?.[0]?.name} size="sm" />
                    <div className="search-result-content">
                      <h4>{story.title}</h4>
                      <span>
                        {category?.name} · {story.sourceCount || story.sources?.length} sources
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="search-empty">
            <p>No stories found for "{query}"</p>
          </div>
        )}

        {!query && (
          <div className="search-suggestions">
            <h4>Try searching for</h4>
            <div className="search-suggestion-tags">
              {['AI agents', 'startups', 'funding', 'chips', 'space', 'markets'].map((tag) => (
                <button key={tag} onClick={() => setQuery(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
