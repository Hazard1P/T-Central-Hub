export const WORLD_LAYOUT = [
  { key: 'arma3', label: 'Arma3 CTH', address: 'tcentral.game.nfoservers.com:2302', description: 'Public tactical hill-control combat.', position: [-12.8, 5.0, -2.8], color: '#7fe7ff', route: '/servers/arma3-cth', kind: 'blackhole', priority: 10 },
  { key: 'sbox', label: 'S&Box', address: 'sbox.game', description: 'External S&Box route.', position: [2.8, 11.2, -4.2], color: '#7cd6ff', route: 'https://sbox.game/', external: true, kind: 'blackhole', priority: 7 },
  { key: 'matrixcoinexchange', label: 'MatrixCoinExchange', address: 'matrixcoinexchange.com', description: 'External MatrixCoinExchange route.', position: [8.6, 6.4, -3.0], color: '#6dffb5', route: 'https://matrixcoinexchange.com', external: true, kind: 'blackhole', priority: 8 },
  { key: 'rust_anchor', label: 'Rust', address: 'tcentralrust.game.nfoservers.com:28015', description: 'Primary Rust route and anchor.', position: [-3.0, -8.0, 2.4], color: '#9f7cff', route: '/servers/rust-biweekly', kind: 'blackhole', priority: 9 },
  { key: 'deep_blackhole', label: 'Deep Standalone Blackhole', address: 'Standalone system anchor', description: 'Permanent anchor shell of the universe fabric. Holds the route mesh, shared multiplayer experience, reference-map context, and persistent anchorage across connected instances.', position: [-17.2, -3.6, -5.8], color: '#c4d4ff', kind: 'blackhole', priority: 6 },

  { key: 'csis', label: 'CSIS', address: 'Dyson sphere', description: 'CSIS Dyson sphere node.', position: [-6.8, 10.6, 5.8], color: '#8ff3ff', kind: 'dyson', priority: 5 },
  { key: 'ss', label: 'S.S', address: 'Dyson sphere', description: 'S.S Dyson sphere node.', position: [13.8, -1.4, 6.0], color: '#ffd67d', kind: 'dyson', priority: 5 },
  { key: 'affiliates', label: 'Affiliates', address: 'Dyson sphere', description: 'Affiliates Dyson sphere node.', position: [-10.6, -9.4, 6.4], color: '#ff9fd9', kind: 'dyson', priority: 5 },

  { key: 'solar_system', label: 'Solar System', address: 'Sun + 9 planets', description: 'Solar system locked into the T-Central Hub zone with nine orbiting planets.', position: [7.4, 2.2, 5.0], color: '#ffd46b', kind: 'solar', priority: 4 },

  { key: 'rust_biweekly', label: 'Rust Bi-Weekly', address: 'tcentralrust.game.nfoservers.com:28015', description: 'Bi-weekly wipe cycle.', position: [1.8, -5.0, 4.8], color: '#d8ff61', route: '/servers/rust-biweekly', kind: 'node', priority: 3 },
  { key: 'rust_weekly', label: 'Rust Weekly', address: 'tcentralrust2.game.nfoservers.com:28015', description: 'Weekly fresh-start cycle.', position: [8.4, -9.2, -2.0], color: '#ff9fd9', route: '/servers/rust-weekly', kind: 'node', priority: 3 },
  { key: 'rust_monthly', label: 'Rust Monthly', address: 'tcentralrust3.game.nfoservers.com:28015', description: 'Long-cycle progression route.', position: [-8.2, -11.4, -1.8], color: '#9dd0ff', route: '/servers/rust-monthly', kind: 'node', priority: 3 },
];

export const ROUTE_CHIPS = ['Arma3 CTH', 'MatrixCoinExchange', 'Rust', 'CSIS', 'S.S', 'Affiliates'];
export const WORLD_SUMMARY = { blackholes: 5, dysonSpheres: 3, solarSystems: 1 };
