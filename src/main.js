import './style.css'
import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'

await RAPIER.init()

const app = document.querySelector('#app')
app.innerHTML = `
  <div class="game-shell">
    <div class="hud">
      <div class="panel">
        <div class="title">Factory Driver Test</div>
        <div class="stats">
          <span>Speed <strong id="speed">0</strong> km/h</span>
          <span>Health <strong id="health">100</strong>%</span>
        </div>
      </div>
    </div>
  </div>
`

const shell = app.querySelector('.game-shell')
const speedEl = document.querySelector('#speed')
const healthEl = document.querySelector('#health')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xb7d6ff)
scene.fog = new THREE.Fog(0xb7d6ff, 18, 90)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
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

const wheelGeometry = new THREE.CylinderGeometry(0.48, 0.48, 0.5, 16)
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

const dynamicBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setMass(1400).setLinearDamping(0.75).setAngularDamping(1.1)
)
dynamicBody.setTranslation({ x: 0, y: 1.2, z: 0 }, true)
world.createCollider(RAPIER.ColliderDesc.cuboid(1.2, 0.5, 2.3), dynamicBody)

const controls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
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

const carState = {
  heading: 0,
  health: 100,
}
const maxSpeed = 28
const engineForce = 55
const steeringRate = 0.045
const drag = 0.92

function updateCar() {
  const velocity = dynamicBody.linvel()
  const speed = Math.hypot(velocity.x, velocity.z)
  const throttle = (controls.forward ? 1 : 0) - (controls.backward ? 1 : 0)
  const steering = (controls.right ? 1 : 0) - (controls.left ? 1 : 0)
  const damageMultiplier = 1 + (100 - carState.health) / 180

  if (throttle !== 0) {
    const forwardX = Math.sin(carState.heading)
    const forwardZ = Math.cos(carState.heading)
    const force = throttle * engineForce * (1 - speed / (maxSpeed + 10))
    dynamicBody.applyImpulse({ x: forwardX * force, y: 0, z: forwardZ * force }, true)
  } else {
    dynamicBody.setLinvel(
      {
        x: velocity.x * drag,
        y: velocity.y,
        z: velocity.z * drag,
      },
      true
    )
  }

  if (Math.abs(steering) > 0) {
    const turnStrength = steering * steeringRate * (0.4 + Math.min(speed / maxSpeed, 1))
    carState.heading += turnStrength * damageMultiplier
  }

  if (speed > maxSpeed) {
    const clamp = maxSpeed / Math.max(speed, 0.001)
    dynamicBody.setLinvel(
      {
        x: velocity.x * clamp,
        y: velocity.y,
        z: velocity.z * clamp,
      },
      true
    )
  }

  if (speed > 12 && Math.abs(steering) > 0.1) {
    carState.health = Math.max(0, carState.health - (Math.abs(steering) * 0.3 + speed * 0.015) * 0.016)
  }

  if (carState.health < 80 && speed > 16) {
    const driftBias = (80 - carState.health) / 120
    carState.heading += steering * driftBias * 0.01
  }

  const translation = dynamicBody.translation()
  car.position.set(translation.x, translation.y, translation.z)
  car.rotation.y = carState.heading
  car.rotation.z = THREE.MathUtils.clamp((velocity.x * 0.22) / Math.max(speed, 1), -0.15, 0.15)

  const speedKmh = Math.round(Math.min((speed * 4.6), 999))
  speedEl.textContent = String(speedKmh)
  healthEl.textContent = String(Math.max(0, Math.round(carState.health)))
}

function updateCamera() {
  const carPosition = car.position.clone()
  const offset = new THREE.Vector3(0, 2.6, -7.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), carState.heading)
  const desiredPosition = carPosition.clone().add(offset)
  camera.position.lerp(desiredPosition, 0.08)

  const lookTarget = carPosition.clone().add(new THREE.Vector3(0, 1.2, 0))
  camera.lookAt(lookTarget)
}

const clock = new THREE.Clock()

function animate() {
  const delta = Math.min(clock.getDelta(), 0.033)
  world.step()
  updateCar()
  updateCamera()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
