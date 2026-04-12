'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

const ROOM_NAME = process.env.NEXT_PUBLIC_MULTIPLAYER_ROOM || 'tcentral-main';
const MAX_SLOTS = Number(process.env.NEXT_PUBLIC_MULTIPLAYER_MAX_SLOTS || 100);

function flattenPresence(state) {
  return Object.values(state || {}).flatMap((entries) => entries || []);
}

export default function MultiplayerHud() {
  const [steamUser, setSteamUser] = useState(null);
  const [presenceUsers, setPresenceUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const channelRef = useRef(null);

  const slotCount = presenceUsers.length;
  const slotsLeft = Math.max(0, MAX_SLOTS - slotCount);

  const summary = useMemo(() => ({
    room: ROOM_NAME,
    slotCount,
    slotsLeft,
    safetyInNumbers: slotCount >= 2,
  }), [slotCount, slotsLeft]);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/steam/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setSteamUser(data?.authenticated ? data.user : null);
      })
      .catch(() => {
        if (!active) return;
        setSteamUser(null);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !steamUser?.steamid) return;

    const channel = supabase.channel(`presence:${ROOM_NAME}`, {
      config: { presence: { key: steamUser.steamid }, broadcast: { self: true } },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        setPresenceUsers(flattenPresence(channel.presenceState()));
      })
      .subscribe(async (status) => {
        setConnected(status === 'SUBSCRIBED');
        if (status !== 'SUBSCRIBED') return;

        const current = flattenPresence(channel.presenceState());
        const already = current.some((entry) => entry.steamid === steamUser.steamid);
        if (current.length >= MAX_SLOTS && !already) {
          setJoined(false);
          return;
        }

        const result = await channel.track({
          steamid: steamUser.steamid,
          personaname: steamUser.personaname || 'Steam user',
          avatar: steamUser.avatar || null,
          joinedAt: new Date().toISOString(),
          mode: 'spectate',
        });
        setJoined(result === 'ok');
      });

    return () => {
      setConnected(false);
      setJoined(false);
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [steamUser]);

  return (
    <div className="multiplayer-hud">
      <div className="multiplayer-card">
        <div className="multiplayer-topline">
          <span className="multiplayer-kicker">Multiplayer</span>
          <span className={`multiplayer-status ${connected ? 'online' : ''}`}>
            {connected ? 'Connected' : 'Offline'}
          </span>
        </div>

        <div className="multiplayer-grid">
          <div className="multiplayer-stat">
            <span>Room</span>
            <strong>{summary.room}</strong>
          </div>
          <div className="multiplayer-stat">
            <span>Players</span>
            <strong>{summary.slotCount} / {MAX_SLOTS}</strong>
          </div>
          <div className="multiplayer-stat">
            <span>Slots left</span>
            <strong>{summary.slotsLeft}</strong>
          </div>
          <div className="multiplayer-stat">
            <span>Safety in numbers</span>
            <strong>{summary.safetyInNumbers ? 'Active' : 'Waiting'}</strong>
          </div>
        </div>

        <div className="multiplayer-presence">
          {steamUser ? (
            joined ? <p className="multiplayer-note">You are in the live room as <strong>{steamUser.personaname || 'Steam user'}</strong>.</p>
                   : <p className="multiplayer-note">Steam linked, but the room is full or unavailable.</p>
          ) : (
            <p className="multiplayer-note">Sign in with Steam to enter the live multiplayer room.</p>
          )}
        </div>

        <div className="multiplayer-roster">
          {presenceUsers.slice(0, 8).map((user) => (
            <div key={`${user.steamid}-${user.joinedAt || ''}`} className="multiplayer-player-pill">
              {user.avatar ? <img src={user.avatar} alt={user.personaname || 'Steam avatar'} /> : null}
              <div className="multiplayer-player-copy">
                <strong>{user.personaname || 'Player'}</strong>
                <span>{user.mode === 'pilot' ? 'Pilot' : 'Spectate'}</span>
              </div>
            </div>
          ))}
          {presenceUsers.length === 0 ? <div className="multiplayer-empty">No active players yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
