import { loadData } from './data';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || true;
const API_URL = import.meta.env.VITE_API_URL || '';

export async function getHealth() {
  if (DEMO_MODE) {
    await delay(400);
    return {
      status: 'ok',
      services: [
        { id: 'orchestrator', name: 'Main Orchestrator', status: 'online', latencyMs: 420 },
        { id: 'llm', name: 'LLM Brain', status: 'online', latencyMs: 1800 },
        { id: 'webhunter', name: 'WebHunter', status: 'online', latencyMs: 6400 },
      ],
    };
  }
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function getChatResponse(messages) {
  if (DEMO_MODE) {
    await delay(1200);
    const lastUser = messages.filter((m) => m.role === 'user').pop();
    const text = (lastUser?.content || '').toLowerCase();
    const data = await loadData();
    const chat = data.sampleChat || {};
    const conversation = chat.conversations?.[0];
    const sample = conversation?.messages || [];
    const assistant = sample.find((m) => m.role === 'assistant');
    const stories = assistant?.storyIds || [];
    const storyObjects = (data.days || [])
      .flatMap((d) => d.stories || [])
      .filter((s) => stories.includes(s.id));
    return {
      role: 'assistant',
      content: assistant?.content || 'Here is what I found based on the available sources.',
      stories: storyObjects,
      evidence: assistant?.evidence || [],
    };
  }
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}

export async function getTrends() {
  if (DEMO_MODE) {
    await delay(600);
    const data = await loadData();
    const today = (data.days || [])[0];
    const stories = today?.stories || [];
    const categoryCounts = {};
    for (const s of stories) {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    }
    return {
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
      signals: [
        { topic: 'AI Agents', direction: 'up' },
        { topic: 'Startup Efficiency', direction: 'up' },
        { topic: 'Chip Demand', direction: 'up' },
        { topic: 'Cloud Spending', direction: 'stable' },
        { topic: 'Consumer Spending', direction: 'down' },
      ],
      storyMomentum: stories.map((s) => ({
        id: s.id,
        title: s.title,
        confidence: s.aiSummary?.confidence || 0,
        sources: s.sourceCount || (s.sources || []).length,
      })),
    };
  }
  const res = await fetch(`${API_URL}/trends`);
  if (!res.ok) throw new Error('Trends failed');
  return res.json();
}

export async function getInsights() {
  if (DEMO_MODE) {
    await delay(700);
    const data = await loadData();
    const clusters = data.storyClusters || [];
    return {
      takeaways: [
        {
          id: 'takeaway-1',
          title: 'AI is shifting from conversation toward execution.',
          explanation: 'Multiple sources describe AI systems moving from answering questions toward completing tasks.',
          sourceCount: 7,
          confidence: 0.92,
          relatedStoryIds: ['story-001', 'story-008', 'story-012'],
        },
        {
          id: 'takeaway-2',
          title: 'Startup efficiency is becoming a stronger competitive advantage.',
          explanation: 'Several stories highlight a stronger focus on distribution, revenue and capital efficiency.',
          sourceCount: 6,
          confidence: 0.88,
          relatedStoryIds: ['story-017', 'story-025', 'story-030'],
        },
        {
          id: 'takeaway-3',
          title: 'Infrastructure and compute remain central to AI adoption.',
          explanation: 'Hardware, cloud and developer tooling stories continue emphasizing efficiency and deployment.',
          sourceCount: 4,
          confidence: 0.85,
          relatedStoryIds: ['story-003', 'story-016', 'story-021'],
        },
        {
          id: 'takeaway-4',
          title: 'Markets are balancing growth expectations with valuations.',
          explanation: 'Investors continue monitoring technology spending and broader economic signals.',
          sourceCount: 3,
          confidence: 0.82,
          relatedStoryIds: ['story-005', 'story-010', 'story-020'],
        },
        {
          id: 'takeaway-5',
          title: 'Personalization and direct customer relationships are expanding.',
          explanation: 'Consumer brands and retailers are testing new formats and pricing models.',
          sourceCount: 4,
          confidence: 0.79,
          relatedStoryIds: ['story-007', 'story-013', 'story-019'],
        },
      ],
    };
  }
  const res = await fetch(`${API_URL}/insights`);
  if (!res.ok) throw new Error('Insights failed');
  return res.json();
}

export async function getBriefing(dayId) {
  if (DEMO_MODE) {
    await delay(900);
    const data = await loadData();
    const day = (data.days || []).find((d) => d.id === dayId) || (data.days || [])[0];
    const stories = day?.stories || [];
    const totalSources = new Set(stories.flatMap((s) => (s.sources || []).map((src) => src.id))).size;
    const categories = new Set(stories.map((s) => s.category)).size;
    return {
      dayId: day?.id,
      date: day?.displayDate || day?.date,
      storyCount: stories.length,
      sourceCount: totalSources,
      categoryCount: categories,
      stories,
    };
  }
  const res = await fetch(`${API_URL}/briefing/${dayId}`);
  if (!res.ok) throw new Error('Briefing failed');
  return res.json();
}

export async function getSourcesSummary() {
  if (DEMO_MODE) {
    await delay(500);
    const data = await loadData();
    const sources = new Map();
    for (const day of data.days || []) {
      for (const story of day.stories || []) {
        for (const src of story.sources || []) {
          if (!sources.has(src.id)) {
            sources.set(src.id, { ...src, storyCount: 0 });
          }
          sources.get(src.id).storyCount += 1;
        }
      }
    }
    const list = Array.from(sources.values());
    const byType = {};
    for (const s of list) {
      const type = s.type || 'Other';
      byType[type] = (byType[type] || 0) + 1;
    }
    return {
      total: list.length,
      byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
      list,
    };
  }
  const res = await fetch(`${API_URL}/sources');
  if (!res.ok) throw new Error('Sources failed');
  return res.json();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const serviceConfig = {
  demoMode: DEMO_MODE,
  apiUrl: API_URL,
};
