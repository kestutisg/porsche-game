import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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
    defaultColor: '#d4d4d8',
    defaultWheelColor: '#f1f5f9',
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

// 3D GLB Model Asset Manager with DRACO decompression
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/gltf/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let cachedPorscheGLTF = null
const gltfLoadCallbacks = []

gltfLoader.load(
  '/models/porsche-911.glb',
  (gltf) => {
    cachedPorscheGLTF = gltf
    gltfLoadCallbacks.forEach((cb) => cb(gltf))
    gltfLoadCallbacks.length = 0
  },
  undefined,
  (err) => {
    console.error('Error loading Porsche GLB:', err)
  }
)

/**
 * Builds authentic realistic 3D Porsche model from photorealistic GLTF assets
 */
export function buildPorsche3DModel(carId, options = {}) {
  const carConfig = PORSCHE_CATALOG[carId] || PORSCHE_CATALOG.carrera_rs
  const paintColorHex = options.paintColor || carConfig.defaultColor
  const wheelColorHex = options.wheelColor || carConfig.defaultWheelColor
  const stripeColorHex = options.stripeColor || carConfig.defaultStripeColor || paintColorHex

  const root = new THREE.Group()
  root.name = `Porsche_${carId}`

  const bodyMaterials = []
  const rimMaterials = []
  const lightMaterials = []

  const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.6 })
  const accentMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(stripeColorHex), roughness: 0.35, metalness: 0.5 })

  // Function to configure realistic GLB model
  const applyGLTFModel = (gltf) => {
    const carModel = gltf.scene.clone(true)

    // Remove any oversized background planes or studio boxes from the original asset
    const toRemove = []
    carModel.traverse((node) => {
      if (node.isMesh) {
        const name = (node.name || '').toLowerCase()
        if (
          name.includes('plane.002') ||
          name.includes('plane.003') ||
          name.includes('cube.001') ||
          name.includes('cube.002')
        ) {
          toRemove.push(node)
        }
      }
    })
    toRemove.forEach((node) => {
      if (node.parent) {
        node.parent.remove(node)
      }
    })

    // Create normalized container pivot
    const container = new THREE.Group()
    container.add(carModel)

    carModel.updateMatrixWorld(true)
    const bbox = new THREE.Box3().setFromObject(carModel)
    const size = bbox.getSize(new THREE.Vector3())
    const center = bbox.getCenter(new THREE.Vector3())

    // Target car length ~ 4.45 meters
    const targetLength = 4.45
    const maxDim = Math.max(size.x, size.y, size.z)
    const scaleFactor = targetLength / maxDim

    // Center carModel so center is at (0, 0, 0) and bottom is at Y = 0
    carModel.position.x = -center.x
    carModel.position.y = -bbox.min.y
    carModel.position.z = -center.z

    container.scale.setScalar(scaleFactor)

    // Traverse and identify paint, glass, chrome, and wheel materials
    carModel.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true

        if (node.material) {
          const mat = node.material.clone()
          node.material = mat
          const matName = (mat.name || node.name || '').toLowerCase()

          // Paint Material detection ('paint', 'coat')
          if (
            matName.includes('paint') ||
            matName.includes('coat') ||
            matName.includes('body') ||
            matName.includes('exterior') ||
            matName.includes('car_paint')
          ) {
            // Apply Clearcoat Physical Paint
            mat.color = new THREE.Color(paintColorHex)
            mat.metalness = 0.65
            mat.roughness = 0.22
            mat.clearcoat = 1.0
            mat.clearcoatRoughness = 0.08
            mat.needsUpdate = true
            bodyMaterials.push(mat)
          } else if (matName.includes('silver') || matName.includes('rim') || matName.includes('wheel')) {
            mat.color = new THREE.Color(wheelColorHex)
            mat.metalness = 0.85
            mat.roughness = 0.25
            mat.needsUpdate = true
            rimMaterials.push(mat)
          } else if (matName.includes('glass') || matName.includes('window')) {
            mat.transparent = true
            mat.opacity = 0.65
            mat.roughness = 0.05
            mat.transmission = 0.6
            mat.needsUpdate = true
          } else if (matName.includes('lights')) {
            mat.emissive = new THREE.Color(0x000000)
            mat.emissiveIntensity = 0
            mat.needsUpdate = true
            lightMaterials.push(mat)
          }
        }
      }
    })

    // Model-Specific Spoilers & Wings
    if (carId === 'carrera_rs') {
      // 1973 Carrera RS Ducktail Spoiler
      const ducktailShape = new THREE.Shape()
      ducktailShape.moveTo(0, 0)
      ducktailShape.lineTo(0.36, 0)
      ducktailShape.quadraticCurveTo(0.4, 0.16, 0.22, 0.28)
      ducktailShape.lineTo(0, 0.1)
      ducktailShape.closePath()

      const ducktailGeo = new THREE.ExtrudeGeometry(ducktailShape, { depth: 1.18, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 })
      ducktailGeo.center()
      const ducktailMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(paintColorHex), metalness: 0.65, roughness: 0.22, clearcoat: 1.0 })
      const ducktail = new THREE.Mesh(ducktailGeo, ducktailMat)
      ducktail.rotation.y = Math.PI / 2
      ducktail.position.set(0, 1.02, -1.82)
      ducktail.castShadow = true
      root.add(ducktail)
      bodyMaterials.push(ducktailMat)

      // RS Side Script Decals
      ;[-0.92, 0.92].forEach((xPos) => {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 2.2), accentMat)
        stripe.position.set(xPos, 0.44, 0.0)
        root.add(stripe)
      })
    } else if (carId === 'turbo_930') {
      // 1978 930 Whale Tail / Tea Tray Spoiler
      const whaleTailMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(paintColorHex), metalness: 0.65, roughness: 0.22, clearcoat: 1.0 })
      const whaleTailBase = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.12, 0.65), whaleTailMat)
      whaleTailBase.position.set(0, 1.02, -1.85)
      whaleTailBase.rotation.x = 0.16
      whaleTailBase.castShadow = true
      root.add(whaleTailBase)
      bodyMaterials.push(whaleTailMat)

      const rubberLip = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.08, 0.12), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 }))
      rubberLip.position.set(0, 1.11, -2.16)
      root.add(rubberLip)
    } else if (carId === 'gt2_993') {
      // 1995 993 GT2 Bi-Plane Racing Wing
      const wingBaseMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(paintColorHex), metalness: 0.65, roughness: 0.22, clearcoat: 1.0 })
      const wingBase = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.16, 0.58), wingBaseMat)
      wingBase.position.set(0, 1.05, -1.82)
      wingBase.rotation.x = 0.15
      root.add(wingBase)
      bodyMaterials.push(wingBaseMat)

      const topWing = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.06, 0.42), carbonMat)
      topWing.position.set(0, 1.38, -1.98)
      topWing.rotation.x = 0.12
      topWing.castShadow = true
      root.add(topWing)
    } else if (carId === 'gt3_996') {
      // 2003 GT3 RS Carbon Racing Wing
      ;[-0.48, 0.48].forEach((xPos) => {
        const upright = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.38, 0.16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 }))
        upright.position.set(xPos, 1.12, -1.88)
        root.add(upright)
      })

      const gtWing = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.055, 0.44), carbonMat)
      gtWing.position.set(0, 1.32, -1.92)
      gtWing.rotation.x = 0.14
      gtWing.castShadow = true
      root.add(gtWing)

      ;[-0.91, 0.91].forEach((xPos) => {
        const endplate = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.24, 0.48), accentMat)
        endplate.position.set(xPos, 1.32, -1.92)
        root.add(endplate)
      })
    } else if (carId === 'gt1_lemans') {
      // 1998 GT1 Roof Scoop & Longtail Wing
      const roofScoop = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 1.15), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(paintColorHex), metalness: 0.65, roughness: 0.22, clearcoat: 1.0 }))
      roofScoop.position.set(0, 1.25, -0.15)
      roofScoop.rotation.x = -0.12
      root.add(roofScoop)
      bodyMaterials.push(roofScoop.material)

      ;[-0.68, 0.68].forEach((xPos) => {
        const mount = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.22), carbonMat)
        mount.position.set(xPos, 0.98, -2.18)
        root.add(mount)
      })

      const leMansWing = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.08, 0.52), carbonMat)
      leMansWing.position.set(0, 1.22, -2.22)
      leMansWing.rotation.x = 0.12
      leMansWing.castShadow = true
      root.add(leMansWing)
    }

    root.add(container)
  }

  if (cachedPorscheGLTF) {
    applyGLTFModel(cachedPorscheGLTF)
  } else {
    gltfLoadCallbacks.push((gltf) => {
      applyGLTFModel(gltf)
    })
  }

  // Dynamic Customization Interface
  root.userData = {
    carId,
    setPaintColor(hex) {
      bodyMaterials.forEach((m) => m.color.set(hex))
    },
    setStripeColor(hex) {
      accentMat.color.set(hex)
    },
    setWheelFinish(hex, metalness = 0.85, roughness = 0.25) {
      rimMaterials.forEach((m) => {
        m.color.set(hex)
        m.metalness = metalness
        m.roughness = roughness
      })
    },
    toggleHeadlights(on) {
      lightMaterials.forEach((m) => {
        if (m.emissive) {
          m.emissive.set(on ? 0xfffae6 : 0x000000)
          m.emissiveIntensity = on ? 2.0 : 0
        }
      })
    },
  }

  return root
}
