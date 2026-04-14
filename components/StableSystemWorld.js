'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORLD_LAYOUT } from '@/lib/worldLayout';
import { getPrivateWorldKey } from '@/lib/securityConfig';
import { getSteamAccessProfile } from '@/lib/steamAccess';
import { hasPaypalSubscription, isSteamAuthenticated } from '@/lib/accountFlags';
import StableNodePanel from '@/components/StableNodePanel';
import StandaloneAnchorPanel from '@/components/StandaloneAnchorPanel';
import NDSPAnchorPanel from '@/components/NDSPAnchorPanel';
import NDSPProfilePanel from '@/components/NDSPProfilePanel';
import NewsInfoTab from '@/components/NewsInfoTab';

function SynapticDysonSphere({ node, onSelect, lobbyMode = 'private', steamUser = null }) {
  const ring1 = useRef(null);
  const ring2 = useRef(null);
  const ring3 = useRef(null);
  const authenticated = isSteamAuthenticated(steamUser);
  const subscribed = hasPaypalSubscription(steamUser);

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.y += delta * 0.35;
    if (ring2.current && (authenticated || lobbyMode === 'hub')) ring2.current.rotation.x += delta * 0.6;
    if (ring3.current && (lobbyMode === 'hub' || (lobbyMode === 'private' && subscribed))) ring3.current.rotation.z += delta * 0.85;
  });

  return (
    <group position={node.position || [0, 0, 0]}>
      <mesh onClick={() => onSelect(node)}>
        <icosahedronGeometry args={[0.86, 1]} />
        <meshStandardMaterial color={node.color || '#ffd67d'} emissive={node.color || '#ffd67d'} emissiveIntensity={0.34} metalness={0.82} roughness={0.18} />
      </mesh>

      <group ref={ring1} rotation={[Math.PI / 2.6, 0, 0]}>
        <mesh onClick={() => onSelect(node)}>
          <torusGeometry args={[1.3, 0.05, 14, 90]} />
          <meshBasicMaterial color="#f8e7a0" transparent opacity={0.85} />
        </mesh>
      </group>

      <group ref={ring2} rotation={[0.6, 0.2, 0.4]}>
        <mesh onClick={() => onSelect(node)}>
          <torusGeometry args={[1.72, 0.045, 14, 90]} />
          <meshBasicMaterial color="#9be9ff" transparent opacity={authenticated || lobbyMode === 'hub' ? 0.82 : 0.18} />
        </mesh>
      </group>

      <group ref={ring3} rotation={[0.8, 0.4, 1.1]}>
        <mesh onClick={() => onSelect(node)}>
          <torusGeometry args={[2.08, 0.04, 14, 90]} />
          <meshBasicMaterial color="#ffb4ec" transparent opacity={lobbyMode === 'hub' || (lobbyMode === 'private' && subscribed) ? 0.82 : 0.14} />
        </mesh>
      </group>

      <Html center distanceFactor={14} position={[0, 2.45, 0]}>
        <button className="stable-node-label synaptic-label" onClick={() => onSelect(node)}>
          <strong>{node.label}</strong>
          <span>dyson sphere · ndsp</span>
        </button>
      </Html>
    </group>
  );
}

function GenericNodeVisual({ node, onSelect }) {
  const isBlackhole = node.kind === 'blackhole';
  const isDyson = node.kind === 'dyson';
  const isSolar = node.kind === 'solar';
  const isStandalone = node.key === 'deep_blackhole';

  return (
    <group position={node.position || [0, 0, 0]}>
      <mesh onClick={() => onSelect(node)} scale={isStandalone ? 1.45 : isBlackhole ? 1.2 : isDyson ? 1.05 : isSolar ? 1.35 : 0.75}>
        {isBlackhole ? (
          <torusGeometry args={[isStandalone ? 1.1 : 0.95, isStandalone ? 0.34 : 0.26, 20, 64]} />
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
          emissiveIntensity={isStandalone ? 0.75 : isBlackhole ? 0.55 : 0.28}
          metalness={isDyson ? 0.7 : 0.25}
          roughness={isDyson ? 0.22 : 0.45}
        />
      </mesh>

      {isBlackhole ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[isStandalone ? 1.95 : 1.45, 0.05, 10, 72]} />
          <meshBasicMaterial color={node.color || '#9fdcff'} transparent opacity={isStandalone ? 0.9 : 0.7} />
        </mesh>
      ) : null}

      <Html center distanceFactor={14} position={[0, isSolar ? 1.8 : 1.45, 0]}>
        <button className="stable-node-label" onClick={() => onSelect(node)}>
          <strong>{node.label}</strong>
          <span>{node.kind}</span>
        </button>
      </Html>
    </group>
  );
}

function StableSceneContent({ onSelect, lobbyMode = 'private', steamUser = null }) {
  const nodes = useMemo(
    () => WORLD_LAYOUT.filter((node) => ['blackhole', 'dyson', 'solar'].includes(node.kind)),
    []
  );

  return (
    <>
      <color attach="background" args={['#07111b']} />
      <fog attach="fog" args={['#08111b', 18, 95]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[8, 10, 6]} intensity={1.15} color="#dff8ff" />
      <pointLight position={[-10, 6, 10]} intensity={1.2} color="#9f7cff" />
      <Stars radius={120} depth={60} count={4200} factor={4.8} saturation={0} fade speed={1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -14, 0]}>
        <circleGeometry args={[54, 60]} />
        <meshBasicMaterial color="#071019" transparent opacity={0.45} />
      </mesh>

      <group position={[7.4, 2.2, 5.0]}>
        {[2.2, 3.4, 4.8].map((radius) => (
          <mesh key={radius} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 6, 80]} />
            <meshBasicMaterial color="#ffd46b" transparent opacity={0.24} />
          </mesh>
        ))}
      </group>

      {nodes.map((node) => (
        node.key === 'ss'
          ? <SynapticDysonSphere key={node.key} node={node} onSelect={onSelect} lobbyMode={lobbyMode} steamUser={steamUser} />
          : <GenericNodeVisual key={node.key} node={node} onSelect={onSelect} />
      ))}

      <OrbitControls enablePan={false} minDistance={14} maxDistance={55} />
    </>
  );
}

export default function StableSystemWorld({ lobbyMode = 'private', steamUser = null }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const accessProfile = getSteamAccessProfile(steamUser, lobbyMode);

  const handleOpen = (node) => {
    setSelected(node);
    const href = node.route;
    if (!href) return;
    if (node.external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  };

  return (
    <div className="stable-system-page">
      <NewsInfoTab selected={selected} lobbyMode={lobbyMode} steamUser={steamUser} />
      <div className="stable-system-overlay-stack">
        <StableNodePanel
          selected={selected}
          lobbyMode={lobbyMode}
          onClose={() => setSelected(null)}
          onOpen={handleOpen}
        />
        <StandaloneAnchorPanel selected={selected} />
        <NDSPAnchorPanel selected={selected} steamUser={steamUser} lobbyMode={lobbyMode} />
        {selected?.key === 'ss' ? <NDSPProfilePanel steamUser={steamUser} lobbyMode={lobbyMode} /> : null}
      </div>

      <div className="stable-world-canvas">
        <Canvas camera={{ position: [0, 8, 24], fov: 48 }}>
          <StableSceneContent onSelect={setSelected} lobbyMode={lobbyMode} steamUser={steamUser} />
        </Canvas>
      </div>

      <div className="stable-access-pill">
        <span>{accessProfile.instanceType}</span>
        <span>{lobbyMode === 'hub' ? 'shared multiplayer shell' : `anchored: ${getPrivateWorldKey(steamUser?.steamid)}`}</span>
      </div>
    </div>
  );
}
