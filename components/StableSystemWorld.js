'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORLD_LAYOUT } from '@/lib/worldLayout';
import { getPrivateWorldKey } from '@/lib/securityConfig';

function DeepBlackholeAttachments({ node }) {
  const groupRef = useRef(null);
  const mapTexture = useTexture(node.mapAsset || '/cosmic-map.jpg');
  const seedTexture = useTexture(node.seedAsset || '/blackhole-anchor.jpg');

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-2.25, 1.35, -0.75]} rotation={[0, Math.PI / 8, 0]}>
        <planeGeometry args={[2.25, 3.0]} />
        <meshBasicMaterial map={mapTexture} transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[-2.25, 1.35, -0.82]} rotation={[0, Math.PI / 8, 0]}>
        <planeGeometry args={[2.45, 3.2]} />
        <meshBasicMaterial color="#b8eeff" transparent opacity={0.14} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      <mesh position={[2.05, -1.25, 0.5]} rotation={[0.18, -Math.PI / 6, 0]}>
        <planeGeometry args={[1.45, 1.45]} />
        <meshBasicMaterial map={seedTexture} transparent opacity={0.96} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[2.05, -1.25, 0.42]} rotation={[0.18, -Math.PI / 6, 0]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial color="#d0c2ff" transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.08, 16, 96]} />
        <meshBasicMaterial color={node.color || '#c4d4ff'} transparent opacity={0.52} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, Math.PI / 5, 0]}>
        <torusGeometry args={[2.8, 0.03, 12, 96]} />
        <meshBasicMaterial color={'#9fdcff'} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function RouteBeam({ from, to, color = '#67dfff' }) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 1.6;
    return [start, mid, end];
  }, [from, to]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const beamRef = useRef(null);

  useFrame(({ clock }) => {
    if (!beamRef.current) return;
    beamRef.current.material.opacity = 0.14 + Math.sin(clock.elapsedTime * 1.4) * 0.04;
  });

  return (
    <mesh ref={beamRef}>
      <tubeGeometry args={[curve, 48, 0.035, 10, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

function HaloRing({ radius = 1.8, color = '#9fdcff', speed = 0.4, tilt = 0 }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.035, 12, 72]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  );
}

function NodeVisual({ node, onSelect, selectedKey }) {
  const isBlackhole = node.kind === 'blackhole';
  const isDyson = node.kind === 'dyson';
  const isSolar = node.kind === 'solar';
  const spinRef = useRef(null);
  const auraRef = useRef(null);

  useFrame(({ clock }, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * (isBlackhole ? 0.55 : isDyson ? 0.4 : 0.2);
    }
    if (auraRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 1.8 + node.position[0]) * 0.08;
      auraRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={node.position || [0, 0, 0]}>
      <mesh ref={auraRef} scale={isBlackhole ? 1.9 : isDyson ? 1.6 : 2.15}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color={node.color || '#9fdcff'} transparent opacity={isBlackhole ? 0.08 : 0.05} />
      </mesh>

      <group ref={spinRef}>
        <mesh onClick={() => onSelect(node)} scale={isBlackhole ? 1.2 : isDyson ? 1.05 : isSolar ? 1.35 : 0.75}>
          {isBlackhole ? (
            <torusGeometry args={[0.95, 0.26, 20, 64]} />
          ) : isDyson ? (
            <icosahedronGeometry args={[0.95, 1]} />
          ) : isSolar ? (
            <sphereGeometry args={[1.1, 28, 28]} />
          ) : (
            <sphereGeometry args={[0.55, 18, 18]} />
          )}
          <meshStandardMaterial
            color={node.color || '#9fdcff'}
            emissive={node.color || '#9fdcff'}
            emissiveIntensity={isBlackhole ? 0.75 : 0.32}
            metalness={isDyson ? 0.7 : 0.25}
            roughness={isDyson ? 0.18 : 0.42}
          />
        </mesh>
      </group>

      {isBlackhole ? (
        <>
          <HaloRing radius={1.45} color={node.color || '#9fdcff'} speed={0.5} />
          <HaloRing radius={1.76} color="#d7f7ff" speed={-0.35} tilt={0.18} />
        </>
      ) : null}

      {node.key === 'deep_blackhole' ? <DeepBlackholeAttachments node={node} /> : null}

      <Html center distanceFactor={14} position={[0, isSolar ? 1.85 : 1.55, 0]}>
        <button className={`stable-node-label polished ${selectedKey === node.key ? 'is-selected' : ''}`} onClick={() => onSelect(node)}>
          <strong>{node.label}</strong>
          <span>{node.kind}</span>
          <small>{node.address}</small>
        </button>
      </Html>
    </group>
  );
}

function StableSceneContent({ onSelect, selectedKey }) {
  const nodes = useMemo(
    () => WORLD_LAYOUT.filter((node) => ['blackhole', 'dyson', 'solar'].includes(node.kind)),
    []
  );

  const primaryBeams = useMemo(
    () => [
      [nodes.find((n) => n.key === 'deep_blackhole')?.position, nodes.find((n) => n.key === 'matrixcoinexchange')?.position, '#6dffb5'],
      [nodes.find((n) => n.key === 'deep_blackhole')?.position, nodes.find((n) => n.key === 'arma3')?.position, '#7fe7ff'],
      [nodes.find((n) => n.key === 'deep_blackhole')?.position, nodes.find((n) => n.key === 'rust_anchor')?.position, '#9f7cff'],
    ].filter(([a, b]) => a && b),
    [nodes]
  );

  return (
    <>
      <color attach="background" args={['#040912']} />
      <fog attach="fog" args={['#08111b', 18, 95]} />
      <ambientLight intensity={1.05} />
      <directionalLight position={[8, 10, 6]} intensity={1.2} color="#dff8ff" />
      <pointLight position={[-10, 6, 10]} intensity={1.4} color="#9f7cff" />
      <pointLight position={[12, -2, 6]} intensity={1.1} color="#6dffb5" />
      <Stars radius={120} depth={60} count={5200} factor={5.2} saturation={0} fade speed={1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -14, 0]}>
        <circleGeometry args={[54, 60]} />
        <meshBasicMaterial color="#071019" transparent opacity={0.45} />
      </mesh>

      <mesh position={[0, 14, -24]}>
        <sphereGeometry args={[7.2, 40, 40]} />
        <meshBasicMaterial color="#11253d" transparent opacity={0.22} />
      </mesh>

      {primaryBeams.map(([from, to, color], index) => (
        <RouteBeam key={index} from={from} to={to} color={color} />
      ))}

      {nodes.map((node) => (
        <NodeVisual key={node.key} node={node} onSelect={onSelect} selectedKey={selectedKey} />
      ))}

      <OrbitControls enablePan={false} minDistance={14} maxDistance={55} />
    </>
  );
}

export default function StableSystemWorld({ lobbyMode = 'hub', steamUser = null, onSelectionChange = null }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const handleSelect = (node) => {
    setSelected(node);
    onSelectionChange?.(node);
  };

  const activeNode = selected || WORLD_LAYOUT.find((node) => node.key === 'deep_blackhole') || null;

  const handleRouteOpen = () => {
    if (!activeNode?.route) return;
    if (activeNode.external) {
      window.open(activeNode.route, '_blank', 'noopener,noreferrer');
    } else {
      router.push(activeNode.route);
    }
  };

  const highlightedTags = activeNode?.tags || ['blackhole', 'route shell', '3D anchor'];
  const perspective = steamUser?.steamid
    ? { role: lobbyMode === 'hub' ? 'Player-linked observer' : 'Private player shell', note: lobbyMode === 'hub' ? 'Steam session linked. You can inspect first, then travel routes.' : 'Private Steam world active with isolated route ownership.' }
    : { role: 'Observer shell', note: 'Spectator-first layout active. Panels remain readable while routes stay inspectable.' };
  const visibleLayers = [
    { label: 'Steam control', state: steamUser?.steamid ? 'linked' : 'guest' },
    { label: 'News & Info', state: 'active' },
    { label: 'Route focus', state: activeNode?.label || 'deep anchor' },
    { label: 'Perspective', state: perspective.role },
    { label: '3D world', state: lobbyMode === 'hub' ? 'shared' : 'private' },
  ];

  return (
    <div className="stable-system-page polished-shell">
      <div className="stable-system-backdrop" />

      <div className="stable-system-hud">
        <div className="content-card stable-card intro">
          <p className="eyebrow">Stability shell</p>
          <h3>{lobbyMode === 'hub' ? 'Multiplayer Hub shell' : 'Private World shell'}</h3>
          <p className="muted">
            This simplified world keeps the main routes, blackholes, Dyson spheres, and solar system online while the heavier 3D runtime is being stabilized.
          </p>
          <div className="focus-meta">
            <span>{lobbyMode === 'hub' ? 'Shared route layer' : getPrivateWorldKey(steamUser?.steamid)}</span>
            <span>{steamUser?.personaname || 'Guest'}</span>
          </div>
          <div className="stable-chip-row">
            <span>Deep-space anchor</span>
            <span>Steam-linked shell</span>
            <span>Shared route memory</span>
          </div>
        </div>

        <div className="content-card stable-card route">
          <p className="eyebrow">Selected route</p>
          <h3>{activeNode?.label || 'Deep Space Blackhole'}</h3>
          <p className="muted">{activeNode?.description || 'Select a node to inspect its route, anchor assets, and linked destination behavior.'}</p>
          <div className="focus-meta">
            <span>{activeNode?.address || 'Primary deep-space anchor'}</span>
            <span>{activeNode?.kind || 'blackhole'}</span>
          </div>
          <div className="stable-chip-row alt">
            {highlightedTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {activeNode?.mapAsset || activeNode?.seedAsset ? (
            <div className="stable-asset-previews">
              {activeNode?.mapAsset ? (
                <img className="stable-asset-preview wide" src={activeNode.mapAsset} alt={`${activeNode.label} map anchor`} />
              ) : null}
              {activeNode?.seedAsset ? (
                <img className="stable-asset-preview seed" src={activeNode.seedAsset} alt={`${activeNode.label} seed anchor`} />
              ) : null}
            </div>
          ) : null}
          {activeNode?.route ? (
            <button className="stable-route-button" onClick={handleRouteOpen}>
              Travel to route
            </button>
          ) : null}
        </div>

        <div className="content-card stable-card observer">
          <p className="eyebrow">Observer / Player</p>
          <h3>{perspective.role}</h3>
          <p className="muted">{perspective.note}</p>
          <div className="focus-meta">
            <span>{steamUser?.personaname || 'Guest observer'}</span>
            <span>{lobbyMode === 'hub' ? 'Shared world visibility' : 'Private world visibility'}</span>
          </div>
          <div className="stable-chip-row alt">
            <span>Inspect</span>
            <span>Travel</span>
            <span>Overlay-safe</span>
          </div>
        </div>
      </div>

      <div className="stable-layer-dock content-card">
        <div className="stable-layer-dock-head">
          <span className="eyebrow">Visible layers</span>
          <strong>System shell stack</strong>
        </div>
        <div className="stable-layer-grid">
          {visibleLayers.map((layer) => (
            <div className="stable-layer-pill" key={layer.label}>
              <span>{layer.label}</span>
              <strong>{layer.state}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="stable-world-canvas polished-canvas">
        <Canvas camera={{ position: [0, 8, 24], fov: 48 }}>
          <StableSceneContent onSelect={handleSelect} selectedKey={activeNode?.key} />
        </Canvas>
      </div>
    </div>
  );
}
