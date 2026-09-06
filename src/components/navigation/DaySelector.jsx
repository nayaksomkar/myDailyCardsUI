import React, { useRef, useEffect } from 'react';

export default function DaySelector({ days, currentDayId, onSelectDay }) {
  const scrollRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentDayId]);

  const formatDayLabel = (day) => {
    const d = new Date(day.date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateNum = (day) => {
    const d = new Date(day.date + 'T00:00:00');
    return d.getDate();
  };

  return (
    <div className="day-selector">
      <div className="day-selector-track" ref={scrollRef}>
        {days.map((day) => (
          <button
            key={day.id}
            ref={day.id === currentDayId ? activeRef : null}
            className={`day-chip ${day.id === currentDayId ? 'active' : ''}`}
            onClick={() => onSelectDay(day.id)}
          >
            <span className="day-chip-weekday">{formatDayLabel(day)}</span>
            <span className="day-chip-date">{formatDateNum(day)}</span>
            {day.label === 'Today' && <span className="day-chip-today">TODAY</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
