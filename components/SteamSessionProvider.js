'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPresenceSnapshot, reducePresenceSnapshots } from '@/lib/multiplayerSyncEngine';

const SteamSessionContext = createContext({
  steamUser: null,
  support: null,
  universe: null,
  loading: true,
  refresh: async () => {},
  authenticated: false,
  lobbyMode: 'hub',
  setLobbyMode: () => {},
  updatePresence: () => {},
  presence: [],
});

export function SteamSessionProvider({ children }) {
  const [steamUser, setSteamUser] = useState(null);
  const [support, setSupport] = useState(null);
  const [universe, setUniverse] = useState(null);
  const [presence, setPresence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lobbyMode, setLobbyMode] = useState('hub');
  const channelRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const [steamRes, supportRes, universeRes] = await Promise.all([
        fetch('/api/auth/steam/session', { cache: 'no-store' }),
        fetch('/api/support/session', { cache: 'no-store' }),
        fetch(`/api/universe/session?lobbyMode=${encodeURIComponent(lobbyMode)}`, { cache: 'no-store' }),
      ]);
      const steamData = await steamRes.json();
      const supportData = await supportRes.json();
      const universeData = await universeRes.json();
      setSteamUser(steamData?.authenticated ? steamData.user : null);
      setSupport(supportData?.linked ? supportData.support : null);
      setUniverse(universeData?.ok ? universeData : null);
    } catch {
      setSteamUser(null);
      setSupport(null);
      setUniverse(null);
    } finally {
      setLoading(false);
    }
  }, [lobbyMode]);

  const updatePresence = useCallback((telemetry) => {
    const snapshot = createPresenceSnapshot({
      steamUser,
      telemetry,
      scope: universe?.privacy,
      lobbyMode,
    });

    setPresence((current) => reducePresenceSnapshots([snapshot, ...current]));

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('tcentral_presence_sync', JSON.stringify(snapshot));
      } catch {}
      window.dispatchEvent(new CustomEvent('tcentral-presence-updated', { detail: snapshot }));
    }

    if (channelRef.current) {
      try {
        channelRef.current.postMessage(snapshot);
      } catch {}
    }
  }, [steamUser, universe, lobbyMode]);

  useEffect(() => {
    refresh();
    const intervalId = window.setInterval(refresh, 30000);
    const handleFocus = () => refresh();
    const handleStorage = (event) => {
      if (!event.key || ['steam_session_sync', 'tcentral_presence_sync'].includes(event.key)) refresh();
      if (event.key === 'tcentral_presence_sync' && event.newValue) {
        try {
          const snapshot = JSON.parse(event.newValue);
          setPresence((current) => reducePresenceSnapshots([snapshot, ...current]));
        } catch {}
      }
    };
    const handleSessionBroadcast = () => refresh();
    const handlePresence = (event) => {
      const snapshot = event.detail;
      if (snapshot) setPresence((current) => reducePresenceSnapshots([snapshot, ...current]));
    };

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channelRef.current = new BroadcastChannel('tcentral-universe-observance');
      channelRef.current.onmessage = (event) => {
        if (event?.data) setPresence((current) => reducePresenceSnapshots([event.data, ...current]));
      };
    }

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('steam-session-updated', handleSessionBroadcast);
    window.addEventListener('tcentral-presence-updated', handlePresence);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('steam-session-updated', handleSessionBroadcast);
      window.removeEventListener('tcentral-presence-updated', handlePresence);
      if (channelRef.current) channelRef.current.close();
    };
  }, [refresh]);

  const value = useMemo(() => ({
    steamUser,
    support,
    universe,
    presence,
    loading,
    refresh,
    updatePresence,
    lobbyMode,
    setLobbyMode,
    authenticated: Boolean(steamUser?.steamid),
  }), [steamUser, support, universe, presence, loading, refresh, updatePresence, lobbyMode]);

  return <SteamSessionContext.Provider value={value}>{children}</SteamSessionContext.Provider>;
}

export function useSteamSession() {
  return useContext(SteamSessionContext);
}
