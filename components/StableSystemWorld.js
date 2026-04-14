'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Sparkles, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORLD_LAYOUT } from '@/lib/worldLayout';
import { getPrivateWorldKey } from '@/lib/securityConfig';
import { buildUniverseGraph, getNodePositionMap } from '@/lib/universeEngine';

function DeepBlackholeAttachments({ node }) {
  const groupRef = useRef(null);
  const mapTexture = useTexture(node.mapAsset || '/cosmic-map.jpg');
  const seedTexture = useTexture(node.seedAsset || '/blackhole-anchor.jpg');

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-2.45, 1.35, -0.85]} rotation={[0, Math.PI / 8, 0]}>
        <planeGeometry args={[2.35, 3.15]} />
        <meshBasicMaterial map={mapTexture} transparent opacity={0.94} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[-2.45, 1.35, -0.95]} rotation={[0, Math.PI / 8, 0]}>
        <planeGeometry args={[2.6, 3.4]} />
        <meshBasicMaterial color="#b8eeff" transparent opacity={0.14} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      <mesh position={[2.2, -1.4, 0.55]} rotation={[0.18, -Math.PI / 6, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={seedTexture} transparent opacity={0.96} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[2.2, -1.4, 0.48]} rotation={[0.18, -Math.PI / 6, 0]}>
        <planeGeometry args={[1.78, 1.78]} />
        <meshBasicMaterial color="#d0c2ff" transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RouteBeam({ from, to, color = '#67dfff', arc = 1.8, opacity = 0.18, radius = 0.04 }) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += arc;
    return [start, mid, end];
  }, [from, to, arc]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const beamRef = useRef(null);

  useFrame(({ clock }) => {
    if (!beamRef.current) return;
    beamRef.current.material.opacity = opacity + Math.sin(clock.elapsedTime * 1.4) * 0.04;
  });

  return (
    <mesh ref={beamRef}>
      <tubeGeometry args={[curve, 64, radius, 14, false]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function HaloRing({ radius = 1.8, color = '#9fdcff', speed = 0.4, tilt = 0, thickness = 0.045, opacity = 0.55 }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, thickness, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function SolarSubSystem({ node }) {
  const orbitRefs = useRef([]);
  const starRef = useRef(null);

  useFrame(({ clock }, delta) => {
    if (starRef.current) starRef.current.rotation.y += delta * 0.15;
    node.orbiters?.forEach((orbit, index) => {
      const planet = orbitRefs.current[index];
      if (!planet) return;
      const angle = clock.elapsedTime * orbit.speed + orbit.seedAngle;
      planet.position.set(
        Math.cos(angle) * orbit.radius,
        Math.sin(angle * 0.5) * orbit.tilt,
        Math.sin(angle) * orbit.radius * 0.72,
      );
    });
  });

  return (
    <group position={node.position}>
      <mesh scale={2.8}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color="#ffd46b" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={starRef}>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshStandardMaterial color="#ffd46b" emissive="#ffbf54" emissiveIntensity={0.95} roughness={0.4} metalness={0.14} />
      </mesh>
      {node.orbiters?.map((orbit, index) => (
        <group key={orbit.key}>
          <mesh rotation={[Math.PI / 2 + orbit.tilt, 0, 0]}>
            <torusGeometry args={[orbit.radius, 0.015, 8, 96]} />
            <meshBasicMaterial color="#dff8ff" transparent opacity={0.14} depthWrite={false} />
          </mesh>
          <mesh ref={(el) => { orbitRefs.current[index] = el; }}>
            <sphereGeometry args={[orbit.size, 14, 14]} />
            <meshStandardMaterial color={orbit.color} emissive={orbit.color} emissiveIntensity={0.24} roughness={0.55} metalness={0.12} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NodeVisual({ node, onSelect, selectedKey, graphNode }) {
  const isBlackhole = node.kind === 'blackhole';
  const isDyson = node.kind === 'dyson';
  const isSolar = node.kind === 'solar';
  const spinRef = useRef(null);
  const auraRef = useRef(null);

  useFrame(({ clock }, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * (isBlackhole ? 0.42 : isDyson ? 0.3 : 0.14);
    }
    if (auraRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 1.8 + node.position[0]) * 0.08;
      auraRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={node.position || [0, 0, 0]}>
      <mesh ref={auraRef} scale={isBlackhole ? 2.25 : isDyson ? 1.8 : isSolar ? 2.8 : 0.95}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color={node.color || '#9fdcff'} transparent opacity={isBlackhole ? 0.09 : isSolar ? 0.06 : 0.05} depthWrite={false} />
      </mesh>

      {isSolar ? <SolarSubSystem node={graphNode || node} /> : null}

      <group ref={spinRef}>
        {isBlackhole ? (
          <>
            <mesh onClick={() => onSelect(node)}>
              <sphereGeometry args={[0.46, 24, 24]} />
              <meshStandardMaterial color="#020409" emissive="#000000" roughness={0.32} metalness={0.2} />
            </mesh>
            <mesh onClick={() => onSelect(node)} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.08, 0.3, 28, 140]} />
              <meshBasicMaterial color={node.color || '#9fdcff'} transparent opacity={0.85} depthWrite={false} />
            </mesh>
            <mesh rotation={[Math.PI / 2.3, Math.PI / 5, 0]}>
              <torusGeometry args={[1.42, 0.06, 16, 120]} />
              <meshBasicMaterial color="#d7f7ff" transparent opacity={0.42} depthWrite={false} />
            </mesh>
          </>
        ) : isDyson ? (
          <mesh onClick={() => onSelect(node)}>
            <icosahedronGeometry args={[0.96, 1]} />
            <meshStandardMaterial color={node.color || '#9fdcff'} emissive={node.color || '#9fdcff'} emissiveIntensity={0.4} metalness={0.74} roughness={0.18} />
          </mesh>
        ) : !isSolar ? (
          <mesh onClick={() => onSelect(node)} scale={node.generated ? 0.7 : 1}>
            <sphereGeometry args={[node.generated ? 0.32 : 0.55, 18, 18]} />
            <meshStandardMaterial color={node.color || '#9fdcff'} emissive={node.color || '#9fdcff'} emissiveIntensity={node.generated ? 0.16 : 0.22} metalness={0.18} roughness={0.45} />
          </mesh>
        ) : null}
      </group>

      {isBlackhole ? (
        <>
          <HaloRing radius={1.62} color={node.color || '#9fdcff'} speed={0.46} opacity={0.5} />
          <HaloRing radius={1.94} color="#d7f7ff" speed={-0.32} tilt={0.18} thickness={0.028} opacity={0.24} />
        </>
      ) : null}

      {node.key === 'deep_blackhole' ? <DeepBlackholeAttachments node={node} /> : null}

      {!node.generated ? (
        <Html center distanceFactor={14} position={[0, isSolar ? 2.25 : 1.65, 0]}>
          <button className={`stable-node-label polished ${selectedKey === node.key ? 'is-selected' : ''}`} onClick={() => onSelect(node)}>
            <strong>{node.label}</strong>
            <span>{node.kind}</span>
            <small>{node.address}</small>
          </button>
        </Html>
      ) : null}
    </group>
  );
}

function StableSceneContent({ onSelect, selectedKey }) {
  const graph = useMemo(() => buildUniverseGraph(), []);
  const graphByKey = useMemo(() => Object.fromEntries(graph.nodes.map((node) => [node.key, node])), [graph]);
  const positions = useMemo(() => getNodePositionMap(graph), [graph]);
  const displayNodes = useMemo(
    () => WORLD_LAYOUT.filter((node) => ['blackhole', 'dyson', 'solar', 'node'].includes(node.kind)).slice(0, WORLD_LAYOUT.length),
    []
  );

  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#07111d', 20, 105]} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[8, 10, 6]} intensity={1.15} color="#dff8ff" />
      <pointLight position={[-10, 6, 10]} intensity={1.28} color="#9f7cff" />
      <pointLight position={[12, -2, 6]} intensity={1.12} color="#6dffb5" />
      <Stars radius={140} depth={72} count={8800} factor={5.8} saturation={0} fade speed={1.1} />
      <Sparkles count={240} scale={[60, 34, 44]} size={3.0} speed={0.25} opacity={0.7} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -14, 0]}>
        <circleGeometry args={[62, 72]} />
        <meshBasicMaterial color="#060d18" transparent opacity={0.56} />
      </mesh>

      <mesh position={[0, 12, -26]} scale={[2.6, 1.1, 1]}>
        <sphereGeometry args={[7.2, 40, 40]} />
        <meshBasicMaterial color="#132947" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[-18, 8, -18]} scale={[2.1, 1.0, 1]}>
        <sphereGeometry args={[5.8, 30, 30]} />
        <meshBasicMaterial color="#6b4dff" transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {graph.routeLinks.map((link) => {
        const from = positions[link.from];
        const to = positions[link.to];
        if (!from || !to) return null;
        return (
          <RouteBeam
            key={link.key}
            from={from}
            to={to}
            color={link.color}
            arc={link.arc}
            opacity={link.faint ? 0.09 : 0.18}
            radius={link.faint ? 0.02 : 0.04}
          />
        );
      })}

      {displayNodes.map((node) => (
        <NodeVisual key={node.key} node={node} graphNode={graphByKey[node.key]} onSelect={onSelect} selectedKey={selectedKey} />
      ))}

      <OrbitControls enablePan={false} minDistance={14} maxDistance={62} />
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

  return (
    <div className="stable-system-page polished-shell cinematic-system-page">
      <div className="stable-system-backdrop" />

      <div className="stable-system-hud">
        <div className="content-card stable-card intro">
          <p className="eyebrow">Stability shell</p>
          <h3>{lobbyMode === 'hub' ? 'Multiplayer Hub shell' : 'Private World shell'}</h3>
          <p className="muted">
            Clean observer panels stay on top while the deeper system layer keeps blackholes, orbital routes, Dyson spheres, and solar bodies active beneath them.
          </p>
          <div className="focus-meta">
            <span>{lobbyMode === 'hub' ? 'Shared route layer' : getPrivateWorldKey(steamUser?.steamid)}</span>
            <span>{steamUser?.personaname || 'Guest'}</span>
          </div>
          <div className="stable-chip-row">
            <span>Deep-space anchor</span>
            <span>Steam-linked shell</span>
            <span>Cinematic route field</span>
          </div>
        </div>

        <div className="content-card stable-card focus">
          <p className="eyebrow">Selected route</p>
          <h3>{activeNode?.label || 'Deep Space Blackhole'}</h3>
          <p className="muted">{activeNode?.description || 'Primary anchor route.'}</p>
          <div className="focus-meta">
            <span>{activeNode?.address || 'Primary anchor'}</span>
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

      <div className="stable-world-canvas polished-canvas cinematic-polished-canvas">
        <Canvas camera={{ position: [0, 8, 26], fov: 46 }} dpr={[1, 1.6]}>
          <StableSceneContent onSelect={handleSelect} selectedKey={activeNode?.key} />
        </Canvas>
      </div>
    </div>
  );
}
