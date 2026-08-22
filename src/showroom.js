import * as THREE from 'three'
import {
  PORSCHE_CATALOG,
  FACTORY_PAINTS,
  WHEEL_FINISHES,
  buildPorsche3DModel,
} from './carBuilder.js'

export class PorscheShowroom {
  constructor(containerEl, onStartDrive) {
    this.container = containerEl
    this.onStartDrive = onStartDrive

    this.currentCarId = 'carrera_rs'
    this.selectedPaint = '#f8fafc'
    this.selectedWheelColor = '#2563eb'
    this.selectedWheelFinish = WHEEL_FINISHES[0]
    this.selectedStripeColor = '#2563eb'
    this.headlightsOn = false
    this.autoRotate = true
    this.currentEraFilter = 'all'

    // Camera Orbit state
    this.isDragging = false
    this.previousMousePosition = { x: 0, y: 0 }
    this.spherical = {
      radius: 6.8,
      theta: Math.PI * 0.25, // horizontal angle
      phi: Math.PI * 0.38,   // elevation angle
    }
    this.targetSpherical = { ...this.spherical }
    this.turntableAngle = 0

    this.initScene()
    this.initUI()
    this.loadCar(this.currentCarId)
    this.setupEventListeners()
    this.setupAudioPreview()
  }

  initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0e17)
    this.scene.fog = new THREE.FogExp2(0x0a0e17, 0.035)

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    this.updateCameraPosition()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15

    this.container.appendChild(this.renderer.domElement)

    // Studio Environment & Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(ambientLight)

    // Key Overhead Softbox Spot
    this.keyLight = new THREE.SpotLight(0xffffff, 4.2, 25, Math.PI / 3, 0.4, 1.2)
    this.keyLight.position.set(4, 8, 5)
    this.keyLight.castShadow = true
    this.keyLight.shadow.mapSize.set(2048, 2048)
    this.keyLight.shadow.bias = -0.0001
    this.scene.add(this.keyLight)

    // Fill Softbox (Cool blue tint)
    const fillLight = new THREE.DirectionalLight(0xa5c4ff, 1.4)
    fillLight.position.set(-6, 5, -4)
    this.scene.add(fillLight)

    // Rim / Backlight for Porsche silhouette edge highlights
    const rimLight = new THREE.DirectionalLight(0xffecd1, 2.2)
    rimLight.position.set(0, 4, -7)
    this.scene.add(rimLight)

    // Floor Pedestal / Turntable Stage
    this.stageGroup = new THREE.Group()

    // Dark Reflective Circular Stage
    const stageGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.15, 64)
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.22,
      metalness: 0.75,
    })
    const stageMesh = new THREE.Mesh(stageGeo, stageMat)
    stageMesh.position.y = -0.075
    stageMesh.receiveShadow = true
    this.stageGroup.add(stageMesh)

    // Glowing Perimeter Ring
    const ringGeo = new THREE.TorusGeometry(3.62, 0.035, 16, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 2
    ringMesh.position.y = 0.01
    this.stageGroup.add(ringMesh)

    // Outer Studio Dark Floor
    const outerFloorGeo = new THREE.PlaneGeometry(80, 80)
    const outerFloorMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      roughness: 0.6,
      metalness: 0.3,
    })
    const outerFloor = new THREE.Mesh(outerFloorGeo, outerFloorMat)
    outerFloor.rotation.x = -Math.PI / 2
    outerFloor.position.y = -0.15
    outerFloor.receiveShadow = true
    this.scene.add(outerFloor)

    this.scene.add(this.stageGroup)

    // Car Holder
    this.carHolder = new THREE.Group()
    this.scene.add(this.carHolder)
  }

  loadCar(carId) {
    this.currentCarId = carId
    const config = PORSCHE_CATALOG[carId]
    if (!config) return

    // Clean up previous car model
    while (this.carHolder.children.length > 0) {
      const obj = this.carHolder.children[0]
      this.carHolder.remove(obj)
    }

    // Default colors for this car if not customized
    this.selectedPaint = config.defaultColor
    this.selectedWheelColor = config.defaultWheelColor
    this.selectedStripeColor = config.defaultStripeColor || config.defaultColor

    // Build 3D Porsche
    this.currentCarModel = buildPorsche3DModel(carId, {
      paintColor: this.selectedPaint,
      wheelColor: this.selectedWheelColor,
      stripeColor: this.selectedStripeColor,
    })

    this.carHolder.add(this.currentCarModel)
    this.currentCarModel.userData.toggleHeadlights(this.headlightsOn)

    this.updateUI()
  }

  updateCameraPosition() {
    // Spherical to Cartesian coordinates
    const x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta)
    const y = this.spherical.radius * Math.cos(this.spherical.phi)
    const z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta)

    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 0.65, 0)
  }

  initUI() {
    const uiOverlay = document.createElement('div')
    uiOverlay.className = 'showroom-ui'
    uiOverlay.innerHTML = `
      <!-- Top Brand Header -->
      <header class="showroom-header">
        <div class="brand-title">
          <span class="porsche-crest-badge">PORSCHE</span>
          <h1>UNLEASHED SHOWROOM</h1>
        </div>
        <div class="era-tabs">
          <button class="era-tab active" data-era="all">All Eras</button>
          <button class="era-tab" data-era="classic">Classic Era</button>
          <button class="era-tab" data-era="golden">Golden Era</button>
          <button class="era-tab" data-era="modern">Modern Era</button>
        </div>
      </header>

      <!-- Main Showcase Selector Carousel -->
      <div class="car-selector-dock" id="car-selector-dock"></div>

      <!-- Left Specs Sheet Panel -->
      <div class="showroom-panel left-panel">
        <div class="panel-tag" id="spec-era-tag">Golden Era • 1973</div>
        <h2 id="spec-name" class="car-title">911 Carrera RS 2.7</h2>
        <p id="spec-tagline" class="car-tagline">The pure homologation special featuring the legendary ducktail.</p>

        <div class="specs-grid">
          <div class="spec-card">
            <span class="spec-label">Engine</span>
            <strong id="spec-engine" class="spec-value">2.7L Flat-6</strong>
          </div>
          <div class="spec-card">
            <span class="spec-label">Output</span>
            <strong id="spec-power" class="spec-value">210 hp</strong>
          </div>
          <div class="spec-card">
            <span class="spec-label">Top Speed</span>
            <strong id="spec-topspeed" class="spec-value">245 km/h</strong>
          </div>
          <div class="spec-card">
            <span class="spec-label">0–100 km/h</span>
            <strong id="spec-accel" class="spec-value">5.8s</strong>
          </div>
          <div class="spec-card">
            <span class="spec-label">Weight</span>
            <strong id="spec-weight" class="spec-value">975 kg</strong>
          </div>
          <div class="spec-card">
            <span class="spec-label">Layout</span>
            <strong id="spec-layout" class="spec-value">Rear-Engine, RWD</strong>
          </div>
        </div>

        <div class="showroom-actions">
          <button id="btn-rev-engine" class="action-btn rev-btn" type="button">
            <span class="icon">🔊</span> Rev Boxer Flat-6
          </button>
          <button id="btn-toggle-lights" class="action-btn light-btn" type="button">
            <span class="icon">💡</span> Toggle Lights
          </button>
        </div>
      </div>

      <!-- Right Customizer Panel -->
      <div class="showroom-panel right-panel">
        <h3>PORSCHE EXCLUSIVE MANUFAKTUR</h3>
        
        <div class="customizer-section">
          <label>Exterior Paint Color</label>
          <div class="paint-swatches" id="paint-swatches"></div>
        </div>

        <div class="customizer-section">
          <label>Wheel Alloy Finish</label>
          <div class="wheel-swatches" id="wheel-swatches"></div>
        </div>

        <div class="customizer-section controls-hint">
          <div class="hint-item"><span>🖱️ Drag to rotate 360°</span></div>
          <div class="hint-item"><span>🔍 Scroll / Pinch to zoom</span></div>
          <button id="btn-auto-rotate" class="toggle-pill active" type="button">Auto-Spin: ON</button>
        </div>

        <!-- Launch Drive Button -->
        <button id="btn-enter-track" class="btn-primary-drive" type="button">
          <span>DRIVE ON TEST TRACK</span>
          <small>Take your Porsche to the circuit & career missions →</small>
        </button>
      </div>
    `
    this.container.appendChild(uiOverlay)
    this.ui = uiOverlay
  }

  updateUI() {
    const config = PORSCHE_CATALOG[this.currentCarId]
    if (!config) return

    // Update Specs
    this.ui.querySelector('#spec-era-tag').textContent = `${config.eraLabel} • ${config.year}`
    this.ui.querySelector('#spec-name').textContent = config.name
    this.ui.querySelector('#spec-tagline').textContent = config.tagline
    this.ui.querySelector('#spec-engine').textContent = config.engine
    this.ui.querySelector('#spec-power').textContent = config.power
    this.ui.querySelector('#spec-topspeed').textContent = config.topSpeed
    this.ui.querySelector('#spec-accel').textContent = config.acceleration
    this.ui.querySelector('#spec-weight').textContent = config.weight
    this.ui.querySelector('#spec-layout').textContent = config.layout

    // Render Car Carousel Cards
    const dockEl = this.ui.querySelector('#car-selector-dock')
    const filteredCars = Object.values(PORSCHE_CATALOG).filter(
      (c) => this.currentEraFilter === 'all' || c.era === this.currentEraFilter
    )

    dockEl.innerHTML = filteredCars
      .map(
        (c) => `
        <button class="car-card ${c.id === this.currentCarId ? 'selected' : ''}" data-car-id="${c.id}">
          <span class="card-year">${c.year}</span>
          <strong class="card-name">${c.name}</strong>
          <small class="card-hp">${c.power.split('@')[0]}</small>
        </button>
      `
      )
      .join('')

    // Render Paint Swatches
    const paintContainer = this.ui.querySelector('#paint-swatches')
    paintContainer.innerHTML = FACTORY_PAINTS.map(
      (paint) => `
      <button class="paint-chip ${paint.hex.toLowerCase() === this.selectedPaint.toLowerCase() ? 'active' : ''}" 
        style="background: ${paint.hex};" 
        title="${paint.name}" 
        data-paint-hex="${paint.hex}">
      </button>
    `
    ).join('')

    // Render Wheel Finish Swatches
    const wheelContainer = this.ui.querySelector('#wheel-swatches')
    wheelContainer.innerHTML = WHEEL_FINISHES.map(
      (w) => `
      <button class="wheel-chip ${w.name === this.selectedWheelFinish.name ? 'active' : ''}" 
        data-wheel-name="${w.name}">
        <span class="wheel-color-dot" style="background: ${w.hex};"></span>
        <span>${w.name}</span>
      </button>
    `
    ).join('')
  }

  setupEventListeners() {
    // Era Filter Tabs
    this.ui.querySelectorAll('.era-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        this.ui.querySelectorAll('.era-tab').forEach((t) => t.classList.remove('active'))
        tab.classList.add('active')
        this.currentEraFilter = tab.dataset.era
        this.updateUI()
      })
    })

    // Car Selection in Dock
    this.ui.querySelector('#car-selector-dock').addEventListener('click', (e) => {
      const card = e.target.closest('.car-card')
      if (card) {
        this.loadCar(card.dataset.carId)
      }
    })

    // Paint Swatch Selection
    this.ui.querySelector('#paint-swatches').addEventListener('click', (e) => {
      const chip = e.target.closest('.paint-chip')
      if (chip) {
        const hex = chip.dataset.paintHex
        this.selectedPaint = hex
        if (this.currentCarModel?.userData?.setPaintColor) {
          this.currentCarModel.userData.setPaintColor(hex)
        }
        this.updateUI()
      }
    })

    // Wheel Finish Selection
    this.ui.querySelector('#wheel-swatches').addEventListener('click', (e) => {
      const chip = e.target.closest('.wheel-chip')
      if (chip) {
        const finish = WHEEL_FINISHES.find((w) => w.name === chip.dataset.wheelName)
        if (finish) {
          this.selectedWheelFinish = finish
          this.selectedWheelColor = finish.hex
          if (this.currentCarModel?.userData?.setWheelFinish) {
            this.currentCarModel.userData.setWheelFinish(finish.hex, finish.metalness, finish.roughness)
          }
          this.updateUI()
        }
      }
    })

    // Headlight Toggle Button
    this.ui.querySelector('#btn-toggle-lights').addEventListener('click', () => {
      this.headlightsOn = !this.headlightsOn
      if (this.currentCarModel?.userData?.toggleHeadlights) {
        this.currentCarModel.userData.toggleHeadlights(this.headlightsOn)
      }
      this.ui.querySelector('#btn-toggle-lights').classList.toggle('active', this.headlightsOn)
    })

    // Auto-Rotate Button
    const autoRotateBtn = this.ui.querySelector('#btn-auto-rotate')
    autoRotateBtn.addEventListener('click', () => {
      this.autoRotate = !this.autoRotate
      autoRotateBtn.textContent = `Auto-Spin: ${this.autoRotate ? 'ON' : 'OFF'}`
      autoRotateBtn.classList.toggle('active', this.autoRotate)
    })

    // Rev Engine Sound Button
    const revBtn = this.ui.querySelector('#btn-rev-engine')
    revBtn.addEventListener('click', () => {
      this.playEngineRevSound()
    })

    // Enter Track / Start Driving
    this.ui.querySelector('#btn-enter-track').addEventListener('click', () => {
      if (this.onStartDrive) {
        this.onStartDrive({
          carId: this.currentCarId,
          paintColor: this.selectedPaint,
          wheelColor: this.selectedWheelColor,
          stripeColor: this.selectedStripeColor,
        })
      }
    })

    // 360 Orbit Mouse & Touch Interaction
    const domEl = this.renderer.domElement
    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true
      this.previousMousePosition = { x: clientX, y: clientY }
    }

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging) return

      const deltaX = clientX - this.previousMousePosition.x
      const deltaY = clientY - this.previousMousePosition.y

      this.targetSpherical.theta -= deltaX * 0.007
      this.targetSpherical.phi = Math.max(0.18, Math.min(Math.PI * 0.46, this.targetSpherical.phi + deltaY * 0.006))

      this.previousMousePosition = { x: clientX, y: clientY }
    }

    const onPointerUp = () => {
      this.isDragging = false
    }

    domEl.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY))
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY))
    window.addEventListener('mouseup', onPointerUp)

    domEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY)
      }
    })
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    })
    window.addEventListener('touchend', onPointerUp)

    // Zoom on wheel
    domEl.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
        this.targetSpherical.radius = Math.max(3.8, Math.min(10.5, this.targetSpherical.radius + e.deltaY * 0.006))
      },
      { passive: false }
    )

    // Window Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  setupAudioPreview() {
    this.audioCtx = null
  }

  async playEngineRevSound() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) return

    if (!this.audioCtx) {
      this.audioCtx = new AudioCtor()
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume()
    }

    const config = PORSCHE_CATALOG[this.currentCarId]
    const profile = config.audioProfile || { basePitch: 55, maxFreq: 600 }

    const now = this.audioCtx.currentTime

    // Multi-oscillator flat-6 boxer engine synthesis
    const osc1 = this.audioCtx.createOscillator()
    const osc2 = this.audioCtx.createOscillator()
    const filter = this.audioCtx.createBiquadFilter()
    const gain = this.audioCtx.createGain()

    osc1.type = 'sawtooth'
    osc2.type = 'triangle'
    osc1.frequency.setValueAtTime(profile.basePitch, now)
    osc2.frequency.setValueAtTime(profile.basePitch * 1.5, now)

    // Rev throttle profile curve (Idle -> High Rev -> Burble & Exhaust Pop)
    osc1.frequency.linearRampToValueAtTime(profile.basePitch * 1.2, now + 0.15)
    osc1.frequency.exponentialRampToValueAtTime(profile.maxFreq, now + 0.65)
    osc1.frequency.exponentialRampToValueAtTime(profile.maxFreq * 1.05, now + 0.85)
    osc1.frequency.exponentialRampToValueAtTime(profile.basePitch * 1.3, now + 1.4)
    osc1.frequency.exponentialRampToValueAtTime(profile.basePitch, now + 1.8)

    osc2.frequency.linearRampToValueAtTime(profile.basePitch * 1.8, now + 0.15)
    osc2.frequency.exponentialRampToValueAtTime(profile.maxFreq * 1.5, now + 0.65)
    osc2.frequency.exponentialRampToValueAtTime(profile.basePitch * 1.5, now + 1.8)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(350, now)
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.65)
    filter.frequency.exponentialRampToValueAtTime(500, now + 1.8)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.35, now + 0.2)
    gain.gain.linearRampToValueAtTime(0.45, now + 0.65)
    gain.gain.linearRampToValueAtTime(0.2, now + 1.4)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioCtx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 2.05)
    osc2.stop(now + 2.05)
  }

  show() {
    this.container.style.display = 'block'
    this.ui.style.display = 'block'
    this.animate()
  }

  hide() {
    this.container.style.display = 'none'
    this.ui.style.display = 'none'
  }

  animate() {
    if (this.container.style.display === 'none') return

    // Smooth Orbit Camera Interpolation
    this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.1
    this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.1
    this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.1

    // Turntable Auto-Rotation if user is not actively dragging
    if (this.autoRotate && !this.isDragging) {
      this.targetSpherical.theta += 0.004
    }

    this.updateCameraPosition()

    this.renderer.render(this.scene, this.camera)
    this.animId = requestAnimationFrame(() => this.animate())
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId)
    this.renderer.dispose()
    this.container.innerHTML = ''
  }
}
