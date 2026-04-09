# T-Central Hub Ultimate

Fully upgraded premium multi-page Next.js website for:
- Arma3 Capture the Hill
- Rust Vanilla Bi-Weekly Wipe
- Rust Vanilla Monthly Wipe
- Rust Vanilla Weekly Wipe

## Included
- Interactive 3D cosmic map homepage
- Dedicated Arma3 page
- Dedicated Rust page
- Information page
- Donate page
- Report Player page
- PayPal subscription integration
- Discord integration
- SEO metadata
- robots.js and sitemap.js
- Vercel-ready structure
- Artwork and Arma screenshot in `/public`

## Server details
### Arma3
- `tcentral.game.nfoservers.com:2302`

### Rust
- Server name: `NFOservers.com: T-Central Rust Vanilla Bi-Weekly Wipe`
- Address: `tcentralrust.game.nfoservers.com:28015`
- Current map: `Procedural Map`
- Current players: `0 / 250`
- Currently locked: `No`

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

## Important after deployment
Replace `https://t-central.me` in:
- `app/layout.js`
- `app/robots.js`
- `app/sitemap.js`

## Notes
- Live server player counts are still static placeholders unless you add a backend or API source later.
- The PayPal subscription button is already wired to your provided plan.


## Player reporting
- Added a dedicated `/report-player` page
- Reports currently route through Discord for moderation follow-up


### Rust Monthly
- Server name: `T-Central Rust Vanilla Monthly Wipe`
- Address: `tcentralrust3.game.nfoservers.com:28015`
- Current map: `Procedural Map`
- Current players: `0 / 250`

### Rust Weekly
- Server name: `T-Central Rust Vanilla Weekly Wipe`
- Address: `tcentralrust2.game.nfoservers.com:28015`
- Current map: `Procedural Map`
- Current players: `0 / 250`
- Currently locked: `No`


## 3D map notes
- Added a Vercel-compatible 3D homepage map using:
  - `three`
  - `@react-three/fiber`
  - `@react-three/drei`
- Rust servers are pinned around the black hole cluster on the lower section of the map
- The remaining hub routes are mapped across the constellation for navigation


## Warp and Dyson upgrades
- Added warp zoom transitions into Arma3 and Rust routes from the 3D homepage map
- Upgraded Arma3 into its own interactive black hole anchor
- Added a spinning Dyson sphere on the support side of the map


## Map definition upgrade
- Dyson sphere label changed to `S.S`
- 3D map now uses clearer sectors:
  - Arma Sector
  - Rust Sector
  - Support Sector
- Node labels now include short role descriptions
- Rust servers remain pinned to the lower black hole cluster
