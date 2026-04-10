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


## Central system trim
- Reduced the large front-facing intro layer
- Kept the central 3D system as the main experience
- Left status pill visible without the oversized homepage heading


## Donate page rebuild
- Rebuilt the donate page layout
- Uses the provided PayPal subscription button scheme
- Keeps the provided PayPal client ID and plan ID in the Next.js page


## Donate page expansion
- Rebuilt the donate page with a stronger multi-tier visual structure
- Kept the current PayPal plan as the only live payment path
- Added direct PayPal subscription link plus embedded PayPal button
- Added tier cards for future expansion without faking extra plan IDs


## S&Box black hole
- Added a dedicated S&Box black hole
- Links directly to `https://sbox.game/`
- Added an S&Box sector ring to the 3D system


## Spatial layout update
- Increased spacing between black holes, stars, support nodes, and sector rings
- Opened the camera out to fit the larger map layout
- Relaxed OrbitControls so the camera feels less fixed and more freely explorable
- Renamed the lower main sector ring to `T-Central Hub`


## Deep black hole and solar replica
- Added a standalone Deep Black Hole as its own anchor
- Added a Solar Replica with a procedural sun and 9 orbiting planets
- Both are integrated into the 3D system without inventing fake destination links


## Solar staging update
- Moved the Solar Replica into the T-Central Hub zone
- Spread the overall system farther apart for a more staged composition
- Opened the camera farther back to fit the larger system layout


## Solar lock position fix
- Moved the Solar Replica upward so it no longer sits inside the Rust black hole
- Locked it into the same T-Central Hub positional zone at a cleaner vertical level


## Dynamic background, free fly, and warp
- Added a dynamic procedural nebula-style background layer
- Added a Free Fly toggle bubble
- Free Fly supports WASD movement plus Space and Shift for vertical travel
- Rebuilt the server-entry overlay into a stronger warp experience
