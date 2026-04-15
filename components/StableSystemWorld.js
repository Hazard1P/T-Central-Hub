'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSteamSession } from '@/components/SteamSessionProvider';
import { WORLD_LAYOUT } from '@/lib/worldLayout';
import { getPrivateWorldKey } from '@/lib/securityConfig';
import { buildUniverseGraph, getNodePositionMap } from '@/lib/universeEngine';
import { summarizeEpochRelativity } from '@/lib/epochDysonEngine';
import { createGravitySources, stepShipState } from '@/lib/physicsEngine';
import { createQuantumState, summarizeQuantumState, evolveQuantumState } from '@/lib/quantumFieldEngine';

function useDeviceTier() {
  const [tier, setTier] = useState({ isMobile: false, dpr: [1, 1.6], stars: 7600, sparkles: 220, meteors: 18 });

  useEffect(() => {
    const update = () => {
      const isMobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches;
      setTier({
        isMobile,
        dpr: isMobile ? [1, 1.2] : [1, 1.6],
        stars: isMobile ? 3600 : 7600,
        sparkles: isMobile ? 120 : 220,
        meteors: isMobile ? 8 : 18,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return tier;
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

function EventHorizon({ radius = 1.25, color = '#9fdcff' }) {
  const ringA = useRef(null);
  const ringB = useRef(null);
  const glow = useRef(null);

  useFrame(({ clock }, delta) => {
    if (ringA.current) ringA.current.rotation.z += delta * 0.85;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.42;
    if (glow.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2.1) * 0.08;
      glow.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={glow}>
        <sphereGeometry args={[radius * 1.8, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, radius * 0.26, 28, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.82} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.35, Math.PI / 4, 0]}>
        <torusGeometry args={[radius * 1.34, radius * 0.06, 16, 120]} />
        <meshBasicMaterial color="#d7f7ff" transparent opacity={0.34} depthWrite={false} />
      </mesh>
    </group>
  );
}

function MeteorSwarm({ count = 10, radius = 24 }) {
  const group = useRef(null);
  const meteors = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      key: `meteor-${index}`,
      orbitRadius: radius + (index % 4) * 3.6,
      speed: 0.12 + (index % 5) * 0.03,
      angle: (Math.PI * 2 * index) / count,
      height: ((index % 5) - 2) * 1.1,
      size: 0.08 + (index % 3) * 0.04,
    })),
    [count, radius]
  );

  useFrame(({ clock }) => {
    meteors.forEach((meteor, index) => {
      const mesh = group.current?.children?.[index];
      if (!mesh) return;
      const angle = clock.elapsedTime * meteor.speed + meteor.angle;
      mesh.position.set(
        Math.cos(angle) * meteor.orbitRadius,
        meteor.height + Math.sin(angle * 2.4) * 0.5,
        Math.sin(angle) * meteor.orbitRadius * 0.74,
      );
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.03;
    });
  });

  return (
    <group ref={group}>
      {meteors.map((meteor) => (
        <group key={meteor.key}>
          <mesh>
            <dodecahedronGeometry args={[meteor.size, 0]} />
            <meshStandardMaterial color="#7a7c86" emissive="#352f26" emissiveIntensity={0.16} roughness={0.95} metalness={0.08} />
          </mesh>
          <mesh position={[-0.22, 0, 0]}>
            <coneGeometry args={[meteor.size * 0.7, meteor.size * 1.8, 8]} />
            <meshBasicMaterial color="#ffb86c" transparent opacity={0.18} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GravityFieldRings({ position = [0, 0, 0], color = '#7fe7ff' }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.6, 0.018, 8, 140]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
        <torusGeometry args={[6.2, 0.014, 8, 140]} />
        <meshBasicMaterial color="#dff8ff" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SolarSubSystem({ node }) {
  const orbitRefs = useRef([]);
  const starRef = useRef(null);

  useFrame(({ clock }, delta) => {
    if (starRef.current) starRef.current.rotation.y += delta * (0.15 + (node.epochAnchor?.dysonAlignment || 0) * 0.08);
    node.orbiters?.forEach((orbit, index) => {
      const planet = orbitRefs.current[index];
      if (!planet) return;
      const angle = clock.elapsedTime * orbit.speed + orbit.seedAngle + (node.epochAnchor?.phase || 0) * Math.PI * 2;
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
    if (spinRef.current) spinRef.current.rotation.y += delta * (isBlackhole ? 0.42 : isDyson ? 0.3 : 0.14);
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
            <EventHorizon radius={1.08} color={node.color || '#9fdcff'} />
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

      {isBlackhole || isSolar ? <GravityFieldRings position={[0, 0, 0]} color={node.color || '#9fdcff'} /> : null}
      {node.key === 'deep_blackhole' ? <MeteorSwarm count={12} radius={8.6} /> : null}

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

function FlightRig({ gravitySources, onNearestChange, onTelemetryChange, touchInput, isMobile = false, authenticated = false, epochSummary = null }) {
  const groupRef = useRef(null);
  const pilotRef = useRef(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef({});
  const lastNearest = useRef(null);
  const { camera } = useThree();

  useEffect(() => {
    const down = (event) => { keys.current[event.code] = true; };
    const up = (event) => { keys.current[event.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const quantumRef = useRef(createQuantumState(12));

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const move = new THREE.Vector3(
      (keys.current.KeyD || keys.current.ArrowRight ? 1 : 0) - (keys.current.KeyA || keys.current.ArrowLeft ? 1 : 0) + (touchInput.x || 0),
      (keys.current.Space ? 1 : 0) - (keys.current.ShiftLeft || keys.current.ShiftRight ? 1 : 0) + (touchInput.y || 0),
      (keys.current.KeyS || keys.current.ArrowDown ? 1 : 0) - (keys.current.KeyW || keys.current.ArrowUp ? 1 : 0) + (touchInput.z || 0),
    );

    const stepped = stepShipState({
      position: groupRef.current.position.clone(),
      velocity: velocity.current.clone(),
      inputVector: move,
      gravitySources,
      isMobile,
      dt: Math.min(delta, 1 / 24),
    });

    velocity.current.copy(stepped.velocity);
    groupRef.current.position.copy(stepped.position);

    const speed = stepped.speed;
    if (speed > 0.01) groupRef.current.lookAt(groupRef.current.position.clone().add(velocity.current));

    const gravityMagnitude = stepped.gravitySample.acceleration.length();
    const nearest = stepped.gravitySample.diagnostics[0] || null;
    const horizonFactor = nearest?.horizonFactor || 0;

    quantumRef.current = evolveQuantumState({
      prevState: quantumRef.current,
      dt,
      speed,
      gravityMagnitude,
      horizonFactor,
      authenticated,
      nearestKey: nearest?.key || null,
    });

    if (pilotRef.current) {
      const pulse = 0.92 + Math.min(speed * 0.05, 0.15) + quantumRef.current.coherence * 0.04;
      pilotRef.current.scale.setScalar(pulse);
      pilotRef.current.material.emissive.set(quantumRef.current.hue);
      pilotRef.current.material.color.set(quantumRef.current.hue);
    }

    const cameraOffset = new THREE.Vector3(0, 4.8, 12.6 + horizonFactor * 2.4);
    const cameraTarget = groupRef.current.position.clone().add(cameraOffset);
    camera.position.lerp(cameraTarget, 0.055);
    camera.lookAt(groupRef.current.position.clone().add(new THREE.Vector3(0, 0.6, 0)));

    if (nearest && lastNearest.current !== nearest.key && nearest.distance < nearest.source.influenceRadius) {
      lastNearest.current = nearest.key;
      onNearestChange?.(nearest.key);
    }

    onTelemetryChange?.({
      speed: Number(speed.toFixed(2)),
      gravity: Number(gravityMagnitude.toFixed(2)),
      horizonFactor: Number(horizonFactor.toFixed(2)),
      nearest: nearest?.key || null,
      nearestDistance: Number((nearest?.distance || 0).toFixed(2)),
      escapeVelocity: Number((nearest?.escapeVelocity || 0).toFixed(2)),
      horizon: stepped.horizon,
      quantum: summarizeQuantumState(quantumRef.current),
      epoch: epochSummary,
      position: [
        Number(groupRef.current.position.x.toFixed(2)),
        Number(groupRef.current.position.y.toFixed(2)),
        Number(groupRef.current.position.z.toFixed(2)),
      ],
    });

    state.invalidate();
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 18]}>
      <mesh ref={pilotRef} position={[0, 0.06, 0.28]}>
        <sphereGeometry args={[0.16, 18, 18]} />
        <meshStandardMaterial color="#dff8ff" emissive="#dff8ff" emissiveIntensity={0.55} roughness={0.22} metalness={0.05} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.42, 1.2, 4]} />
        <meshStandardMaterial color="#92b8ff" emissive="#3c5aa8" emissiveIntensity={0.4} roughness={0.28} metalness={0.66} />
      </mesh>
      <mesh position={[0, 0, -0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.42, 12]} />
        <meshBasicMaterial color="#ffbd75" transparent opacity={0.8} depthWrite={false} />
      </mesh>
      <mesh position={[0.36, 0, -0.22]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[0.62, 0.04, 0.18]} />
        <meshStandardMaterial color="#aac8ff" roughness={0.36} metalness={0.72} />
      </mesh>
      <mesh position={[-0.36, 0, -0.22]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[0.62, 0.04, 0.18]} />
        <meshStandardMaterial color="#aac8ff" roughness={0.36} metalness={0.72} />
      </mesh>
    </group>
  );
}

function StableSceneContent({ onSelect, selectedKey, onAutoFocus, onTelemetryChange, touchInput, deviceTier, authenticated = false }) {
  const graph = useMemo(() => buildUniverseGraph(), []);
  const epochSummary = useMemo(() => summarizeEpochRelativity(graph.epochAnchor), [graph]);
  const graphByKey = useMemo(() => Object.fromEntries(graph.nodes.map((node) => [node.key, node])), [graph]);
  const positions = useMemo(() => getNodePositionMap(graph), [graph]);
  const displayNodes = useMemo(
    () => WORLD_LAYOUT.filter((node) => ['blackhole', 'dyson', 'solar', 'node'].includes(node.kind)).slice(0, WORLD_LAYOUT.length),
    []
  );
  const gravitySources = useMemo(
    () => createGravitySources(graph.nodes.filter((node) => ['blackhole', 'solar', 'dyson'].includes(node.kind))),
    [graph]
  );

  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#07111d', 20, 105]} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[8, 10, 6]} intensity={1.15} color="#dff8ff" />
      <pointLight position={[-10, 6, 10]} intensity={1.28} color="#9f7cff" />
      <pointLight position={[12, -2, 6]} intensity={1.12} color="#6dffb5" />
      <Stars radius={140} depth={72} count={deviceTier.stars} factor={5.8} saturation={0} fade speed={1.1} />
      <Sparkles count={deviceTier.sparkles} scale={[60, 34, 44]} size={3.0} speed={0.25} opacity={0.7} />
      <MeteorSwarm count={deviceTier.meteors} radius={26} />

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

      <FlightRig gravitySources={gravitySources} onNearestChange={onAutoFocus} onTelemetryChange={onTelemetryChange} touchInput={touchInput} isMobile={deviceTier.isMobile} authenticated={authenticated} epochSummary={epochSummary} />
    </>
  );
}

function TouchFlightPad({ onInputChange }) {
  const setAxis = (axis, value) => onInputChange((prev) => ({ ...prev, [axis]: value }));

  return (
    <div className="touch-flight-pad" aria-hidden="true">
      <div className="touch-flight-cluster">
        <button onTouchStart={() => setAxis('z', -1)} onTouchEnd={() => setAxis('z', 0)} onMouseDown={() => setAxis('z', -1)} onMouseUp={() => setAxis('z', 0)}>↑</button>
        <div className="touch-flight-row">
          <button onTouchStart={() => setAxis('x', -1)} onTouchEnd={() => setAxis('x', 0)} onMouseDown={() => setAxis('x', -1)} onMouseUp={() => setAxis('x', 0)}>←</button>
          <button onTouchStart={() => setAxis('x', 1)} onTouchEnd={() => setAxis('x', 0)} onMouseDown={() => setAxis('x', 1)} onMouseUp={() => setAxis('x', 0)}>→</button>
        </div>
        <button onTouchStart={() => setAxis('z', 1)} onTouchEnd={() => setAxis('z', 0)} onMouseDown={() => setAxis('z', 1)} onMouseUp={() => setAxis('z', 0)}>↓</button>
      </div>
      <div className="touch-flight-cluster vertical">
        <button onTouchStart={() => setAxis('y', 1)} onTouchEnd={() => setAxis('y', 0)} onMouseDown={() => setAxis('y', 1)} onMouseUp={() => setAxis('y', 0)}>Ascend</button>
        <button onTouchStart={() => setAxis('y', -1)} onTouchEnd={() => setAxis('y', 0)} onMouseDown={() => setAxis('y', -1)} onMouseUp={() => setAxis('y', 0)}>Descend</button>
      </div>
    </div>
  );
}

export default function StableSystemWorld({ lobbyMode = 'hub', steamUser = null, onSelectionChange = null }) {
  const router = useRouter();
  const deviceTier = useDeviceTier();
  const { universe, presence, updatePresence, refresh } = useSteamSession();
  const [selected, setSelected] = useState(null);
  const [touchInput, setTouchInput] = useState({ x: 0, y: 0, z: 0 });
  const lastPresenceBroadcast = useRef(0);
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    gravity: 0,
    horizonFactor: 0,
    nearest: null,
    nearestDistance: 0,
    escapeVelocity: 0,
    quantum: summarizeQuantumState(createQuantumState(12)),
    position: [0, 0, 18],
  });

  const [prayerSeedState, setPrayerSeedState] = useState({ status: '', ok: true });

  const graph = useMemo(() => buildUniverseGraph(), []);
  const graphByKey = useMemo(() => Object.fromEntries(graph.nodes.map((node) => [node.key, node])), [graph]);

  const handleSelect = (node) => {
    setSelected(node);
    onSelectionChange?.(node);
  };

  const handleAutoFocus = (key) => {
    const match = WORLD_LAYOUT.find((node) => node.key === key) || graphByKey[key] || null;
    if (!match) return;
    setSelected((current) => (current?.key === match.key ? current : match));
    onSelectionChange?.(match);
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

  useEffect(() => {
    if (!telemetry?.quantum) return;
    const now = Date.now();
    if (now - lastPresenceBroadcast.current < 1200) return;
    lastPresenceBroadcast.current = now;
    updatePresence?.(telemetry);
  }, [telemetry, updatePresence]);

  const handlePrayerSeed = async () => {
    const body = window.prompt('Plant a private Prayer Seed into the Solar System vault:', activeNode?.label ? `${activeNode.label} / ` : '');
    if (!body || !body.trim()) return;

    setPrayerSeedState({ status: 'Planting Prayer Seed...', ok: true });

    try {
      const response = await fetch('/api/universe/prayer-seeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, solarSystemKey: 'solar_system', tags: [activeNode?.key || 'deep_blackhole', lobbyMode], lobbyMode }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setPrayerSeedState({
          status: data?.error || data?.message || 'Prayer Seed planting is unavailable right now.',
          ok: false,
        });
        return;
      }

      setPrayerSeedState({ status: data?.message || 'Prayer Seed planted.', ok: true });
      await refresh?.();
    } catch {
      setPrayerSeedState({ status: 'Prayer Seed request failed. Try again in a moment.', ok: false });
    }
  };

  const perspective = steamUser?.steamid
    ? { role: lobbyMode === 'hub' ? 'Player-linked observer' : 'Private player shell', note: lobbyMode === 'hub' ? 'Steam session linked. Shared observance and pilot state remain synchronized.' : 'Private Steam world active with isolated route ownership and synchronized pilot state.' }
    : { role: 'Observer shell', note: 'Guest observer mode stays synchronized across the HUD and world while route flight remains available.' };

  return (
    <div className="stable-system-page polished-shell cinematic-system-page">
      <div className="stable-system-backdrop" />

      <div className="stable-system-hud">
        <div className="content-card stable-card intro">
          <p className="eyebrow">Stability shell</p>
          <h3>{lobbyMode === 'hub' ? 'Multiplayer Hub shell' : 'Private World shell'}</h3>
          <p className="muted">
            Clean observer panels stay on top while the deeper system layer keeps blackholes, event horizons, meteor belts, solar systems, and gravity wells active beneath them.
          </p>
          <div className="focus-meta">
            <span>{lobbyMode === 'hub' ? 'Shared route layer' : getPrivateWorldKey(steamUser?.steamid)}</span>
            <span>{steamUser?.personaname || 'Guest'}</span>
          </div>
          <div className="stable-chip-row">
            <span>Gravity flight</span>
            <span>{steamUser?.steamid ? 'Steam-linked shell' : 'Guest shell sync'}</span>
            <span>Q12D state-space</span>
            <span>{universe?.privacy?.privacyTier || 'guest-public'}</span>
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
          <div className="stable-chip-row alt">
            <span>Epoch {epochSummary.unix}</span>
            <span>Dyson {epochSummary.dysonPercent}%</span>
            <span>Phase {epochSummary.phasePercent}%</span>
          </div>
          {activeNode?.route ? (
            <button className="stable-route-button" onClick={handleRouteOpen}>
              Travel to route
            </button>
          ) : null}
        </div>

        <div className="content-card stable-card observer">
          <p className="eyebrow">Observer / Pilot</p>
          <h3>{perspective.role}</h3>
          <p className="muted">{perspective.note}</p>
          <div className="focus-meta">
            <span>{steamUser?.personaname || 'Guest observer'}</span>
            <span>{lobbyMode === 'hub' ? 'Shared world visibility' : 'Private world visibility'}</span>
          </div>
          <div className="stable-chip-row alt">
            <span>Inspect</span>
            <span>Fly</span>
            <span>Overlay-safe</span>
            <span>{presence.length} pilots</span>
          </div>
          <p className="stable-flight-note">
            Desktop: WASD / arrows + Space / Shift. Mobile: use the flight pad.
          </p>
          {lobbyMode === 'private' ? (
            <button className="stable-route-button" onClick={handlePrayerSeed}>
              Plant Prayer Seed
            </button>
          ) : null}
          {prayerSeedState.status ? (
            <p className={`report-status ${prayerSeedState.ok ? 'success' : 'error'}`}>{prayerSeedState.status}</p>
          ) : null}
        </div>


        <div className="content-card stable-card observer quantum-telemetry-card">
          <p className="eyebrow">Private universe matrix</p>
          <h3>{universe?.privacy?.observanceScope || 'hub:public'}</h3>
          <p className="muted">Prayer Seeds stay bound to the private universe vault while the Solar System remains anchored to Unix epoch timing and Dyson-sphere relativity.</p>
          <div className="focus-meta">
            <span>{universe?.privacy?.storageKey || 'vault:guest'}</span>
            <span>{universe?.privacy?.multiplayerChannel || 'mp:public'}</span>
          </div>
          <div className="stable-chip-row alt">
            <span>{universe?.privacy?.privacyTier || 'guest-public'}</span>
            <span>Seeds {universe?.prayerSeeds?.total ?? 0}</span>
            <span>Pilots {presence.length}</span>
          </div>
        </div>

        <div className="content-card stable-card observer quantum-telemetry-card">
          <p className="eyebrow">Q12D / Physics telemetry</p>
          <h3>{telemetry.quantum.signature}</h3>
          <p className="muted">Mathematical flight uses RK4 integration, inverse-square gravity, event-horizon stress, and a 12-dimensional state-space that reacts to your motion and the nearest anchor.</p>
          <div className="focus-meta">
            <span>Speed {telemetry.speed}</span>
            <span>Gravity {telemetry.gravity}</span>
          </div>
          <div className="stable-chip-row alt">
            <span>Coherence {telemetry.quantum.coherencePercent}%</span>
            <span>Entropy {telemetry.quantum.entropyPercent}%</span>
            <span>{telemetry.quantum.dominantDimension}</span>
          </div>
          <p className="stable-flight-note">
            Nearest anchor: {telemetry.nearest || 'deep-space drift'} · Δr {telemetry.nearestDistance} · vₑ {telemetry.escapeVelocity}
          </p>
          <div className="stable-chip-row alt">
            <span>Epoch {telemetry.epoch?.unix ?? epochSummary.unix}</span>
            <span>Dyson {telemetry.epoch?.dysonPercent ?? epochSummary.dysonPercent}%</span>
            <span>Seeds {universe?.prayerSeeds?.total ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="stable-world-canvas polished-canvas cinematic-polished-canvas">
        <Canvas camera={{ position: [0, 8, 26], fov: deviceTier.isMobile ? 52 : 46 }} dpr={deviceTier.dpr} gl={{ antialias: !deviceTier.isMobile }}>
          <StableSceneContent
            onSelect={handleSelect}
            selectedKey={activeNode?.key}
            onAutoFocus={handleAutoFocus}
            touchInput={touchInput}
            deviceTier={deviceTier}
            authenticated={Boolean(steamUser?.steamid)}
            onTelemetryChange={setTelemetry}
          />
        </Canvas>
      </div>

      {deviceTier.isMobile ? <TouchFlightPad onInputChange={setTouchInput} /> : null}
    </div>
  );
}
