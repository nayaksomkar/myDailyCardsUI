import React from 'react';
import { getCategories, getAllStories, getTrendingTopics } from '../../services/data';
import SourceAvatar from '../shared/SourceAvatar';

export default function DiscoverPage({ onReadMore }) {
  const categories = getCategories();
  const trending = getTrendingTopics();
  const allStories = getAllStories();
  const featuredStories = allStories.slice(0, 6);

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h2>Discover</h2>
        <p>What's happening across the internet today</p>
      </div>

      <section className="discover-section">
        <h3 className="discover-section-title">🔥 Trending today</h3>
        <div className="trending-topics">
          {trending.slice(0, 6).map((topic) => (
            <button key={topic.name} className="trending-topic">
              <span className="trending-topic-name">{topic.name}</span>
              <span className="trending-topic-count">{topic.count} cards</span>
            </button>
          ))}
        </div>
      </section>

      <section className="discover-section">
        <h3 className="discover-section-title">Categories</h3>
        <div className="discover-categories">
          {categories.map((cat) => (
            <div key={cat.id} className="discover-category-card">
              <span className="discover-category-name">{cat.name}</span>
              <span className="discover-category-desc">{cat.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="discover-section">
        <h3 className="discover-section-title">Featured stories</h3>
        <div className="discover-stories">
          {featuredStories.map((story) => (
            <div
              key={story.id}
              className="discover-story-card"
              onClick={() => onReadMore(story.id)}
            >
              <div className={`discover-story-image gradient-${story.category || 'default'}`} />
              <div className="discover-story-content">
                <SourceAvatar name={story.sources?.[0]?.name} size="sm" />
                <h4 className="discover-story-title">{story.title}</h4>
                <span className="discover-story-meta">
                  {story.sourceCount || story.sources?.length} sources · {story.readingTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
