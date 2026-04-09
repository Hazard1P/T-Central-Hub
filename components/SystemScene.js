'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';

const NAV_BUBBLES = [
  { label: 'Center', type: 'reset', position: [-1.3, 5.0, 0], note: 'Reset system view' },
  { label: 'Donate', href: '/donate', position: [0.8, 5.1, 0], note: 'Support system' },
  { label: 'Report', href: '/report-player', position: [2.9, 4.95, 0], note: 'Player reporting' }
];

const NODES = [
  {
    key: 'arma3',
    label: 'Arma3 CTH',
    address: 'tcentral.game.nfoservers.com:2302',
    description: 'Public tactical hill-control combat.',
    position: [-5.7, 2.25, 0.2],
    color: '#84ebff',
    route: '/servers/arma3-cth',
    kind: 'blackhole'
  },
  {
    key: 'rust_anchor',
    label: 'Rust Cluster',
    address: 'Lower singularity anchor',
    description: 'Main Rust cluster anchor.',
    position: [0, -3.05, 0],
    color: '#9b74ff',
    route: '/servers/rust-biweekly',
    kind: 'blackhole'
  },
  {
    key: 'rust_biweekly',
    label: 'Rust Bi-Weekly',
    address: 'tcentralrust.game.nfoservers.com:28015',
    description: 'Bi-weekly wipe cycle.',
    position: [0.5, -2.7, 0.8],
    color: '#d8ff61',
    route: '/servers/rust-biweekly',
    kind: 'node'
  },
  {
    key: 'rust_weekly',
    label: 'Rust Weekly',
    address: 'tcentralrust2.game.nfoservers.com:28015',
    description: 'Weekly fresh-start cycle.',
    position: [2.8, -3.35, -0.2],
    color: '#ff9fd9',
    route: '/servers/rust-weekly',
    kind: 'node'
  },
  {
    key: 'rust_monthly',
    label: 'Rust Monthly',
    address: 'tcentralrust3.game.nfoservers.com:28015',
    description: 'Monthly progression cycle.',
    position: [-2.4, -3.5, -0.15],
    color: '#ffd35c',
    route: '/servers/rust-monthly',
    kind: 'node'
  },
  {
    key: 'ss',
    label: 'S.S',
    address: 'synapticsystems.ca',
    description: 'Core systems link.',
    position: [5.15, 2.5, -0.45],
    color: '#ffd15c',
    route: 'https://synapticsystems.ca',
    external: true,
    kind: 'dyson'
  },
  {
    key: 'nfo',
    label: 'Affiliate Star',
    address: 'nfoservers.com',
    description: 'Hosting affiliate and provider link.',
    position: [7.8, -2.8, 0.35],
    color: '#6affc4',
    route: 'https://www.nfoservers.com/?aff=A-J4QVQU',
    external: true,
    kind: 'star'
  },
  {
    key: 'ns',
    label: 'National Security Star',
    address: 'canada.ca',
    description: 'Government of Canada reporting resource.',
    position: [7.15, 4.15, -0.55],
    color: '#fff3a0',
    route: 'https://www.canada.ca/en/security-intelligence-service/corporate/reporting-national-security-information.html',
    external: true,
    kind: 'star'
  },
  {
    key: 'report',
    label: 'Player Reporting',
    address: 'Moderation route',
    description: 'Player misconduct and rule-reporting route.',
    position: [5.9, -0.3, 0.25],
    color: '#ff8a8a',
    route: '/report-player',
    kind: 'node'
  }
];

function formatStatus(status) {
  if (!status) return 'Status unavailable';
  if (status.online === true) return `${status.players ?? 0} / ${status.maxPlayers ?? '?'}`;
  if (status.online === false) return 'Offline';
  return 'Status unavailable';
}

function MatterStream({ radius = 2.7, color = '#8a69ff', speed = 0.2, tilt = [Math.PI / 2.4, 0, 0], density = 40 }) {
  const ref = useRef();
  const particles = useMemo(() => {
    return Array.from({ length: density }, (_, i) => {
      const angle = (i / density) * Math.PI * 2;
      return {
        x: Math.cos(angle) * (radius + Math.sin(i * 1.7) * 0.18),
        y: Math.cos(i * 0.8) * 0.08,
        z: Math.sin(angle) * (radius + Math.sin(i * 1.7) * 0.18),
        s: 0.04 + (i % 4) * 0.008
      };
    });
  }, [density, radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <group ref={ref} rotation={tilt}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={p.s}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function BlackHole({ node, onSelect, label, sublabel, coreColor, ringColor }) {
  const group = useRef();
  const disc = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (disc.current) disc.current.rotation.z += delta * 0.4;
  });

  return (
    <group
      ref={group}
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      <MatterStream radius={2.8} color={coreColor} speed={0.12} tilt={[Math.PI / 2.46, 0.1, 0]} density={42} />
      <MatterStream radius={2.2} color={ringColor} speed={-0.18} tilt={[Math.PI / 2.25, -0.18, 0.18]} density={28} />
      <mesh>
        <sphereGeometry args={[0.92, 48, 48]} />
        <meshStandardMaterial color="#020409" emissive="#09111d" emissiveIntensity={1.0} />
      </mesh>
      <mesh ref={disc} rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[1.7, 0.25, 22, 140]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={1.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[2.22, 0.07, 16, 140]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.7} />
      </mesh>
      <pointLight position={[0, 0, 0]} color={coreColor} intensity={18} distance={12} />
      <Html position={[0, node.key === 'rust_anchor' ? -1.95 : 1.55, 0]} center distanceFactor={10}>
        <button className="map-anchor-label clickable" onClick={() => onSelect(node)}>
          <span className="anchor-title">{label}</span>
          <span className="anchor-copy">{sublabel}</span>
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
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (ringA.current) ringA.current.rotation.x += delta * 0.44;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.32;
    if (ringC.current) ringC.current.rotation.z += delta * 0.52;
  });

  return (
    <group position={node.position} ref={group} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={1.9} />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[0.9, 0.03, 12, 120]} />
        <meshStandardMaterial color="#ffe694" emissive="#ffe694" emissiveIntensity={1.1} />
      </mesh>
      <mesh ref={ringB} rotation={[1.08, 0.25, 0.18]}>
        <torusGeometry args={[1.18, 0.025, 12, 120]} />
        <meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={0.95} />
      </mesh>
      <mesh ref={ringC} rotation={[0.22, 0.74, 1.0]}>
        <torusGeometry args={[1.46, 0.02, 12, 120]} />
        <meshStandardMaterial color="#fff4c1" emissive="#fff4c1" emissiveIntensity={0.85} />
      </mesh>
      <Html position={[0, -1.36, 0]} center distanceFactor={10}>
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
    if (halo.current) halo.current.rotation.y += delta * 0.55;
  });

  return (
    <group position={node.position} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh ref={core}>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={1.95} />
      </mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.0, 0.024, 12, 100]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={1.0} />
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

function SectorRing({ position, radius, color, label }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 10, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <Html position={[0, radius + 0.55, 0]} center>
        <div className="sector-label">{label}</div>
      </Html>
    </group>
  );
}

function ConstellationLines() {
  const geometry = useMemo(() => {
    const ordered = [
      new THREE.Vector3(...NODES.find((n) => n.key === 'rust_biweekly').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'rust_monthly').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'rust_weekly').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'rust_anchor').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'arma3').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'report').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'ss').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'ns').position),
      new THREE.Vector3(...NODES.find((n) => n.key === 'nfo').position)
    ];
    const curve = new THREE.CatmullRomCurve3(ordered, false, 'catmullrom', 0.22);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(300));
  }, []);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#71e9ff" transparent opacity={0.35} />
    </line>
  );
}

function BubbleNav({ onBubble }) {
  return (
    <>
      {NAV_BUBBLES.map((bubble) => (
        <Html key={bubble.label} position={bubble.position} center distanceFactor={10}>
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
    mesh.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 1.15 + node.position[0]) * 0.08;
    mesh.current.rotation.y += 0.012;
  });

  return (
    <group position={node.position}>
      <Trail width={0.42} length={2.4} color={glowColor} attenuation={(t) => t * t}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => { e.stopPropagation(); onHover(node.key); }}
          onPointerOut={(e) => { e.stopPropagation(); onLeave(); }}
          onClick={(e) => { e.stopPropagation(); onSelect(node); }}
        >
          <icosahedronGeometry args={[selected ? 0.33 : 0.28, 1]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={selected ? 1.6 : 1.05} />
        </mesh>
      </Trail>
      <mesh>
        <sphereGeometry args={[selected ? 0.62 : 0.52, 20, 20]} />
        <meshBasicMaterial color={glowColor} transparent opacity={selected ? 0.16 : 0.09} />
      </mesh>
      <Html center distanceFactor={8.5} position={[0, selected ? 0.96 : 0.82, 0]}>
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

function Scene({ statuses, onSelect, onBubble, resetTick }) {
  const [hovered, setHovered] = useState('rust_biweekly');

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 6, 4]} intensity={1.45} color="#b9efff" />
      <pointLight position={[-6, 3, 4]} intensity={14} color="#6fdfff" distance={18} />
      <pointLight position={[6, 2, -2]} intensity={10} color="#b78dff" distance={18} />
      <fog attach="fog" args={['#060e16', 12, 28]} />
      <Stars radius={70} depth={30} count={3000} factor={4.2} saturation={0} fade speed={0.8} />

      <group rotation={[-0.15, -0.08, 0]}>
        <SectorRing position={[-5.7, 2.25, 0.2]} radius={3.1} color="#58dfff" label="Arma Sector" />
        <SectorRing position={[0, -3.05, 0]} radius={3.85} color="#b78dff" label="Rust Sector" />
        <SectorRing position={[5.15, 2.5, -0.45]} radius={2.7} color="#ffd15c" label="Support Sector" />

        <ConstellationLines />
        <BubbleNav onBubble={onBubble} />

        <BlackHole
          node={NODES.find((n) => n.key === 'rust_anchor')}
          onSelect={onSelect}
          label="Rust Cluster"
          sublabel="Lower singularity anchor"
          coreColor="#8e71ff"
          ringColor="#86e7ff"
        />
        <BlackHole
          node={NODES.find((n) => n.key === 'arma3')}
          onSelect={onSelect}
          label="Arma3 Black Hole"
          sublabel="Upper tactical anchor"
          coreColor="#00eaff"
          ringColor="#8beaff"
        />
        <DysonSphere node={NODES.find((n) => n.key === 'ss')} onSelect={onSelect} />
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
        enablePan
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={25}
        autoRotate={false}
        zoomSpeed={0.92}
        rotateSpeed={0.62}
        panSpeed={0.66}
        maxPolarAngle={Math.PI * 0.9}
        minPolarAngle={Math.PI * 0.08}
      />
      <CameraReset tick={resetTick} />
    </>
  );
}

function CameraReset({ tick }) {
  const { camera, controls } = useThreeBridge();
  useEffectReset(camera, controls, tick);
  return null;
}

function useThreeBridge() {
  const state = require('@react-three/fiber').useThree();
  return state;
}

function useEffectReset(camera, controls, tick) {
  const React = require('react');
  React.useEffect(() => {
    camera.position.set(0, 1.45, 11);
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [camera, controls, tick]);
}

function FocusPanel({ item, statuses, onClose, onOpen }) {
  if (!item) return null;
  const status = item.key ? statuses?.[item.key] : null;

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
          <div className="status-row">
            <span>Status</span>
            <strong>{status.online === true ? 'Online' : status.online === false ? 'Offline' : 'Unavailable'}</strong>
          </div>
          <div className="status-row">
            <span>Players</span>
            <strong>{formatStatus(status)}</strong>
          </div>
          {status.map ? (
            <div className="status-row">
              <span>Map</span>
              <strong>{status.map}</strong>
            </div>
          ) : null}
          {status.source ? <div className="status-note">{status.source}</div> : null}
        </div>
      ) : null}
      <div className="button-column">
        <button className="button primary" onClick={() => onOpen(item)}>
          Open destination
        </button>
        <button className="button secondary" onClick={onClose}>
          Clear selection
        </button>
      </div>
    </div>
  );
}

function SystemOverlay({ loading, mode }) {
  return (
    <div className="system-overlay minimal">
      <div className="overlay-status">
        <span>{loading ? 'Loading status layer…' : mode === 'remote' ? 'Live status layer connected' : 'Status layer ready — source not configured'}</span>
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

    setSelected({
      label: bubble.label,
      address: bubble.note,
      description: bubble.note,
      href: bubble.href,
      route: bubble.href
    });
  };

  return (
    <div className="system-page">
      <SystemOverlay loading={loading} mode={mode} />
      <div className="interactive-map-stage full">
        <Canvas camera={{ position: [0, 1.45, 11], fov: 46 }}>
          <Scene
            statuses={statuses}
            onSelect={setSelected}
            onBubble={onBubble}
            resetTick={resetTick}
          />
        </Canvas>

        <FocusPanel item={selected} statuses={statuses} onClose={() => setSelected(null)} onOpen={openNode} />

        {transition ? (
          <div className="transition-overlay">
            <div className="transition-core" />
            <div className="transition-copy">Entering {transition}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
