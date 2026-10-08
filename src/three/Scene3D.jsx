import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraRig from './CameraRig'
import GlassPanel from './GlassPanel'
import AgentNode from './AgentNode'
import DataFlow from './DataFlow'
import Particles from './Particles'
import { TIER_SETTINGS } from '../hooks/useDeviceTier'

const VIOLET = '#7c3aed'
const CYAN = '#0891b2'
const AMBER = '#d97706'

function World({ tier }) {
  const s = TIER_SETTINGS[tier]
  const full = tier === 'high'

  return (
    <>
      {/* ---------- Chapter 1: arrival ---------- */}
      <GlassPanel position={[-5.6, 0.8, -3]} rotation={[0, 0.6, 0]} kind="website" seed={1} />
      <GlassPanel position={[5.4, -0.6, -4.5]} rotation={[0, -0.55, 0]} kind="software" seed={2} />
      {full && (
        <GlassPanel position={[0.6, 2.6, -8]} rotation={[0, 0.1, 0]} kind="agent" seed={3} scale={0.8} />
      )}
      <AgentNode position={[-2.2, -2.0, -6]} color={VIOLET} seed={1} size={0.36} />
      <AgentNode position={[3.2, 2.0, -7]} color={CYAN} seed={2} size={0.3} />
      <DataFlow from={[-5.6, 0.8, -3]} to={[-2.2, -2.0, -6]} color={VIOLET} seed={0.2} />
      <DataFlow from={[5.4, -0.6, -4.5]} to={[3.2, 2.0, -7]} color={CYAN} seed={0.7} />

      {/* ---------- Chapter 2: the service constellation ---------- */}
      <AgentNode position={[-5.6, 1.4, -15]} color={VIOLET} seed={3} size={0.34} />
      <AgentNode position={[-3.0, -1.8, -17]} color={CYAN} seed={4} size={0.3} />
      <AgentNode position={[4.6, 1.8, -16]} color={AMBER} seed={5} size={0.34} />
      {full && <AgentNode position={[6.2, -1.4, -18.5]} color={VIOLET} seed={6} size={0.3} />}
      {full && <AgentNode position={[0.4, 3.4, -19]} color={CYAN} seed={7} size={0.28} />}
      <DataFlow from={[-5.6, 1.4, -15]} to={[-3.0, -1.8, -17]} color={VIOLET} seed={1.1} sag={0.5} />
      <DataFlow from={[4.6, 1.8, -16]} to={[-3.0, -1.8, -17]} color={CYAN} seed={1.6} sag={1.1} />
      {full && (
        <>
          <DataFlow from={[4.6, 1.8, -16]} to={[6.2, -1.4, -18.5]} color={AMBER} seed={2.1} sag={0.4} />
          <DataFlow from={[-5.6, 1.4, -15]} to={[0.4, 3.4, -19]} color={VIOLET} seed={2.6} sag={0.6} />
        </>
      )}
      <GlassPanel position={[5.2, -0.2, -21]} rotation={[0, -0.5, 0]} kind="agent" seed={8} />

      {/* ---------- Chapter 3: the work ---------- */}
      <GlassPanel position={[-5.8, 1.6, -25]} rotation={[0, 0.6, 0.03]} kind="website" seed={9} />
      <GlassPanel position={[5.6, 0.6, -27]} rotation={[0, -0.55, -0.03]} kind="website" seed={10} />
      {full && (
        <GlassPanel position={[-5.0, -2.2, -29]} rotation={[0, 0.45, 0]} kind="software" seed={11} scale={0.9} />
      )}
      <GlassPanel position={[4.8, -2.0, -30.5]} rotation={[0, -0.4, 0]} kind="software" seed={12} scale={0.95} />
      {full && (
        <GlassPanel position={[-0.4, 3.2, -31]} rotation={[0, 0.1, 0]} kind="agent" seed={13} scale={0.78} />
      )}

      {/* ---------- Chapter 4: everything connected ---------- */}
      <AgentNode position={[-4.6, 1.2, -36]} color={CYAN} seed={8} size={0.32} />
      <AgentNode position={[4.6, -0.8, -37]} color={AMBER} seed={9} size={0.32} />
      <AgentNode position={[0, 0.2, -42]} color={VIOLET} seed={10} size={0.6} />
      <DataFlow from={[-4.6, 1.2, -36]} to={[0, 0.2, -42]} color={CYAN} seed={3.1} sag={0.6} pulses={4} />
      <DataFlow from={[4.6, -0.8, -37]} to={[0, 0.2, -42]} color={AMBER} seed={3.6} sag={0.6} pulses={4} />

      <Particles count={s.particles} />
    </>
  )
}

export default function Scene3D({ progressRef, tier }) {
  const s = TIER_SETTINGS[tier]
  const [active, setActive] = useState(true)

  useEffect(() => {
    const onVisibility = () => setActive(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <Canvas
      className="scene-canvas"
      dpr={s.dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0.5, 10] }}
    >
      <ambientLight intensity={1.15} />
      <hemisphereLight args={['#ffffff', '#cbd5f5', 0.8]} />
      <directionalLight position={[6, 8, 6]} intensity={1.1} />
      <directionalLight position={[-6, -2, -4]} intensity={0.35} color="#a78bfa" />
      <fog attach="fog" args={['#f3f5fb', 22, 70]} />

      <CameraRig progressRef={progressRef} interactive={tier === 'high'} />
      <World tier={tier} />
    </Canvas>
  )
}
