'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

const ROOM_NAME = process.env.NEXT_PUBLIC_MULTIPLAYER_ROOM || 'tcentral-main';
const MAX_SLOTS = Number(process.env.NEXT_PUBLIC_MULTIPLAYER_MAX_SLOTS || 32);

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
  const safetyInNumbers = slotCount >= 2;

  const summary = useMemo(() => {
    return {
      room: ROOM_NAME,
      slotCount,
      slotsLeft,
      safetyInNumbers,
    };
  }, [slotCount, slotsLeft, safetyInNumbers]);

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
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !steamUser?.steamid) return;

    const channel = supabase.channel(`presence:${ROOM_NAME}`, {
      config: {
        presence: { key: steamUser.steamid },
        broadcast: { self: true },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPresenceUsers(flattenPresence(state));
      })
      .subscribe(async (status) => {
        setConnected(status === 'SUBSCRIBED');
        if (status !== 'SUBSCRIBED') return;

        const payload = {
          steamid: steamUser.steamid,
          personaname: steamUser.personaname || 'Steam user',
          avatar: steamUser.avatar || null,
          profileurl: steamUser.profileurl || null,
          mode: 'observer',
          zone: 'hub',
          joinedAt: new Date().toISOString(),
        };

        const current = flattenPresence(channel.presenceState());
        const alreadyCounted = current.some((entry) => entry.steamid === steamUser.steamid);
        if (current.length >= MAX_SLOTS && !alreadyCounted) {
          setJoined(false);
          return;
        }

        const result = await channel.track(payload);
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
            joined ? (
              <p className="multiplayer-note">You are in the live room as <strong>{steamUser.personaname || 'Steam user'}</strong>.</p>
            ) : (
              <p className="multiplayer-note">Steam linked, but the room is full or not ready yet.</p>
            )
          ) : (
            <p className="multiplayer-note">Sign in with Steam to join live presence and player slots.</p>
          )}
        </div>

        <div className="multiplayer-player-list">
          {presenceUsers.slice(0, 8).map((user) => (
            <div key={`${user.steamid}-${user.joinedAt || ''}`} className="multiplayer-player-pill">
              {user.avatar ? <img src={user.avatar} alt={user.personaname || 'Steam avatar'} /> : null}
              <span>{user.personaname || user.steamid}</span>
            </div>
          ))}
          {presenceUsers.length === 0 ? <div className="multiplayer-empty">No active players yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
