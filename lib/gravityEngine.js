import { sampleGravityField } from '@/lib/physicsEngine';

export function buildGravitySources(graph) {
  return graph.nodes
    .filter((node) => node.mass && Array.isArray(node.position))
    .map((node) => ({
      key: node.key,
      position: node.position,
      mass: node.mass,
      radius: node.radius || 1,
      kind: node.kind,
      color: node.color,
      curvature: node.curvature || 0,
    }));
}

export function sampleUniverseGravity({ graph, position }) {
  const sources = buildGravitySources(graph);
  return sampleGravityField({ position, sources });
}

export function computeTidalStress({ graph, position }) {
  const field = sampleUniverseGravity({ graph, position });
  const magnitude = Math.sqrt(field.acceleration[0] ** 2 + field.acceleration[1] ** 2 + field.acceleration[2] ** 2);
  return Number((magnitude * 0.45 + field.horizonStress * 0.8).toFixed(4));
}
