'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Trail } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

const SERVER_NODES = [
  {
    label: 'Arma3 CTH',
    sublabel: 'tcentral.game.nfoservers.com:2302',
    position: [-5.5, 2.2, 0.5],
    color: '#8beaff',
    href: '/servers/arma3-cth',
    description: 'Tactical hill battles and public objective warfare.'
  },
  {
    label: 'Rust Bi-Weekly',
    sublabel: 'tcentralrust.game.nfoservers.com:28015',
    position: [0.4, -2.8, 0.8],
    color: '#d8ff61',
    href: '/servers/rust-vanilla',
    description: 'Bi-weekly wipe cycle near the black hole cluster.'
  },
  {
    label: 'Rust Monthly',
    sublabel: 'tcentralrust3.game.nfoservers.com:28015',
    position: [-2.4, -3.55, -0.2],
    color: '#ffd15c',
    href: '/servers/rust-monthly',
    description: 'Longer progression cycle pinned to the lower singularity.'
  },
  {
    label: 'Rust Weekly',
    sublabel: 'tcentralrust2.game.nfoservers.com:28015',
    position: [2.7, -3.45, -0.35],
    color: '#ff9fda',
    href: '/servers/rust-weekly',
    description: 'Fast reset cycle anchored under the black hole.'
  },
  {
    label: 'Support Hub',
    sublabel: 'Donate + subscription',
    position: [5.0, 2.6, -0.4],
    color: '#b68cff',
    href: '/donate',
    description: 'Support the ecosystem and recurring subscription options.'
  },
  {
    label: 'Player Reporting',
    sublabel: 'Moderation route',
    position: [5.8, -0.2, 0.3],
    color: '#ff8a8a',
    href: '/report-player',
    description: 'Structured reporting flow for moderation issues.'
  }
];

function BlackHole() {
  const group = useRef();
  const disc = useRef();

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (disc.current) disc.current.rotation.z -= delta * 0.35;
  });

  return (
    <group ref={group} position={[0, -3.1, 0]}>
      <mesh>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshStandardMaterial color="#020409" emissive="#060812" emissiveIntensity={0.9} />
      </mesh>

      <mesh ref={disc} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.8, 0.36, 32, 140]} />
        <meshStandardMaterial
          color="#17111f"
          emissive="#5f3fd5"
          emissiveIntensity={1.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.35, 0.1, 24, 140]} />
        <meshStandardMaterial color="#86e7ff" emissive="#86e7ff" emissiveIntensity={0.5} />
      </mesh>

      <pointLight position={[0, 0, 0]} color="#7d5cff" intensity={35} distance={14} />
      <Html position={[0, -1.75, 0]} center>
        <div className="map-anchor-label">
          <span className="anchor-title">Black Hole Cluster</span>
          <span className="anchor-copy">Rust network anchor</span>
        </div>
      </Html>
    </group>
  );
}

function ConstellationLines() {
  const points = useMemo(
    () => SERVER_NODES.map((node) => new THREE.Vector3(...node.position)),
    []
  );

  const geometry = useMemo(() => {
    const ordered = [
      points[1], // bi-weekly
      points[2], // monthly
      points[3], // weekly
      new THREE.Vector3(0, -3.1, 0),
      points[5], // reporting
      points[4], // support
      points[0], // arma
    ];
    const curve = new THREE.CatmullRomCurve3(ordered, false, 'catmullrom', 0.25);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(260));
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#6de8ff" transparent opacity={0.35} />
    </line>
  );
}

function Node({ node, active, onHover, onLeave, onClick }) {
  const mesh = useRef();

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 1.2 + node.position[0]) * 0.08;
    mesh.current.rotation.y += 0.012;
  });

  return (
    <group position={node.position}>
      <Trail width={0.4} length={2.5} color={node.color} attenuation={(t) => t * t}>
        <mesh
          ref={mesh}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(node.label);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onLeave();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick(node.href);
          }}
        >
          <icosahedronGeometry args={[active ? 0.34 : 0.28, 1]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={active ? 1.6 : 0.95}
            roughness={0.2}
            metalness={0.15}
          />
        </mesh>
      </Trail>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[active ? 0.62 : 0.52, 24, 24]} />
        <meshBasicMaterial color={node.color} transparent opacity={active ? 0.18 : 0.1} />
      </mesh>

      <Html center distanceFactor={8.5} position={[0, active ? 0.92 : 0.78, 0]}>
        <button
          className={`map-node-label ${active ? 'active' : ''}`}
          onMouseEnter={() => onHover(node.label)}
          onMouseLeave={onLeave}
          onClick={() => onClick(node.href)}
        >
          <strong>{node.label}</strong>
          <span>{node.sublabel}</span>
        </button>
      </Html>
    </group>
  );
}

function Scene() {
  const router = useRouter();
  const [active, setActive] = useState('Rust Bi-Weekly');

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 6, 4]} intensity={1.5} color="#bdefff" />
      <pointLight position={[-6, 3, 4]} intensity={16} color="#6fdfff" distance={18} />
      <pointLight position={[6, 3, -2]} intensity={10} color="#b78dff" distance={18} />
      <fog attach="fog" args={['#060e16', 12, 28]} />
      <Stars radius={70} depth={30} count={3200} factor={4.2} saturation={0} fade speed={0.8} />

      <group rotation={[-0.15, -0.08, 0]}>
        <ConstellationLines />
        <BlackHole />
        {SERVER_NODES.map((node) => (
          <Node
            key={node.label}
            node={node}
            active={active === node.label}
            onHover={setActive}
            onLeave={() => setActive('Rust Bi-Weekly')}
            onClick={(href) => router.push(href)}
          />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.22}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.28}
      />
    </>
  );
}

export default function InteractiveGalaxyMap() {
  return (
    <div className="interactive-map-shell">
      <div className="interactive-map-copy">
        <p className="eyebrow">3D system map</p>
        <h3>Orbit the hub, inspect the constellation, and jump into the server you want.</h3>
        <p className="muted">
          The lower singularity acts as the Rust anchor cluster. The monthly, weekly, and bi-weekly servers are
          pinned around the black hole, while Arma3 and the support routes are placed across the wider constellation.
        </p>
      </div>

      <div className="interactive-map-stage">
        <Canvas camera={{ position: [0, 0.9, 11], fov: 46 }}>
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}
