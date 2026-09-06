const CARDS_ENGINE_URL = import.meta.env.VITE_CARDS_ENGINE_URL || 'https://cardsengine.onrender.com';
const WEBHUNTER_URL = import.meta.env.VITE_WEBHUNTER_URL || 'https://webhunter-1v83.onrender.com';
const LLMPING_URL = import.meta.env.VITE_LLMPING_URL || 'https://llmping.onrender.com';

export const SERVICE_ENDPOINTS = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Main Orchestrator',
    host: 'CardsEngine',
    url: CARDS_ENGINE_URL,
    probe: `${CARDS_ENGINE_URL}/health`,
  },
  llm: {
    id: 'llm',
    name: 'LLM Brain',
    host: 'LLMPing',
    url: LLMPING_URL,
    probe: `${LLMPING_URL}/`,
  },
  webhunter: {
    id: 'webhunter',
    name: 'WebHunter',
    host: 'Web Research',
    url: WEBHUNTER_URL,
    probe: `${WEBHUNTER_URL}/`,
  },
};

async function probeOne(endpoint, timeoutMs = 8000) {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint.probe, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal,
      cache: 'no-store',
    });
    const latencyMs = Math.round(performance.now() - start);
    return {
      id: endpoint.id,
      name: endpoint.name,
      host: endpoint.host,
      url: endpoint.url,
      latencyMs,
      ok: res.ok,
      status: classify(res.status, latencyMs),
      httpStatus: res.status,
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      id: endpoint.id,
      name: endpoint.name,
      host: endpoint.host,
      url: endpoint.url,
      latencyMs,
      ok: false,
      status: err.name === 'AbortError' ? 'timeout' : 'offline',
      httpStatus: null,
      error: err.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

function classify(httpStatus, latencyMs) {
  if (!httpStatus) return 'offline';
  if (httpStatus >= 200 && httpStatus < 400) {
    return latencyMs > 3000 ? 'slow' : 'online';
  }
  return 'offline';
}

export async function checkAllServices() {
  const endpoints = Object.values(SERVICE_ENDPOINTS);
  const results = await Promise.all(endpoints.map((e) => probeOne(e)));
  return results;
}
