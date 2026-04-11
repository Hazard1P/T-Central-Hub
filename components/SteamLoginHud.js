'use client';

import { useEffect, useState } from 'react';

export default function SteamLoginHud() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth/steam/session', { cache: 'no-store' });
      const data = await res.json();
      setSession(data?.authenticated ? data.user : null);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
    const id = setInterval(loadSession, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="steam-login-hud">
      <div className="steam-login-card">
        <div className="steam-login-topline">
          <span className="steam-kicker">Steam Access</span>
          {session ? <span className="steam-status online">Linked</span> : <span className="steam-status">Guest</span>}
        </div>

        <div className="steam-login-body">
          {session?.avatar ? (
            <img className="steam-avatar" src={session.avatar} alt={session.personaname || 'Steam avatar'} />
          ) : (
            <div className="steam-avatar steam-avatar-fallback">S</div>
          )}

          <div className="steam-login-meta">
            {loading ? (
              <>
                <strong>Checking session…</strong>
                <small>Waiting for Steam profile</small>
              </>
            ) : session ? (
              <>
                <strong>{session.personaname || 'Steam user'}</strong>
                <small>{session.steamid}</small>
                <small className="steam-subtle">In-game identity active</small>
              </>
            ) : (
              <>
                <strong>Sign in with Steam</strong>
                <small>Connect your Steam profile</small>
                <small className="steam-subtle">Unlock profile-linked UI</small>
              </>
            )}
          </div>
        </div>

        <div className="steam-login-actions">
          {session ? (
            <>
              {session.profileurl ? (
                <a className="steam-mini-link" href={session.profileurl} target="_blank" rel="noreferrer">
                  Profile
                </a>
              ) : null}
              <a className="steam-mini-link" href="/report-player">
                Report player
              </a>
              <a className="steam-mini-link" href="/api/auth/steam/logout">
                Sign out
              </a>
            </>
          ) : (
            <a className="steam-login-button" href="/api/auth/steam/login">
              Continue with Steam
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
