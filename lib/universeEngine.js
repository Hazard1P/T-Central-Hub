import { WORLD_LAYOUT } from '@/lib/worldLayout';
import { PRIMARY_SERVER_ROUTES } from '@/lib/serverData';
import { createEpochAnchor, computeOrbitFromEpoch } from '@/lib/epochDysonEngine';
import { enrichUniverseGraph } from '@/lib/proceduralUniverse';

const DEFAULT_ROUTE_COLORS = ['#7fe7ff', '#9f7cff', '#6dffb5', '#ffd46b', '#ff9fd9', '#9dd0ff'];

function round(n) {
  return Number(n.toFixed(2));
}

function classifyNode(node) {
  if (node.kind === 'solar') return 'solar';
  if (node.kind === 'dyson') return 'anchor';
  if (node.kind === 'blackhole') return node.route ? 'portal' : 'anchor';
  if ((node.tags || []).includes('rust')) return 'server';
  return node.generated ? 'relay' : 'node';
}

function createSolarChildren(node, index, epochAnchor) {
  if (node.kind !== 'solar') return [];

  const orbitCount = 6;
  return Array.from({ length: orbitCount }, (_, orbitIndex) => {
    const angle = (Math.PI * 2 * orbitIndex) / orbitCount + index * 0.35;
    const radius = 2.2 + orbitIndex * 0.85;
    const orbitEpoch = computeOrbitFromEpoch({ orbitIndex, baseSpeed: 0.12 + orbitIndex * 0.02, anchor: epochAnchor });
    return {
      key: `${node.key}-planet-${orbitIndex + 1}`,
      parentKey: node.key,
      label: `Planet ${orbitIndex + 1}`,
      kind: 'planet',
      radius: round(radius),
      speed: round(orbitEpoch.angularVelocity),
      size: round(0.16 + orbitIndex * 0.035),
      tilt: round(((orbitIndex % 3) - 1) * 0.18),
      seedAngle: round(angle + orbitEpoch.phaseOffset * Math.PI * 2),
      color: DEFAULT_ROUTE_COLORS[(orbitIndex + 2) % DEFAULT_ROUTE_COLORS.length],
    };
  });
}

export function buildUniverseGraph(now = Date.now()) {
  const epochAnchor = createEpochAnchor({ now });

  const nodes = WORLD_LAYOUT.map((node, index) => ({
    ...node,
    category: classifyNode(node),
    intensity:
      node.kind === 'blackhole' ? 1.1 :
      node.kind === 'solar' ? 0.85 :
      node.kind === 'dyson' ? 0.72 :
      node.generated ? 0.32 : 0.45,
    radius:
      node.kind === 'blackhole' ? 1.9 :
      node.kind === 'solar' ? 1.55 :
      node.kind === 'dyson' ? 1.18 :
      node.generated ? 0.24 : 0.42,
    mass:
      node.kind === 'blackhole' ? 440 - index * 6 :
      node.kind === 'solar' ? 190 :
      node.kind === 'dyson' ? 125 : 18,
    curvature:
      node.kind === 'blackhole' ? 1 :
      node.kind === 'solar' ? 0.58 :
      node.kind === 'dyson' ? 0.42 : 0.12,
    stateVectorSeed: (index + 1) * 0.73,
    anchorType: 'simulated-' + node.kind,
    epochAnchor: node.kind === 'solar' || node.kind === 'dyson' ? epochAnchor : null,
    orbiters: createSolarChildren(node, index, epochAnchor),
  }));

  const primaryAnchors = nodes.filter((node) => ['blackhole', 'solar', 'dyson'].includes(node.kind));
  const routeLinks = [];

  const deepAnchor = nodes.find((node) => node.key === 'deep_blackhole');
  const solarAnchor = nodes.find((node) => node.kind === 'solar');
  const rustServers = PRIMARY_SERVER_ROUTES.filter((server) => server.family === 'rust');
  const armaServer = PRIMARY_SERVER_ROUTES.find((server) => server.slug === 'arma3-cth');

  if (deepAnchor && solarAnchor) {
    routeLinks.push({
      key: 'deep-to-solar',
      from: deepAnchor.key,
      to: solarAnchor.key,
      color: '#7fe7ff',
      arc: 2.6,
      weight: 1.25,
    });
  }

  if (deepAnchor && armaServer) {
    routeLinks.push({
      key: 'deep-to-arma3',
      from: deepAnchor.key,
      to: armaServer.statusKey,
      color: '#6dffb5',
      arc: 2.1,
      weight: 1.35,
    });
  }

  rustServers.forEach((server, index) => {
    routeLinks.push({
      key: `rust-link-${server.slug}`,
      from: deepAnchor?.key || 'deep_blackhole',
      to: server.statusKey,
      color: DEFAULT_ROUTE_COLORS[(index + 1) % DEFAULT_ROUTE_COLORS.length],
      arc: 1.6 + index * 0.3,
      weight: 1.1,
    });
  });

  const generatedRelays = nodes.filter((node) => node.generated).slice(0, 18);
  generatedRelays.forEach((relay, index) => {
    const target = primaryAnchors[index % primaryAnchors.length];
    if (!target) return;
    routeLinks.push({
      key: `relay-${relay.key}`,
      from: relay.key,
      to: target.key,
      color: relay.color || '#9dd0ff',
      arc: 0.8 + (index % 4) * 0.25,
      weight: 0.45,
      faint: true,
    });
  });

  const heroNodes = nodes
    .filter((node) => ['blackhole', 'solar', 'dyson'].includes(node.kind) || PRIMARY_SERVER_ROUTES.some((server) => server.statusKey === node.key))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return enrichUniverseGraph({
    nodes,
    epochAnchor,
    heroNodes,
    routeLinks,
    primaryAnchors,
    stats: {
      blackholes: nodes.filter((node) => node.kind === 'blackhole').length,
      solarSystems: nodes.filter((node) => node.kind === 'solar').length,
      dysonSpheres: nodes.filter((node) => node.kind === 'dyson').length,
      relays: nodes.filter((node) => node.generated).length,
    },
  });
}

export function getNodePositionMap(graph) {
  return Object.fromEntries(graph.nodes.map((node) => [node.key, node.position]));
}
