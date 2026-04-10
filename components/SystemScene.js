'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Trail, Line } from '@react-three/drei';
import * as THREE from 'three';

const NAV_BUBBLES = [
  { label: 'Center', type: 'reset', position: [-3.4, 9.6, 0], note: 'Reset system view' },
  { label: 'Donate', href: '/donate', position: [0, 10.1, 0], note: 'Support system' },
  { label: 'Report', href: '/report-player', position: [3.4, 9.6, 0], note: 'Player reporting' },
  { label: 'Free Fly', type: 'freefly', position: [6.9, 9.3, 0], note: 'Toggle WASD flight' }
];

const NODES = [
  { key: 'arma3', label: 'Arma3 CTH', address: 'tcentral.game.nfoservers.com:2302', description: 'Public tactical hill-control combat.', position: [-9.4, 3.0, 0], color: '#7fe7ff', route: '/servers/arma3-cth', kind: 'blackhole' },
  { key: 'sbox', label: 'S&Box', address: 'sbox.game', description: 'External S&Box route.', position: [0, 8.2, 0], color: '#7cd6ff', route: 'https://sbox.game/', external: true, kind: 'blackhole' },
  { key: 'rust_anchor', label: 'T-Central Hub', address: 'Lower singularity anchor', description: 'Main Rust cluster anchor.', position: [0, -6.0, 0], color: '#9f7cff', route: '/servers/rust-biweekly', kind: 'blackhole' },
  { key: 'deep_blackhole', label: 'Deep Black Hole', address: 'Standalone system anchor', description: 'Independent black hole added from the map concept.', position: [-12.2, -5.8, -0.3], color: '#c4d4ff', kind: 'blackhole' },
  { key: 'solar_system', label: 'Solar System', address: 'Sun + 9 planets', description: 'Solar system locked into the T-Central Hub zone with nine orbiting planets.', position: [0, 0.2, 1.0], color: '#ffd46b', kind: 'solar' },
  { key: 'rust_biweekly', label: 'Rust Bi-Weekly', address: 'tcentralrust.game.nfoservers.com:28015', description: 'Bi-weekly wipe cycle.', position: [0, -3.8, 1.35], color: '#d8ff61', route: '/servers/rust-biweekly', kind: 'node' },
  { key: 'rust_weekly', label: 'Rust Weekly', address: 'tcentralrust2.game.nfoservers.com:28015', description: 'Weekly fresh-start cycle.', position: [4.9, -6.7, -0.45], color: '#ff9fd9', route: '/servers/rust-weekly', kind: 'node' },
  { key: 'rust_monthly', label: 'Rust Monthly', address: 'tcentralrust3.game.nfoservers.com:28015', description: 'Monthly progression cycle.', position: [-4.9, -6.7, -0.45], color: '#ffd35c', route: '/servers/rust-monthly', kind: 'node' },
  { key: 'ss', label: 'S.S', address: 'synapticsystems.ca', description: 'Core systems link.', position: [9.4, 3.0, 0], color: '#ffd15c', route: 'https://synapticsystems.ca', external: true, kind: 'dyson' },
  { key: 'nfo', label: 'Affiliate Star', address: 'nfoservers.com', description: 'Hosting affiliate and provider link.', position: [9.8, -2.8, 0.25], color: '#6affc4', route: 'https://www.nfoservers.com/?aff=A-J4QVQU', external: true, kind: 'star' },
  { key: 'ns', label: 'National Security Star', address: 'canada.ca', description: 'Government of Canada reporting resource.', position: [9.6, 8.0, -0.25], color: '#fff3a0', route: 'https://www.canada.ca/en/security-intelligence-service/corporate/reporting-national-security-information.html', external: true, kind: 'star' },
  { key: 'report', label: 'Player Reporting', address: 'Moderation route', description: 'Player misconduct and rule-reporting route.', position: [12.0, -1.2, 0.15], color: '#ff8a8a', route: '/report-player', kind: 'node' }
];

function formatStatus(status) {
  if (!status) return 'Status unavailable';
  if (status.online === true) return `${status.players ?? 0} / ${status.maxPlayers ?? '?'}`;
  if (status.online === false) return 'Offline';
  return 'Status unavailable';
}

function DynamicBackgroundField() {
  const group = useRef();
  const a = useRef();
  const b = useRef();
  const c = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.006;
    if (a.current) a.current.rotation.z += delta * 0.01;
    if (b.current) b.current.rotation.z -= delta * 0.008;
    if (c.current) c.current.rotation.y += delta * 0.007;
  });

  return (
    <group ref={group}>
      <mesh ref={a} position={[-18, 10, -18]}>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial color="#6748d7" transparent opacity={0.08} />
      </mesh>
      <mesh ref={b} position={[16, -8, -20]}>
        <sphereGeometry args={[11, 32, 32]} />
        <meshBasicMaterial color="#3fc4ea" transparent opacity={0.065} />
      </mesh>
      <mesh ref={c} position={[0, 18, -28]}>
        <sphereGeometry args={[12.5, 32, 32]} />
        <meshBasicMaterial color="#f4cf6a" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function CameraReset({ tick }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    camera.position.set(0, 1.4, 26);
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [camera, controls, tick]);
  return null;
}

function FreeFlyRig({ enabled, resetTick }) {
  const { camera, controls } = useThree();
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    const onKeyDown = (e) => { keys.current[e.code] = true; };
    const onKeyUp = (e) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    velocity.current.set(0, 0, 0);
  }, [resetTick]);

  useEffect(() => {
    if (controls) controls.enablePan = !enabled;
  }, [enabled, controls]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const input = new THREE.Vector3(
      (keys.current['KeyD'] ? 1 : 0) - (keys.current['KeyA'] ? 1 : 0),
      (keys.current['Space'] ? 1 : 0) - (keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? 1 : 0),
      (keys.current['KeyS'] ? 1 : 0) - (keys.current['KeyW'] ? 1 : 0)
    );

    if (input.lengthSq() > 0) {
      input.normalize();

      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.normalize();

      const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

      const move = new THREE.Vector3();
      move.addScaledVector(right, input.x);
      move.addScaledVector(camera.up, input.y);
      move.addScaledVector(forward, input.z);

      velocity.current.lerp(move.normalize().multiplyScalar(13), 0.14);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.1);
    }

    camera.position.addScaledVector(velocity.current, delta);

    if (controls) {
      const look = new THREE.Vector3();
      camera.getWorldDirection(look);
      controls.target.copy(camera.position).add(look.multiplyScalar(10));
      controls.update();
    }
  });

  return null;
}

function OrbitalMatter({ radius = 2.9, color = '#8f76ff', speed = 0.14, tilt = [Math.PI / 2.4, 0, 0], count = 44, spread = 0.16 }) {
  const ref = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + Math.sin(i * 1.87) * spread;
      return {
        position: [Math.cos(angle) * r, Math.cos(i * 0.8) * 0.08, Math.sin(angle) * r],
        scale: 0.03 + (i % 4) * 0.008,
      };
    });
  }, [count, radius, spread]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <group ref={ref} rotation={tilt}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function BlackHoleAnchor({ node, onSelect, title, subtitle, coreColor, ringColor, labelOffset = [0, 1.55, 0], matterRadius = 3.2 }) {
  const group = useRef();
  const disc = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
    if (disc.current) disc.current.rotation.z += delta * 0.36;
  });

  return (
    <group position={node.position} ref={group} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <OrbitalMatter radius={matterRadius} color={coreColor} speed={0.10} tilt={[Math.PI / 2.46, 0.12, 0]} count={44} />
      <OrbitalMatter radius={matterRadius - 0.8} color={ringColor} speed={-0.16} tilt={[Math.PI / 2.22, -0.15, 0.18]} count={28} spread={0.12} />
      <mesh>
        <sphereGeometry args={[0.95, 56, 56]} />
        <meshStandardMaterial color="#020409" emissive="#0b1220" emissiveIntensity={1.0} />
      </mesh>
      <mesh ref={disc} rotation={[Math.PI / 2.34, 0, 0]}>
        <torusGeometry args={[1.8, 0.2, 20, 140]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={1.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2.34, 0, 0]}>
        <torusGeometry args={[2.35, 0.06, 16, 140]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.72} />
      </mesh>
      <pointLight position={[0, 0, 0]} color={coreColor} intensity={18} distance={14} />
      <Html position={labelOffset} center distanceFactor={11}>
        <button className="map-anchor-label clickable" onClick={() => onSelect(node)}>
          <span className="anchor-title">{title}</span>
          <span className="anchor-copy">{subtitle}</span>
        </button>
      </Html>
    </group>
  );
}

function DysonSphere({ node, onSelect }) {
  const group = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const ringC = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.16;
    if (ringA.current) ringA.current.rotation.x += delta * 0.42;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.3;
    if (ringC.current) ringC.current.rotation.z += delta * 0.48;
  });

  return (
    <group position={node.position} ref={group} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={1.95} />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[0.95, 0.03, 12, 120]} />
        <meshStandardMaterial color="#ffe694" emissive="#ffe694" emissiveIntensity={1.1} />
      </mesh>
      <mesh ref={ringB} rotation={[1.05, 0.25, 0.16]}>
        <torusGeometry args={[1.22, 0.024, 12, 120]} />
        <meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={0.95} />
      </mesh>
      <mesh ref={ringC} rotation={[0.2, 0.72, 1.0]}>
        <torusGeometry args={[1.48, 0.02, 12, 120]} />
        <meshStandardMaterial color="#fff4c1" emissive="#fff4c1" emissiveIntensity={0.85} />
      </mesh>
      <Html position={[0, -1.4, 0]} center distanceFactor={10}>
        <button className="map-anchor-label clickable" onClick={() => onSelect(node)}>
          <span className="anchor-title">S.S</span>
          <span className="anchor-copy">Dyson sphere link</span>
        </button>
      </Html>
    </group>
  );
}

function StarNode({ node, onSelect }) {
  const core = useRef();
  const halo = useRef();

  useFrame((state, delta) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.3) * 0.12;
    if (core.current) core.current.scale.setScalar(pulse);
    if (halo.current) halo.current.rotation.y += delta * 0.44;
  });

  return (
    <group position={node.position} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh ref={core}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={1.95} />
      </mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.0, 0.022, 12, 100]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.95} />
      </mesh>
      <pointLight position={[0, 0, 0]} color={node.color} intensity={10} distance={9} />
      <Html position={[0, 1.14, 0]} center distanceFactor={10}>
        <button className="map-anchor-label clickable" onClick={() => onSelect(node)}>
          <span className="anchor-title">{node.label}</span>
          <span className="anchor-copy">{node.address}</span>
        </button>
      </Html>
    </group>
  );
}

function Planet({ planet, index }) {
  const planetRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * planet.speed + index;
    const x = Math.cos(t) * planet.orbit;
    const z = Math.sin(t) * planet.orbit;
    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
      planetRef.current.rotation.y += 0.02;
    }
    if (ringRef.current) {
      ringRef.current.position.set(x, 0, z);
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[planet.radius, 20, 20]} />
        <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.35} />
      </mesh>
      {planet.ring ? (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[planet.radius * 1.65, planet.radius * 0.18, 10, 80]} />
          <meshStandardMaterial color="#e8d7ab" emissive="#e8d7ab" emissiveIntensity={0.25} />
        </mesh>
      ) : null}
    </>
  );
}

function SolarSystem({ node, onSelect }) {
  const group = useRef();
  const sunRef = useRef();

  const planets = useMemo(() => ([
    { name: 'Mercury', radius: 0.06, orbit: 0.9, speed: 1.3, color: '#c7b39a' },
    { name: 'Venus', radius: 0.09, orbit: 1.25, speed: 1.05, color: '#d8b47a' },
    { name: 'Earth', radius: 0.1, orbit: 1.65, speed: 0.88, color: '#5fb7ff' },
    { name: 'Mars', radius: 0.08, orbit: 2.0, speed: 0.76, color: '#d86d54' },
    { name: 'Jupiter', radius: 0.2, orbit: 2.55, speed: 0.54, color: '#d9b48b' },
    { name: 'Saturn', radius: 0.16, orbit: 3.15, speed: 0.43, color: '#e0c582', ring: true },
    { name: 'Uranus', radius: 0.12, orbit: 3.75, speed: 0.34, color: '#9ce3ff' },
    { name: 'Neptune', radius: 0.12, orbit: 4.25, speed: 0.28, color: '#628dff' },
    { name: 'Pluto', radius: 0.05, orbit: 4.8, speed: 0.22, color: '#b3b3c9' },
  ]), []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.04;
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group position={node.position} ref={group} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#ffd46b" emissive="#ffd46b" emissiveIntensity={2.2} />
      </mesh>
      {planets.map((planet, i) => (
        <group key={planet.name}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[planet.orbit, 0.008, 8, 120]} />
            <meshBasicMaterial color="white" transparent opacity={0.12} />
          </mesh>
          <Planet planet={planet} index={i} />
        </group>
      ))}
      <pointLight position={[0, 0, 0]} color="#ffd46b" intensity={18} distance={10} />
      <Html position={[0, -1.25, 0]} center distanceFactor={11}>
        <button className="map-anchor-label clickable" onClick={() => onSelect(node)}>
          <span className="anchor-title">Solar System</span>
          <span className="anchor-copy">Sun + 9 planets</span>
        </button>
      </Html>
    </group>
  );
}

function SectorRing({ position, radius, color, label }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.06;
  });

  return (
    <group position={position}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.018, 10, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.26} />
      </mesh>
      <Html position={[0, radius + 0.65, 0]} center>
        <div className="sector-label">{label}</div>
      </Html>
    </group>
  );
}

function ConstellationLines() {
  const pointGroups = useMemo(() => ([
    [NODES.find((n) => n.key === 'arma3').position, NODES.find((n) => n.key === 'sbox').position, NODES.find((n) => n.key === 'ss').position, NODES.find((n) => n.key === 'ns').position],
    [NODES.find((n) => n.key === 'rust_anchor').position, NODES.find((n) => n.key === 'rust_biweekly').position, NODES.find((n) => n.key === 'rust_weekly').position, NODES.find((n) => n.key === 'rust_monthly').position],
    [NODES.find((n) => n.key === 'ss').position, NODES.find((n) => n.key === 'report').position, NODES.find((n) => n.key === 'nfo').position],
    [NODES.find((n) => n.key === 'deep_blackhole').position, NODES.find((n) => n.key === 'rust_anchor').position, NODES.find((n) => n.key === 'solar_system').position]
  ]), []);

  return (
    <>
      {pointGroups.map((group, i) => (
        <Line key={i} points={group} color="#71e9ff" transparent opacity={0.22} lineWidth={1} />
      ))}
    </>
  );
}

function BubbleNav({ onBubble }) {
  return (
    <>
      {NAV_BUBBLES.map((bubble) => (
        <Html key={bubble.label} position={bubble.position} center distanceFactor={11}>
          <button className="bubble-nav" onClick={() => onBubble(bubble)}>
            <strong>{bubble.label}</strong>
            <span>{bubble.note}</span>
          </button>
        </Html>
      ))}
    </>
  );
}

function StatusNode({ node, status, selected, onHover, onLeave, onSelect }) {
  const mesh = useRef();
  const glowColor = status?.online === true ? '#73ff9e' : status?.online === false ? '#ff7d7d' : node.color;

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 1.05 + node.position[0]) * 0.06;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <group position={node.position}>
      <Trail width={0.4} length={2.2} color={glowColor} attenuation={(t) => t * t}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => { e.stopPropagation(); onHover(node.key); }}
          onPointerOut={(e) => { e.stopPropagation(); onLeave(); }}
          onClick={(e) => { e.stopPropagation(); onSelect(node); }}
        >
          <icosahedronGeometry args={[selected ? 0.32 : 0.27, 1]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={selected ? 1.55 : 1.0} />
        </mesh>
      </Trail>
      <mesh>
        <sphereGeometry args={[selected ? 0.60 : 0.50, 20, 20]} />
        <meshBasicMaterial color={glowColor} transparent opacity={selected ? 0.15 : 0.08} />
      </mesh>
      <Html center distanceFactor={8.8} position={[0, selected ? 0.92 : 0.78, 0]}>
        <button
          className={`map-node-label ${selected ? 'active' : ''}`}
          onMouseEnter={() => onHover(node.key)}
          onMouseLeave={onLeave}
          onClick={() => onSelect(node)}
        >
          <strong>{node.label}</strong>
          <span>{node.address}</span>
          <em>{node.description}</em>
          <small>{formatStatus(status)}</small>
        </button>
      </Html>
    </group>
  );
}

function Scene({ statuses, onSelect, onBubble, resetTick, freeFly }) {
  const [hovered, setHovered] = useState('rust_biweekly');

  return (
    <>
      <DynamicBackgroundField />
      <ambientLight intensity={1.05} />
      <directionalLight position={[5, 7, 4]} intensity={1.25} color="#bdefff" />
      <pointLight position={[-7, 3, 4]} intensity={12} color="#6fdfff" distance={18} />
      <pointLight position={[7, 3, -2]} intensity={8} color="#b78dff" distance={18} />
      <fog attach="fog" args={['#060e16', 18, 36]} />
      <Stars radius={96} depth={44} count={4200} factor={4.2} saturation={0} fade speed={0.9} />

      <group rotation={[-0.10, -0.03, 0]}>
        <SectorRing position={[-9.4, 3.0, 0]} radius={4.8} color="#58dfff" label="Arma Sector" />
        <SectorRing position={[0, 8.2, 0]} radius={3.9} color="#67d7ff" label="S&Box Sector" />
        <SectorRing position={[0, -6.0, 0]} radius={6.6} color="#9f7cff" label="T-Central Hub" />
        <SectorRing position={[9.4, 3.0, 0]} radius={4.8} color="#ffd15c" label="Support Sector" />
        <SectorRing position={[-12.2, -5.8, -0.3]} radius={4.2} color="#c4d4ff" label="Deep Anchor" />
        <SectorRing position={[0, 0.2, 1.0]} radius={4.4} color="#ffd46b" label="Solar System" />

        <ConstellationLines />
        <BubbleNav onBubble={onBubble} />

        <BlackHoleAnchor node={NODES.find((n) => n.key === 'arma3')} onSelect={onSelect} title="Arma3 Black Hole" subtitle="Tactical anchor" coreColor="#00eaff" ringColor="#8beaff" labelOffset={[0, 1.55, 0]} matterRadius={3.1} />
        <BlackHoleAnchor node={NODES.find((n) => n.key === 'sbox')} onSelect={onSelect} title="S&Box Black Hole" subtitle="Sandbox anchor" coreColor="#67d7ff" ringColor="#b6f3ff" labelOffset={[0, 1.55, 0]} matterRadius={2.7} />
        <BlackHoleAnchor node={NODES.find((n) => n.key === 'rust_anchor')} onSelect={onSelect} title="T-Central Hub" subtitle="Lower singularity anchor" coreColor="#8e71ff" ringColor="#86e7ff" labelOffset={[0, -1.95, 0]} matterRadius={3.4} />
        <BlackHoleAnchor node={NODES.find((n) => n.key === 'deep_blackhole')} onSelect={onSelect} title="Deep Black Hole" subtitle="Standalone anchor" coreColor="#d8e0ff" ringColor="#a8b8ff" labelOffset={[0, -1.9, 0]} matterRadius={2.8} />

        <DysonSphere node={NODES.find((n) => n.key === 'ss')} onSelect={onSelect} />
        <SolarSystem node={NODES.find((n) => n.key === 'solar_system')} onSelect={onSelect} />
        <StarNode node={NODES.find((n) => n.key === 'ns')} onSelect={onSelect} />
        <StarNode node={NODES.find((n) => n.key === 'nfo')} onSelect={onSelect} />

        {NODES.filter((n) => n.kind === 'node').map((node) => (
          <StatusNode
            key={node.key}
            node={node}
            status={statuses?.[node.key]}
            selected={hovered === node.key}
            onHover={setHovered}
            onLeave={() => setHovered('rust_biweekly')}
            onSelect={onSelect}
          />
        ))}
      </group>

      <OrbitControls
        makeDefault
        enablePan={!freeFly}
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={100}
        autoRotate={false}
        zoomSpeed={1.0}
        rotateSpeed={0.8}
        panSpeed={0.9}
        screenSpacePanning
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
      <CameraReset tick={resetTick} />
      <FreeFlyRig enabled={freeFly} resetTick={resetTick} />
    </>
  );
}

function FocusPanel({ item, statuses, onClose, onOpen }) {
  if (!item) return null;
  const status = item.key ? statuses?.[item.key] : null;
  const openable = Boolean(item.route || item.href);

  return (
    <div className="map-focus-panel">
      <div className="map-focus-header">
        <div>
          <p className="eyebrow">Selected node</p>
          <h4>{item.label}</h4>
        </div>
        <button className="focus-close" onClick={onClose}>×</button>
      </div>
      <p className="muted">{item.description}</p>
      <div className="focus-meta">
        <span>{item.address || item.sublabel}</span>
      </div>
      {item.key && status ? (
        <div className="focus-status">
          <div className="status-row"><span>Status</span><strong>{status.online === true ? 'Online' : status.online === false ? 'Offline' : 'Unavailable'}</strong></div>
          <div className="status-row"><span>Players</span><strong>{formatStatus(status)}</strong></div>
          {status.map ? <div className="status-row"><span>Map</span><strong>{status.map}</strong></div> : null}
          {status.source ? <div className="status-note">{status.source}</div> : null}
        </div>
      ) : null}
      <div className="button-column">
        {openable ? <button className="button primary" onClick={() => onOpen(item)}>Open destination</button> : null}
        <button className="button secondary" onClick={onClose}>Clear selection</button>
      </div>
    </div>
  );
}

function WarpOverlay({ label }) {
  return (
    <div className="transition-overlay warp-enter">
      <div className="warp-rings"><span /><span /><span /></div>
      <div className="transition-copy">Warping into {label}</div>
    </div>
  );
}

function SystemOverlay({ loading, mode, freeFly }) {
  return (
    <div className="system-overlay minimal">
      <div className="overlay-status">
        <span>
          {loading ? 'Loading status layer…' : mode === 'remote' ? 'Live status layer connected' : 'Status layer ready — source not configured'}
          {freeFly ? ' • Free Fly active' : ''}
        </span>
      </div>
    </div>
  );
}

export default function SystemScene() {
  const router = useRouter();
  const [statuses, setStatuses] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('unconfigured');
  const [transition, setTransition] = useState(null);
  const [resetTick, setResetTick] = useState(0);
  const [freeFly, setFreeFly] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/live-status', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        setStatuses(data.statuses || {});
        setMode(data.mode || 'unconfigured');
      } catch {
        if (!active) return;
        setMode('error');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const openNode = (item) => {
    const href = item.route || item.href;
    if (!href) return;
    setTransition(item.label);
    setTimeout(() => {
      if (item.external) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(href);
      }
    }, 900);
  };

  const onBubble = (bubble) => {
    if (bubble.type === 'reset') {
      setSelected(null);
      setResetTick((n) => n + 1);
      return;
    }
    if (bubble.type === 'freefly') {
      setFreeFly((v) => !v);
      setSelected({
        label: 'Free Fly Mode',
        address: 'WASD + drag mouse + Space/Shift',
        description: 'Use W A S D to move, Space to rise, Shift to descend, and drag the mouse to steer your view.',
      });
      return;
    }
    setSelected({ label: bubble.label, address: bubble.note, description: bubble.note, href: bubble.href, route: bubble.href });
  };

  return (
    <div className="system-page refined">
      <SystemOverlay loading={loading} mode={mode} freeFly={freeFly} />
      <div className="interactive-map-stage full refined-stage">
        <Canvas camera={{ position: [0, 1.4, 26], fov: 38 }}>
          <Scene statuses={statuses} onSelect={setSelected} onBubble={onBubble} resetTick={resetTick} freeFly={freeFly} />
        </Canvas>
        <FocusPanel item={selected} statuses={statuses} onClose={() => setSelected(null)} onOpen={openNode} />
        {transition ? <WarpOverlay label={transition} /> : null}
      </div>
    </div>
  );
}
