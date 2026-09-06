let rawData = null;
let ready = false;

export async function loadData() {
  if (ready) return rawData;
  try {
    const response = await fetch('./sampledata.json');
    if (!response.ok) throw new Error('Failed to load sampledata.json');
    rawData = await response.json();
    ready = true;
    return rawData;
  } catch (err) {
    console.error('DataService load error:', err);
    rawData = {
      app: {},
      days: [],
      storyClusters: [],
      categories: [],
      keywords: [],
      filters: {},
      uiContent: {},
      sampleChat: {},
    };
    ready = true;
    return rawData;
  }
}

export function getDays() {
  return rawData?.days || [];
}

export function getDayById(id) {
  return (rawData?.days || []).find((d) => d.id === id) || null;
}

export function getStories(dayId) {
  const day = (rawData?.days || []).find((d) => d.id === dayId);
  return day ? day.stories || [] : [];
}

export function getStoryById(id) {
  for (const day of rawData?.days || []) {
    const story = (day.stories || []).find((s) => s.id === id);
    if (story) return story;
  }
  return null;
}

export function getCategories() {
  return rawData?.categories || [];
}

export function getCategoryById(id) {
  return (rawData?.categories || []).find((c) => c.id === id) || null;
}

export function getKeywords() {
  return rawData?.keywords || [];
}

export function getStoryClusters() {
  return rawData?.storyClusters || [];
}

export function getStoryClusterById(id) {
  return (rawData?.storyClusters || []).find((c) => c.id === id) || null;
}

export function getSampleChat() {
  return rawData?.sampleChat || {};
}

export function getSources() {
  const sources = new Map();
  for (const day of rawData?.days || []) {
    for (const story of day.stories || []) {
      for (const source of story.sources || []) {
        if (!sources.has(source.id)) sources.set(source.id, source);
      }
    }
  }
  return Array.from(sources.values());
}

export function getAllStories() {
  const stories = [];
  for (const day of rawData?.days || []) {
    for (const story of day.stories || []) {
      stories.push({ ...story, dayId: day.id, dayLabel: day.label, dayDate: day.displayDate });
    }
  }
  return stories;
}

export function filterStories({ dayId, category, keywords, search, sourceType } = {}) {
  let stories = dayId ? getStories(dayId) : getAllStories();

  if (category && category !== 'all') {
    stories = stories.filter((s) => s.category === category);
  }

  if (keywords && keywords.length > 0) {
    stories = stories.filter((s) => {
      const kwSet = new Set(keywords);
      const storyKws = s.keywords || [];
      return storyKws.some((k) => kwSet.has(k));
    });
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    stories = stories.filter((s) => {
      const sourceNames = (s.sources || []).map((source) => `${source.name} ${source.domain || ''}`).join(' ');
      const categoryName = s.category || '';
      const haystack = `${s.title} ${s.subtitle || ''} ${s.summary || ''} ${s.shortSummary || ''} ${(s.keywords || []).join(' ')} ${categoryName} ${sourceNames}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  if (sourceType && sourceType !== 'all') {
    stories = stories.filter((s) => (s.sources || []).some((src) => src.type === sourceType));
  }

  return stories;
}

export function getTrendingTopics() {
  const topics = new Map();
  for (const day of rawData?.days || []) {
    for (const story of day.stories || []) {
      for (const kw of story.keywords || []) {
        topics.set(kw, (topics.get(kw) || 0) + 1);
      }
    }
  }
  return Array.from(topics.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function getCategoryDistribution() {
  const counts = {};
  for (const day of rawData?.days || []) {
    for (const story of day.stories || []) {
      counts[story.category] = (counts[story.category] || 0) + 1;
    }
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}
