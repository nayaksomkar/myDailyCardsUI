import React from 'react';

export default function AISummary({ story }) {
  const summary = story.aiSummary;
  if (!summary?.generated) return null;

  const keyPoints = summary.keyPoints?.slice(0, 3) || [];
  const explainTitle = story.explain?.title;

  return (
    <div className="ai-summary">
      <div className="ai-summary-header">
        <span className="ai-summary-icon">✦</span>
        <span className="ai-summary-label">AI SUMMARY</span>
      </div>
      <p className="ai-summary-text">{story.shortSummary || story.summary}</p>

      {keyPoints.length > 0 && (
        <ul className="ai-summary-points">
          {keyPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}

      <div className="ai-summary-footer">
        <span>Based on {story.sourceCount || story.sources?.length || 0} sources</span>
        {summary.confidence && (
          <span className="ai-confidence">{Math.round(summary.confidence * 100)}% confidence</span>
        )}
        {explainTitle && (
          <span className="ai-explain-link">{explainTitle} →</span>
        )}
      </div>
    </div>
  );
}
