'use client';

import { getSystemStatusPills } from '@/lib/siteContent';

export default function SystemStatusStrip() {
  const pills = getSystemStatusPills();

  return (
    <div className="system-status-strip">
      {pills.map((pill) => (
        <div className="status-strip-pill" key={`${pill.label}-${pill.value}`}>
          <span>{pill.label}</span>
          <strong>{pill.value}</strong>
        </div>
      ))}
    </div>
  );
}
