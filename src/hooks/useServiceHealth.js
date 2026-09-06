import { useEffect, useState, useCallback, useRef } from 'react';
import { checkAllServices } from '../services/health';

const POLL_INTERVAL_MS = 30000;

export default function useServiceHealth() {
  const [services, setServices] = useState(() =>
    Object.values({
      orchestrator: { id: 'orchestrator', name: 'Main Orchestrator', status: 'checking', latencyMs: null },
      llm: { id: 'llm', name: 'LLM Brain', status: 'checking', latencyMs: null },
      webhunter: { id: 'webhunter', name: 'WebHunter', status: 'checking', latencyMs: null },
    })
  );
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    const results = await checkAllServices();
    setServices(results);
    setLastChecked(Date.now());
    setLoading(false);
    inFlight.current = false;
  }, []);

  useEffect(() => {
    refresh();
    let intervalId = null;
    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(refresh, POLL_INTERVAL_MS);
    };
    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh();
        start();
      } else {
        stop();
      }
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  const onlineCount = services.filter((s) => s.status === 'online' || s.status === 'slow').length;

  return { services, onlineCount, total: services.length, loading, lastChecked, refresh };
}
