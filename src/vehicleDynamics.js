import * as THREE from 'three'

/**
 * Authentic Porsche Vehicle Dynamics & Physics Model
 * Simulates rear-engine (RR) weight distribution, pendulum moment of inertia,
 * non-linear Pacejka tire slip curves, suspension dive/roll, and downforce.
 */

export class VehicleDynamics {
  constructor(carConfig = {}) {
    this.setConfig(carConfig)

    // Dynamic State
    this.heading = 0
    this.speedKmh = 0
    this.longitudinalAcc = 0
    this.lateralAcc = 0
    this.yawRate = 0

    // Suspension & Chassis Visual Rotation
    this.pitch = 0 // Body dive / squat
    this.roll = 0  // Body lean in turns
    this.suspensionTravel = { fl: 0, fr: 0, rl: 0, rr: 0 }

    // Surface Friction
    this.currentSurface = 'asphalt' // 'asphalt' | 'curb' | 'grass'
    this.surfaceFriction = 1.0

    // Drift / Slip State
    this.slipAngle = 0 // Radians
    this.slipRatio = 0
    this.isDrifting = false
    this.driftIntensity = 0
  }

  setConfig(config) {
    this.config = config
    this.isRearEngine = config.id !== 'gt1_lemans' // 911s are RR, GT1 is MR
    this.weightRearBias = this.isRearEngine ? 0.62 : 0.54 // 62% rear weight on 911s
    this.mass = config.id === 'porsche_356' ? 780 : config.id === 'gt1_lemans' ? 1150 : 1350
    this.maxSpeed = config.id === 'porsche_356' ? 24 : config.id === 'gt1_lemans' ? 36 : 31
    this.enginePower = config.id === 'porsche_356' ? 46 : config.id === 'gt1_lemans' ? 76 : 64
    this.hasAeroWing = Boolean(config.id === 'turbo_930' || config.id === 'gt2_993' || config.id === 'gt3_996' || config.id === 'gt1_lemans')
  }

  /**
   * Pacejka Magic Formula simplified for lateral tire grip
   * B: Stiffness, C: Shape factor, D: Peak friction, E: Curvature
   */
  calcLateralTireForce(slipAngleRad, normalLoad) {
    const B = 10.0
    const C = 1.4
    const D = this.surfaceFriction * normalLoad
    const E = -0.15

    const slip = slipAngleRad
    return D * Math.sin(C * Math.atan(B * slip - E * (B * slip - Math.atan(B * slip))))
  }

  /**
   * Calculates dynamic forces, weight transfer, and new velocity
   */
  computeStep({ currentVelocity, currentPosition, throttle, steering, handbrake, delta, upgrades = {} }) {
    const speed = Math.hypot(currentVelocity.x, currentVelocity.z)
    this.speedKmh = speed * 4.8

    // Surface Detection (Check if car is on track vs off-track grass vs curb)
    const distFromOrigin = Math.hypot(currentPosition.x / 32, currentPosition.z / 22)
    const trackDeviation = Math.abs(distFromOrigin - 1.0)

    if (trackDeviation < 0.12) {
      this.currentSurface = 'asphalt'
      this.surfaceFriction = 1.0
    } else if (trackDeviation < 0.16) {
      this.currentSurface = 'curb'
      this.surfaceFriction = 0.85
    } else {
      this.currentSurface = 'grass'
      this.surfaceFriction = 0.45 // Significant grip loss on grass
    }

    // Direction Vectors
    const forwardX = Math.sin(this.heading)
    const forwardZ = Math.cos(this.heading)
    const rightX = forwardZ
    const rightZ = -forwardX

    // Velocity decomposition into Longitudinal (forward) and Lateral (sideways)
    const longSpeed = currentVelocity.x * forwardX + currentVelocity.z * forwardZ
    const latSpeed = currentVelocity.x * rightX + currentVelocity.z * rightZ

    // Weight Transfer (Front / Rear Axle Normal Loads)
    const baseWeight = this.mass * 9.81
    const staticFrontLoad = baseWeight * (1 - this.weightRearBias)
    const staticRearLoad = baseWeight * this.weightRearBias

    // Longitudinal Weight Transfer (Dive under braking, Squat under throttle)
    const accelG = this.longitudinalAcc / 9.81
    const dynamicWeightShift = (accelG * 0.32) * baseWeight

    const frontAxleLoad = Math.max(baseWeight * 0.18, staticFrontLoad - dynamicWeightShift)
    const rearAxleLoad = Math.max(baseWeight * 0.22, staticRearLoad + dynamicWeightShift)

    // Aerodynamic Downforce (scales with v^2)
    let aeroDownforce = 0
    if (this.hasAeroWing && speed > 10) {
      aeroDownforce = Math.pow(speed / 30, 2) * (baseWeight * 0.25) * (1 + (upgrades.aeroDrag || 0) * 0.15)
    }

    // Slip Angle Calculation
    if (speed > 1.2) {
      this.slipAngle = Math.atan2(latSpeed, Math.abs(longSpeed) + 0.1)
    } else {
      this.slipAngle = 0
    }

    // Steering Response & Rear-Engine Pendulum Swing
    // On 911s, braking or lifting off mid-corner increases front grip and decreases rear grip -> pendulum oversteer!
    const isLiftingOff = throttle <= 0 && speed > 12 && Math.abs(steering) > 0.1
    const trailBrakingOversteer = throttle < 0 && Math.abs(steering) > 0.15 ? 1.4 : isLiftingOff ? 1.25 : 1.0

    // Upgrades Influence
    const engineUpgradeFactor = 1 + (upgrades.engine || 0) * 0.08
    const suspensionUpgradeFactor = 1 + (upgrades.suspension || 0) * 0.1
    const tireGripFactor = 1 + (upgrades.tireCompound || 0) * 0.08

    const effectiveMaxSpeed = this.maxSpeed * engineUpgradeFactor
    const steerRate = 0.048 * (0.35 + Math.min(speed / effectiveMaxSpeed, 1))

    // Yaw Rotation (Steering + Pendulum Moment)
    let yawDelta = steering * steerRate * trailBrakingOversteer
    if (handbrake) {
      yawDelta *= 1.75
    }
    this.heading += yawDelta

    // Lateral Grip Force via Pacejka Formula
    const totalLateralLoad = (frontAxleLoad + rearAxleLoad + aeroDownforce) * tireGripFactor * suspensionUpgradeFactor
    const peakGrip = totalLateralLoad * this.surfaceFriction * 0.00035

    // Handbrake and heavy steering break rear traction
    const driftIntent = Math.min(1.0, Math.abs(this.slipAngle) * 3.5 + (handbrake ? 0.85 : 0))
    const gripEfficiency = THREE.MathUtils.lerp(0.96, 0.42, driftIntent)

    const lateralForceCorrection = latSpeed * (1 - (gripEfficiency * peakGrip)) * 0.22

    // Drive Force from Engine / Brakes
    let driveForce = 0
    if (throttle > 0) {
      driveForce = throttle * this.enginePower * engineUpgradeFactor * (1 - speed / (effectiveMaxSpeed + 12))
    } else if (throttle < 0) {
      driveForce = throttle * this.enginePower * 0.75 // Braking force
    }

    // Calculate new velocity
    const nextVel = {
      x: currentVelocity.x + forwardX * driveForce * delta - rightX * lateralForceCorrection,
      y: currentVelocity.y,
      z: currentVelocity.z + forwardZ * driveForce * delta - rightZ * lateralForceCorrection,
    }

    // Natural drag & rolling resistance
    const dragCoeff = this.currentSurface === 'grass' ? 0.88 : 0.94
    if (throttle === 0) {
      nextVel.x *= dragCoeff
      nextVel.z *= dragCoeff
    }

    // Clamp to effective top speed
    const newSpeed = Math.hypot(nextVel.x, nextVel.z)
    if (newSpeed > effectiveMaxSpeed) {
      const scale = effectiveMaxSpeed / newSpeed
      nextVel.x *= scale
      nextVel.z *= scale
    }

    // Update Accelerations for weight transfer
    this.longitudinalAcc = (newSpeed - speed) / Math.max(delta, 0.001)
    this.lateralAcc = Math.abs(latSpeed) * (speed / 10)

    // Chassis Pitch (Dive/Squat) and Roll (Body Lean)
    const targetPitch = THREE.MathUtils.clamp(-this.longitudinalAcc * 0.004, -0.06, 0.05)
    const targetRoll = THREE.MathUtils.clamp(latSpeed * 0.025 + steering * (speed / 20) * 0.04, -0.12, 0.12)

    this.pitch += (targetPitch - this.pitch) * Math.min(delta * 14, 1)
    this.roll += (targetRoll - this.roll) * Math.min(delta * 14, 1)

    // Drift State for effects & scoring
    this.driftIntensity = THREE.MathUtils.clamp((Math.abs(latSpeed) * 0.25 + (handbrake ? 0.5 : 0)) * (speed / 15), 0, 1)
    this.isDrifting = this.driftIntensity > 0.25 && speed > 6

    return {
      nextVelocity: nextVel,
      heading: this.heading,
      pitch: this.pitch,
      roll: this.roll,
      driftIntensity: this.driftIntensity,
      surface: this.currentSurface,
    }
  }
}
