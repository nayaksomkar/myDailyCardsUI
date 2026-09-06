import React, { useState } from 'react';
import useServiceHealth from '../../hooks/useServiceHealth';

function formatLatency(ms) {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function statusLabel(status) {
  switch (status) {
    case 'online': return 'Online';
    case 'slow': return 'Slow';
    case 'offline': return 'Offline';
    case 'timeout': return 'Offline';
    case 'checking': return 'Checking…';
    default: return 'Unknown';
  }
}

export default function ServiceStatus() {
  const [expanded, setExpanded] = useState(false);
  const { services, onlineCount, total, loading, lastChecked, refresh } = useServiceHealth();

  const overall = loading ? 'checking' : (onlineCount === total ? 'online' : (onlineCount === 0 ? 'offline' : 'slow'));

  return (
    <div className="service-status">
      <button
        className="service-status-trigger"
        onClick={() => setExpanded(!expanded)}
        aria-label="Service status"
      >
        <span className={`service-dot ${overall}`} />
        <span>{loading ? 'Checking…' : `${onlineCount}/${total} online`}</span>
      </button>

      {expanded && (
        <div className="service-status-panel">
          <div className="service-status-header">
            <h4>System status</h4>
            <button onClick={() => setExpanded(false)} aria-label="Close">×</button>
          </div>
          <div className="service-status-list">
            {services.map((service) => (
              <div key={service.id} className="service-status-item">
                <span className={`service-dot ${service.status}`} />
                <div className="service-status-meta">
                  <span className="service-name">{service.name}</span>
                  <span className="service-host">{service.host}</span>
                </div>
                <div className="service-status-value">
                  <span className={`service-status-text ${service.status}`}>{statusLabel(service.status)}</span>
                  <span className="service-latency">{formatLatency(service.latencyMs)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="service-status-footer">
            <button className="service-status-refresh" onClick={refresh}>↻ Refresh status</button>
            {lastChecked && (
              <span className="service-status-checked">
                Last checked {new Date(lastChecked).toLocaleTimeString()}
              </span>
            )}
            <span>⌁ Running on free Render hosting + a free AI API, so responses may take a little longer.</span>
          </div>
        </div>
      )}
    </div>
  );
}
