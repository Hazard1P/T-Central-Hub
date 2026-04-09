'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Trail } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

const SERVER_NODES = [
  {
    label: 'Arma3 CTH',
    sublabel: 'tcentral.game.nfoservers.com:2302',
    position: [-5.6, 2.4, 0.3],
    color: '#8beaff',
    href: '/servers/arma3-cth',
    description: 'Tactical hill battles and public objective warfare.',
    type: 'arma'
  },
  {
    label: 'Rust Bi-Weekly',
    sublabel: 'tcentralrust.game.nfoservers.com:28015',
    position: [0.5, -2.75, 0.7],
    color: '#d8ff61',
    href: '/servers/rust-vanilla',
    description: 'Bi-weekly wipe cycle near the black hole cluster.'
  },
  {
    label: 'Rust Monthly',
    sublabel: 'tcentralrust3.game.nfoservers.com:28015',
    position: [-2.35, -3.5, -0.15],
    color: '#ffd15c',
    href: '/servers/rust-monthly',
    description: 'Longer progression cycle pinned to the lower singularity.'
  },
  {
    label: 'Rust Weekly',
    sublabel: 'tcentralrust2.game.nfoservers.com:28015',
    position: [2.7, -3.45, -0.3],
    color: '#ff9fda',
    href: '/servers/rust-weekly',
    description: 'Fast reset cycle anchored under the black hole.'
  },
  {
    label: 'Support Hub',
    sublabel: 'Donate + subscription',
    position: [5.15, 2.5, -0.45],
    color: '#b68cff',
    href: '/donate',
    description: 'Support the ecosystem and recurring subscription options.'
  },
  {
    label: 'Player Reporting',
    sublabel: 'Moderation route',
    position: [5.85, -0.25, 0.2],
    color: '#ff8a8a',
    href: '/report-player',
    description: 'Structured reporting flow for moderation issues.'
  }
];

function BlackHole({ position = [0, -3.1, 0], label = 'Black Hole Cluster', sublabel = 'Rust network anchor', colorA = '#5f3fd5', colorB = '#86e7ff' }) {
  const group = useRef();
  const disc = useRef();

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (disc.current) disc.current.rotation.z -= delta * 0.35;
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshStandardMaterial color="#020409" emissive="#060812" emissiveIntensity={0.9} />
      </mesh>

      <mesh ref={disc} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.8, 0.36, 32, 140]} />
        <meshStandardMaterial
          color="#17111f"
          emissive={colorA}
          emissiveIntensity={1.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.35, 0.1, 24, 140]} />
        <meshStandardMaterial color={colorB} emissive={colorB} emissiveIntensity={0.5} />
      </mesh>

      <pointLight position={[0, 0, 0]} color={colorA} intensity={35} distance={14} />
      <Html position={[0, -1.75, 0]} center>
        <div className="map-anchor-label">
          <span className="anchor-title">{label}</span>
          <span className="anchor-copy">{sublabel}</span>
        </div>
      </Html>
    </group>
  );
}

function ArmaBlackHole({ onClick, onHover }) {
  const group = useRef();
  const disc = useRef();

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y -= delta * 0.14;
    if (disc.current) disc.current.rotation.z += delta * 0.42;
  });

  return (
    <group
      ref={group}
      position={[-5.6, 2.4, 0.3]}
      onClick={(e) => {
        e.stopPropagation();
        onClick('/servers/arma3-cth');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover('Arma3 CTH');
      }}
    >
      <mesh>
        <sphereGeometry args={[0.82, 48, 48]} />
        <meshStandardMaterial color="#020409" emissive="#0a1a2a" emissiveIntensity={1.2} />
      </mesh>

      <mesh ref={disc} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.6, 0.25, 32, 120]} />
        <meshStandardMaterial color="#00eaff" emissive="#00eaff" emissiveIntensity={1.4} />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.18, 0.08, 24, 120]} />
        <meshStandardMaterial color="#8beaff" emissive="#8beaff" emissiveIntensity={0.65} />
      </mesh>

      <pointLight position={[0, 0, 0]} color="#00eaff" intensity={30} distance={12} />

      <Html position={[0, 1.55, 0]} center>
        <button className="map-anchor-label clickable" onClick={() => onClick('/servers/arma3-cth')}>
          <span className="anchor-title">Arma3 Black Hole</span>
          <span className="anchor-copy">Tactical system anchor</span>
        </button>
      </Html>
    </group>
  );
}

function DysonSphere({ position = [5.15, 2.5, -0.45], onClick, onHover }) {
  const group = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const ringC = useRef();

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (ringA.current) ringA.current.rotation.x += delta * 0.45;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.36;
    if (ringC.current) ringC.current.rotation.z += delta * 0.52;
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick('/donate');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover('Support Hub');
      }}
    >
      <mesh>
        <sphereGeometry args={[0.42, 28, 28]} />
        <meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={1.8} />
      </mesh>

      <mesh ref={ringA}>
        <torusGeometry args={[0.9, 0.03, 16, 140]} />
        <meshStandardMaterial color="#ffe694" emissive="#ffe694" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={ringB} rotation={[1.1, 0.3, 0.2]}>
        <torusGeometry args={[1.18, 0.025, 16, 140]} />
        <meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={1.1} />
      </mesh>
      <mesh ref={ringC} rotation={[0.2, 0.7, 1.0]}>
        <torusGeometry args={[1.45, 0.02, 16, 140]} />
        <meshStandardMaterial color="#fff4c1" emissive="#fff4c1" emissiveIntensity={0.9} />
      </mesh>

      <pointLight position={[0, 0, 0]} color="#ffd15c" intensity={16} distance={10} />
      <Html position={[0, -1.35, 0]} center>
        <button className="map-anchor-label clickable" onClick={() => onClick('/donate')}>
          <span className="anchor-title">Dyson Sphere</span>
          <span className="anchor-copy">Support network</span>
        </button>
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
      points[1],
      points[2],
      points[3],
      new THREE.Vector3(0, -3.1, 0),
      new THREE.Vector3(-5.6, 2.4, 0.3),
      points[5],
      new THREE.Vector3(5.15, 2.5, -0.45)
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

function WarpController({ warpTarget, setWarpTarget }) {
  const { camera, controls } = useThree();
  const progress = useRef(0);
  const startPos = useRef(camera.position.clone());
  const temp = useRef(new THREE.Vector3());

  useEffect(() => {
    if (warpTarget) {
      progress.current = 0;
      startPos.current = camera.position.clone();
    }
  }, [warpTarget, camera]);

  useFrame((state, delta) => {
    if (!warpTarget) return;
    progress.current = Math.min(progress.current + delta * 0.8, 1);
    const eased = 1 - Math.pow(1 - progress.current, 3);

    const focus = new THREE.Vector3(...warpTarget.focus);
    const cam = new THREE.Vector3(...warpTarget.camera);
    temp.current.copy(startPos.current).lerp(cam, eased);
    camera.position.copy(temp.current);
    camera.lookAt(focus);

    if (controls) {
      controls.target.lerp(focus, eased);
      controls.update();
    }

    if (progress.current >= 1) {
      warpTarget.complete();
      setWarpTarget(null);
    }
  });

  return null;
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
            onClick(node);
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
          onClick={() => onClick(node)}
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
  const [warpTarget, setWarpTarget] = useState(null);
  const controlsRef = useRef();

  const startWarp = (node) => {
    const base = new THREE.Vector3(...node.position);
    const isBlackHole = node.type === 'arma' || node.label.includes('Rust');
    const offset = node.type === 'arma'
      ? new THREE.Vector3(0, 0.1, 3.0)
      : node.label.includes('Rust')
      ? new THREE.Vector3(0, 0.15, 2.8)
      : new THREE.Vector3(0, 0.15, 2.5);

    setWarpTarget({
      focus: base.toArray(),
      camera: base.clone().add(offset).toArray(),
      complete: () => router.push(node.href)
    });
  };

  const rustAnchorNode = { label: 'Rust Cluster', href: '/servers/rust-vanilla', position: [0, -3.1, 0] };
  const armaAnchorNode = { label: 'Arma3 CTH', href: '/servers/arma3-cth', position: [-5.6, 2.4, 0.3], type: 'arma' };

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

        <group
          onClick={(e) => {
            e.stopPropagation();
            startWarp(rustAnchorNode);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setActive('Rust Bi-Weekly');
          }}
        >
          <BlackHole />
        </group>

        <ArmaBlackHole onClick={() => startWarp(armaAnchorNode)} onHover={setActive} />
        <DysonSphere onClick={(href) => startWarp(SERVER_NODES[4])} onHover={setActive} />

        {SERVER_NODES.filter((node) => node.label !== 'Arma3 CTH' && node.label !== 'Support Hub').map((node) => (
          <Node
            key={node.label}
            node={node}
            active={active === node.label}
            onHover={setActive}
            onLeave={() => setActive('Rust Bi-Weekly')}
            onClick={startWarp}
          />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={7}
        maxDistance={15}
        autoRotate={!warpTarget}
        autoRotateSpeed={0.22}
        maxPolarAngle={Math.PI * 0.72}
        minPolarAngle={Math.PI * 0.28}
      />
      <WarpController warpTarget={warpTarget} setWarpTarget={setWarpTarget} />
    </>
  );
}

export default function InteractiveGalaxyMap() {
  return (
    <div className="interactive-map-shell">
      <div className="interactive-map-copy">
        <p className="eyebrow">3D system map</p>
        <h3>Orbit the hub, inspect the constellation, and warp directly into the server you want.</h3>
        <p className="muted">
          The lower singularity acts as the Rust anchor cluster. The monthly, weekly, and bi-weekly servers are
          pinned around the black hole, Arma3 now has its own interactive black hole anchor, and the Dyson sphere
          spins across the support side of the system.
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
