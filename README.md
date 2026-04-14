# T-Central Hub — Full Phase 3 Build

This repository is the consolidated handoff that folds the earlier cleanup, infinite-layout, cinematic, gravity, session-sync, private-universe, and epoch-anchor passes into one working Next.js codebase.

See `PHASE_3_HANDOFF.md` for the fastest setup and engine overview.

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


## Steam login
- Added a lightweight Steam sign-in flow using Steam's browser-based OpenID callback pattern
- Added a fixed Steam login HUD in the top-right corner
- Profile enrichment uses `STEAM_API_KEY` from environment variables
- Set `NEXT_PUBLIC_APP_URL` and `STEAM_API_KEY` in Vercel before deploying


## Steam-linked expansions
- Added Steam avatar/profile state to the top-right Steam HUD
- Added a lower-left in-game identity panel that reflects Steam login state
- Added a Steam-linked player reporting page and API route


## Arma3 blackhole interior
- Added a dedicated Arma3 blackhole interior scene instead of immediate direct handoff
- Interior uses a three-step loop:
  - datapoint capture
  - confirmation
  - deploy
- The deploy button only activates after confirmation


## Arma3 blackhole quick-connect
- Added a visible Arma3 server list card inside the blackhole interior
- Added copy IP, Launch Arma 3, and Quick Connect actions
- Quick Connect uses the Steam browser protocol handoff


## Dynamic server browser
- Replaced the simple Arma3 interior card with a full dynamic browser layout
- Added search, sort, suggested server logic, and per-server quick-connect actions
- Server definitions live in `lib/serverCatalog.js`
- Live status enriches entries when available from the existing status layer


## Scroll lock fix
- Locked the main web-game shell to the viewport
- Disabled browser scrolling for the fullscreen system scene
- Kept regular content pages scrollable where needed


## Content-page scroll and Arma refresh
- Donate and report pages are scrollable again while the fullscreen hub remains locked
- Restored the Arma map image more prominently on the Arma3 page
- Added a Capture the Hill briefing, future prospects, and direct quick-connect actions


## Full architecture fix
- Moved interactive server join controls into a dedicated client component: `components/ServerConnectActions.js`
- Kept route pages and layout-safe wrappers server-friendly where possible
- Preserved the fullscreen hub while leaving donate and report scrollable
- Kept Steam auth routes, reporting flow, Arma quick connect, and refreshed donate/support messaging concurrent in the same package

## Why this fixes the Vercel build
- Next.js App Router does not allow passing event handlers from Server Components into Client Component props
- The Arma server page now imports a client-only connect actions component instead of attaching `onClick` directly inside the page


## Steam-linked recurring support and security
- Added encrypted support receipt handling for PayPal subscription linking
- Steam sessions and support receipts now use server-side encryption helpers in `lib/security.js`
- Added:
  - `app/api/support/link/route.js`
  - `app/api/support/session/route.js`
  - `components/DonateSupportClient.js`
- Added supporter status to the Steam HUD
- Restored the Arma3 battlefield image inside the blackhole server browser
- Added `public/photo.jpg` as a compatible image alias from the existing map asset

## Environment variables
- `SUPPORT_LINK_SECRET` should be a long random secret in production
- `STEAM_API_KEY` still powers Steam profile enrichment


## Single-server map restore
- Reduced the Arma server browser to a single live server overall
- Restored the uploaded map image inside the Arma blackhole browser
- Restored the uploaded reference photo on the Arma page
- Kept the single IP route as `tcentral.game.nfoservers.com:2302`


## Consolidation pass
- Added `/status` page summarizing the current stabilized package
- Re-checked the one-server Arma setup and image availability
- Kept recent fixes concurrent instead of branching the package further


## Arma inner restore
- Restored a stronger Arma blackhole entry feel with system warp wording
- Added a tactical briefing and Altis map panel back into the Arma blackhole interior
- Switched the Arma page main map back to the battlefield image instead of the cosmic reference


## Altis page patch
- Kept the Arma blackhole warp/system behavior intact
- Changed the Arma page image references to `arma-cth-shot.png`


## Phone and piloting optimization
- Added mobile pilot assist panel and touch flight controls
- Simplified cockpit/UI density on smaller screens
- Improved fixed navigation spacing and top HUD stacking for phones
- Adjusted support label and pilot messaging for clearer end-user guidance


## V2 package baseline
- Added a new front page entry layer at `/`
- Moved the live 3D web-game system to `/system`
- Added `/privacy-policy` and `/terms-and-conditions`
- Restored a Supabase-backed 100-slot multiplayer baseline
- Added in-scene multiplayer presence markers for visible players in the 3D space


## Performance optimization package
- Added a launch step before loading the full `/system` 3D scene
- Moved `/system` to a client wrapper that only mounts the heavy scene on demand
- Added mobile/reduced-scene scaling for stars, holograms, and background effects
- Set multiplayer baseline to 100 slots in `.env.example`
- Replaced compatibility-risk CSS `end` values with `flex-end`


## Stabilized server-layer pass
- Simplified the later game-layer additions that were more likely to cause client-side failures
- Kept `/system`, shared-room sync, proximity prompts, and 3D presence markers active
- Reduced extra HUD/panel complexity so the live layer is more reliable


## Continue building pass
- Integrated the selected cosmic background asset into the live package
- Applied the cosmic image across entry, launcher, system, and content layers
- Added a screen-space cosmic overlay for more depth in the 3D scene
- Kept moving the project toward the web-base game direction instead of splitting into a separate visual branch


## Front page JSX fix
- Rebuilt `app/page.js` cleanly after the cosmic wrapper insertion malformed the JSX structure


## Combined runtime fix
- Removed leaked `setIsMobile` / `setReducedScene` calls from `SteamIdentityPanel`
- Fixed `CameraReset` so it reports intro completion through a passed callback instead of directly calling `setIntroVisible`
- Restored `reducedScene` state and mobile detection inside `SystemScene`


## Deep simulation stabilization
- Removed leaked `setIsMobile` / `setReducedScene` calls from `SteamIdentityPanel`
- Added null guards to scene objects that can receive undefined nodes
- Restored mobile/reduced-scene logic to `SystemScene`
- Hooked `onIntroDone` back into `SystemScene`
- Simplified outbound realtime broadcasts to a steadier interval loop


## Continued development pass
- Added a top-level system status strip for clearer live-world context
- Added an in-world guide panel to make the 3D environment easier to use
- Kept the focus on the same shared 3D system instead of branching away from it


## WorldGuide split fix
- Moved `WorldGuide` back into `components/WorldGuide.js`
- Removed the accidental second `export default` from `components/SystemScene.js`


## Build further pass
- Added a route-focus panel to strengthen node/server progression in the shared world
- Added objective framing so the 3D environment feels more like a live game-space
- Added a room pulse panel for better immediate awareness of the shared layer


## Build further + background pass
- Merged the selected cosmic background asset into the current build-further package
- Applied the background across entry, launcher, system, and content layers
- Added a cosmic overlay to the front page and 3D system stage


## Internal systems pass
- Extracted the world layout into `lib/worldLayout.js`
- Extracted runtime settings into `lib/systemRuntime.js`
- Added `RouteLegend` so the world composition is visible in the current game layer
- Reduced direct scene-file ownership of layout/runtime data for a cleaner project baseline


## Continue patching pass
- Added `lib/worldHelpers.js` for cleaner world grouping/access
- Added `WorldStructurePanel` to show the live layout in-system
- Improved node-selection fallback and focus metadata handling


## Overall build pass
- Added `lib/worldDescriptors.js` for higher-level world summaries and featured routes
- Added `NodeCountsPanel` and `SystemConsolePanel` to strengthen the live-world structure
- Continued moving the project toward a cleaner internal-system baseline while preserving the current 3D environment


## Lobby + security pass
- Added explicit Multiplayer Hub and Private World lobby modes
- Kept route portals available in both modes
- Restricted shared realtime presence to the public hub
- Added a security baseline config for encryption/session expectations
- Updated privacy policy and terms to reflect public/private lobby behavior


## Runtime guard pass
- Added `SystemErrorBoundary` around the live system launch path
- Prevented duplicate Steam session fetches when a valid external Steam user is already present
- Added guarded Supabase initialization in the HUD and SystemScene


## Next stage stabilized pass
- Added `lib/playerRuntime.js` with safe default flight-state handling
- Normalized scene flight updates before they enter the live UI/runtime
- Guarded position-based broadcast logic against undefined state
- Added `ProgressStagePanel` to mark the next stable build stage


## Deployment hardening pass
- Fixed helper-scope leaks where scene helpers referenced variables only defined in `SystemScene`
- Hardened `CockpitOverlay`, `RoomPulse`, and `FocusPanel` against undefined runtime data
- Reduced repeated deployment risk from undefined state during first render and lobby transitions


## Stability shell pass
- Added `StableSystemWorld` as a simplified 3D route shell
- Kept the main blackholes, Dyson spheres, and solar system online
- Switched the `/system` launch path to the safer shell while heavier runtime work continues
