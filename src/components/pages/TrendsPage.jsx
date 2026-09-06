import React from 'react';
import { getTrendingTopics, getAllStories, getCategories } from '../../services/data';

export default function TrendsPage() {
  const trending = getTrendingTopics();
  const allStories = getAllStories();
  const categories = getCategories();

  const categoryData = categories.map((cat) => {
    const count = allStories.filter((s) => s.category === cat.id).length;
    return { ...cat, count };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...categoryData.map((c) => c.count));

  return (
    <div className="trends-page">
      <div className="trends-header">
        <h2>🔥 Trending</h2>
        <p>The biggest conversations today</p>
      </div>

      <section className="trends-section">
        <h3 className="trends-section-title">Topic momentum</h3>
        <div className="trends-bars">
          {categoryData.map((cat) => (
            <div key={cat.id} className="trend-bar-item">
              <span className="trend-bar-label">{cat.name}</span>
              <div className="trend-bar-track">
                <div
                  className="trend-bar-fill"
                  style={{ width: `${(cat.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="trend-bar-value">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="trends-section">
        <h3 className="trends-section-title">Top keywords</h3>
        <div className="trends-keywords">
          {trending.slice(0, 10).map((topic, idx) => (
            <div key={topic.name} className="trend-keyword">
              <span className="trend-keyword-rank">#{idx + 1}</span>
              <span className="trend-keyword-name">{topic.name}</span>
              <span className="trend-keyword-count">{topic.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="trends-section">
        <h3 className="trends-section-title">Today's pulse</h3>
        <div className="pulse-cards">
          <div className="pulse-card">
            <span className="pulse-label">AI</span>
            <span className="pulse-value up">↑ 32%</span>
          </div>
          <div className="pulse-card">
            <span className="pulse-label">Startups</span>
            <span className="pulse-value up">↑ 18%</span>
          </div>
          <div className="pulse-card">
            <span className="pulse-label">Finance</span>
            <span className="pulse-value stable">→ 4%</span>
          </div>
          <div className="pulse-card">
            <span className="pulse-label">Science</span>
            <span className="pulse-value up">↑ 11%</span>
          </div>
          <div className="pulse-card">
            <span className="pulse-label">Sports</span>
            <span className="pulse-value down">↓ 2%</span>
          </div>
        </div>
      </section>
    </div>
  );
}
