'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Line, OrbitControls, Sparkles, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { buildUniverseGraph, getNodePositionMap } from '@/lib/universeEngine';

function CinematicDustField() {
  const group = useRef(null);
  const clouds = [
    { position: [-16, 8, -26], scale: [18, 10, 1], color: '#7f6dff', opacity: 0.16 },
    { position: [18, -6, -22], scale: [16, 9, 1], color: '#5fdcff', opacity: 0.12 },
    { position: [4, 14, -30], scale: [24, 11, 1], color: '#ffbf66', opacity: 0.08 },
  ];

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.01;
      group.current.rotation.z += delta * 0.004;
    }
  });

  return (
    <group ref={group}>
      {clouds.map((cloud) => (
        <mesh key={cloud.position.join(':')} position={cloud.position} scale={cloud.scale}>
          <planeGeometry args={[1, 1, 16, 16]} />
          <meshBasicMaterial color={cloud.color} transparent opacity={cloud.opacity} depthWrite={false} />
        </mesh>
      ))}
      <Sparkles count={190} scale={[52, 32, 38]} size={2.8} speed={0.18} opacity={0.75} />
    </group>
  );
}

function RouteRibbon({ from, to, color = '#7fe7ff', arc = 1.8, faint = false }) {
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
      lineWidth={faint ? 0.7 : 1.35}
      transparent
      opacity={faint ? 0.22 : 0.48}
    />
  );
}

function BlackholeNode({ node, simplified = false }) {
  const ref = useRef(null);
  const ringA = useRef(null);
  const ringB = useRef(null);
  const flare = useRef(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (ref.current) ref.current.rotation.y += delta * 0.18;
    if (ringA.current) ringA.current.rotation.z += delta * 0.72;
    if (ringB.current) ringB.current.rotation.x -= delta * 0.46;
    if (flare.current) {
      const pulse = 1 + Math.sin(t * 1.9 + node.position[0]) * 0.08;
      flare.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={node.position}>
      <mesh ref={flare}>
        <sphereGeometry args={[node.radius * 1.9, 32, 32]} />
        <meshBasicMaterial color={node.color} transparent opacity={simplified ? 0.08 : 0.12} depthWrite={false} />
      </mesh>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[node.radius * 0.44, 32, 32]} />
          <meshStandardMaterial color="#020409" emissive="#030509" emissiveIntensity={0.12} metalness={0.15} roughness={0.35} />
        </mesh>
        <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[node.radius, node.radius * 0.28, 28, 140]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.82} depthWrite={false} />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 2.4, Math.PI / 6, 0]}>
          <torusGeometry args={[node.radius * 1.32, node.radius * 0.08, 16, 120]} />
          <meshBasicMaterial color="#d7f7ff" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

function SolarSystemNode({ node, simplified = false }) {
  const starRef = useRef(null);
  const orbitRef = useRef([]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (starRef.current) starRef.current.rotation.y += delta * 0.14;
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
        <sphereGeometry args={[node.radius * 1.95, 32, 32]} />
        <meshBasicMaterial color="#ffd46b" transparent opacity={simplified ? 0.06 : 0.1} depthWrite={false} />
      </mesh>
      <mesh ref={starRef}>
        <sphereGeometry args={[node.radius * 0.9, 32, 32]} />
        <meshStandardMaterial color="#ffd46b" emissive="#ffbf54" emissiveIntensity={1.1} metalness={0.15} roughness={0.38} />
      </mesh>
      {node.orbiters.map((orbit, index) => (
        <group key={orbit.key}>
          <mesh rotation={[Math.PI / 2 + orbit.tilt, 0, 0]}>
            <torusGeometry args={[orbit.radius, 0.015, 8, 96]} />
            <meshBasicMaterial color="white" transparent opacity={0.16} depthWrite={false} />
          </mesh>
          <mesh ref={(el) => { orbitRef.current[index] = el; }}>
            <sphereGeometry args={[orbit.size, 16, 16]} />
            <meshStandardMaterial color={orbit.color} emissive={orbit.color} emissiveIntensity={0.3} roughness={0.5} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DysonNode({ node }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.08;
      ref.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group position={node.position}>
      <mesh scale={node.radius * 2.2}>
        <sphereGeometry args={[1, 30, 30]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <icosahedronGeometry args={[node.radius * 0.9, 1]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.44} metalness={0.72} roughness={0.18} />
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
      <meshBasicMaterial color={node.color} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
}

function HeroLabels({ nodes }) {
  return (
    <>
      {nodes.slice(0, 4).map((node) => (
        <Billboard key={node.key} position={[node.position[0], node.position[1] + node.radius * 2.6, node.position[2]]}>
          <mesh>
            <planeGeometry args={[2.8, 0.56]} />
            <meshBasicMaterial color="#9fe7ff" transparent opacity={0.08} />
          </mesh>
        </Billboard>
      ))}
    </>
  );
}

function CometTrail() {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.12;
    ref.current.position.set(
      Math.cos(t * Math.PI * 2) * 18,
      4 + Math.sin(t * Math.PI * 4) * 6,
      Math.sin(t * Math.PI * 2) * 10 - 6,
    );
  });

  return (
    <Trail width={1.2} length={8} color={'#7fe7ff'} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshBasicMaterial color="#7fe7ff" />
      </mesh>
    </Trail>
  );
}

function Scene({ mode = 'landing' }) {
  const graph = useMemo(() => buildUniverseGraph(), []);
  const positions = useMemo(() => getNodePositionMap(graph), [graph]);
  const anchors = mode === 'landing' ? graph.heroNodes.slice(0, 10) : graph.nodes;
  const relays = mode === 'landing' ? graph.nodes.filter((node) => node.generated).slice(0, 10) : graph.nodes.filter((node) => node.generated);
  const simplified = mode === 'landing';

  return (
    <>
      <color attach="background" args={['#020611']} />
      <fog attach="fog" args={['#040913', 26, 120]} />
      <ambientLight intensity={0.95} />
      <pointLight position={[10, 12, 8]} intensity={1.4} color="#dff8ff" />
      <pointLight position={[-16, 4, 4]} intensity={1.1} color="#8f6dff" />
      <pointLight position={[16, -8, 8]} intensity={0.95} color="#6dffb5" />
      <Stars radius={160} depth={80} count={mode === 'landing' ? 6800 : 9200} factor={5.8} saturation={0} fade speed={1.2} />
      <CinematicDustField />
      <Sparkles count={mode === 'landing' ? 160 : 260} scale={[64, 40, 48]} size={3.2} speed={0.24} opacity={0.7} />

      {graph.routeLinks.map((link) => {
        const from = positions[link.from];
        const to = positions[link.to];
        if (!from || !to) return null;
        return <RouteRibbon key={link.key} from={from} to={to} color={link.color} arc={link.arc} faint={simplified && link.faint} />;
      })}

      {anchors.map((node) => {
        if (node.kind === 'blackhole') return <BlackholeNode key={node.key} node={node} simplified={simplified} />;
        if (node.kind === 'solar') return <SolarSystemNode key={node.key} node={node} simplified={simplified} />;
        if (node.kind === 'dyson') return <DysonNode key={node.key} node={node} />;
        return <RelayNode key={node.key} node={node} />;
      })}

      {relays.map((node) => <RelayNode key={node.key} node={node} />)}

      <CometTrail />

      <HeroLabels nodes={graph.heroNodes} />
      <OrbitControls enablePan={false} enableZoom={mode !== 'landing'} autoRotate={mode === 'landing'} autoRotateSpeed={0.18} minDistance={14} maxDistance={90} />
    </>
  );
}

export default function CinematicUniverseCanvas({ mode = 'landing', className = '' }) {
  return (
    <div className={`cinematic-universe-shell ${className}`.trim()}>
      <Canvas camera={{ position: mode === 'landing' ? [0, 6, 28] : [0, 8, 26], fov: mode === 'landing' ? 44 : 48 }} dpr={[1, 1.6]}>
        <Scene mode={mode} />
      </Canvas>
    </div>
  );
}
