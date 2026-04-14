'use client';

export default function RoomObjectives() {
  return (
    <div className="room-objectives">
      <div className="live-room-head">
        <span className="pilot-assist-kicker">Objectives</span>
        <strong>Shared system goals</strong>
      </div>
      <div className="room-objective-list">
        <div className="room-objective-item">
          <span>•</span>
          <p>Travel between blackholes and routes to learn the system layout.</p>
        </div>
        <div className="room-objective-item">
          <span>•</span>
          <p>Enter pilot mode and practice movement around the primary route cluster.</p>
        </div>
        <div className="room-objective-item">
          <span>•</span>
          <p>Use the Arma3 blackhole interior as the main tactical handoff into the live server.</p>
        </div>
      </div>
    </div>
  );
}
