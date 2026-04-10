'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars, Trail, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';

const NAV_BUBBLES = [
  { label: 'Center', type: 'reset', position: [-3.4, 9.6, 0], note: 'Reset system view' },
  { label: 'Donate', href: '/donate', position: [0, 10.1, 0], note: 'Support system' },
  { label: 'Report', href: '/report-player', position: [3.4, 9.6, 0], note: 'Player reporting' },
  { label: 'Free Fly', type: 'freefly', position: [6.9, 9.3, 0], note: 'Toggle ship flight' },
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
  { key: 'report', label: 'Player Reporting', address: 'Moderation route', description: 'Player misconduct and rule-reporting route.', position: [12.0, -1.2, 0.15], color: '#ff8a8a', route: '/report-player', kind: 'node' },
];

function formatStatus(status) {
  if (!status) return 'Status unavailable';
  if (status.online === true) return `${status.players ?? 0} / ${status.maxPlayers ?? '?'}`;
  if (status.online === false) return 'Offline';
  return 'Status unavailable';
}


function DynamicBackgroundField() {
  const group = useRef(null);
  const nebulaA = useRef(null);
  const nebulaB = useRef(null);
  const nebulaC = useRef(null);
  const nebulaD = useRef(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.0035;
    if (nebulaA.current) nebulaA.current.rotation.z += delta * 0.006;
    if (nebulaB.current) nebulaB.current.rotation.z -= delta * 0.004;
    if (nebulaC.current) nebulaC.current.rotation.y += delta * 0.004;
    if (nebulaD.current) nebulaD.current.rotation.x -= delta * 0.003;
  });

  return (
    <group ref={group}>
      <mesh ref={nebulaA} position={[-28, 16, -34]}>
        <sphereGeometry args={[16, 48, 48]} />
        <meshBasicMaterial color="#5d3ff1" transparent opacity={0.12} />
      </mesh>
      <mesh ref={nebulaB} position={[24, -12, -30]}>
        <sphereGeometry args={[18, 48, 48]} />
        <meshBasicMaterial color="#1fc8ff" transparent opacity={0.09} />
      </mesh>
      <mesh ref={nebulaC} position={[2, 24, -42]}>
        <sphereGeometry args={[22, 48, 48]} />
        <meshBasicMaterial color="#ffbb57" transparent opacity={0.05} />
      </mesh>
      <mesh ref={nebulaD} position={[-10, -20, -38]}>
        <sphereGeometry args={[18, 48, 48]} />
        <meshBasicMaterial color="#8d4eff" transparent opacity={0.06} />
      </mesh>

      <Billboard position={[0, 6, -26]} follow>
        <mesh>
          <planeGeometry args={[16, 24]} />
          <meshBasicMaterial color="#6fdfff" transparent opacity={0.06} />
        </mesh>
      </Billboard>
    </group>
  );
}

function MapHologram() {
  return (
    <Billboard position={[13, 9, -12]} follow={false}>
      <mesh rotation={[0, -0.35, 0]}>
        <planeGeometry args={[5.2, 7.2]} />
        <meshBasicMaterial color="#8fe9ff" transparent opacity={0.06} />
      </mesh>
    </Billboard>
  );
}

function CameraReset({ tick }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

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




function FlyShipRig({ enabled, resetTick, onFlightStats }) {
  const { camera, controls } = useThree();
  const shipRef = useRef(null);
  const flameCore = useRef(null);
  const flameLeft = useRef(null);
  const flameRight = useRef(null);
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const shipPos = useRef(new THREE.Vector3(0, 1.4, 26));
  const yaw = useRef(0);
  const pitch = useRef(-0.02);
  const roll = useRef(0);
  const dragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const boostMeter = useRef(100);

  useEffect(() => {
    const onKeyDown = (e) => { keys.current[e.code] = true; };
    const onKeyUp = (e) => { keys.current[e.code] = false; };
    const onMouseDown = (e) => {
      if (!enabled) return;
      dragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { dragging.current = false; };
    const onMouseMove = (e) => {
      if (!enabled || !dragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * 0.0025;
      pitch.current -= dy * 0.0018;
      const limit = Math.PI / 2.45;
      pitch.current = Math.max(-limit, Math.min(limit, pitch.current));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [enabled]);

  useEffect(() => {
    shipPos.current.set(0, 1.4, 26);
    velocity.current.set(0, 0, 0);
    yaw.current = 0;
    pitch.current = -0.02;
    roll.current = 0;
    boostMeter.current = 100;
    if (controls) controls.enabled = !enabled;
  }, [enabled, resetTick, controls]);


  useFrame((state, delta) => {
    if (!shipRef.current) return;

    if (!enabled) {
      shipRef.current.visible = false;
      onFlightStats?.({
        speed: 0,
        boosting: false,
        boostLevel: boostMeter.current,
        gravityTarget: 'None',
        zone: 'Navigation',
      });
      return;
    }

    shipRef.current.visible = true;

    const rawBoost = keys.current['ControlLeft'] || keys.current['ControlRight'];
    const canBoost = boostMeter.current > 4;
    const boost = rawBoost && canBoost;
    const maxSpeed = boost ? 24 : 12;
    const accel = boost ? 0.16 : 0.10;

    if (boost) {
      boostMeter.current = Math.max(0, boostMeter.current - delta * 20);
    } else {
      boostMeter.current = Math.min(100, boostMeter.current + delta * 10);
    }

    const targetRoll =
      (keys.current['KeyD'] ? -0.22 : 0) +
      (keys.current['KeyA'] ? 0.22 : 0) +
      (keys.current['KeyQ'] ? 0.16 : 0) +
      (keys.current['KeyE'] ? -0.16 : 0);

    roll.current += (targetRoll - roll.current) * 0.08;

    const quat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(pitch.current, yaw.current, roll.current, 'YXZ')
    );

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quat).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(quat).normalize();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quat).normalize();

    const move = new THREE.Vector3();
    if (keys.current['KeyW']) move.add(forward);
    if (keys.current['KeyS']) move.addScaledVector(forward, -0.7);
    if (keys.current['KeyD']) move.add(right);
    if (keys.current['KeyA']) move.addScaledVector(right, -1);
    if (keys.current['Space']) move.add(up);
    if (keys.current['ShiftLeft'] || keys.current['ShiftRight']) move.addScaledVector(up, -1);

    if (move.lengthSq() > 0) {
      move.normalize();
      velocity.current.lerp(move.multiplyScalar(maxSpeed), accel);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.035);
    }

    let gravityTarget = 'None';
    let strongestPull = 0;
    const gravityAnchors = [
      { label: 'Arma3', pos: [-9.4, 3.0, 0], radius: 6.5, pull: 1.6 },
      { label: 'S&Box', pos: [0, 8.2, 0], radius: 5.4, pull: 1.2 },
      { label: 'T-Central Hub', pos: [0, -6.0, 0], radius: 8.5, pull: 2.2 },
      { label: 'Deep Black Hole', pos: [-12.2, -5.8, -0.3], radius: 7.0, pull: 1.9 },
    ];

    for (const anchor of gravityAnchors) {
      const d = distance3(anchor.pos, shipPos.current);
      if (d < anchor.radius) {
        const pullFactor = (1 - d / anchor.radius) * anchor.pull;
        if (pullFactor > strongestPull) {
          strongestPull = pullFactor;
          gravityTarget = anchor.label;
        }
        const dir = new THREE.Vector3(anchor.pos[0], anchor.pos[1], anchor.pos[2]).sub(shipPos.current).normalize();
        velocity.current.addScaledVector(dir, pullFactor * delta);
      }
    }

    shipPos.current.addScaledVector(velocity.current, delta);

    shipRef.current.position.copy(shipPos.current);
    shipRef.current.quaternion.copy(quat);

    const thrust = Math.min(1.75, velocity.current.length() / maxSpeed + (boost ? 0.35 : 0));
    const pulse = 0.9 + Math.sin(state.clock.elapsedTime * 26) * 0.1;
    if (flameCore.current) flameCore.current.scale.set(1, 1, pulse * thrust + 0.18);
    if (flameLeft.current) flameLeft.current.scale.set(1, 1, pulse * thrust + 0.14);
    if (flameRight.current) flameRight.current.scale.set(1, 1, pulse * thrust + 0.14);

    const camOffset = new THREE.Vector3(0, 0.72, 3.65).applyQuaternion(quat);
    const desiredCam = shipPos.current.clone().add(camOffset);
    camera.position.lerp(desiredCam, 0.08);

    const lookTarget = shipPos.current.clone().add(forward.clone().multiplyScalar(12));
    const lookMatrix = new THREE.Matrix4().lookAt(camera.position, lookTarget, camera.up);
    const lookQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);
    camera.quaternion.slerp(lookQuat, 0.18);

    if (controls) {
      controls.target.copy(lookTarget);
      controls.update();
    }

    let zone = 'Open Space';
    if (shipPos.current.y > 5) zone = 'Upper Sectors';
    else if (shipPos.current.y < -4) zone = 'Lower Hub';
    else zone = 'Central Band';

    onFlightStats?.({
      speed: velocity.current.length(),
      boosting: boost,
      boostLevel: boostMeter.current,
      gravityTarget,
      zone,
    });
  });



  return (
    <group ref={shipRef} visible={false} scale={0.58} rotation={[Math.PI / 2, 0, 0]}>
      <group>
        {/* main nose cone */}
        <mesh position={[0, 0.02, 1.35]}>
          <coneGeometry args={[0.17, 2.0, 36]} />
          <meshStandardMaterial color="#eff8ff" emissive="#9de8ff" emissiveIntensity={0.14} metalness={0.76} roughness={0.2} />
        </mesh>

        {/* front body */}
        <mesh position={[0, 0.02, 0.55]}>
          <cylinderGeometry args={[0.19, 0.22, 1.3, 28]} />
          <meshStandardMaterial color="#667c95" metalness={0.58} roughness={0.28} />
        </mesh>

        {/* rear fuselage */}
        <mesh position={[0, 0.02, -0.45]}>
          <cylinderGeometry args={[0.24, 0.24, 1.4, 28]} />
          <meshStandardMaterial color="#60748b" metalness={0.56} roughness={0.3} />
        </mesh>

        {/* canopy */}
        <mesh position={[0, 0.2, 0.52]} scale={[0.72, 0.34, 1.4]}>
          <sphereGeometry args={[0.26, 28, 28]} />
          <meshStandardMaterial color="#b9edff" emissive="#8fe2ff" emissiveIntensity={0.24} transparent opacity={0.72} />
        </mesh>

        {/* dorsal spine */}
        <mesh position={[0, 0.28, -0.05]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.1, 0.62, 1.95]} />
          <meshStandardMaterial color="#788ca2" metalness={0.4} roughness={0.36} />
        </mesh>

        {/* side intakes */}
        <mesh position={[-0.28, 0.03, -0.08]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.18, 0.2, 0.72]} />
          <meshStandardMaterial color="#55697f" metalness={0.44} roughness={0.34} />
        </mesh>
        <mesh position={[0.28, 0.03, -0.08]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.18, 0.2, 0.72]} />
          <meshStandardMaterial color="#55697f" metalness={0.44} roughness={0.34} />
        </mesh>

        {/* main wings */}
        <mesh position={[-0.85, -0.02, -0.02]} rotation={[0.05, 0.08, 0.14]}>
          <boxGeometry args={[1.18, 0.05, 0.78]} />
          <meshStandardMaterial color="#95aac3" metalness={0.44} roughness={0.34} />
        </mesh>
        <mesh position={[0.85, -0.02, -0.02]} rotation={[0.05, -0.08, -0.14]}>
          <boxGeometry args={[1.18, 0.05, 0.78]} />
          <meshStandardMaterial color="#95aac3" metalness={0.44} roughness={0.34} />
        </mesh>

        {/* front winglets */}
        <mesh position={[-0.52, -0.01, 0.95]} rotation={[0.03, 0.1, 0.34]}>
          <boxGeometry args={[0.58, 0.035, 0.46]} />
          <meshStandardMaterial color="#a8bbd0" metalness={0.42} roughness={0.34} />
        </mesh>
        <mesh position={[0.52, -0.01, 0.95]} rotation={[0.03, -0.1, -0.34]}>
          <boxGeometry args={[0.58, 0.035, 0.46]} />
          <meshStandardMaterial color="#a8bbd0" metalness={0.42} roughness={0.34} />
        </mesh>

        {/* twin rear fins */}
        <mesh position={[-0.38, 0.35, -1.15]} rotation={[0.52, 0.03, 0.08]}>
          <boxGeometry args={[0.09, 0.82, 0.92]} />
          <meshStandardMaterial color="#7a8da3" metalness={0.36} roughness={0.42} />
        </mesh>
        <mesh position={[0.38, 0.35, -1.15]} rotation={[0.52, -0.03, -0.08]}>
          <boxGeometry args={[0.09, 0.82, 0.92]} />
          <meshStandardMaterial color="#7a8da3" metalness={0.36} roughness={0.42} />
        </mesh>

        {/* ventral fin / keel */}
        <mesh position={[0, -0.28, -0.35]}>
          <boxGeometry args={[0.2, 0.08, 1.22]} />
          <meshStandardMaterial color="#6f8399" metalness={0.32} roughness={0.42} />
        </mesh>

        {/* engine pods */}
        <mesh position={[-0.24, -0.09, -1.42]} rotation={[0.12, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.12, 0.56, 20]} />
          <meshStandardMaterial color="#566a81" metalness={0.54} roughness={0.28} />
        </mesh>
        <mesh position={[0.24, -0.09, -1.42]} rotation={[0.12, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.12, 0.56, 20]} />
          <meshStandardMaterial color="#566a81" metalness={0.54} roughness={0.28} />
        </mesh>
        <mesh position={[0, -0.05, -1.58]} rotation={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.14, 0.62, 20]} />
          <meshStandardMaterial color="#5b6f85" metalness={0.56} roughness={0.28} />
        </mesh>

        {/* engine glows */}
        <mesh position={[-0.24, -0.09, -1.6]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshBasicMaterial color="#79e6ff" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.24, -0.09, -1.6]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshBasicMaterial color="#79e6ff" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, -0.05, -1.76]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshBasicMaterial color="#9aefff" transparent opacity={0.6} />
        </mesh>

        {/* thrusters */}
        <mesh ref={flameCore} position={[0, -0.05, -2.0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.095, 0.64, 18]} />
          <meshBasicMaterial color="#90e8ff" transparent opacity={0.94} />
        </mesh>
        <mesh ref={flameLeft} position={[-0.24, -0.09, -1.78]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.34, 16]} />
          <meshBasicMaterial color="#7ee7ff" transparent opacity={0.84} />
        </mesh>
        <mesh ref={flameRight} position={[0.24, -0.09, -1.78]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.34, 16]} />
          <meshBasicMaterial color="#7ee7ff" transparent opacity={0.84} />
        </mesh>

        {/* wireframe overlay */}
        <lineSegments position={[0, 0.02, 0.55]}>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.19, 0.22, 1.3, 20)]} />
          <lineBasicMaterial color="#bceeff" transparent opacity={0.16} />
        </lineSegments>
        <lineSegments position={[0, 0.02, -0.45]}>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.24, 0.24, 1.4, 20)]} />
          <lineBasicMaterial color="#9de7ff" transparent opacity={0.14} />
        </lineSegments>
        <lineSegments position={[0, 0.02, 1.35]}>
          <edgesGeometry args={[new THREE.ConeGeometry(0.17, 2.0, 20)]} />
          <lineBasicMaterial color="#d5f7ff" transparent opacity={0.14} />
        </lineSegments>
        <lineSegments position={[0, 0.2, 0.52]} scale={[0.72, 0.34, 1.4]}>
          <edgesGeometry args={[new THREE.SphereGeometry(0.26, 18, 18)]} />
          <lineBasicMaterial color="#c8f5ff" transparent opacity={0.12} />
        </lineSegments>
        <lineSegments position={[-0.85, -0.02, -0.02]} rotation={[0.05, 0.08, 0.14]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.18, 0.05, 0.78)]} />
          <lineBasicMaterial color="#89ddff" transparent opacity={0.14} />
        </lineSegments>
        <lineSegments position={[0.85, -0.02, -0.02]} rotation={[0.05, -0.08, -0.14]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.18, 0.05, 0.78)]} />
          <lineBasicMaterial color="#89ddff" transparent opacity={0.14} />
        </lineSegments>
        <lineSegments position={[-0.38, 0.35, -1.15]} rotation={[0.52, 0.03, 0.08]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.09, 0.82, 0.92)]} />
          <lineBasicMaterial color="#8ce4ff" transparent opacity={0.14} />
        </lineSegments>
        <lineSegments position={[0.38, 0.35, -1.15]} rotation={[0.52, -0.03, -0.08]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.09, 0.82, 0.92)]} />
          <lineBasicMaterial color="#8ce4ff" transparent opacity={0.14} />
        </lineSegments>
        <lineSegments position={[-0.24, -0.09, -1.42]} rotation={[0.12, 0, 0]}>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.085, 0.12, 0.56, 16)]} />
          <lineBasicMaterial color="#c9f5ff" transparent opacity={0.12} />
        </lineSegments>
        <lineSegments position={[0.24, -0.09, -1.42]} rotation={[0.12, 0, 0]}>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.085, 0.12, 0.56, 16)]} />
          <lineBasicMaterial color="#c9f5ff" transparent opacity={0.12} />
        </lineSegments>
      </group>
    </group>
  );
}

function OrbitalMatter({ radius = 2.9, color = '#8f76ff', speed = 0.14, tilt = [Math.PI / 2.4, 0, 0], count = 44, spread = 0.16 }) {
  const ref = useRef(null);
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const r = radius + Math.sin(i * 1.87) * spread;
    return { position: [Math.cos(angle) * r, Math.cos(i * 0.8) * 0.08, Math.sin(angle) * r], scale: 0.03 + (i % 4) * 0.008 };
  }), [count, radius, spread]);

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
  const group = useRef(null);
  const disc = useRef(null);

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
  const group = useRef(null);
  const ringA = useRef(null);
  const ringB = useRef(null);
  const ringC = useRef(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.16;
    if (ringA.current) ringA.current.rotation.x += delta * 0.42;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.3;
    if (ringC.current) ringC.current.rotation.z += delta * 0.48;
  });

  return (
    <group position={node.position} ref={group} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh><sphereGeometry args={[0.42, 24, 24]} /><meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={1.95} /></mesh>
      <mesh ref={ringA}><torusGeometry args={[0.95, 0.03, 12, 120]} /><meshStandardMaterial color="#ffe694" emissive="#ffe694" emissiveIntensity={1.1} /></mesh>
      <mesh ref={ringB} rotation={[1.05, 0.25, 0.16]}><torusGeometry args={[1.22, 0.024, 12, 120]} /><meshStandardMaterial color="#ffd15c" emissive="#ffd15c" emissiveIntensity={0.95} /></mesh>
      <mesh ref={ringC} rotation={[0.2, 0.72, 1.0]}><torusGeometry args={[1.48, 0.02, 12, 120]} /><meshStandardMaterial color="#fff4c1" emissive="#fff4c1" emissiveIntensity={0.85} /></mesh>
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
  const core = useRef(null);
  const halo = useRef(null);

  useFrame((state, delta) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.3) * 0.12;
    if (core.current) core.current.scale.setScalar(pulse);
    if (halo.current) halo.current.rotation.y += delta * 0.44;
  });

  return (
    <group position={node.position} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh ref={core}><dodecahedronGeometry args={[0.35, 0]} /><meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={1.95} /></mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0]}><torusGeometry args={[1.0, 0.022, 12, 100]} /><meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.95} /></mesh>
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
  const planetRef = useRef(null);
  const ringRef = useRef(null);

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
      <mesh ref={planetRef}><sphereGeometry args={[planet.radius, 20, 20]} /><meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={0.35} /></mesh>
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
  const group = useRef(null);
  const sunRef = useRef(null);
  const planets = useMemo(() => [
    { name: 'Mercury', radius: 0.06, orbit: 0.9, speed: 1.3, color: '#c7b39a' },
    { name: 'Venus', radius: 0.09, orbit: 1.25, speed: 1.05, color: '#d8b47a' },
    { name: 'Earth', radius: 0.1, orbit: 1.65, speed: 0.88, color: '#5fb7ff' },
    { name: 'Mars', radius: 0.08, orbit: 2.0, speed: 0.76, color: '#d86d54' },
    { name: 'Jupiter', radius: 0.2, orbit: 2.55, speed: 0.54, color: '#d9b48b' },
    { name: 'Saturn', radius: 0.16, orbit: 3.15, speed: 0.43, color: '#e0c582', ring: true },
    { name: 'Uranus', radius: 0.12, orbit: 3.75, speed: 0.34, color: '#9ce3ff' },
    { name: 'Neptune', radius: 0.12, orbit: 4.25, speed: 0.28, color: '#628dff' },
    { name: 'Pluto', radius: 0.05, orbit: 4.8, speed: 0.22, color: '#b3b3c9' },
  ], []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.04;
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group position={node.position} ref={group} onClick={(e) => { e.stopPropagation(); onSelect(node); }}>
      <mesh ref={sunRef}><sphereGeometry args={[0.42, 32, 32]} /><meshStandardMaterial color="#ffd46b" emissive="#ffd46b" emissiveIntensity={2.2} /></mesh>
      {planets.map((planet, i) => (
        <group key={planet.name}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[planet.orbit, 0.008, 8, 120]} /><meshBasicMaterial color="white" transparent opacity={0.12} /></mesh>
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
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.06;
  });

  return (
    <group position={position}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.018, 10, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.26} />
      </mesh>
      <Html position={[0, radius + 0.65, 0]} center><div className="sector-label">{label}</div></Html>
    </group>
  );
}

function ConstellationLines() {
  const pointGroups = useMemo(() => [
    [NODES.find((n) => n.key === 'arma3').position, NODES.find((n) => n.key === 'sbox').position, NODES.find((n) => n.key === 'ss').position, NODES.find((n) => n.key === 'ns').position],
    [NODES.find((n) => n.key === 'rust_anchor').position, NODES.find((n) => n.key === 'rust_biweekly').position, NODES.find((n) => n.key === 'rust_weekly').position, NODES.find((n) => n.key === 'rust_monthly').position],
    [NODES.find((n) => n.key === 'ss').position, NODES.find((n) => n.key === 'report').position, NODES.find((n) => n.key === 'nfo').position],
    [NODES.find((n) => n.key === 'deep_blackhole').position, NODES.find((n) => n.key === 'rust_anchor').position, NODES.find((n) => n.key === 'solar_system').position],
  ], []);

  return (
    <>
      {pointGroups.map((group, i) => (
        <Line key={i} points={group} color="#71e9ff" transparent opacity={0.14} lineWidth={1} />
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
  const mesh = useRef(null);
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
      <mesh><sphereGeometry args={[selected ? 0.6 : 0.5, 20, 20]} /><meshBasicMaterial color={glowColor} transparent opacity={selected ? 0.15 : 0.08} /></mesh>
      <Html center distanceFactor={8.8} position={[0, selected ? 0.92 : 0.78, 0]}>
        <button className={`map-node-label ${selected ? 'active' : ''}`} onMouseEnter={() => onHover(node.key)} onMouseLeave={onLeave} onClick={() => onSelect(node)}>
          <strong>{node.label}</strong>
          <span>{node.address}</span>
          <em>{node.description}</em>
          <small>{formatStatus(status)}</small>
        </button>
      </Html>
    </group>
  );
}

function Scene({ statuses, onSelect, onBubble, resetTick, freeFly, onFlightStats }) {
  const [hovered, setHovered] = useState('rust_biweekly');

  return (
    <>
      <DynamicBackgroundField />
      <MapHologram />
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
          <StatusNode key={node.key} node={node} status={statuses?.[node.key]} selected={hovered === node.key} onHover={setHovered} onLeave={() => setHovered('rust_biweekly')} onSelect={onSelect} />
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
      <FlyShipRig enabled={freeFly} resetTick={resetTick} onFlightStats={onFlightStats} />
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
        <div><p className="eyebrow">Selected node</p><h4>{item.label}</h4></div>
        <button className="focus-close" onClick={onClose}>×</button>
      </div>
      <p className="muted">{item.description}</p>
      <div className="focus-meta"><span>{item.address || item.sublabel}</span></div>
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


function distance3(a, b) {
  return Math.sqrt(
    (a[0] - b.x) ** 2 +
    (a[1] - b.y) ** 2 +
    (a[2] - b.z) ** 2
  );
}

function GameHUD({ freeFly, flightStats }) {
  return (
    <div className={`game-hud ${freeFly ? 'active' : ''}`}>
      <div className="hud-left">
        <div className="hud-card">
          <span className="hud-label">Mode</span>
          <strong>{freeFly ? 'Rocket Flight' : 'Navigation'}</strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">Speed</span>
          <strong>{Math.round(flightStats.speed)}</strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">Boost</span>
          <strong>{flightStats.boosting ? 'Active' : 'Standby'}</strong>
        </div>
      </div>

      {freeFly ? <div className="hud-crosshair"><span /><span /></div> : null}

      <div className="hud-right">
        <div className="hud-card">
          <span className="hud-label">Gravity Pull</span>
          <strong>{flightStats.gravityTarget || 'None'}</strong>
        </div>
        <div className="hud-card">
          <span className="hud-label">Zone</span>
          <strong>{flightStats.zone || 'Open Space'}</strong>
        </div>
      </div>

      {freeFly ? (
        <div className="hud-bottom">
          <div className="boost-bar">
            <div className="boost-fill" style={{ width: `${Math.min(100, flightStats.boostLevel)}%` }} />
          </div>
          <p>WASD move · Mouse drag steer · Space/Shift vertical · Ctrl boost · Q/E roll</p>
        </div>
      ) : null}
    </div>
  );
}


function CinematicIntro({ visible }) {
  if (!visible) return null;
  return (
    <div className="cinematic-intro">
      <div className="cinematic-scan" />
      <div className="cinematic-copy">
        <p>T-Central Web Game</p>
        <h2>Initializing navigation systems…</h2>
      </div>
    </div>
  );
}

function SystemOverlay({ loading, mode, freeFly }) {
  return (
    <div className="system-overlay minimal">
      <div className="overlay-status">
        <span>
          {loading ? 'Loading status layer…' : mode === 'remote' ? 'Live status layer connected' : 'Status layer ready — source not configured'}
          {freeFly ? ' • Rocket Flight active' : ''}
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
  const [flightStats, setFlightStats] = useState({ speed: 0, boosting: false, boostLevel: 100, gravityTarget: 'None', zone: 'Navigation' });
  const [introVisible, setIntroVisible] = useState(true);

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
        label: 'Rocket Ship Mode',
        address: 'WASD + drag + Space/Shift + Ctrl boost + Q/E roll',
        description: 'Use W A S D to move, Space to rise, Shift to descend, hold the mouse button while dragging to steer, hold Control to boost, and use Q / E for extra roll. The craft is rebuilt as a more recognizable futuristic spaceship with rocket-inspired proportions and denser wireframe detailing.',
      });
      return;
    }
    setSelected({ label: bubble.label, address: bubble.note, description: bubble.note, href: bubble.href, route: bubble.href });
  };

  return (
    <div className="system-page refined">
      <CinematicIntro visible={introVisible} />
      <SystemOverlay loading={loading} mode={mode} freeFly={freeFly} />
      <GameHUD freeFly={freeFly} flightStats={flightStats} />
      <div className="interactive-map-stage full refined-stage">
        <Canvas camera={{ position: [0, 1.4, 26], fov: 38 }}>
          <Scene statuses={statuses} onSelect={setSelected} onBubble={onBubble} resetTick={resetTick} freeFly={freeFly} onFlightStats={setFlightStats} />
        </Canvas>
        <FocusPanel item={selected} statuses={statuses} onClose={() => setSelected(null)} onOpen={openNode} />
        {transition ? <WarpOverlay label={transition} /> : null}
      </div>
    </div>
  );
}
