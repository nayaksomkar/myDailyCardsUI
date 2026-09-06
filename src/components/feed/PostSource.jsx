import React from 'react';
import SourceAvatar from '../shared/SourceAvatar';
import { getCategoryById } from '../../services/data';

function timeAgo(iso) {
  if (!iso) return '';
  const now = new Date();
  const then = new Date(iso);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function PostSource({ story, source }) {
  const category = getCategoryById(story.category);
  const primarySource = source || story.sources?.[0];
  const sourceCount = story.sourceCount || story.sources?.length || 0;

  return (
    <div className="post-source">
      <SourceAvatar name={primarySource?.name} size="lg" />
      <div className="post-source-info">
        <div className="post-source-name">
          {primarySource?.name}
          {sourceCount > 1 && (
            <span className="post-source-more"> +{sourceCount - 1}</span>
          )}
        </div>
        <div className="post-source-meta">
          <span>{timeAgo(primarySource?.publishedAt)}</span>
          <span className="post-source-dot">·</span>
          <span>{category?.name || story.category}</span>
          {primarySource?.domain && (
            <>
              <span className="post-source-dot">·</span>
              <span className="post-source-domain">{primarySource.domain}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
