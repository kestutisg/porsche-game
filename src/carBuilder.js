import * as THREE from 'three'

// Porsche Catalog with historical technical specifications and styling profiles
export const PORSCHE_CATALOG = {
  porsche_356: {
    id: 'porsche_356',
    name: '356 A Speedster',
    year: 1956,
    era: 'classic',
    eraLabel: 'Classic Era',
    tagline: 'The timeless lightweight icon that started the legend.',
    engine: '1.6L Air-Cooled Flat-4',
    power: '75 hp @ 5,000 RPM',
    torque: '117 Nm @ 3,700 RPM',
    topSpeed: '175 km/h',
    acceleration: '12.5s (0-100 km/h)',
    weight: '760 kg',
    layout: 'Rear-Engine, RWD',
    price: 0,
    defaultColor: '#c0c0c8',
    defaultWheelColor: '#d1d5db',
    audioProfile: { basePitch: 45, revMulti: 5.5, maxFreq: 420, roughness: 0.8 },
  },
  carrera_rs: {
    id: 'carrera_rs',
    name: '911 Carrera RS 2.7',
    year: 1973,
    era: 'golden',
    eraLabel: 'Golden Era',
    tagline: 'The pure homologation special featuring the legendary ducktail.',
    engine: '2.7L Air-Cooled Flat-6 MFI',
    power: '210 hp @ 6,300 RPM',
    torque: '255 Nm @ 5,100 RPM',
    topSpeed: '245 km/h',
    acceleration: '5.8s (0-100 km/h)',
    weight: '975 kg',
    layout: 'Rear-Engine, RWD',
    price: 1800,
    defaultColor: '#f8fafc',
    defaultStripeColor: '#2563eb',
    defaultWheelColor: '#2563eb',
    audioProfile: { basePitch: 55, revMulti: 7.0, maxFreq: 580, roughness: 0.65 },
  },
  turbo_930: {
    id: 'turbo_930',
    name: '911 Turbo 3.3 (930)',
    year: 1978,
    era: 'golden',
    eraLabel: 'Golden Era',
    tagline: 'The legendary "Widowmaker" with explosive turbo boost and whale-tail.',
    engine: '3.3L Turbocharged Air-Cooled Flat-6',
    power: '300 hp @ 5,500 RPM',
    torque: '412 Nm @ 4,000 RPM',
    topSpeed: '260 km/h',
    acceleration: '5.2s (0-100 km/h)',
    weight: '1,300 kg',
    layout: 'Rear-Engine, RWD',
    price: 3200,
    defaultColor: '#dc2626',
    defaultWheelColor: '#18181b',
    audioProfile: { basePitch: 50, revMulti: 7.5, maxFreq: 640, roughness: 0.75, hasBlowoff: true },
  },
  gt2_993: {
    id: 'gt2_993',
    name: '911 GT2 (993)',
    year: 1995,
    era: 'golden',
    eraLabel: 'Air-Cooled Climax',
    tagline: 'The pinnacle of air-cooled racing with riveted widebody and twin turbos.',
    engine: '3.6L Twin-Turbo Air-Cooled Flat-6',
    power: '430 hp @ 5,750 RPM',
    torque: '540 Nm @ 4,500 RPM',
    topSpeed: '295 km/h',
    acceleration: '3.9s (0-100 km/h)',
    weight: '1,290 kg',
    layout: 'Rear-Engine, RWD',
    price: 5400,
    defaultColor: '#eab308',
    defaultWheelColor: '#e2e8f0',
    audioProfile: { basePitch: 58, revMulti: 8.2, maxFreq: 720, roughness: 0.6, hasBlowoff: true },
  },
  gt3_996: {
    id: 'gt3_996',
    name: '911 GT3 RS (996)',
    year: 2003,
    era: 'modern',
    eraLabel: 'Modern Era',
    tagline: 'High-revving Mezger naturally-aspirated track weapon with carbon aero.',
    engine: '3.6L Naturally Aspirated Mezger Flat-6',
    power: '381 hp @ 7,400 RPM',
    torque: '385 Nm @ 5,000 RPM',
    topSpeed: '306 km/h',
    acceleration: '4.4s (0-100 km/h)',
    weight: '1,360 kg',
    layout: 'Rear-Engine, RWD',
    price: 7500,
    defaultColor: '#f8fafc',
    defaultStripeColor: '#ef4444',
    defaultWheelColor: '#ef4444',
    audioProfile: { basePitch: 64, revMulti: 9.0, maxFreq: 860, roughness: 0.45 },
  },
  gt1_lemans: {
    id: 'gt1_lemans',
    name: '911 GT1 Strassenversion',
    year: 1998,
    era: 'modern',
    eraLabel: 'Ultimate Exotic',
    tagline: 'Le Mans winning prototype homologated for the street.',
    engine: '3.2L Twin-Turbo Mid-Engine Flat-6',
    power: '544 hp @ 7,200 RPM',
    torque: '600 Nm @ 4,250 RPM',
    topSpeed: '310 km/h',
    acceleration: '3.7s (0-100 km/h)',
    weight: '1,150 kg',
    layout: 'Mid-Engine, RWD',
    price: 11000,
    defaultColor: '#f8fafc',
    defaultWheelColor: '#e2e8f0',
    audioProfile: { basePitch: 62, revMulti: 9.5, maxFreq: 900, roughness: 0.5, hasBlowoff: true },
  },
}

export const FACTORY_PAINTS = [
  { name: 'Guards Red', hex: '#d91424' },
  { name: 'Speed Yellow', hex: '#fabc05' },
  { name: 'Riviera Blue', hex: '#0284c7' },
  { name: 'GT Silver Metallic', hex: '#94a3b8' },
  { name: 'British Racing Green', hex: '#14532d' },
  { name: 'Schwarz Black', hex: '#0f172a' },
  { name: 'Grand Prix White', hex: '#f8fafc' },
  { name: 'Viola Metallic', hex: '#4c1d95' },
  { name: 'Signal Orange', hex: '#ea580c' },
  { name: 'Gulf Blue', hex: '#7dd3fc' },
]

export const WHEEL_FINISHES = [
  { name: 'Silver Alloy', hex: '#e2e8f0', metalness: 0.85, roughness: 0.25 },
  { name: 'Matte Gold', hex: '#d97706', metalness: 0.7, roughness: 0.45 },
  { name: 'Gloss Black', hex: '#18181b', metalness: 0.9, roughness: 0.15 },
  { name: 'Gunmetal Titanium', hex: '#475569', metalness: 0.8, roughness: 0.3 },
  { name: 'Guards Red Racing', hex: '#dc2626', metalness: 0.5, roughness: 0.35 },
]

// Helpers for procedural modeling
function createSharedMaterials() {
  return {
    tire: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.92, metalness: 0.05 }),
    tireTread: new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.98 }),
    brakeDisc: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 }),
    caliperRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.6 }),
    caliperYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.6 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.08 }),
    blackTrim: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.2 }),
    carbonFiber: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5,
    }),
    interior: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 }),
    headlightGlass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
    }),
    headlightReflector: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x000000,
      emissiveIntensity: 0,
    }),
    taillightReflector: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.4,
      roughness: 0.2,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.6,
    }),
    amberIndicator: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.4,
      roughness: 0.3,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
    }),
  }
}

/**
 * Creates a detailed wheel assembly with rim, tire, vented brake disc, and caliper
 */
function createWheelAssembly(wheelColorHex, rimStyle = 'fuchs', sharedMat) {
  const wheelGroup = new THREE.Group()

  // Outer Tire
  const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.38, 24)
  const tire = new THREE.Mesh(tireGeo, sharedMat.tire)
  tire.rotation.z = Math.PI / 2
  tire.castShadow = true
  tire.receiveShadow = true
  wheelGroup.add(tire)

  // Tire sidewall rim
  const sidewallGeo = new THREE.TorusGeometry(0.38, 0.05, 12, 24)
  const sidewall = new THREE.Mesh(sidewallGeo, sharedMat.tire)
  sidewall.rotation.y = Math.PI / 2
  wheelGroup.add(sidewall)

  // Wheel Rim Material
  const rimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(wheelColorHex),
    metalness: 0.85,
    roughness: 0.2,
  })

  // Rim barrel
  const rimBarrelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.39, 24, 1, true)
  const rimBarrel = new THREE.Mesh(rimBarrelGeo, rimMat)
  rimBarrel.rotation.z = Math.PI / 2
  wheelGroup.add(rimBarrel)

  // Center hub & spokes based on style
  if (rimStyle === 'classic_cap') {
    // 356 Chrome Hubcap
    const capGeo = new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45)
    const cap = new THREE.Mesh(capGeo, sharedMat.chrome)
    cap.rotation.z = -Math.PI / 2
    cap.position.x = 0.18
    wheelGroup.add(cap)
  } else if (rimStyle === 'fuchs') {
    // Iconic 5-leaf Fuchs cloverleaf
    const centerGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16)
    const center = new THREE.Mesh(centerGeo, sharedMat.blackTrim)
    center.rotation.z = Math.PI / 2
    center.position.x = 0.17
    wheelGroup.add(center)

    for (let i = 0; i < 5; i++) {
      const spokeAngle = (i / 5) * Math.PI * 2
      const spokeGeo = new THREE.BoxGeometry(0.04, 0.06, 0.22)
      const spoke = new THREE.Mesh(spokeGeo, rimMat)
      spoke.position.set(0.18, Math.cos(spokeAngle) * 0.16, Math.sin(spokeAngle) * 0.16)
      spoke.rotation.x = -spokeAngle
      wheelGroup.add(spoke)
    }
  } else if (rimStyle === 'bbs_mesh') {
    // GT2 Racing Mesh
    const centerCapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12)
    const centerCap = new THREE.Mesh(centerCapGeo, sharedMat.chrome)
    centerCap.rotation.z = Math.PI / 2
    centerCap.position.x = 0.18
    wheelGroup.add(centerCap)

    for (let i = 0; i < 10; i++) {
      const spokeAngle = (i / 10) * Math.PI * 2
      const spokeGeo = new THREE.BoxGeometry(0.02, 0.04, 0.25)
      const spoke = new THREE.Mesh(spokeGeo, rimMat)
      spoke.position.set(0.17, Math.cos(spokeAngle) * 0.15, Math.sin(spokeAngle) * 0.15)
      spoke.rotation.x = -spokeAngle
      wheelGroup.add(spoke)
    }
  } else {
    // 5-Spoke Sport Rim (Turbo/GT3/GT1)
    const centerCapGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16)
    const centerCap = new THREE.Mesh(centerCapGeo, rimMat)
    centerCap.rotation.z = Math.PI / 2
    centerCap.position.x = 0.17
    wheelGroup.add(centerCap)

    for (let i = 0; i < 5; i++) {
      const spokeAngle = (i / 5) * Math.PI * 2
      const spokeGeo = new THREE.BoxGeometry(0.035, 0.07, 0.23)
      const spoke = new THREE.Mesh(spokeGeo, rimMat)
      spoke.position.set(0.17, Math.cos(spokeAngle) * 0.15, Math.sin(spokeAngle) * 0.15)
      spoke.rotation.x = -spokeAngle
      wheelGroup.add(spoke)
    }
  }

  // Brake Disc inside wheel
  const discGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 18)
  const disc = new THREE.Mesh(discGeo, sharedMat.brakeDisc)
  disc.rotation.z = Math.PI / 2
  disc.position.x = 0.06
  wheelGroup.add(disc)

  // Brake Caliper
  const caliperGeo = new THREE.BoxGeometry(0.07, 0.14, 0.1)
  const caliper = new THREE.Mesh(caliperGeo, rimStyle === 'fuchs' || rimStyle === 'classic_cap' ? sharedMat.caliperRed : sharedMat.caliperYellow)
  caliper.position.set(0.06, 0.16, 0)
  wheelGroup.add(caliper)

  wheelGroup.userData.rimMaterial = rimMat
  return wheelGroup
}

/**
 * Creates the cockpit silhouette: interior tub, dashboard, steering wheel, and sports bucket seats
 */
function createCockpitInterior(sharedMat, isRaceCar = false) {
  const cockpit = new THREE.Group()

  // Floor / Tub
  const tubGeo = new THREE.BoxGeometry(1.4, 0.35, 1.8)
  const tub = new THREE.Mesh(tubGeo, sharedMat.interior)
  tub.position.set(0, 0.45, 0.1)
  cockpit.add(tub)

  // Dashboard
  const dashGeo = new THREE.BoxGeometry(1.35, 0.25, 0.45)
  const dash = new THREE.Mesh(dashGeo, sharedMat.interior)
  dash.position.set(0, 0.72, 0.8)
  cockpit.add(dash)

  // Steering Wheel
  const wheelRimGeo = new THREE.TorusGeometry(0.15, 0.02, 8, 16)
  const steeringWheel = new THREE.Mesh(wheelRimGeo, sharedMat.blackTrim)
  steeringWheel.position.set(-0.35, 0.76, 0.55)
  steeringWheel.rotation.x = Math.PI * 0.35
  cockpit.add(steeringWheel)

  // Driver & Passenger Sport Seats
  const seatPositions = [-0.34, 0.34]
  seatPositions.forEach((xPos) => {
    const seatBottomGeo = new THREE.BoxGeometry(0.44, 0.16, 0.55)
    const seatBottom = new THREE.Mesh(seatBottomGeo, sharedMat.interior)
    seatBottom.position.set(xPos, 0.5, 0.05)
    cockpit.add(seatBottom)

    const seatBackGeo = new THREE.BoxGeometry(0.42, 0.62, 0.14)
    const seatBack = new THREE.Mesh(seatBackGeo, sharedMat.interior)
    seatBack.position.set(xPos, 0.82, -0.2)
    seatBack.rotation.x = -Math.PI * 0.08
    cockpit.add(seatBack)

    const headrestGeo = new THREE.BoxGeometry(0.25, 0.2, 0.12)
    const headrest = new THREE.Mesh(headrestGeo, sharedMat.interior)
    headrest.position.set(xPos, 1.15, -0.27)
    cockpit.add(headrest)
  })

  // Roll Cage for GT2 / GT3 / GT1
  if (isRaceCar) {
    const rollBarGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.3, 8)
    const rollBarTop = new THREE.Mesh(rollBarGeo, sharedMat.chrome)
    rollBarTop.rotation.z = Math.PI / 2
    rollBarTop.position.set(0, 1.25, -0.35)
    cockpit.add(rollBarTop)

    const barLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), sharedMat.chrome)
    barLeft.position.set(-0.62, 0.85, -0.35)
    cockpit.add(barLeft)

    const barRight = barLeft.clone()
    barRight.position.x = 0.62
    cockpit.add(barRight)
  }

  return cockpit
}

/**
 * Creates headlamp assemblies with reflector, housing, and optional light sources
 */
function createHeadlights(type = 'round', sharedMat) {
  const group = new THREE.Group()

  if (type === 'round') {
    // Classic 356 / 911 / 930 round headlamps
    const lampGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.12, 18)
    const glassCapGeo = new THREE.SphereGeometry(0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4)

    const positions = [[-0.78, 0.82, 2.05], [0.78, 0.82, 2.05]]
    positions.forEach(([x, y, z]) => {
      const lampHousing = new THREE.Mesh(lampGeo, sharedMat.chrome)
      lampHousing.rotation.x = Math.PI / 2 - 0.2
      lampHousing.position.set(x, y, z)
      group.add(lampHousing)

      const lens = new THREE.Mesh(glassCapGeo, sharedMat.headlightReflector)
      lens.rotation.x = Math.PI / 2 - 0.2
      lens.position.set(x, y, z + 0.06)
      group.add(lens)
    })
  } else if (type === 'teardrop') {
    // 996 GT3 RS / GT1 Teardrop Headlamps
    const shapeGeo = new THREE.BoxGeometry(0.38, 0.18, 0.45)
    const positions = [[-0.74, 0.76, 2.0], [0.74, 0.76, 2.0]]
    positions.forEach(([x, y, z]) => {
      const lens = new THREE.Mesh(shapeGeo, sharedMat.headlightReflector)
      lens.position.set(x, y, z)
      lens.rotation.y = x > 0 ? -0.2 : 0.2
      lens.rotation.x = -0.15
      group.add(lens)
    })
  }

  return group
}

/**
 * Creates rear taillight bar and exhaust tips
 */
function createRearLightingAndExhaust(type = 'classic', sharedMat) {
  const group = new THREE.Group()

  if (type === '356') {
    // Tiny dual beehive taillights
    const lampGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12)
    const leftLamp = new THREE.Mesh(lampGeo, sharedMat.taillightReflector)
    leftLamp.rotation.x = Math.PI / 2
    leftLamp.position.set(-0.6, 0.72, -2.1)
    group.add(leftLamp)

    const rightLamp = leftLamp.clone()
    rightLamp.position.x = 0.6
    group.add(rightLamp)

    // Single chrome exhaust
    const exhaustGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12)
    const exhaust = new THREE.Mesh(exhaustGeo, sharedMat.chrome)
    exhaust.rotation.x = Math.PI / 2
    exhaust.position.set(-0.25, 0.28, -2.15)
    group.add(exhaust)
  } else if (type === 'lightbar') {
    // Iconic 911 reflector center bar + taillights
    const barGeo = new THREE.BoxGeometry(1.6, 0.12, 0.1)
    const bar = new THREE.Mesh(barGeo, sharedMat.taillightReflector)
    bar.position.set(0, 0.74, -2.2)
    group.add(bar)

    // Dual/Single exhaust
    const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 12)
    const exhaustLeft = new THREE.Mesh(exhaustGeo, sharedMat.chrome)
    exhaustLeft.rotation.x = Math.PI / 2
    exhaustLeft.position.set(-0.55, 0.32, -2.22)
    group.add(exhaustLeft)

    const exhaustRight = exhaustLeft.clone()
    exhaustRight.position.x = 0.55
    group.add(exhaustRight)
  } else if (type === 'center_dual') {
    // GT3 RS Center dual exhaust
    const barGeo = new THREE.BoxGeometry(1.5, 0.14, 0.1)
    const bar = new THREE.Mesh(barGeo, sharedMat.taillightReflector)
    bar.position.set(0, 0.74, -2.2)
    group.add(bar)

    const exhaustGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.26, 12)
    const ex1 = new THREE.Mesh(exhaustGeo, sharedMat.chrome)
    ex1.rotation.x = Math.PI / 2
    ex1.position.set(-0.09, 0.42, -2.25)
    group.add(ex1)

    const ex2 = ex1.clone()
    ex2.position.x = 0.09
    group.add(ex2)
  }

  return group
}

/**
 * Master Porsche Model Generator
 */
export function buildPorsche3DModel(carId, options = {}) {
  const carConfig = PORSCHE_CATALOG[carId] || PORSCHE_CATALOG.carrera_rs
  const paintColorHex = options.paintColor || carConfig.defaultColor
  const wheelColorHex = options.wheelColor || carConfig.defaultWheelColor
  const stripeColorHex = options.stripeColor || carConfig.defaultStripeColor || paintColorHex

  const root = new THREE.Group()
  root.name = `Porsche_${carId}`
  const sharedMat = createSharedMaterials()

  // Primary High-Gloss Automotive Body Material
  const bodyPaintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(paintColorHex),
    metalness: 0.65,
    roughness: 0.28,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  })

  // Accent / Stripe Material
  const accentPaintMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(stripeColorHex),
    metalness: 0.5,
    roughness: 0.35,
  })

  let wheelStyle = 'fuchs'
  let wheelPositions = [
    [-1.02, 0.42, 1.45], // Front Left
    [1.02, 0.42, 1.45],  // Front Right
    [-1.04, 0.42, -1.35], // Rear Left
    [1.04, 0.42, -1.35],  // Rear Right
  ]

  // Model-specific Bodywork Construction
  switch (carId) {
    case 'porsche_356': {
      wheelStyle = 'classic_cap'
      // Curvaceous classic body
      const mainBodyGeo = new THREE.BoxGeometry(1.85, 0.58, 4.3)
      const mainBody = new THREE.Mesh(mainBodyGeo, bodyPaintMat)
      mainBody.position.y = 0.6
      mainBody.castShadow = true
      root.add(mainBody)

      // Smooth Rounded Vintage Hood
      const hoodGeo = new THREE.CylinderGeometry(0.88, 0.94, 1.8, 16)
      const hood = new THREE.Mesh(hoodGeo, bodyPaintMat)
      hood.rotation.z = Math.PI / 2
      hood.rotation.y = Math.PI / 2
      hood.position.set(0, 0.68, 1.1)
      hood.scale.set(1.0, 0.55, 1.15)
      root.add(hood)

      // Sloping Rounded Rear Deck
      const rearDeckGeo = new THREE.CylinderGeometry(0.75, 0.92, 1.7, 16)
      const rearDeck = new THREE.Mesh(rearDeckGeo, bodyPaintMat)
      rearDeck.rotation.z = Math.PI / 2
      rearDeck.rotation.y = Math.PI / 2
      rearDeck.position.set(0, 0.64, -1.1)
      rearDeck.scale.set(1.0, 0.52, 1.1)
      root.add(rearDeck)

      // Speedster Low Windscreen
      const screenGeo = new THREE.CylinderGeometry(0.8, 0.85, 0.35, 16, 1, true, 0, Math.PI)
      const screen = new THREE.Mesh(screenGeo, sharedMat.glass)
      screen.rotation.x = -Math.PI * 0.4
      screen.position.set(0, 0.95, 0.3)
      root.add(screen)

      // Chrome Frame around screen
      const frameGeo = new THREE.TorusGeometry(0.82, 0.025, 8, 16, Math.PI)
      const frame = new THREE.Mesh(frameGeo, sharedMat.chrome)
      frame.rotation.x = -Math.PI * 0.4
      frame.position.set(0, 0.96, 0.3)
      root.add(frame)

      // Vintage Chrome Bumpers with Overriders
      const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.12, 0.15), sharedMat.chrome)
      frontBumper.position.set(0, 0.44, 2.22)
      root.add(frontBumper)

      const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.12, 0.15), sharedMat.chrome)
      rearBumper.position.set(0, 0.46, -2.18)
      root.add(rearBumper)

      root.add(createCockpitInterior(sharedMat, false))
      root.add(createHeadlights('round', sharedMat))
      root.add(createRearLightingAndExhaust('356', sharedMat))
      break
    }

    case 'carrera_rs': {
      wheelStyle = 'fuchs'
      // 911 Carrera RS Body
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.55, 4.45), bodyPaintMat)
      lowerBody.position.y = 0.58
      lowerBody.castShadow = true
      root.add(lowerBody)

      // Front Sloping Hood
      const hoodGeo = new THREE.BoxGeometry(1.68, 0.38, 1.85)
      const hood = new THREE.Mesh(hoodGeo, bodyPaintMat)
      hood.position.set(0, 0.74, 1.15)
      hood.rotation.x = 0.1
      root.add(hood)

      // Fastback Cabin Greenhouse
      const cabinGeo = new THREE.BoxGeometry(1.5, 0.65, 2.05)
      const cabin = new THREE.Mesh(cabinGeo, sharedMat.glass)
      cabin.position.set(0, 1.16, -0.15)
      cabin.rotation.x = -0.05
      root.add(cabin)

      // Roof Skin
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.45), bodyPaintMat)
      roof.position.set(0, 1.48, -0.12)
      root.add(roof)

      // Flared Rear Hips
      const rearHipLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 1.4), bodyPaintMat)
      rearHipLeft.position.set(-0.95, 0.65, -1.1)
      root.add(rearHipLeft)
      const rearHipRight = rearHipLeft.clone()
      rearHipRight.position.x = 0.95
      root.add(rearHipRight)

      // Iconic Ducktail Rear Spoiler
      const ducktailGeo = new THREE.BoxGeometry(1.42, 0.22, 0.45)
      const ducktail = new THREE.Mesh(ducktailGeo, bodyPaintMat)
      ducktail.position.set(0, 0.95, -1.82)
      ducktail.rotation.x = 0.42
      ducktail.castShadow = true
      root.add(ducktail)

      // Carrera RS Side Stripes
      const stripeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 2.4), accentPaintMat)
      stripeLeft.position.set(-0.99, 0.48, 0.0)
      root.add(stripeLeft)
      const stripeRight = stripeLeft.clone()
      stripeRight.position.x = 0.99
      root.add(stripeRight)

      root.add(createCockpitInterior(sharedMat, false))
      root.add(createHeadlights('round', sharedMat))
      root.add(createRearLightingAndExhaust('lightbar', sharedMat))
      break
    }

    case 'turbo_930': {
      wheelStyle = '5spoke'
      wheelPositions[2][0] = -1.14 // Wider rear track
      wheelPositions[3][0] = 1.14

      // 930 Widebody
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.58, 4.45), bodyPaintMat)
      lowerBody.position.y = 0.58
      lowerBody.castShadow = true
      root.add(lowerBody)

      // Front Chin Spoiler
      const chinSpoiler = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.14, 0.35), sharedMat.blackTrim)
      chinSpoiler.position.set(0, 0.36, 2.18)
      root.add(chinSpoiler)

      // Massive Turbo Rear Flares (Turbo Hips)
      const turboFlareLeft = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 1.5), bodyPaintMat)
      turboFlareLeft.position.set(-1.06, 0.64, -1.12)
      root.add(turboFlareLeft)
      const turboFlareRight = turboFlareLeft.clone()
      turboFlareRight.position.x = 1.06
      root.add(turboFlareRight)

      // Cabin & Roof
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 2.05), sharedMat.glass)
      cabin.position.set(0, 1.16, -0.15)
      root.add(cabin)

      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.45), bodyPaintMat)
      roof.position.set(0, 1.48, -0.12)
      root.add(roof)

      // Iconic "Whale Tail" / "Tea Tray" Intercooler Wing
      const whaleTailBase = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.16, 0.68), bodyPaintMat)
      whaleTailBase.position.set(0, 0.98, -1.82)
      whaleTailBase.rotation.x = 0.18
      root.add(whaleTailBase)

      const whaleTailRubberLip = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.1, 0.14), sharedMat.blackTrim)
      whaleTailRubberLip.position.set(0, 1.06, -2.12)
      root.add(whaleTailRubberLip)

      root.add(createCockpitInterior(sharedMat, false))
      root.add(createHeadlights('round', sharedMat))
      root.add(createRearLightingAndExhaust('lightbar', sharedMat))
      break
    }

    case 'gt2_993': {
      wheelStyle = 'bbs_mesh'
      wheelPositions[0][0] = -1.12
      wheelPositions[1][0] = 1.12
      wheelPositions[2][0] = -1.18
      wheelPositions[3][0] = 1.18

      // 993 GT2 Widebody with Riveted Bolt-on Arches
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.58, 4.45), bodyPaintMat)
      lowerBody.position.y = 0.58
      root.add(lowerBody)

      // Bolt-on Riveted Arches (Front & Rear)
      const boltArchGeo = new THREE.BoxGeometry(0.38, 0.46, 1.35)
      const frontArchL = new THREE.Mesh(boltArchGeo, bodyPaintMat)
      frontArchL.position.set(-1.05, 0.62, 1.4)
      root.add(frontArchL)
      const frontArchR = frontArchL.clone()
      frontArchR.position.x = 1.05
      root.add(frontArchR)

      const rearArchL = new THREE.Mesh(boltArchGeo, bodyPaintMat)
      rearArchL.position.set(-1.1, 0.64, -1.18)
      root.add(rearArchL)
      const rearArchR = rearArchL.clone()
      rearArchR.position.x = 1.1
      root.add(rearArchR)

      // Front Racing Splitter
      const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.45), sharedMat.carbonFiber)
      splitter.position.set(0, 0.32, 2.22)
      root.add(splitter)

      // Cabin & Roof
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 2.05), sharedMat.glass)
      cabin.position.set(0, 1.16, -0.15)
      root.add(cabin)

      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.45), bodyPaintMat)
      roof.position.set(0, 1.48, -0.12)
      root.add(roof)

      // Bi-Plane Racing Wing with Air Scoops
      const wingBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 0.55), bodyPaintMat)
      wingBase.position.set(0, 0.98, -1.78)
      wingBase.rotation.x = 0.18
      root.add(wingBase)

      const wingAirScoopL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.35), bodyPaintMat)
      wingAirScoopL.position.set(-0.68, 1.14, -1.82)
      root.add(wingAirScoopL)
      const wingAirScoopR = wingAirScoopL.clone()
      wingAirScoopR.position.x = 0.68
      root.add(wingAirScoopR)

      const topWing = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.08, 0.42), sharedMat.carbonFiber)
      topWing.position.set(0, 1.34, -1.95)
      topWing.rotation.x = 0.12
      root.add(topWing)

      root.add(createCockpitInterior(sharedMat, true))
      root.add(createHeadlights('round', sharedMat))
      root.add(createRearLightingAndExhaust('lightbar', sharedMat))
      break
    }

    case 'gt3_996': {
      wheelStyle = '5spoke'
      // 996 GT3 RS Smooth Aero Body
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.56, 4.5), bodyPaintMat)
      lowerBody.position.y = 0.56
      root.add(lowerBody)

      // Aerodynamic Front Bumper with Intakes
      const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.45, 0.6), bodyPaintMat)
      frontBumper.position.set(0, 0.54, 2.05)
      root.add(frontBumper)

      const frontIntake = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.1), sharedMat.blackTrim)
      frontIntake.position.set(0, 0.42, 2.36)
      root.add(frontIntake)

      // Smooth Cabin & Roof
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 2.1), sharedMat.glass)
      cabin.position.set(0, 1.15, -0.1)
      root.add(cabin)

      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.48), bodyPaintMat)
      roof.position.set(0, 1.47, -0.08)
      root.add(roof)

      // Carbon Fiber High GT Wing on Aluminum Uprights
      const strutL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.15), sharedMat.chrome)
      strutL.position.set(-0.45, 1.05, -1.85)
      root.add(strutL)
      const strutR = strutL.clone()
      strutR.position.x = 0.45
      root.add(strutR)

      const gtWing = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.06, 0.44), sharedMat.carbonFiber)
      gtWing.position.set(0, 1.25, -1.9)
      gtWing.rotation.x = 0.14
      gtWing.castShadow = true
      root.add(gtWing)

      // Endplates on GT Wing
      const endplateL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.48), accentPaintMat)
      endplateL.position.set(-0.89, 1.25, -1.9)
      root.add(endplateL)
      const endplateR = endplateL.clone()
      endplateR.position.x = 0.89
      root.add(endplateR)

      // GT3 RS Side Scripts
      const scriptL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 2.2), accentPaintMat)
      scriptL.position.set(-1.0, 0.46, 0.0)
      root.add(scriptL)
      const scriptR = scriptL.clone()
      scriptR.position.x = 1.0
      root.add(scriptR)

      root.add(createCockpitInterior(sharedMat, true))
      root.add(createHeadlights('teardrop', sharedMat))
      root.add(createRearLightingAndExhaust('center_dual', sharedMat))
      break
    }

    case 'gt1_lemans': {
      wheelStyle = '5spoke'
      wheelPositions = [
        [-1.08, 0.38, 1.55],
        [1.08, 0.38, 1.55],
        [-1.12, 0.38, -1.45],
        [1.12, 0.38, -1.45],
      ]

      // Ultra-Low Le Mans Silhouette
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.45, 4.8), bodyPaintMat)
      lowerBody.position.y = 0.46
      root.add(lowerBody)

      // Elongated Front Nose with Deep Aero Vents
      const noseGeo = new THREE.BoxGeometry(1.85, 0.28, 1.8)
      const nose = new THREE.Mesh(noseGeo, bodyPaintMat)
      nose.position.set(0, 0.5, 1.5)
      nose.rotation.x = 0.16
      root.add(nose)

      // Low Le Mans Cockpit with Roof Air Intake Scoop
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.52, 1.6), sharedMat.glass)
      cabin.position.set(0, 0.95, -0.05)
      root.add(cabin)

      const roofScoop = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 1.1), bodyPaintMat)
      roofScoop.position.set(0, 1.25, -0.15)
      roofScoop.rotation.x = -0.12
      root.add(roofScoop)

      // Elongated Long-Tail Rear Deck
      const longTail = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.35, 1.7), bodyPaintMat)
      longTail.position.set(0, 0.58, -1.5)
      root.add(longTail)

      // Massive Rear Le Mans Wing
      const wingMountL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 0.2), sharedMat.carbonFiber)
      wingMountL.position.set(-0.65, 0.95, -2.15)
      root.add(wingMountL)
      const wingMountR = wingMountL.clone()
      wingMountR.position.x = 0.65
      root.add(wingMountR)

      const leMansWing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.52), sharedMat.carbonFiber)
      leMansWing.position.set(0, 1.18, -2.2)
      leMansWing.rotation.x = 0.12
      root.add(leMansWing)

      // Rear Diffuser
      const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.5), sharedMat.carbonFiber)
      diffuser.position.set(0, 0.24, -2.35)
      diffuser.rotation.x = -0.3
      root.add(diffuser)

      root.add(createCockpitInterior(sharedMat, true))
      root.add(createHeadlights('teardrop', sharedMat))
      root.add(createRearLightingAndExhaust('center_dual', sharedMat))
      break
    }
  }

  // Add 4 Wheel Assemblies
  const wheels = []
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheelAssembly(wheelColorHex, wheelStyle, sharedMat)
    wheel.position.set(x, y, z)
    if (x < 0) {
      wheel.rotation.y = Math.PI
    }
    root.add(wheel)
    wheels.push(wheel)
  })

  // Expose API on root object for live customization
  root.userData = {
    carId,
    bodyPaintMaterial: bodyPaintMat,
    accentPaintMaterial: accentPaintMat,
    wheels,
    sharedMaterials: sharedMat,
    setPaintColor(hex) {
      bodyPaintMat.color.set(hex)
    },
    setStripeColor(hex) {
      accentPaintMat.color.set(hex)
    },
    setWheelFinish(hex, metalness = 0.85, roughness = 0.25) {
      wheels.forEach((w) => {
        if (w.userData.rimMaterial) {
          w.userData.rimMaterial.color.set(hex)
          w.userData.rimMaterial.metalness = metalness
          w.userData.rimMaterial.roughness = roughness
        }
      })
    },
    toggleHeadlights(on) {
      sharedMat.headlightReflector.emissive.set(on ? 0xfffae6 : 0x000000)
      sharedMat.headlightReflector.emissiveIntensity = on ? 1.8 : 0
      sharedMat.taillightReflector.emissiveIntensity = on ? 1.2 : 0.4
    },
  }

  return root
}
