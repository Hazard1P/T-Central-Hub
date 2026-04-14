import { PRIMARY_SERVER_ROUTES } from '@/lib/serverData';

const SERVER_NODE_LAYOUT = {
  'arma3-cth': { key: 'arma3', position: [-12.8, 5.0, -2.8], color: '#7fe7ff' },
  'rust-biweekly': { key: 'rust_biweekly', position: [1.8, -5.0, 4.8], color: '#d8ff61' },
  'rust-weekly': { key: 'rust_weekly', position: [8.4, -9.2, -2.0], color: '#ff9fd9' },
  'rust-monthly': { key: 'rust_monthly', position: [-8.2, -11.4, -1.8], color: '#9dd0ff' },
};

const PRIMARY_WORLD_NODES = [
  { key: 'sbox', label: 'S&Box', address: 'sbox.game', description: 'External S&Box route.', position: [2.8, 11.2, -4.2], color: '#7cd6ff', route: 'https://sbox.game/', external: true, kind: 'blackhole', priority: 7 },
  { key: 'matrixcoinexchange', label: 'MatrixCoinExchange', address: 'matrixcoinexchange.com', description: 'External MatrixCoinExchange route.', position: [8.6, 6.4, -3.0], color: '#6dffb5', route: 'https://matrixcoinexchange.com', external: true, kind: 'blackhole', priority: 8 },
  { key: 'deep_blackhole', label: 'Deep Space Blackhole', address: 'Primary deep-space anchor', description: 'Deep-space blackhole rendered through generated event-horizon visuals and anchored route physics so the core world stays cohesive without external map artwork.', position: [-17.2, -3.6, -5.8], color: '#c4d4ff', kind: 'blackhole', priority: 6, tags: ['deep space', 'generated horizon', 'existing anchorage'] },
  { key: 'csis', label: 'CSIS', address: 'Dyson sphere', description: 'CSIS Dyson sphere node.', position: [-6.8, 10.6, 5.8], color: '#8ff3ff', kind: 'dyson', priority: 5 },
  { key: 'ss', label: 'S.S', address: 'Dyson sphere', description: 'S.S Dyson sphere node.', position: [13.8, -1.4, 6.0], color: '#ffd67d', kind: 'dyson', priority: 5 },
  { key: 'affiliates', label: 'Affiliates', address: 'Dyson sphere', description: 'Affiliates Dyson sphere node.', position: [-10.6, -9.4, 6.4], color: '#ff9fd9', kind: 'dyson', priority: 5 },
  { key: 'solar_system', label: 'Solar System', address: 'Sun + 9 planets', description: 'Solar system locked into the T-Central Hub zone with nine orbiting planets.', position: [7.4, 2.2, 5.0], color: '#ffd46b', kind: 'solar', priority: 4 },
];

function createServerNode(server, index) {
  const preset = SERVER_NODE_LAYOUT[server.slug] || {};
  const fallbackRadius = 10 + index * 3.2;
  const fallbackAngle = index * 1.7;

  return {
    key: preset.key || server.statusKey || server.slug,
    label: server.shortTitle,
    address: server.ip,
    description: server.summary,
    position: preset.position || [
      Number((Math.cos(fallbackAngle) * fallbackRadius).toFixed(2)),
      Number((-5 + index * 1.5).toFixed(2)),
      Number((Math.sin(fallbackAngle) * fallbackRadius * 0.55).toFixed(2)),
    ],
    color: preset.color || '#9dd0ff',
    route: server.href,
    kind: server.slug === 'arma3-cth' ? 'blackhole' : 'node',
    priority: server.slug === 'arma3-cth' ? 10 : 3,
    tags: server.tags,
  };
}

const DYNAMIC_SERVER_NODES = PRIMARY_SERVER_ROUTES.map(createServerNode);

const SATELLITE_RINGS = Number(process.env.NEXT_PUBLIC_WORLD_RINGS || 5);
const SATELLITES_PER_RING = Number(process.env.NEXT_PUBLIC_WORLD_RING_DENSITY || 6);
const SATELLITE_RADIUS_START = 16;
const SATELLITE_RADIUS_STEP = 5.25;
const SATELLITE_COLORS = ['#91f2ff', '#d3b6ff', '#ffd589', '#8cffcc', '#ff9fd9', '#9dd0ff'];

function createSatelliteNode(ringIndex, satelliteIndex) {
  const radius = SATELLITE_RADIUS_START + ringIndex * SATELLITE_RADIUS_STEP;
  const angle = (Math.PI * 2 * satelliteIndex) / SATELLITES_PER_RING + ringIndex * 0.42;
  const verticalWave = ((satelliteIndex % 3) - 1) * 2.8 + ringIndex * 0.35;

  return {
    key: `aux-${ringIndex + 1}-${satelliteIndex + 1}`,
    label: `Aux Node ${ringIndex + 1}.${satelliteIndex + 1}`,
    address: `Expansion ring ${ringIndex + 1}`,
    description: 'Procedurally generated relay node for infinite-feeling world expansion and future route growth.',
    position: [
      Number((Math.cos(angle) * radius).toFixed(2)),
      Number(verticalWave.toFixed(2)),
      Number((Math.sin(angle) * radius * 0.72).toFixed(2)),
    ],
    color: SATELLITE_COLORS[(ringIndex + satelliteIndex) % SATELLITE_COLORS.length],
    kind: 'node',
    priority: 1,
    generated: true,
  };
}

const GENERATED_SATELLITE_NODES = Array.from({ length: SATELLITE_RINGS * SATELLITES_PER_RING }, (_, index) => {
  const ringIndex = Math.floor(index / SATELLITES_PER_RING);
  const satelliteIndex = index % SATELLITES_PER_RING;
  return createSatelliteNode(ringIndex, satelliteIndex);
});

export const WORLD_LAYOUT = [...PRIMARY_WORLD_NODES, ...DYNAMIC_SERVER_NODES, ...GENERATED_SATELLITE_NODES];

export const ROUTE_CHIPS = WORLD_LAYOUT
  .filter((node) => ['blackhole', 'dyson', 'solar'].includes(node.kind))
  .map((node) => node.label);

export const WORLD_SUMMARY = WORLD_LAYOUT.reduce(
  (summary, node) => {
    if (node.kind === 'blackhole') summary.blackholes += 1;
    if (node.kind === 'dyson') summary.dysonSpheres += 1;
    if (node.kind === 'solar') summary.solarSystems += 1;
    if (node.kind === 'node') summary.nodes += 1;
    return summary;
  },
  { blackholes: 0, dysonSpheres: 0, solarSystems: 0, nodes: 0 }
);
