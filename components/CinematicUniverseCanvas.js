'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Line, Sparkles, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { buildUniverseGraph, getNodePositionMap } from '@/lib/universeEngine';

function useDeviceTier() {
  const [tier, setTier] = useState({
    isMobile: false,
    dpr: [1, 1.45],
    stars: 6800,
    sparkles: 180,
    meteors: 12,
    labels: 4,
  });

  useEffect(() => {
    const update = () => {
      const isMobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
      setTier({
        isMobile,
        dpr: isMobile ? [1, 1.2] : [1, 1.45],
        stars: isMobile ? 3200 : 6800,
        sparkles: isMobile ? 90 : 180,
        meteors: isMobile ? 6 : 12,
        labels: isMobile ? 2 : 4,
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return tier;
}

function NebulaBackdrop() {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.006;
    ref.current.rotation.y += delta * 0.01;
  });

  return (
    <group ref={ref} position={[0, 2, -40]}>
      <mesh position={[-10, 5, 0]} scale={[34, 18, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial color="#6f52ff" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh position={[12, -4, 2]} scale={[28, 14, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial color="#46cfff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[0, 10, -2]} scale={[46, 22, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial color="#ff9b5a" transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CinematicDustField({ sparkleCount }) {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.012;
    group.current.rotation.z += delta * 0.004;
  });

  return (
    <group ref={group}>
      <Sparkles count={sparkleCount} scale={[64, 40, 56]} size={3.4} speed={0.22} opacity={0.82} />
      <mesh position={[0, 0, -24]} scale={[60, 30, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <meshBasicMaterial color="#78d8ff" transparent opacity={0.035} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RouteRibbon({ from, to, color = '#7fe7ff', arc = 2.2, faint = false }) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += arc;
    return [start, mid, end];
  }, [from, to, arc]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={faint ? 0.85 : 1.8}
      transparent
      opacity={faint ? 0.26 : 0.62}
    />
  );
}

function GravitationalLens({ radius = 3.2 }) {
  const shellA = useRef(null);
  const shellB = useRef(null);

  useFrame(({ clock }, delta) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.03;
    if (shellA.current) {
      shellA.current.rotation.y += delta * 0.12;
      shellA.current.scale.setScalar(pulse);
    }
    if (shellB.current) {
      shellB.current.rotation.x -= delta * 0.08;
      shellB.current.rotation.z += delta * 0.05;
      shellB.current.scale.setScalar(1.04 + Math.sin(clock.elapsedTime * 1.1) * 0.04);
    }
  });

  return (
    <group>
      <mesh ref={shellA}>
        <sphereGeometry args={[radius * 1.95, 42, 42]} />
        <meshBasicMaterial color="#72d7ff" transparent opacity={0.065} depthWrite={false} />
      </mesh>
      <mesh ref={shellB}>
        <sphereGeometry args={[radius * 2.5, 28, 28]} />
        <meshBasicMaterial color="#a989ff" transparent opacity={0.035} depthWrite={false} />
      </mesh>
    </group>
  );
}

function EventHorizon({ radius = 2.2, color = '#9fdcff' }) {
  const diskA = useRef(null);
  const diskB = useRef(null);
  const coreGlow = useRef(null);

  useFrame(({ clock }, delta) => {
    if (diskA.current) diskA.current.rotation.z += delta * 0.95;
    if (diskB.current) diskB.current.rotation.z -= delta * 0.52;
    if (coreGlow.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.08;
      coreGlow.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={coreGlow}>
        <sphereGeometry args={[radius * 1.65, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      <mesh ref={diskA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, radius * 0.34, 36, 180]} />
        <meshBasicMaterial color={color} transparent opacity={0.92} depthWrite={false} />
      </mesh>

      <mesh ref={diskB} rotation={[Math.PI / 2.25, Math.PI / 7, 0]}>
        <torusGeometry args={[radius * 1.38, radius * 0.1, 20, 160]} />
        <meshBasicMaterial color="#f0fbff" transparent opacity={0.48} depthWrite={false} />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, Math.PI / 5, 0]}>
        <torusGeometry args={[radius * 1.72, radius * 0.03, 10, 220]} />
        <meshBasicMaterial color="#ffae52" transparent opacity={0.26} depthWrite={false} />
      </mesh>
    </group>
  );
}

function MeteorField({ count = 12, spread = 36, center = [0, 0, 0] }) {
  const refs = useRef([]);
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        key: `landing-meteor-${index}`,
        orbitRadius: 12 + (index % 5) * 4 + spread * 0.08,
        speed: 0.11 + (index % 7) * 0.025,
        angle: (Math.PI * 2 * index) / count,
        height: ((index % 5) - 2) * 1.4,
        size: 0.18 + (index % 4) * 0.08,
        tail: 0.12 + (index % 3) * 0.05,
      })),
    [count, spread]
  );

  useFrame(({ clock }) => {
    meteors.forEach((meteor, index) => {
      const ref = refs.current[index];
      if (!ref) return;
      const angle = clock.elapsedTime * meteor.speed + meteor.angle;
      ref.position.set(
        center[0] + Math.cos(angle) * meteor.orbitRadius,
        center[1] + meteor.height + Math.sin(angle * 2.1) * 0.75,
        center[2] + Math.sin(angle) * meteor.orbitRadius * 0.72,
      );
      ref.rotation.x += 0.017;
      ref.rotation.y += 0.022;
    });
  });

  return (
    <group>
      {meteors.map((meteor, index) => (
        <group key={meteor.key} ref={(el) => { refs.current[index] = el; }}>
          <mesh>
            <dodecahedronGeometry args={[meteor.size, 0]} />
            <meshStandardMaterial color="#7d838f" emissive="#31281f" emissiveIntensity={0.18} roughness={0.96} metalness={0.05} />
          </mesh>
          <mesh position={[-meteor.size * 1.1, 0, 0]}>
            <coneGeometry args={[meteor.size * 0.7, meteor.size * 3.2, 8]} />
            <meshBasicMaterial color="#ffbc77" transparent opacity={meteor.tail} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BlackholeNode({ node, hero = false }) {
  const ref = useRef(null);
  const aura = useRef(null);

  useFrame(({ clock }, delta) => {
    if (ref.current) ref.current.rotation.y += delta * (hero ? 0.24 : 0.18);
    if (aura.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * (hero ? 1.9 : 1.4)) * 0.05;
      aura.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={node.position}>
      <group ref={ref}>
        <mesh ref={aura}>
          <sphereGeometry args={[node.radius * (hero ? 2.8 : 2.2), 32, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={hero ? 0.08 : 0.05} depthWrite={false} />
        </mesh>
        <GravitationalLens radius={hero ? node.radius * 1.08 : node.radius * 0.9} />
        <mesh>
          <sphereGeometry args={[node.radius * 0.44, 36, 36]} />
          <meshStandardMaterial color="#020409" emissive="#04060a" emissiveIntensity={0.16} metalness={0.18} roughness={0.32} />
        </mesh>
        <EventHorizon radius={hero ? node.radius * 1.22 : node.radius} color={node.color} />
      </group>
      <MeteorField count={hero ? 8 : 4} spread={node.radius * (hero ? 6.2 : 4.2)} center={node.position} />
    </group>
  );
}

function SolarSystemNode({ node }) {
  const starRef = useRef(null);
  const orbitRef = useRef([]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (starRef.current) starRef.current.rotation.y += delta * 0.16;
    orbitRef.current.forEach((planet, index) => {
      if (!planet) return;
      const orbit = node.orbiters[index];
      const angle = t * orbit.speed + orbit.seedAngle;
      planet.position.set(
        Math.cos(angle) * orbit.radius,
        Math.sin(angle * 0.5) * orbit.tilt,
        Math.sin(angle) * orbit.radius * 0.72,
      );
    });
  });

  return (
    <group position={node.position}>
      <mesh>
        <sphereGeometry args={[node.radius * 2.15, 32, 32]} />
        <meshBasicMaterial color="#ffd46b" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh ref={starRef}>
        <sphereGeometry args={[node.radius * 0.92, 32, 32]} />
        <meshStandardMaterial color="#ffd46b" emissive="#ffbf54" emissiveIntensity={1.2} metalness={0.15} roughness={0.38} />
      </mesh>
      {node.orbiters.map((orbit, index) => (
        <group key={orbit.key}>
          <mesh rotation={[Math.PI / 2 + orbit.tilt, 0, 0]}>
            <torusGeometry args={[orbit.radius, 0.018, 8, 108]} />
            <meshBasicMaterial color="white" transparent opacity={0.2} depthWrite={false} />
          </mesh>
          <mesh ref={(el) => { orbitRef.current[index] = el; }}>
            <sphereGeometry args={[orbit.size, 16, 16]} />
            <meshStandardMaterial color={orbit.color} emissive={orbit.color} emissiveIntensity={0.34} roughness={0.5} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DysonNode({ node }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.08;
    ref.current.rotation.y += delta * 0.12;
  });

  return (
    <group position={node.position}>
      <mesh scale={node.radius * 2.4}>
        <sphereGeometry args={[1, 30, 30]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <icosahedronGeometry args={[node.radius * 0.94, 1]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.46} metalness={0.72} roughness={0.18} />
      </mesh>
    </group>
  );
}

function RelayNode({ node }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.scale.setScalar(0.95 + Math.sin(clock.elapsedTime * 2.2 + node.position[0]) * 0.08);
  });

  return (
    <mesh ref={ref} position={node.position}>
      <sphereGeometry args={[node.radius, 10, 10]} />
      <meshBasicMaterial color={node.color} transparent opacity={0.58} depthWrite={false} />
    </mesh>
  );
}

function HeroLabels({ nodes, limit = 4 }) {
  return (
    <>
      {nodes.slice(0, limit).map((node) => (
        <Billboard key={node.key} position={[node.position[0], node.position[1] + 2.8, node.position[2]]}>
          <div className="universe-label">
            <strong>{node.label}</strong>
            <span>{node.kind}</span>
          </div>
        </Billboard>
      ))}
    </>
  );
}

function CometTrail() {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.22;
    ref.current.position.set(Math.cos(t) * 24, 10 + Math.sin(t * 1.8) * 5, Math.sin(t) * 16 - 8);
  });

  return (
    <Trail width={1.5} length={10} color={new THREE.Color('#dff8ff')} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.34, 18, 18]} />
        <meshBasicMaterial color="#f7ffff" />
      </mesh>
    </Trail>
  );
}

function CameraDrift({ heroPosition }) {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    const offsetX = Math.sin(t * 0.16) * 1.4;
    const offsetY = 8 + Math.sin(t * 0.12) * 0.8;
    const offsetZ = 27 + Math.cos(t * 0.09) * 1.4;
    camera.position.lerp(new THREE.Vector3(offsetX, offsetY, offsetZ), 0.02);
    camera.lookAt(heroPosition[0], heroPosition[1], heroPosition[2]);
  });

  return null;
}

function UniverseScene({ tier }) {
  const graph = useMemo(() => buildUniverseGraph(), []);
  const positions = useMemo(() => getNodePositionMap(graph), [graph]);
  const heroBlackhole = useMemo(
    () => graph.nodes.find((node) => node.kind === 'blackhole' && !node.route) || graph.nodes.find((node) => node.kind === 'blackhole') || graph.nodes[0],
    [graph]
  );
  const heroPosition = heroBlackhole?.position || [0, 0, 0];

  return (
    <>
      <color attach="background" args={['#030913']} />
      <fog attach="fog" args={['#04101a', 16, 108]} />
      <ambientLight intensity={1.02} />
      <directionalLight position={[8, 14, 10]} intensity={1.25} color="#e6fbff" />
      <pointLight position={[0, 2, 0]} intensity={1.65} color="#7bd9ff" />
      <pointLight position={[-18, 8, 6]} intensity={1.15} color="#9f7cff" />
      <pointLight position={[18, -6, 8]} intensity={1.05} color="#6dffb5" />
      <Stars radius={150} depth={84} count={tier.stars} factor={6.2} saturation={0} fade speed={1.1} />
      <NebulaBackdrop />
      <CinematicDustField sparkleCount={tier.sparkles} />
      <MeteorField count={tier.meteors} spread={42} center={heroPosition} />

      {graph.routeLinks.map((link) => {
        const from = positions[link.from];
        const to = positions[link.to];
        if (!from || !to) return null;
        return <RouteRibbon key={link.key} from={from} to={to} color={link.color} arc={link.arc + 0.3} faint={link.faint} />;
      })}

      {graph.nodes.map((node) => {
        if (node.kind === 'blackhole') return <BlackholeNode key={node.key} node={node} hero={node.key === heroBlackhole?.key} />;
        if (node.kind === 'solar') return <SolarSystemNode key={node.key} node={node} />;
        if (node.kind === 'dyson') return <DysonNode key={node.key} node={node} />;
        return <RelayNode key={node.key} node={node} />;
      })}

      <HeroLabels nodes={graph.heroNodes} limit={tier.labels} />
      <CometTrail />
      <CameraDrift heroPosition={heroPosition} />
    </>
  );
}

export default function CinematicUniverseCanvas({ className = '' }) {
  const tier = useDeviceTier();

  return (
    <div className={`cinematic-universe-shell ${className}`.trim()}>
      <Canvas
        camera={{ position: [0, 8, 28], fov: tier.isMobile ? 52 : 44 }}
        dpr={tier.dpr}
        gl={{ antialias: !tier.isMobile, alpha: false, powerPreference: 'high-performance' }}
      >
        <UniverseScene tier={tier} />
      </Canvas>
    </div>
  );
}
