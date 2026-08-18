import './style.css'
import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'

await RAPIER.init()

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="game-shell">
    <div class="hud">
      <div class="panel">
        <div class="panel-header">
          <span class="eyebrow">Factory Driver</span>
          <span id="lap" class="lap-tag">Lap 1</span>
        </div>
        <div class="stats">
          <span>Speed <strong id="speed">0</strong> km/h</span>
          <span>Health <strong id="health">100</strong>%</span>
        </div>
        <div id="challenge-text" class="objective">Checkpoint 1 / 8</div>
        <div id="score" class="objective subtle">Drift score: 0</div>
        <div id="damage" class="damage">Engine 100% • Transmission 100% • Suspension 100% • Bumper 100%</div>
      </div>
    </div>

    <div id="checkpoint-toast">Checkpoint clear</div>

    <div id="overlay" class="overlay">
      <div class="overlay-card">
        <span class="overlay-tag">Porsche Factory Driver</span>
        <h1 id="overlay-title">Career Menu</h1>
        <p id="overlay-subtitle">Select a challenge and prove your skills in the garage.</p>

        <div id="career-menu" class="career-menu"></div>

        <div class="garage-section">
          <div class="section-heading">
            <span>Garage</span>
            <strong id="bank-balance">Credits: 2800</strong>
          </div>
          <div id="garage-panel" class="garage-panel"></div>
        </div>

        <button id="overlay-button" class="overlay-button" type="button">Start Challenge</button>
      </div>
    </div>
  </div>
`

const shell = app.querySelector('.game-shell')
const speedEl = document.querySelector('#speed')
const healthEl = document.querySelector('#health')
const lapEl = document.querySelector('#lap')
const challengeTextEl = document.querySelector('#challenge-text')
const scoreEl = document.querySelector('#score')
const damageEl = document.querySelector('#damage')
const overlayEl = document.querySelector('#overlay')
const overlayTitleEl = document.querySelector('#overlay-title')
const overlaySubtitleEl = document.querySelector('#overlay-subtitle')
const overlayButtonEl = document.querySelector('#overlay-button')
const careerMenuEl = document.querySelector('#career-menu')
const garagePanelEl = document.querySelector('#garage-panel')
const checkpointToastEl = document.querySelector('#checkpoint-toast')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xb7d6ff)
scene.fog = new THREE.Fog(0xb7d6ff, 20, 150)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 250)
camera.position.set(0, 4, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
shell.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

const sun = new THREE.DirectionalLight(0xfff5d9, 1.35)
sun.position.set(10, 18, 8)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
scene.add(sun)

const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
groundBody.setTranslation({ x: 0, y: -0.5, z: 0 }, true)
world.createCollider(RAPIER.ColliderDesc.cuboid(60, 0.5, 60), groundBody)

const groundMesh = new THREE.Mesh(
  new THREE.BoxGeometry(120, 1, 120),
  new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.95, metalness: 0.15 })
)
groundMesh.position.y = -1
groundMesh.receiveShadow = true
scene.add(groundMesh)

const trackGroup = new THREE.Group()
const checkpointPositions = []
const checkpointTotal = 8
const checkpointMeshes = []

for (let i = 0; i < 90; i += 1) {
  const t = (i / 90) * Math.PI * 2
  const x = Math.cos(t) * 26
  const z = Math.sin(t) * 18
  const roadSegment = new THREE.Mesh(
    new THREE.BoxGeometry(6.5, 0.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x2c3748, roughness: 0.95, metalness: 0.1 })
  )
  roadSegment.position.set(x, 0.08, z)
  const tangentX = -Math.sin(t) * 26
  const tangentZ = Math.cos(t) * 18
  roadSegment.rotation.y = Math.atan2(tangentX, tangentZ)
  roadSegment.receiveShadow = true
  trackGroup.add(roadSegment)
}

for (let i = 0; i < checkpointTotal; i += 1) {
  const t = (i / checkpointTotal) * Math.PI * 2
  const x = Math.cos(t) * 25.4
  const z = Math.sin(t) * 17.3
  checkpointPositions.push({ x, z })

  const gate = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 2.2, 0.8),
    new THREE.MeshStandardMaterial({ color: i === 0 ? 0x22c55e : 0xfbbf24, emissive: 0x0f172a, emissiveIntensity: 0.2 })
  )
  gate.position.set(x, 1.2, z)
  gate.rotation.y = Math.atan2(-Math.sin(t) * 25.4, Math.cos(t) * 17.3)
  gate.userData.flash = 0
  trackGroup.add(gate)
  checkpointMeshes.push(gate)
}

scene.add(trackGroup)

const car = new THREE.Group()
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7, roughness: 0.4 })
const accentMaterial = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.4, roughness: 0.5 })

const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 4.6), bodyMaterial)
carBody.position.y = 1.05
carBody.castShadow = true
carBody.receiveShadow = true
car.add(carBody)

const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 2.2), accentMaterial)
cabin.position.set(0, 1.45, -0.2)
cabin.castShadow = true
car.add(cabin)

const wheelGeometry = new THREE.CylinderGeometry(0.48, 0.48, 0.5, 18)
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 })

const wheelOffsets = [
  [-1.2, 0.42, 1.45],
  [1.2, 0.42, 1.45],
  [-1.2, 0.42, -1.45],
  [1.2, 0.42, -1.45],
]

for (const [x, y, z] of wheelOffsets) {
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
  wheel.rotation.z = Math.PI / 2
  wheel.position.set(x, y, z)
  wheel.castShadow = true
  wheel.receiveShadow = true
  car.add(wheel)
}

scene.add(car)

const ghostCar = new THREE.Group()
const ghostBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 4.6), new THREE.MeshStandardMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.3 }))
ghostBody.position.y = 1.05
ghostCar.add(ghostBody)
const ghostCabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 2.2), new THREE.MeshStandardMaterial({ color: 0xfcd34d, transparent: true, opacity: 0.3 }))
ghostCabin.position.set(0, 1.45, -0.2)
ghostCar.add(ghostCabin)
ghostCar.position.set(checkpointPositions[0].x, 1.2, checkpointPositions[0].z)
ghostCar.visible = false
scene.add(ghostCar)

const rbDesc = RAPIER.RigidBodyDesc.dynamic()
  .setLinearDamping(0.75)
  .setAngularDamping(1.1)
  .setMass(1400)
const dynamicBody = world.createRigidBody(rbDesc)
dynamicBody.setTranslation({ x: checkpointPositions[0].x, y: 1.2, z: checkpointPositions[0].z }, true)
world.createCollider(RAPIER.ColliderDesc.cuboid(1.2, 0.5, 2.3), dynamicBody)

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
})

const careerChallenges = {
  slalom: {
    id: 'slalom',
    title: 'Slalom Drift',
    objective: 'Reach 1,200 drift score',
    targetScore: 1200,
    checkpointTotal: 8,
    reward: 900,
    nextCar: 'turbo',
  },
  precision: {
    id: 'precision',
    title: 'Precision Line',
    objective: 'Clear all checkpoints cleanly',
    targetScore: 1000,
    checkpointTotal: 8,
    reward: 1300,
    nextCar: 'gt',
  },
  street: {
    id: 'street',
    title: 'Street Showdown',
    objective: 'Score 1,800 and keep damage below 35%',
    targetScore: 1800,
    checkpointTotal: 8,
    reward: 1800,
    nextCar: null,
  },
}

const carCatalog = {
  carrera: { id: 'carrera', name: 'Carrera RS', color: 0x1f2937, accent: 0xe11d48, price: 0 },
  turbo: { id: 'turbo', name: 'Turbo S', color: 0x1d4ed8, accent: 0xfbbf24, price: 2200 },
  gt: { id: 'gt', name: 'GT R', color: 0xef4444, accent: 0xf8fafc, price: 3800 },
}

const garageUpgrades = {
  engine: { label: 'Engine Tuning', cost: 450, stepCost: 150, description: '+8% launch and power band' },
  suspension: { label: 'Suspension Kit', cost: 420, stepCost: 140, description: '+10% grip and drift control' },
  brakes: { label: 'Brake Upgrade', cost: 390, stepCost: 130, description: '+7% stability under load' },
  tireCompound: { label: 'Tire Compound', cost: 250, stepCost: 80, description: 'Soft(grip) → Medium → Hard(durability)' },
  aeroDrag: { label: 'Aero Wing', cost: 300, stepCost: 100, description: 'Level 0-3: Low to High downforce' },
}

const playerProgress = {
  credits: 2800,
  selectedCarId: 'carrera',
  ownedCars: { carrera: true },
  unlockedCars: { carrera: true },
  unlockedMissions: { slalom: true },
  completedMissions: {},
  upgrades: { engine: 0, suspension: 0, brakes: 0, tireCompound: 0, aeroDrag: 0, brakeBias: 50 },
  leaderboard: {},
  bestLapTimes: {},
}

const carState = {
  heading: 0,
  health: 100,
  lap: 1,
  lapStartTime: 0,
  lapTime: 0,
  bestLapTime: null,
  checkpointIndex: 0,
  challengeName: careerChallenges.slalom.title,
  driftScore: 0,
  components: {
    engine: 100,
    transmission: 100,
    suspension: 100,
    frontBumper: 100,
  },
  lapReplayData: [],
  isRacingGhost: false,
  ghostReplayData: null,
  ghostProgress: 0,
}

const gameState = {
  started: false,
  finished: false,
  challengeId: 'slalom',
  objectiveComplete: false,
  audioReady: false,
  audioCtx: null,
  engineOsc: null,
  engineGain: null,
  engineFilter: null,
  challengeResult: null,
  overlayMode: 'career',
  showLeaderboard: false,
}

const maxSpeed = 28
const engineForce = 58
const steeringRate = 0.045
const drag = 0.92

function getCareerRanking() {
  const missionCount = Object.keys(playerProgress.completedMissions).length
  if (missionCount === 0) return { tier: 'Rookie', level: 1 }
  if (missionCount === 1) return { tier: 'Pro', level: 2 }
  return { tier: 'Legend', level: 3 }
}

function formatTime(seconds) {
  if (seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getCurrentCarConfig() {
  return carCatalog[playerProgress.selectedCarId] || carCatalog.carrera
}

function applyCarAppearance() {
  const config = getCurrentCarConfig()
  carBody.material.color.setHex(config.color)
  cabin.material.color.setHex(config.accent)
}

function getUpgradeLevel(key) {
  return playerProgress.upgrades[key] || 0
}

function getUpgradeCost(key) {
  const upgrade = garageUpgrades[key]
  return upgrade.cost + getUpgradeLevel(key) * upgrade.stepCost
}

function computeOverallHealth() {
  const total = Object.values(carState.components).reduce((sum, value) => sum + value, 0)
  return total / Object.keys(carState.components).length
}

function recordLapFrame() {
  const translation = dynamicBody.translation()
  carState.lapReplayData.push({
    x: translation.x,
    y: translation.y,
    z: translation.z,
    heading: carState.heading,
    speed: Math.hypot(dynamicBody.linvel().x, dynamicBody.linvel().z),
  })
}

function saveLapToLeaderboard() {
  const leaderboardKey = `${gameState.challengeId}_${playerProgress.selectedCarId}`
  const bestTime = playerProgress.bestLapTimes[leaderboardKey] || Infinity
  
  if (carState.lapTime < bestTime) {
    playerProgress.bestLapTimes[leaderboardKey] = carState.lapTime
    playerProgress.leaderboard[leaderboardKey] = {
      time: carState.lapTime,
      lapData: carState.lapReplayData.slice(),
      lapCount: carState.lap,
      driftScore: carState.driftScore,
      timestamp: Date.now(),
    }
    return true
  }
  return false
}

function getLeaderboardEntry() {
  const key = `${gameState.challengeId}_${playerProgress.selectedCarId}`
  return playerProgress.leaderboard[key]
}

function updateGhostCar() {
  if (!carState.isRacingGhost || !carState.ghostReplayData) return
  
  const frameCount = carState.ghostReplayData.lapData.length
  if (frameCount === 0) return
  
  carState.ghostProgress += 0.016 / (carState.ghostReplayData.time || 60)
  if (carState.ghostProgress >= 1) {
    carState.isRacingGhost = false
    ghostCar.visible = false
    return
  }
  
  const frameIndex = Math.floor(carState.ghostProgress * frameCount)
  const frame = carState.ghostReplayData.lapData[frameIndex]
  
  if (frame) {
    ghostCar.position.set(frame.x, frame.y, frame.z)
    ghostCar.rotation.y = frame.heading
    ghostCar.visible = true
  }
}

function getTireGripFactor() {
  const tireLevel = getUpgradeLevel('tireCompound')
  const tireGrip = [1.0, 1.12, 1.05, 0.85]
  const tireWear = [1.0, 0.6, 1.0, 1.4]
  return { grip: tireGrip[Math.min(tireLevel, 3)], wear: tireWear[Math.min(tireLevel, 3)] }
}

function getAeroFactor() {
  const aeroLevel = getUpgradeLevel('aeroDrag')
  const dragModifier = [1.0, 1.05, 1.15, 1.3]
  const downforceBonus = [0, 0.05, 0.12, 0.25]
  return { drag: dragModifier[Math.min(aeroLevel, 3)], grip: downforceBonus[Math.min(aeroLevel, 3)] }
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
  damageEl.textContent = `Engine ${Math.round(carState.components.engine)}% • Transmission ${Math.round(carState.components.transmission)}% • Suspension ${Math.round(carState.components.suspension)}% • Bumper ${Math.round(carState.components.frontBumper)}%`
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

  const carList = Object.entries(carCatalog).map(([key, carInfo]) => {
    const owned = Boolean(playerProgress.ownedCars[key])
    const unlocked = Boolean(playerProgress.unlockedCars[key])
    const selected = key === playerProgress.selectedCarId
    const price = carInfo.price

    if (owned) {
      return `
        <button type="button" class="garage-car ${selected ? 'selected' : ''}" data-car="${key}">
          <span>${carInfo.name}</span>
          <small>${selected ? 'Selected' : 'Owned'}</small>
        </button>
      `
    } else if (unlocked) {
      return `
        <button type="button" class="garage-car unlock" data-car-buy="${key}">
          <span>${carInfo.name}</span>
          <small>$${price}</small>
        </button>
      `
    } else {
      return `
        <button type="button" class="garage-car locked" disabled>
          <span>${carInfo.name}</span>
          <small>Locked</small>
        </button>
      `
    }
  }).join('')

  const repairCost = Math.round(220 + (100 - computeOverallHealth()) * 9)
  garagePanelEl.innerHTML = `
    <div class="garage-item">
      <div>
        <strong>Garage Repair</strong>
        <small>Repair worn components and get back to full health.</small>
        <span>Est. $${repairCost}</span>
      </div>
      <button type="button" class="garage-button repair-button" data-repair="repair">Repair $${repairCost}</button>
    </div>
    <div class="garage-section-grid">
      ${carList}
    </div>
    ${list}
  `

  const bankBalanceEl = document.querySelector('#bank-balance')
  bankBalanceEl.textContent = `Credits: ${playerProgress.credits}`
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
  carState.components.suspension = 100
  carState.components.frontBumper = 100
  dynamicBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
  dynamicBody.setTranslation({ x: checkpointPositions[0].x, y: 1.2, z: checkpointPositions[0].z }, true)

  checkpointMeshes.forEach((mesh) => {
    mesh.material.emissiveIntensity = 0.2
    mesh.scale.set(1, 1, 1)
    mesh.userData.flash = 0
  })
}

function setupAudio() {
  if (gameState.audioReady) return

  const AudioCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioCtor) return

  const ctx = new AudioCtor()
  const oscillator = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  oscillator.type = 'sawtooth'
  oscillator.frequency.value = 60
  filter.type = 'lowpass'
  filter.frequency.value = 500
  gain.gain.value = 0.0001

  oscillator.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()

  gameState.audioCtx = ctx
  gameState.engineOsc = oscillator
  gameState.engineGain = gain
  gameState.engineFilter = filter
  gameState.audioReady = true
}

function getNextMission() {
  const ordered = ['slalom', 'precision', 'street']
  const index = ordered.indexOf(gameState.challengeId)
  return ordered[index + 1] || null
}

function completeMission() {
  const selectedChallenge = careerChallenges[gameState.challengeId]
  const missionReward = selectedChallenge.reward
  playerProgress.credits += missionReward
  playerProgress.completedMissions[gameState.challengeId] = true

  const nextMission = getNextMission()
  if (nextMission) {
    playerProgress.unlockedMissions[nextMission] = true
    if (selectedChallenge.nextCar) {
      playerProgress.unlockedCars[selectedChallenge.nextCar] = true
    }
  }

  renderCareerMenu()
  renderGaragePanel()

  const ranking = getCareerRanking()
  const summary = nextMission
    ? `Mission cleared! You are now ${ranking.tier}. +$${missionReward} credited.`
    : `Mission cleared! Final rank: ${ranking.tier}. You earned $${missionReward}.`

  showOverlay('Challenge Complete', summary, nextMission ? 'Continue to Next Mission' : 'Back to Garage')
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

function triggerRepair() {
  const repairCost = Math.round(220 + (100 - computeOverallHealth()) * 9)
  if (playerProgress.credits < repairCost) {
    showToast('Not enough credits for repair.')
    return
  }

  playerProgress.credits -= repairCost
  carState.components.engine = 100
  carState.components.transmission = 100
  carState.components.suspension = 100
  carState.components.frontBumper = 100
  renderGaragePanel()
  refreshHud()
  showToast('Your Porsche is back in the garage.')
}

function applyGarageUpgrade(key) {
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
}

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

  const selectedChallenge = careerChallenges[id]
  if (selectedChallenge) {
    overlayTitleEl.textContent = selectedChallenge.title
    overlaySubtitleEl.textContent = selectedChallenge.objective
  }
})

garagePanelEl.addEventListener('click', (event) => {
  const repairButton = event.target.closest('[data-repair]')
  if (repairButton) {
    triggerRepair()
    return
  }

  const carBuyButton = event.target.closest('[data-car-buy]')
  if (carBuyButton) {
    const carId = carBuyButton.dataset.carBuy
    const carInfo = carCatalog[carId]
    if (playerProgress.credits < carInfo.price) {
      showToast(`Need $${carInfo.price - playerProgress.credits} more for ${carInfo.name}.`)
      return
    }
    playerProgress.credits -= carInfo.price
    playerProgress.ownedCars[carId] = true
    playerProgress.selectedCarId = carId
    applyCarAppearance()
    renderGaragePanel()
    showToast(`${carInfo.name} purchased and selected!`)
    return
  }

  const carButton = event.target.closest('[data-car]')
  if (carButton) {
    const carId = carButton.dataset.car
    playerProgress.selectedCarId = carId
    applyCarAppearance()
    renderGaragePanel()
    showToast(`${carCatalog[carId].name} selected.`)
    return
  }

  const upgradeButton = event.target.closest('[data-upgrade]')
  if (!upgradeButton) return

  applyGarageUpgrade(upgradeButton.dataset.upgrade)
})

overlayButtonEl.addEventListener('click', () => {
  if (gameState.challengeResult === 'complete') {
    const nextMission = getNextMission()
    if (nextMission) {
      gameState.challengeId = nextMission
      renderCareerMenu()
    }
    gameState.challengeResult = null
  }

  if (gameState.challengeResult === 'failed') {
    gameState.challengeResult = null
  }

  startChallenge()
})

function triggerCheckpointSuccess(index) {
  const mesh = checkpointMeshes[index]
  if (!mesh) return

  mesh.material.emissive.setHex(0x22c55e)
  mesh.material.emissiveIntensity = 1.25
  mesh.userData.flash = 1
  mesh.scale.set(1.3, 1.3, 1.3)
  showToast(`Checkpoint ${index + 1} clear`)
}

function handleCheckpointProgress() {
  const translation = dynamicBody.translation()
  const target = checkpointPositions[carState.checkpointIndex]
  const distance = Math.hypot(translation.x - target.x, translation.z - target.z)

  if (distance < 5) {
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

function updateCar() {
  if (!gameState.started || gameState.finished) return

  if (carState.lapStartTime > 0) {
    carState.lapTime = (performance.now() / 1000) - carState.lapStartTime
    recordLapFrame()
  }

  const velocity = dynamicBody.linvel()
  const speed = Math.hypot(velocity.x, velocity.z)
  const throttle = (controls.forward ? 1 : 0) - (controls.backward ? 1 : 0)
  const steering = (controls.right ? 1 : 0) - (controls.left ? 1 : 0)
  const handbrake = controls.handbrake ? 1 : 0

  const tireFactors = getTireGripFactor()
  const aeroFactors = getAeroFactor()
  
  const engineFactor = 0.4 + carState.components.engine / 100 * 0.8 + getUpgradeLevel('engine') * 0.08
  const transmissionFactor = 0.5 + carState.components.transmission / 100 * 0.7 + getUpgradeLevel('brakes') * 0.05
  const suspensionFactor = (0.55 + carState.components.suspension / 100 * 0.65 + getUpgradeLevel('suspension') * 0.1) * tireFactors.grip
  const effectiveMaxSpeed = maxSpeed * transmissionFactor * (1 - aeroFactors.drag * 0.05)

  const forwardX = Math.sin(carState.heading)
  const forwardZ = Math.cos(carState.heading)
  const rightX = forwardZ
  const rightZ = -forwardX

  const lateralSpeed = velocity.x * rightX + velocity.z * rightZ

  const driftIntent = clamp(Math.abs(steering) * (speed / 10) + handbrake * 0.7, 0, 1)
  const gripTarget = THREE.MathUtils.lerp(0.92, 0.42, driftIntent)
  const grip = gripTarget * suspensionFactor
  const lateralCorrection = lateralSpeed * (1 - grip) * 0.18
  const nextVelocity = {
    x: velocity.x - rightX * lateralCorrection,
    y: velocity.y,
    z: velocity.z - rightZ * lateralCorrection,
  }

  const selectedChallenge = careerChallenges[gameState.challengeId] || careerChallenges.slalom
  const goalHit = carState.driftScore >= selectedChallenge.targetScore
  if (!gameState.objectiveComplete && goalHit) {
    gameState.objectiveComplete = true
    carState.challengeName = `${selectedChallenge.title} • Objective complete`
  }

  if (throttle !== 0) {
    const force = throttle * engineForce * engineFactor * (1 - speed / (effectiveMaxSpeed + 12))
    nextVelocity.x += forwardX * force
    nextVelocity.z += forwardZ * force

    if (speed > 20) {
      carState.components.engine = clamp(carState.components.engine - 0.04, 0, 100)
    }
  } else {
    nextVelocity.x *= drag
    nextVelocity.z *= drag
  }

  if (Math.abs(steering) > 0 && speed > 1) {
    const steeringBias = Math.max(0, (0.55 - suspensionFactor) * 0.2)
    const effectiveSteer = steering * (1 - steeringBias)
    const turnStrength = effectiveSteer * steeringRate * (0.35 + Math.min(speed / effectiveMaxSpeed, 1))
    carState.heading += turnStrength * (1 + handbrake * 0.6)
  }

  if (speed > effectiveMaxSpeed) {
    const clampRatio = effectiveMaxSpeed / Math.max(speed, 0.001)
    nextVelocity.x *= clampRatio
    nextVelocity.z *= clampRatio
  }

  if (handbrake && speed > 8 && Math.abs(steering) > 0.1) {
    const driftPower = Math.abs(lateralSpeed) * 0.14 + speed * 0.04 + handbrake * 12
    carState.driftScore += driftPower * 0.12
    nextVelocity.x += rightX * steering * 14 * handbrake
    nextVelocity.z += rightZ * steering * 14 * handbrake
  }

  if (speed > 12 && Math.abs(steering) > 0.3 && Math.abs(lateralSpeed) > 2) {
    const wear = (Math.abs(lateralSpeed) * 0.012) + (Math.abs(steering) * 0.008)
    carState.components.suspension = clamp(carState.components.suspension - wear, 0, 100)
    carState.components.frontBumper = clamp(carState.components.frontBumper - wear * 0.7, 0, 100)
  }

  if (throttle !== 0 && speed > 18) {
    carState.components.transmission = clamp(carState.components.transmission - 0.025, 0, 100)
  }

  if (carState.components.suspension < 50 && speed > 8) {
    const driftBias = (50 - carState.components.suspension) / 50
    carState.heading += steering * driftBias * 0.015
  }

  if (carState.components.engine < 60) {
    const enginePenalty = (60 - carState.components.engine) / 60
    nextVelocity.x *= 1 - enginePenalty * 0.2
    nextVelocity.z *= 1 - enginePenalty * 0.2
  }

  dynamicBody.setLinvel({ x: nextVelocity.x, y: velocity.y, z: nextVelocity.z }, true)

  const translation = dynamicBody.translation()
  car.position.set(translation.x, translation.y, translation.z)
  car.rotation.y = carState.heading
  car.rotation.z = THREE.MathUtils.clamp(lateralSpeed * 0.1 + steering * handbrake * 0.18, -0.28, 0.28)

  const speedKmh = Math.round(Math.min(speed * 4.6, 999))
  speedEl.textContent = String(speedKmh)

  if (gameState.challengeId === 'street' && computeOverallHealth() < 35) {
    gameState.finished = true
    gameState.started = false
    gameState.challengeResult = 'failed'
    showOverlay(
      'Garage Verdict',
      `Damage is too high for this build. Keep the car under 35% and try again.`,
      'Retry Challenge'
    )
  }

  refreshHud()
  handleCheckpointProgress()
}

function updateCamera() {
  const carPosition = car.position.clone()
  const offset = new THREE.Vector3(0, 2.8, -7.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), carState.heading)
  const desiredPosition = carPosition.clone().add(offset)
  camera.position.lerp(desiredPosition, 0.08)

  const lookTarget = carPosition.clone().add(new THREE.Vector3(0, 1.2, 0))
  camera.lookAt(lookTarget)
}

const clock = new THREE.Clock()

function updateAudio() {
  if (!gameState.audioReady || !gameState.engineOsc) {
    return
  }

  const velocity = dynamicBody.linvel()
  const speed = Math.hypot(velocity.x, velocity.z)
  const throttle = (controls.forward ? 1 : 0) - (controls.backward ? 1 : 0)
  const handbrake = controls.handbrake ? 1 : 0

  const targetFrequency = 52 + speed * 7 + throttle * 18 + handbrake * 18
  const targetGain = 0.02 + Math.abs(throttle) * 0.12 + (speed / 25) * 0.08 + handbrake * 0.03

  gameState.engineOsc.frequency.setTargetAtTime(targetFrequency, gameState.audioCtx.currentTime, 0.08)
  gameState.engineFilter.frequency.setTargetAtTime(240 + speed * 20 + handbrake * 140, gameState.audioCtx.currentTime, 0.08)
  gameState.engineGain.gain.setTargetAtTime(gameState.started ? targetGain : 0.0001, gameState.audioCtx.currentTime, 0.08)
}

function animateCheckpointEffects(delta) {
  checkpointMeshes.forEach((mesh) => {
    if (!mesh || !mesh.userData.flash) return

    mesh.userData.flash = Math.max(0, mesh.userData.flash - delta * 1.8)
    const pulse = 1 + (1 - mesh.userData.flash) * 0.7
    mesh.scale.setScalar(pulse)

    if (mesh.userData.flash <= 0) {
      mesh.material.emissiveIntensity = 0.3
      mesh.scale.setScalar(1)
      mesh.userData.flash = 0
    }
  })
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.033)
  world.step()
  updateCar()
  updateAudio()
  updateCamera()
  animateCheckpointEffects(delta)
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

applyCarAppearance()
renderCareerMenu()
renderGaragePanel()
refreshHud()
showOverlay('Career Menu', 'Select a challenge and prove your skills in the garage.', 'Start Challenge')
animate()
