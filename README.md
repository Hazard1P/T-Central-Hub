# T-Central Hub Ultimate

Fully upgraded premium multi-page Next.js website for:
- Arma3 Capture the Hill
- Rust Vanilla Bi-Weekly Wipe

## Included
- Interactive cosmic map homepage
- Dedicated Arma3 page
- Dedicated Rust page
- Information page
- Donate page
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
