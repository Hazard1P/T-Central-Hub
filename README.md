# T-Central Hub Vercel System

A full Next.js codebase for a Vercel-deployable interactive 3D game server hub.

## Included
- Full-screen 3D homepage system
- Bubble navigation inside the 3D scene
- Arma3 black hole entry point
- Rust black hole cluster with orbiting matter
- Dyson sphere S.S link
- National Security Star link
- Affiliate Star link
- Focus-panel interaction flow
- Transition overlay when opening a destination
- Donate page with PayPal subscription
- Player reporting page
- Dedicated pages for:
  - Arma3 CTH
  - Rust Bi-Weekly
  - Rust Weekly
  - Rust Monthly
- Vercel-compatible API route for status layer

## Honest status layer behavior
The included status API route does **not** fake live server data.
It works like this:
- If `STATUS_SOURCE_URL` is **not** configured, the site shows status as unavailable/unconfigured.
- If `STATUS_SOURCE_URL` is configured and returns JSON, the hub uses it.

Expected remote JSON shape:
```json
{
  "statuses": {
    "arma3": { "online": true, "players": 14, "maxPlayers": 60, "map": "Altis", "source": "Remote source" },
    "rust_biweekly": { "online": true, "players": 23, "maxPlayers": 250, "map": "Procedural Map", "source": "Remote source" },
    "rust_weekly": { "online": false, "players": 0, "maxPlayers": 250, "map": "Procedural Map", "source": "Remote source" },
    "rust_monthly": { "online": true, "players": 8, "maxPlayers": 250, "map": "Procedural Map", "source": "Remote source" }
  }
}
```

## Local development
```bash
npm install
npm run dev
```

Open:
`http://localhost:3000`

## Deploy to Vercel
1. Upload the folder to GitHub.
2. Import the repo into Vercel.
3. Deploy with default settings.
4. Optionally add `STATUS_SOURCE_URL` as an environment variable if you later build or connect a real status source.

## Routes
- `/`
- `/servers/arma3-cth`
- `/servers/rust-biweekly`
- `/servers/rust-weekly`
- `/servers/rust-monthly`
- `/donate`
- `/report-player`
