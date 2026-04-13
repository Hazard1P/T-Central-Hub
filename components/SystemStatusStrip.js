'use client';

export default function SystemStatusStrip() {
  return (
    <div className="system-status-strip">
      <div className="status-strip-pill">
        <span>Layer</span>
        <strong>Live 3D Web-Game</strong>
      </div>
      <div className="status-strip-pill">
        <span>Roles</span>
        <strong>Pilot / Spectate</strong>
      </div>
      <div className="status-strip-pill">
        <span>Primary route</span>
        <strong>Arma3 CTH</strong>
      </div>
    </div>
  );
}
