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


## Cosmic background and ship flight
- Upgraded the background into a richer cosmic nebula look
- Added a small flyable ship for Free Fly mode
- Free Fly now uses ship-style movement with mouse steering
- Kept the warp entry overlay for server travel


## Space sim flight upgrade
- Upgraded Free Fly into a more game-like space sim mode
- Rebuilt the ship silhouette to feel more like an actual spacecraft
- Added inertial chase-camera movement
- Added Control key boost


## Cinematic web space navigation
- Tuned the experience toward a more cinematic web-space-sim feel
- Reduced the ship's on-screen footprint
- Added smoother chase-camera handling
- Added Q/E roll alongside boost
- Added a faint hologram panel inspired by the uploaded cosmic map


## Futuristic rocket ship rebuild
- Rebuilt the flyable craft into a more futuristic rocket-style silhouette
- Added wireframe edge detailing on the spacecraft
- Kept the entire system Vercel-deployable
- Used the uploaded map as visual language inspiration, not as a fake backend claim


## Web game layer expansion
- Added a game-style HUD with speed, boost, gravity pull, and zone readouts
- Added browser-safe cinematic intro and stronger docking/travel presentation
- Added black-hole proximity gravity pull during flight
- Kept the entire experience deployable on Vercel as a web game


## Spaceship visual upgrade
- Reworked the craft into a more recognizable futuristic spaceship form
- Improved nose, fuselage, canopy, wings, stabilizers, and engine layout
- Kept wireframe edge accents for a tech-heavy visual style


## Ship wiremesh expansion
- Added more wireframe edge detailing across canopy, fins, stabilizers, and engine housings
- Increased the technical panel-line feel of the spacecraft without changing the working flight system


## Domain alignment
- Project metadata and canonical base are aligned to `https://t-central.me`
- This package is prepared to use T-central.me as the primary site slot
- Live inspection of the current domain contents was not possible during packaging because the site returned HTTP 403 to direct fetches


## Complete ship pass
- Rebuilt the ship into a fuller futuristic spaceship form
- Added more complete fuselage, intakes, wing, fin, and engine-pod structure
- Preserved the current working web-game flight stack


## Habitable ship pass
- Reshaped the craft into a more rounded and livable deep-space vessel
- Added clearer habitation volume, observation dome, side pods, and softer engine assembly
- Reduced harsh engineering lines to feel more like a real long-range spacecraft


## Space layout redistribution
- Raised the main navigation bubbles higher in the scene
- Spread major systems across multiple axes instead of a mostly vertical stack
- Pulled the camera back slightly to fit the larger spatial layout


## Bottom HUD and pilot-only ship
- Moved Center / Donate / Report / Pilot controls to the bottom of the screen
- Kept the ship visible only while piloting
- Cleaned the scene so the spacecraft is not always present


## Cleaner visual pass
- Simplified bottom controls
- Reduced label noise
- Tightened HUD and overlay styling
- Softened sector labels and UI surfaces


## Fixed HUD and cockpit overlay
- Moved Center / Donate / Report / Pilot into a fixed bottom screen control bar
- Removed those controls from the 3D scene
- Added a stronger cockpit-style overlay with radar, reticle, and targeting/status panels
