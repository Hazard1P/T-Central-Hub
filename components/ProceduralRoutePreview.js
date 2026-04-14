'use client';

import { useMemo } from 'react';

function createPoints(seed = 1, count = 18) {
  return Array.from({ length: count }, (_, index) => {
    const x = ((Math.sin(seed * 0.7 + index * 1.91) + 1) / 2) * 100;
    const y = ((Math.cos(seed * 0.5 + index * 1.37) + 1) / 2) * 100;
    const size = 1 + ((index + seed) % 4);
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), size };
  });
}

export default function ProceduralRoutePreview({ title = 'Route Preview', seed = 1, variant = 'blackhole' }) {
  const stars = useMemo(() => createPoints(seed, 22), [seed]);
  const planets = useMemo(() => createPoints(seed + 4, 5), [seed]);

  return (
    <div className={`procedural-preview ${variant}`}>
      <div className="procedural-preview__backdrop" />
      <div className="procedural-preview__ring procedural-preview__ring--a" />
      <div className="procedural-preview__ring procedural-preview__ring--b" />
      <div className="procedural-preview__core" />
      <div className="procedural-preview__glow" />
      {stars.map((star, index) => (
        <span
          key={`star-${index}`}
          className="procedural-preview__star"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px` }}
        />
      ))}
      {planets.map((planet, index) => (
        <span
          key={`planet-${index}`}
          className="procedural-preview__planet"
          style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
        />
      ))}
      <div className="procedural-preview__label">{title}</div>
    </div>
  );
}
