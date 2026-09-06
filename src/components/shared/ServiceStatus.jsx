import React, { useState } from 'react';

const SERVICES = [
  { id: 'orchestrator', name: 'Main Orchestrator', status: 'online', latency: '420ms' },
  { id: 'llm', name: 'LLM Brain', status: 'online', latency: '1.8s' },
  { id: 'webhunter', name: 'WebHunter', status: 'online', latency: '6.4s' },
];

export default function ServiceStatus() {
  const [expanded, setExpanded] = useState(false);
  const onlineCount = SERVICES.filter((s) => s.status === 'online').length;

  return (
    <div className="service-status">
      <button
        className="service-status-trigger"
        onClick={() => setExpanded(!expanded)}
        aria-label="Service status"
      >
        <span className={`service-dot ${SERVICES[0].status}`} />
        <span>{onlineCount}/{SERVICES.length} online</span>
      </button>

      {expanded && (
        <div className="service-status-panel">
          <div className="service-status-header">
            <h4>System status</h4>
            <button onClick={() => setExpanded(false)}>×</button>
          </div>
          <div className="service-status-list">
            {SERVICES.map((service) => (
              <div key={service.id} className="service-status-item">
                <span className={`service-dot ${service.status}`} />
                <span className="service-name">{service.name}</span>
                <span className="service-latency">{service.latency}</span>
              </div>
            ))}
          </div>
          <div className="service-status-footer">
            <span>⌁ Running on free Render hosting + a free AI API, so responses may take a little longer.</span>
          </div>
        </div>
      )}
    </div>
  );
}
