import React from 'react';

const COLORS = [
  '#8B5E3C', '#6B4A3A', '#A67C52', '#4A3428', '#B8956A',
  '#7D5A4A', '#5C4033', '#967860', '#6E5444', '#8A6E5A',
];

function getColor(name) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function SourceAvatar({ name, size = 'md' }) {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const color = getColor(name);

  return (
    <div className={`source-avatar source-avatar-${size}`} style={{ background: color }}>
      {initials}
    </div>
  );
}
