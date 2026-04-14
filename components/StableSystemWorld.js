'use client';

import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORLD_LAYOUT } from '@/lib/worldLayout';
import { getPrivateWorldKey } from '@/lib/securityConfig';
import { getSteamAccessProfile } from '@/lib/steamAccess';
import StableNodePanel from '@/components/StableNodePanel';
import SceneObjectsSidebar from '@/components/SceneObjectsSidebar';
import StandaloneAnchorPanel from '@/components/StandaloneAnchorPanel';
import NDSPAnchorPanel from '@/components/NDSPAnchorPanel';

function NodeVisual({ node, onSelect }) {
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

function StableSceneContent({ onSelect }) {
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
          <mesh key={radius} rotation={[Math.PI / 2, 0, 0]} className="solar-orbit-guide">
            <torusGeometry args={[radius, 0.02, 6, 80]} />
            <meshBasicMaterial color="#ffd46b" transparent opacity={0.24} />
          </mesh>
        ))}
      </group>

      {nodes.map((node) => (
        <NodeVisual key={node.key} node={node} onSelect={onSelect} />
      ))}

      <OrbitControls enablePan={false} minDistance={14} maxDistance={55} />
    </>
  );
}

export default function StableSystemWorld({ lobbyMode = 'hub', steamUser = null }) {
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
      <SceneObjectsSidebar lobbyMode={lobbyMode} />
      <div className="stable-system-hud">
        <div className="content-card">
          <p className="eyebrow">Stability shell</p>
          <h3>{accessProfile.instanceType}</h3>
          <p className="muted">
            This simplified world keeps the main routes, blackholes, Dyson spheres, and solar system online while the heavier 3D runtime is being stabilized. Steam-linked users begin in the private single-player world, then can move outward into the shared multiplayer instance.
          </p>
          <div className="focus-meta">
            <span>{lobbyMode === 'hub' ? 'Shared route layer' : `Anchored: ${getPrivateWorldKey(steamUser?.steamid)}`}</span>
            <span>{accessProfile.personaName}</span>
          </div>
        </div>
        <div className="content-card">
          <p className="eyebrow">Universe shell</p>
          <h3>Permanent anchorage layer</h3>
          <p className="muted">The standalone blackhole is the general reference shell that holds the universe fabric, connected instances, route portals, and the multiplayer mesh in one anchored layer.</p>
          <div className="focus-meta"><span>Fabric of the universe</span><span>Permanent anchor</span></div>
        </div>
        <StandaloneAnchorPanel selected={selected} />
        <NDSPAnchorPanel selected={selected} steamUser={steamUser} lobbyMode={lobbyMode} />
        <StableNodePanel
          selected={selected}
          lobbyMode={lobbyMode}
          onClose={() => setSelected(null)}
          onOpen={handleOpen}
        />
      </div>

      <div className="stable-world-canvas">
        <Canvas camera={{ position: [0, 8, 24], fov: 48 }}>
          <StableSceneContent onSelect={setSelected} />
        </Canvas>
      </div>
    </div>
  );
}
