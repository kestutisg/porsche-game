import './style.css'
import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import { PorscheShowroom } from './showroom.js'
import { buildPorsche3DModel, PORSCHE_CATALOG } from './carBuilder.js'
import { GaugeCluster } from './gaugeCluster.js'
import { VehicleDynamics } from './vehicleDynamics.js'
import { TireEffects } from './tireEffects.js'

await RAPIER.init()

const app = document.querySelector('#app')
app.innerHTML = `
  <div id="showroom-root" class="showroom-container"></div>

  <div id="game-shell" class="game-shell">
    <div class="hud-top-right">
      <button id="btn-camera-view" class="hud-btn" type="button">🎥 Camera: Chase (C)</button>
      <button id="btn-back-showroom" class="hud-btn" type="button">🏎️ Showroom / Garage</button>
      <button id="btn-restart-run" class="hud-btn" type="button">🔄 Restart Run</button>
    </div>

    <!-- Top Left Mission HUD -->
    <div class="hud">
      <div class="hud-panel">
        <div class="panel-header">
          <span class="eyebrow" id="hud-car-name">Factory Driver</span>
          <span id="lap" class="lap-tag">Lap 1</span>
        </div>
        <div class="stats">
          <span>Speed <strong id="speed">0</strong> km/h</span>
          <span>Health <strong id="health">100</strong>%</span>
        </div>
        <div id="challenge-text" class="objective">Checkpoint 1 / 8</div>
        <div id="score" class="objective subtle">Drift score: 0</div>
      </div>
    </div>

    <!-- Bottom Right Analog VDO Gauge Cluster & Diagnostics Canvas -->
    <div class="gauge-cluster-container">
      <canvas id="gauge-canvas" width="420" height="210"></canvas>
      <div class="gearbox-mode-pill" id="gearbox-mode-pill">AUTO (M: Toggle)</div>
    </div>

    <div id="checkpoint-toast">Checkpoint clear</div>

    <div id="overlay" class="overlay hidden">
      <div class="overlay-card">
        <span class="overlay-tag">Porsche Factory Driver</span>
        <h1 id="overlay-title">Career Challenge</h1>
        <p id="overlay-subtitle">Complete the objectives on the test circuit.</p>

        <div id="career-menu" class="career-menu"></div>

        <div class="garage-section">
          <div class="section-heading">
            <span>Circuit Garage</span>
            <strong id="bank-balance">Credits: 2800</strong>
          </div>
          <div id="garage-panel" class="garage-panel"></div>
        </div>

        <button id="overlay-button" class="overlay-button" type="button">Start Challenge</button>
      </div>
    </div>
  </div>
`

const showroomRoot = document.querySelector('#showroom-root')
const gameShell = document.querySelector('#game-shell')

const speedEl = document.querySelector('#speed')
const healthEl = document.querySelector('#health')
const lapEl = document.querySelector('#lap')
const challengeTextEl = document.querySelector('#challenge-text')
const scoreEl = document.querySelector('#score')
const overlayEl = document.querySelector('#overlay')
const overlayTitleEl = document.querySelector('#overlay-title')
const overlaySubtitleEl = document.querySelector('#overlay-subtitle')
const overlayButtonEl = document.querySelector('#overlay-button')
const careerMenuEl = document.querySelector('#career-menu')
const garagePanelEl = document.querySelector('#garage-panel')
const checkpointToastEl = document.querySelector('#checkpoint-toast')
const hudCarNameEl = document.querySelector('#hud-car-name')

const btnBackShowroom = document.querySelector('#btn-back-showroom')
const btnRestartRun = document.querySelector('#btn-restart-run')
const btnCameraView = document.querySelector('#btn-camera-view')
const gearboxModePill = document.querySelector('#gearbox-mode-pill')

// Initialize Gauge Cluster
const gaugeCanvas = document.querySelector('#gauge-canvas')
const gaugeCluster = new GaugeCluster(gaugeCanvas)

// Game Track Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x7ba2cc)
scene.fog = new THREE.FogExp2(0x7ba2cc, 0.012)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300)

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
gameShell.appendChild(renderer.domElement)

// Lighting for Race Track
const ambientLight = new THREE.AmbientLight(0xffffff, 1.1)
scene.add(ambientLight)

const sun = new THREE.DirectionalLight(0xfff7e6, 1.8)
sun.position.set(25, 40, 18)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.near = 0.5
sun.shadow.camera.far = 150
sun.shadow.camera.left = -50
sun.shadow.camera.right = 50
sun.shadow.camera.top = 50
sun.shadow.camera.bottom = -50
scene.add(sun)

// Tire Effects System (Skidmarks & Smoke)
const tireEffects = new TireEffects(scene)

// Vehicle Dynamics Engine
const vehicleDynamics = new VehicleDynamics()

// Rapier Physics World
const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

// Ground Plane
const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
groundBody.setTranslation({ x: 0, y: -0.5, z: 0 }, true)
world.createCollider(RAPIER.ColliderDesc.cuboid(100, 0.5, 100), groundBody)

// Track Ground Mesh (Grass & Terrain)
const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(250, 250),
  new THREE.MeshStandardMaterial({ color: 0x334d28, roughness: 0.95, metalness: 0.05 })
)
groundMesh.rotation.x = -Math.PI / 2
groundMesh.position.y = -0.05
groundMesh.receiveShadow = true
scene.add(groundMesh)

// Asphalt Race Track & Checkpoints
const trackGroup = new THREE.Group()
const checkpointPositions = []
const checkpointTotal = 8
const checkpointMeshes = []

// Procedural Circuit Loop
for (let i = 0; i < 120; i += 1) {
  const t = (i / 120) * Math.PI * 2
  const x = Math.cos(t) * 32
  const z = Math.sin(t) * 22
  const roadSegment = new THREE.Mesh(
    new THREE.BoxGeometry(8.0, 0.2, 8.5),
    new THREE.MeshStandardMaterial({ color: 0x22262c, roughness: 0.88, metalness: 0.12 })
  )
  roadSegment.position.set(x, 0.08, z)
  const tangentX = -Math.sin(t) * 32
  const tangentZ = Math.cos(t) * 22
  roadSegment.rotation.y = Math.atan2(tangentX, tangentZ)
  roadSegment.receiveShadow = true
  trackGroup.add(roadSegment)

  // Curbs / Rumble strips along the edges
  const curbLeft = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.24, 8.5),
    new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xd91424 : 0xf8fafc })
  )
  curbLeft.position.set(x - Math.cos(roadSegment.rotation.y) * 4.2, 0.1, z + Math.sin(roadSegment.rotation.y) * 4.2)
  curbLeft.rotation.y = roadSegment.rotation.y
  trackGroup.add(curbLeft)

  const curbRight = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.24, 8.5),
    new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xd91424 : 0xf8fafc })
  )
  curbRight.position.set(x + Math.cos(roadSegment.rotation.y) * 4.2, 0.1, z - Math.sin(roadSegment.rotation.y) * 4.2)
  curbRight.rotation.y = roadSegment.rotation.y
  trackGroup.add(curbRight)
}

// Checkpoint Arches
for (let i = 0; i < checkpointTotal; i += 1) {
  const t = (i / checkpointTotal) * Math.PI * 2
  const x = Math.cos(t) * 31.5
  const z = Math.sin(t) * 21.2
  checkpointPositions.push({ x, z })

  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 3.2, 1.0),
    new THREE.MeshStandardMaterial({
      color: i === 0 ? 0x22c55e : 0xfacc15,
      emissive: i === 0 ? 0x15803d : 0xa16207,
      emissiveIntensity: 0.6,
    })
  )
  gate.position.set(x, 1.6, z)
  gate.rotation.y = Math.atan2(-Math.sin(t) * 31.5, Math.cos(t) * 21.2)
  gate.userData.flash = 0
  trackGroup.add(gate)
  checkpointMeshes.push(gate)
}

scene.add(trackGroup)

// Player Car Container in Race Scene
let carMeshGroup = new THREE.Group()
scene.add(carMeshGroup)

// Dynamic Physics Body for Player Car
const rbDesc = RAPIER.RigidBodyDesc.dynamic()
  .setLinearDamping(0.68)
  .setAngularDamping(1.1)
  .setAdditionalMass(1350)
const dynamicBody = world.createRigidBody(rbDesc)
dynamicBody.setTranslation({ x: checkpointPositions[0].x, y: 1.2, z: checkpointPositions[0].z }, true)
world.createCollider(RAPIER.ColliderDesc.cuboid(1.0, 0.45, 2.2).setMass(1350), dynamicBody)

// Drivetrain & Transmission System
const GEAR_RATIOS = [3.82, 2.25, 1.52, 1.15, 0.92, 0.75]
const FINAL_DRIVE = 3.44

const drivetrain = {
  gear: 1,
  isManual: false,
  rpm: 900,
  idleRpm: 900,
  maxRpm: 8000,
  redlineRpm: 6800,
  shiftTimer: 0,
  boost: 0,
}

// Multi-Camera System
const CAMERA_MODES = ['chase', 'close', 'hood', 'cockpit']
let currentCameraIndex = 0

function cycleCameraView() {
  currentCameraIndex = (currentCameraIndex + 1) % CAMERA_MODES.length
  const mode = CAMERA_MODES[currentCameraIndex]
  const labels = {
    chase: '🎥 Camera: Chase (C)',
    close: '🎥 Camera: Close Chase (C)',
    hood: '🎥 Camera: Hood / Bonnet (C)',
    cockpit: '🎥 Camera: Low Bumper (C)',
  }
  btnCameraView.textContent = labels[mode]
  showToast(labels[mode].replace('(C)', '').trim())
}

btnCameraView.addEventListener('click', () => {
  cycleCameraView()
})

// User Input Controls
const controls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  handbrake: false,
}

const keyMap = {
  w: 'forward',
  arrowup: 'forward',
  s: 'backward',
  arrowdown: 'backward',
  a: 'left',
  arrowleft: 'left',
  d: 'right',
  arrowright: 'right',
  shift: 'handbrake',
  ' ': 'handbrake',
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase()
  const action = keyMap[key]
  if (action) {
    event.preventDefault()
    controls[action] = true
  }

  // Camera Switcher Key
  if (key === 'c') {
    cycleCameraView()
  }

  // Gearbox Mode Toggle
  if (key === 'm') {
    drivetrain.isManual = !drivetrain.isManual
    gearboxModePill.textContent = drivetrain.isManual ? 'MANUAL (Q: Down, E: Up)' : 'AUTO (M: Toggle)'
    showToast(drivetrain.isManual ? 'Manual Transmission Engaged' : 'Automatic Transmission Engaged')
  }

  // Manual Shift Keys
  if (drivetrain.isManual) {
    if (key === 'e') {
      if (drivetrain.gear < 6) {
        drivetrain.gear += 1
        triggerGearShiftEffect()
      }
    } else if (key === 'q') {
      if (drivetrain.gear > 1) {
        drivetrain.gear -= 1
        triggerGearShiftEffect()
      } else if (drivetrain.gear === 1) {
        drivetrain.gear = -1
        triggerGearShiftEffect()
      }
    }
  }
})

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase()
  const action = keyMap[key]
  if (action) {
    controls[action] = false
  }
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  gaugeCluster.resize()
})

// Career Challenges
const careerChallenges = {
  slalom: {
    id: 'slalom',
    title: 'Slalom Drift Test',
    objective: 'Reach 1,200 drift score around the circuit',
    targetScore: 1200,
    checkpointTotal: 8,
    reward: 900,
    nextCar: 'turbo_930',
  },
  precision: {
    id: 'precision',
    title: 'Precision Homologation Line',
    objective: 'Clear all 8 checkpoints cleanly under time',
    targetScore: 1000,
    checkpointTotal: 8,
    reward: 1400,
    nextCar: 'gt2_993',
  },
  street: {
    id: 'street',
    title: 'Le Mans Prototype Showdown',
    objective: 'Score 1,800 drift points and keep damage below 35%',
    targetScore: 1800,
    checkpointTotal: 8,
    reward: 2200,
    nextCar: 'gt1_lemans',
  },
}

const garageUpgrades = {
  engine: { label: 'Engine Tuning', cost: 450, stepCost: 150, description: '+8% launch power & top RPM' },
  suspension: { label: 'Suspension Kit', cost: 420, stepCost: 140, description: '+10% lateral grip & drift control' },
  brakes: { label: 'Brake Upgrade', cost: 390, stepCost: 130, description: '+7% braking stability' },
  tireCompound: { label: 'Tire Compound', cost: 250, stepCost: 80, description: 'Racing Soft Compound for max grip' },
  aeroDrag: { label: 'Aero Downforce', cost: 300, stepCost: 100, description: 'High downforce spoiler tuning' },
}

const playerProgress = {
  credits: 2800,
  selectedCarId: 'carrera_rs',
  paintColor: '#f8fafc',
  wheelColor: '#2563eb',
  stripeColor: '#2563eb',
  ownedCars: { porsche_356: true, carrera_rs: true },
  unlockedMissions: { slalom: true },
  completedMissions: {},
  upgrades: { engine: 0, suspension: 0, brakes: 0, tireCompound: 0, aeroDrag: 0 },
}

const carState = {
  heading: 0,
  health: 100,
  lap: 1,
  lapStartTime: 0,
  lapTime: 0,
  checkpointIndex: 0,
  challengeName: careerChallenges.slalom.title,
  driftScore: 0,
  components: {
    engine: 100,
    transmission: 100,
    frontBumper: 100,
    leftSuspension: 100,
    rightSuspension: 100,
  },
}

const gameState = {
  mode: 'showroom',
  started: false,
  finished: false,
  challengeId: 'slalom',
  objectiveComplete: false,
  audioReady: false,
  audioCtx: null,
  engineOsc: null,
  engineOsc2: null,
  engineGain: null,
  engineFilter: null,
  challengeResult: null,
}

function getCareerRanking() {
  const missionCount = Object.keys(playerProgress.completedMissions).length
  if (missionCount === 0) return { tier: 'Factory Rookie', level: 1 }
  if (missionCount === 1) return { tier: 'Official Test Driver', level: 2 }
  return { tier: 'Porsche Works Legend', level: 3 }
}

function formatTime(seconds) {
  if (seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

function computeOverallHealth() {
  const total = Object.values(carState.components).reduce((sum, value) => sum + value, 0)
  return total / Object.keys(carState.components).length
}

function getUpgradeLevel(key) {
  return playerProgress.upgrades[key] || 0
}

function getUpgradeCost(key) {
  const upgrade = garageUpgrades[key]
  return upgrade.cost + getUpgradeLevel(key) * upgrade.stepCost
}

function spawnPlayerCarModel() {
  while (carMeshGroup.children.length > 0) {
    carMeshGroup.remove(carMeshGroup.children[0])
  }

  const model = buildPorsche3DModel(playerProgress.selectedCarId, {
    paintColor: playerProgress.paintColor,
    wheelColor: playerProgress.wheelColor,
    stripeColor: playerProgress.stripeColor,
  })
  carMeshGroup.add(model)
  model.userData.toggleHeadlights(true)

  const config = PORSCHE_CATALOG[playerProgress.selectedCarId]
  hudCarNameEl.textContent = config ? config.name : 'Porsche'
  gaugeCluster.setCarConfig(config)
  vehicleDynamics.setConfig(config)
}

function refreshHud() {
  const health = Math.round(computeOverallHealth())
  carState.health = health
  const nextCheckpoint = Math.min(carState.checkpointIndex + 1, checkpointTotal)
  const selectedChallenge = careerChallenges[gameState.challengeId] || careerChallenges.slalom

  healthEl.textContent = String(health)
  lapEl.textContent = `Lap ${carState.lap}`
  const lapTimeStr = gameState.started ? ` • ${formatTime(carState.lapTime)}` : ''
  challengeTextEl.textContent = `${carState.challengeName}${lapTimeStr} • Objective ${Math.round(carState.driftScore)} / ${selectedChallenge.targetScore} • CP ${nextCheckpoint} / ${selectedChallenge.checkpointTotal}`
  scoreEl.textContent = `Drift score: ${Math.round(carState.driftScore)}`
}

function showToast(message) {
  checkpointToastEl.textContent = message
  checkpointToastEl.classList.add('visible')
  clearTimeout(checkpointToastEl.hideTimer)
  checkpointToastEl.hideTimer = setTimeout(() => checkpointToastEl.classList.remove('visible'), 1200)
}

function showOverlay(title, subtitle, buttonText) {
  overlayTitleEl.textContent = title
  overlaySubtitleEl.textContent = subtitle
  overlayButtonEl.textContent = buttonText
  overlayEl.classList.remove('hidden')
}

function hideOverlay() {
  overlayEl.classList.add('hidden')
}

function renderCareerMenu() {
  const ranking = getCareerRanking()
  const orderedChallengeIds = ['slalom', 'precision', 'street']
  careerMenuEl.innerHTML = orderedChallengeIds.map((missionId) => {
    const mission = careerChallenges[missionId]
    const unlocked = Boolean(playerProgress.unlockedMissions[missionId])
    const complete = Boolean(playerProgress.completedMissions[missionId])
    const selected = missionId === gameState.challengeId
    return `
      <button class="career-option ${selected ? 'selected' : ''} ${unlocked ? '' : 'locked'}" data-id="${missionId}" type="button" ${unlocked ? '' : 'disabled'}>
        <span>${mission.title}</span>
        <small>${mission.objective}</small>
        <em>${complete ? 'Completed' : unlocked ? 'Unlocked' : 'Locked'}</em>
      </button>
    `
  }).join('')

  const selectedMission = careerChallenges[gameState.challengeId] || careerChallenges.slalom
  overlayTitleEl.textContent = `${selectedMission.title} • ${ranking.tier}`
  overlaySubtitleEl.textContent = selectedMission.objective
}

function renderGaragePanel() {
  const list = Object.entries(garageUpgrades).map(([key, upgrade]) => {
    const level = getUpgradeLevel(key)
    const cost = getUpgradeCost(key)
    return `
      <div class="garage-item">
        <div>
          <strong>${upgrade.label}</strong>
          <small>${upgrade.description}</small>
          <span>Lvl ${level}</span>
        </div>
        <button type="button" class="garage-button" data-upgrade="${key}">Buy $${cost}</button>
      </div>
    `
  }).join('')

  const repairCost = Math.round(220 + (100 - computeOverallHealth()) * 9)
  garagePanelEl.innerHTML = `
    <div class="garage-item">
      <div>
        <strong>Factory Overhaul & Repair</strong>
        <small>Restore engine compression, suspension alignment & bumper.</small>
        <span>Cost: $${repairCost}</span>
      </div>
      <button type="button" class="garage-button repair-button" data-repair="repair">Repair $${repairCost}</button>
    </div>
    ${list}
  `

  const bankBalanceEl = document.querySelector('#bank-balance')
  bankBalanceEl.textContent = `Credits: $${playerProgress.credits}`
}

function resetChallengeState() {
  const selectedChallenge = careerChallenges[gameState.challengeId] || careerChallenges.slalom

  carState.heading = 0
  carState.health = 100
  carState.lap = 1
  carState.lapStartTime = performance.now() / 1000
  carState.lapTime = 0
  carState.checkpointIndex = 0
  carState.challengeName = selectedChallenge.title
  carState.driftScore = 0
  gameState.objectiveComplete = false
  gameState.challengeResult = null
  carState.components.engine = 100
  carState.components.transmission = 100
  carState.components.frontBumper = 100
  carState.components.leftSuspension = 100
  carState.components.rightSuspension = 100

  vehicleDynamics.heading = 0
  drivetrain.gear = 1
  drivetrain.rpm = drivetrain.idleRpm

  tireEffects.clear()

  dynamicBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
  dynamicBody.setTranslation({ x: checkpointPositions[0].x, y: 1.2, z: checkpointPositions[0].z }, true)

  checkpointMeshes.forEach((mesh) => {
    mesh.material.emissiveIntensity = 0.6
    mesh.scale.set(1, 1, 1)
    mesh.userData.flash = 0
  })
}

function triggerGearShiftEffect() {
  drivetrain.shiftTimer = 0.12
  if (gameState.engineGain && gameState.audioReady) {
    const now = gameState.audioCtx.currentTime
    gameState.engineGain.gain.setValueAtTime(0.02, now)
    gameState.engineGain.gain.exponentialRampToValueAtTime(0.22, now + 0.14)
  }
}

function setupAudio() {
  if (gameState.audioReady) return

  const AudioCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioCtor) return

  const ctx = new AudioCtor()
  const osc1 = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  osc1.type = 'sawtooth'
  osc2.type = 'triangle'
  osc1.frequency.value = 55
  osc2.frequency.value = 110

  filter.type = 'lowpass'
  filter.frequency.value = 550
  gain.gain.value = 0.0001

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc1.start()
  osc2.start()

  gameState.audioCtx = ctx
  gameState.engineOsc = osc1
  gameState.engineOsc2 = osc2
  gameState.engineGain = gain
  gameState.engineFilter = filter
  gameState.audioReady = true
}

function completeMission() {
  const selectedChallenge = careerChallenges[gameState.challengeId]
  const missionReward = selectedChallenge.reward
  playerProgress.credits += missionReward
  playerProgress.completedMissions[gameState.challengeId] = true

  const ranking = getCareerRanking()
  renderCareerMenu()
  renderGaragePanel()

  showOverlay('Test Complete', `Mission cleared! You are now ${ranking.tier}. +$${missionReward} awarded.`, 'Continue to Career Menu')
  gameState.finished = true
  gameState.started = false
  gameState.challengeResult = 'complete'
}

async function startChallenge() {
  if (!playerProgress.unlockedMissions[gameState.challengeId]) {
    showToast('Mission locked — finish the prior challenge first.')
    return
  }

  if (!gameState.audioReady) {
    setupAudio()
  }
  if (gameState.audioCtx && gameState.audioCtx.state === 'suspended') {
    await gameState.audioCtx.resume()
  }

  gameState.finished = false
  gameState.started = true
  resetChallengeState()
  hideOverlay()
  refreshHud()
}

// Handlers for switching modes
function enterRaceMode(carOptions) {
  playerProgress.selectedCarId = carOptions.carId
  playerProgress.paintColor = carOptions.paintColor
  playerProgress.wheelColor = carOptions.wheelColor
  playerProgress.stripeColor = carOptions.stripeColor

  showroom.hide()
  gameShell.style.display = 'block'
  gameState.mode = 'race'

  spawnPlayerCarModel()
  resetChallengeState()
  renderCareerMenu()
  renderGaragePanel()
  refreshHud()
  startChallenge()
}

function enterShowroomMode() {
  gameState.mode = 'showroom'
  gameState.started = false
  if (gameState.engineGain) {
    gameState.engineGain.gain.value = 0.0001
  }

  gameShell.style.display = 'none'
  showroom.show()
  showroom.loadCar(playerProgress.selectedCarId)
}

btnBackShowroom.addEventListener('click', () => {
  enterShowroomMode()
})

btnRestartRun.addEventListener('click', () => {
  resetChallengeState()
  refreshHud()
  showToast('Run restarted')
})

careerMenuEl.addEventListener('click', (event) => {
  const button = event.target.closest('.career-option')
  if (!button) return

  const id = button.dataset.id
  if (!playerProgress.unlockedMissions[id]) {
    showToast('This mission is still locked.')
    return
  }

  gameState.challengeId = id
  renderCareerMenu()
})

garagePanelEl.addEventListener('click', (event) => {
  const repairButton = event.target.closest('[data-repair]')
  if (repairButton) {
    const repairCost = Math.round(220 + (100 - computeOverallHealth()) * 9)
    if (playerProgress.credits < repairCost) {
      showToast('Not enough credits for repair.')
      return
    }
    playerProgress.credits -= repairCost
    carState.components.engine = 100
    carState.components.transmission = 100
    carState.components.frontBumper = 100
    carState.components.leftSuspension = 100
    carState.components.rightSuspension = 100
    renderGaragePanel()
    refreshHud()
    showToast('Porsche restored to factory condition.')
    return
  }

  const upgradeButton = event.target.closest('[data-upgrade]')
  if (!upgradeButton) return

  const key = upgradeButton.dataset.upgrade
  const upgrade = garageUpgrades[key]
  const cost = getUpgradeCost(key)
  if (playerProgress.credits < cost) {
    showToast(`Not enough credits for ${upgrade.label}.`)
    return
  }

  playerProgress.credits -= cost
  playerProgress.upgrades[key] += 1
  renderGaragePanel()
  showToast(`${upgrade.label} installed.`)
})

overlayButtonEl.addEventListener('click', () => {
  startChallenge()
})

function triggerCheckpointSuccess(index) {
  const mesh = checkpointMeshes[index]
  if (!mesh) return

  mesh.material.emissive.setHex(0x22c55e)
  mesh.material.emissiveIntensity = 1.5
  mesh.userData.flash = 1
  mesh.scale.set(1.2, 1.2, 1.2)
  showToast(`Checkpoint ${index + 1} Cleared!`)
}

function handleCheckpointProgress() {
  const translation = dynamicBody.translation()
  const target = checkpointPositions[carState.checkpointIndex]
  const distance = Math.hypot(translation.x - target.x, translation.z - target.z)

  if (distance < 5.5) {
    triggerCheckpointSuccess(carState.checkpointIndex)
    carState.checkpointIndex += 1

    if (carState.checkpointIndex >= checkpointTotal) {
      carState.checkpointIndex = 0
      carState.lap += 1
      carState.lapStartTime = performance.now() / 1000

      if (gameState.challengeId === 'precision' && carState.driftScore >= careerChallenges.precision.targetScore) {
        completeMission()
        return
      }
    }

    if (carState.lap > 2) {
      const selectedChallenge = careerChallenges[gameState.challengeId]
      if (carState.driftScore >= selectedChallenge.targetScore) {
        completeMission()
        return
      }
    }

    refreshHud()
  }
}

function updateDrivetrain(speedKmh, throttle, delta) {
  if (drivetrain.shiftTimer > 0) {
    drivetrain.shiftTimer -= delta
  }

  const currentGearRatio = drivetrain.gear === -1 ? 3.5 : GEAR_RATIOS[drivetrain.gear - 1] || 1.0

  const wheelRpm = (speedKmh / (0.42 * 2 * Math.PI * 0.06)) * FINAL_DRIVE * currentGearRatio
  const throttleFlare = throttle > 0 ? (1 - speedKmh / 320) * 1200 : 0
  const calculatedRpm = Math.max(drivetrain.idleRpm, wheelRpm + throttleFlare)

  drivetrain.rpm = Math.min(calculatedRpm, drivetrain.maxRpm)

  // Automatic Gear Shift Logic
  if (!drivetrain.isManual && drivetrain.shiftTimer <= 0) {
    if (throttle < 0 && speedKmh < 3) {
      drivetrain.gear = -1
    } else if (throttle >= 0 && drivetrain.gear === -1) {
      drivetrain.gear = 1
      triggerGearShiftEffect()
    } else if (drivetrain.gear > 0) {
      if (drivetrain.rpm > drivetrain.redlineRpm - 200 && drivetrain.gear < 6) {
        drivetrain.gear += 1
        triggerGearShiftEffect()
      } else if (drivetrain.rpm < 2600 && drivetrain.gear > 1 && speedKmh < drivetrain.gear * 35) {
        drivetrain.gear -= 1
        triggerGearShiftEffect()
      }
    }
  }

  // Turbo boost calculation
  if (throttle > 0 && drivetrain.rpm > 3500) {
    drivetrain.boost = Math.min(1.25, drivetrain.boost + delta * 1.5)
  } else {
    drivetrain.boost = Math.max(0, drivetrain.boost - delta * 2.5)
  }
}

function updateCar(delta) {
  if (!gameState.started || gameState.finished) return

  if (carState.lapStartTime > 0) {
    carState.lapTime = performance.now() / 1000 - carState.lapStartTime
  }

  const currentVel = dynamicBody.linvel()
  const currentPos = dynamicBody.translation()

  const throttle = (controls.forward ? 1 : 0) - (controls.backward ? 1 : 0)
  const steering = (controls.right ? 1 : 0) - (controls.left ? 1 : 0)
  const handbrake = controls.handbrake ? 1 : 0

  // Advanced Vehicle Dynamics & Weight Transfer Step
  const stepResult = vehicleDynamics.computeStep({
    currentVelocity: currentVel,
    currentPosition: currentPos,
    throttle: drivetrain.shiftTimer > 0 ? 0 : throttle,
    steering,
    handbrake,
    delta,
    upgrades: playerProgress.upgrades,
  })

  carState.heading = stepResult.heading
  const speedKmh = Math.round(vehicleDynamics.speedKmh)
  speedEl.textContent = String(speedKmh)

  updateDrivetrain(speedKmh, throttle, delta)

  // Apply new velocity to rigid body
  dynamicBody.setLinvel({ x: stepResult.nextVelocity.x, y: currentVel.y, z: stepResult.nextVelocity.z }, true)

  const translation = dynamicBody.translation()
  carMeshGroup.position.set(translation.x, translation.y, translation.z)

  // Authentic Suspension Pitch, Roll & Heading
  carMeshGroup.rotation.y = stepResult.heading
  carMeshGroup.rotation.x = stepResult.pitch // Dive under braking, squat under power
  carMeshGroup.rotation.z = -stepResult.roll // Body lean in turns

  // Drift Score Accumulation
  if (stepResult.driftIntensity > 0.2) {
    const driftPower = stepResult.driftIntensity * 28 + (speedKmh / 10) * 1.5
    carState.driftScore += driftPower * delta * 12
  }

  const selectedChallenge = careerChallenges[gameState.challengeId] || careerChallenges.slalom
  const goalHit = carState.driftScore >= selectedChallenge.targetScore
  if (!gameState.objectiveComplete && goalHit) {
    gameState.objectiveComplete = true
    carState.challengeName = `${selectedChallenge.title} • Objective Complete!`
  }

  // Component Wear / Damage from intense driving & curb strikes
  if (stepResult.surface === 'curb' && speedKmh > 60) {
    carState.components.leftSuspension = Math.max(0, carState.components.leftSuspension - delta * 2.5)
    carState.components.rightSuspension = Math.max(0, carState.components.rightSuspension - delta * 2.5)
  }
  if (stepResult.driftIntensity > 0.6) {
    carState.components.transmission = Math.max(0, carState.components.transmission - delta * 1.2)
  }

  // Calculate World Positions of Rear Tires for Skidmarks and Smoke
  const forwardVec = new THREE.Vector3(Math.sin(stepResult.heading), 0, Math.cos(stepResult.heading))
  const rightVec = new THREE.Vector3(forwardVec.z, 0, -forwardVec.x)

  const rearAxlePos = new THREE.Vector3(translation.x, translation.y, translation.z).addScaledVector(forwardVec, -1.35)
  const tireLeftPos = rearAxlePos.clone().addScaledVector(rightVec, -1.05)
  const tireRightPos = rearAxlePos.clone().addScaledVector(rightVec, 1.05)

  // Emit 3D Skidmarks
  tireEffects.addSkidmark(tireLeftPos, tireRightPos, stepResult.driftIntensity)

  // Emit Tire Smoke Particles
  if (stepResult.driftIntensity > 0.35 && speedKmh > 10) {
    tireEffects.emitSmoke(tireLeftPos, stepResult.nextVelocity, stepResult.driftIntensity)
    tireEffects.emitSmoke(tireRightPos, stepResult.nextVelocity, stepResult.driftIntensity)
  }

  // Update Gauge Cluster
  gaugeCluster.update(
    {
      rpm: drivetrain.rpm,
      speedKmh,
      gear: drivetrain.gear,
      isManual: drivetrain.isManual,
      boost: drivetrain.boost,
      damage: carState.components,
    },
    delta
  )

  refreshHud()
  handleCheckpointProgress()
}

function updateCamera() {
  const carPosition = carMeshGroup.position.clone()
  const mode = CAMERA_MODES[currentCameraIndex]

  let offset = new THREE.Vector3(0, 3.2, -8.2)
  let lookOffset = new THREE.Vector3(0, 1.2, 0)
  let lerpFactor = 0.1

  if (mode === 'close') {
    offset = new THREE.Vector3(0, 2.2, -5.4)
    lookOffset = new THREE.Vector3(0, 1.0, 0)
    lerpFactor = 0.14
  } else if (mode === 'hood') {
    offset = new THREE.Vector3(0, 1.3, 0.4)
    lookOffset = new THREE.Vector3(0, 1.1, 15)
    lerpFactor = 0.25
  } else if (mode === 'cockpit') {
    offset = new THREE.Vector3(0, 0.8, 2.4)
    lookOffset = new THREE.Vector3(0, 0.7, 18)
    lerpFactor = 0.35
  }

  const worldOffset = offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carState.heading)
  const desiredPosition = carPosition.clone().add(worldOffset)
  camera.position.lerp(desiredPosition, lerpFactor)

  const lookTarget = carPosition.clone().add(lookOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carState.heading))
  camera.lookAt(lookTarget)
}

const clock = new THREE.Clock()

function updateAudio() {
  if (!gameState.audioReady || !gameState.engineOsc) return

  const throttle = (controls.forward ? 1 : 0) - (controls.backward ? 1 : 0)
  const handbrake = controls.handbrake ? 1 : 0

  const carConfig = PORSCHE_CATALOG[playerProgress.selectedCarId]
  const profile = carConfig?.audioProfile || { basePitch: 55, revMulti: 7.0 }

  const rpmFraction = drivetrain.rpm / drivetrain.maxRpm
  const targetFrequency = profile.basePitch + rpmFraction * (profile.maxFreq - profile.basePitch)
  const targetGain = drivetrain.shiftTimer > 0 ? 0.02 : 0.04 + Math.abs(throttle) * 0.16 + handbrake * 0.04

  gameState.engineOsc.frequency.setTargetAtTime(targetFrequency, gameState.audioCtx.currentTime, 0.05)
  if (gameState.engineOsc2) {
    gameState.engineOsc2.frequency.setTargetAtTime(targetFrequency * 1.5, gameState.audioCtx.currentTime, 0.05)
  }
  gameState.engineFilter.frequency.setTargetAtTime(320 + rpmFraction * 2400, gameState.audioCtx.currentTime, 0.05)
  gameState.engineGain.gain.setTargetAtTime(gameState.started ? targetGain : 0.0001, gameState.audioCtx.currentTime, 0.05)
}

function animateCheckpointEffects(delta) {
  checkpointMeshes.forEach((mesh) => {
    if (!mesh || !mesh.userData.flash) return

    mesh.userData.flash = Math.max(0, mesh.userData.flash - delta * 1.8)
    const pulse = 1 + (1 - mesh.userData.flash) * 0.4
    mesh.scale.setScalar(pulse)

    if (mesh.userData.flash <= 0) {
      mesh.material.emissiveIntensity = 0.6
      mesh.scale.setScalar(1)
      mesh.userData.flash = 0
    }
  })
}

function gameLoop() {
  const delta = Math.min(clock.getDelta(), 0.033)
  if (gameState.mode === 'race') {
    world.step()
    updateCar(delta)
    updateAudio()
    updateCamera()
    tireEffects.update(delta, camera)
    animateCheckpointEffects(delta)
    renderer.render(scene, camera)
  }
  requestAnimationFrame(gameLoop)
}

// Initialize Showroom
const showroom = new PorscheShowroom(showroomRoot, (carOptions) => {
  enterRaceMode(carOptions)
})
showroom.show()

// Start in Showroom mode
enterShowroomMode()
gameLoop()
