import * as THREE from 'three'

/**
 * High-performance 3D Tire Skidmark & Smoke Particle System
 */

export class TireEffects {
  constructor(scene) {
    this.scene = scene

    // Skidmark settings
    this.maxSegments = 800
    this.skidPoints = [] // Array of { p1: Vector3, p2: Vector3, opacity: number }
    this.initSkidmarkMesh()

    // Smoke Particle Pool
    this.maxParticles = 120
    this.particles = []
    this.initSmokeParticles()

    this.lastLeftTirePos = null
    this.lastRightTirePos = null
  }

  initSkidmarkMesh() {
    this.skidGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(this.maxSegments * 6 * 3)
    const uvs = new Float32Array(this.maxSegments * 6 * 2)
    const alphas = new Float32Array(this.maxSegments * 6)

    this.skidGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.skidGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    this.skidGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))

    this.skidMat = new THREE.MeshBasicMaterial({
      color: 0x111115,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -1.0,
    })

    this.skidMesh = new THREE.Mesh(this.skidGeo, this.skidMat)
    this.skidMesh.position.y = 0.12 // Just above asphalt
    this.skidMesh.frustumCulled = false
    this.scene.add(this.skidMesh)
    this.currentSkidIndex = 0
  }

  initSmokeParticles() {
    this.smokeGeo = new THREE.PlaneGeometry(0.8, 0.8)
    this.smokeMat = new THREE.MeshBasicMaterial({
      color: 0xd6d3d1,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    this.smokeGroup = new THREE.Group()
    this.scene.add(this.smokeGroup)

    for (let i = 0; i < this.maxParticles; i++) {
      const mesh = new THREE.Mesh(this.smokeGeo, this.smokeMat.clone())
      mesh.visible = false
      this.smokeGroup.add(mesh)
      this.particles.push({
        mesh,
        life: 0,
        maxLife: 1.0,
        velocity: new THREE.Vector3(),
        scale: 0.5,
        rotationSpeed: 0,
      })
    }
  }

  addSkidmark(tirePosL, tirePosR, slipIntensity) {
    if (slipIntensity < 0.22) {
      this.lastLeftTirePos = null
      this.lastRightTirePos = null
      return
    }

    const clampedIntensity = Math.min(1.0, slipIntensity)

    // Left Tire Mark
    if (this.lastLeftTirePos && this.lastLeftTirePos.distanceTo(tirePosL) < 3.0) {
      this.appendSegment(this.lastLeftTirePos, tirePosL, clampedIntensity, 0.32)
    }
    this.lastLeftTirePos = tirePosL.clone()

    // Right Tire Mark
    if (this.lastRightTirePos && this.lastRightTirePos.distanceTo(tirePosR) < 3.0) {
      this.appendSegment(this.lastRightTirePos, tirePosR, clampedIntensity, 0.32)
    }
    this.lastRightTirePos = tirePosR.clone()
  }

  appendSegment(pPrev, pCurr, intensity, width = 0.3) {
    const dir = new THREE.Vector3().subVectors(pCurr, pPrev).normalize()
    const normal = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(width * 0.5)

    const v1 = new THREE.Vector3().subVectors(pPrev, normal)
    const v2 = new THREE.Vector3().addVectors(pPrev, normal)
    const v3 = new THREE.Vector3().subVectors(pCurr, normal)
    const v4 = new THREE.Vector3().addVectors(pCurr, normal)

    const posAttr = this.skidGeo.attributes.position
    const idx = (this.currentSkidIndex % this.maxSegments) * 6 * 3

    // Triangle 1: v1, v2, v3
    posAttr.array[idx] = v1.x; posAttr.array[idx + 1] = v1.y; posAttr.array[idx + 2] = v1.z
    posAttr.array[idx + 3] = v2.x; posAttr.array[idx + 4] = v2.y; posAttr.array[idx + 5] = v2.z
    posAttr.array[idx + 6] = v3.x; posAttr.array[idx + 7] = v3.y; posAttr.array[idx + 8] = v3.z

    // Triangle 2: v2, v4, v3
    posAttr.array[idx + 9] = v2.x; posAttr.array[idx + 10] = v2.y; posAttr.array[idx + 11] = v2.z
    posAttr.array[idx + 12] = v4.x; posAttr.array[idx + 13] = v4.y; posAttr.array[idx + 14] = v4.z
    posAttr.array[idx + 15] = v3.x; posAttr.array[idx + 16] = v3.y; posAttr.array[idx + 17] = v3.z

    posAttr.needsUpdate = true
    this.currentSkidIndex++
  }

  emitSmoke(position, velocity, slipAmount) {
    if (slipAmount < 0.28) return

    const count = Math.min(3, Math.ceil(slipAmount * 3))
    for (let c = 0; c < count; c++) {
      const p = this.particles.find((item) => !item.mesh.visible)
      if (!p) break

      p.mesh.visible = true
      p.life = 0
      p.maxLife = 0.65 + Math.random() * 0.4
      p.scale = 0.45 + Math.random() * 0.3
      p.rotationSpeed = (Math.random() - 0.5) * 3

      // Spawn near tire with small jitter
      p.mesh.position.set(
        position.x + (Math.random() - 0.5) * 0.35,
        position.y + 0.15 + Math.random() * 0.15,
        position.z + (Math.random() - 0.5) * 0.35
      )

      p.velocity.set(
        velocity.x * 0.15 + (Math.random() - 0.5) * 1.5,
        0.8 + Math.random() * 1.2,
        velocity.z * 0.15 + (Math.random() - 0.5) * 1.5
      )
      p.mesh.material.opacity = 0.45 * Math.min(1.0, slipAmount)
      p.mesh.scale.setScalar(p.scale)
    }
  }

  update(delta, camera) {
    // Update and bill-board smoke particles
    for (const p of this.particles) {
      if (!p.mesh.visible) continue

      p.life += delta
      if (p.life >= p.maxLife) {
        p.mesh.visible = false
        continue
      }

      const progress = p.life / p.maxLife
      p.mesh.position.addScaledVector(p.velocity, delta)
      p.velocity.y *= 0.96 // Air drag
      p.scale += delta * 1.8 // Expansion
      p.mesh.scale.setScalar(p.scale)

      p.mesh.material.opacity = 0.45 * (1 - progress)
      p.mesh.rotation.z += p.rotationSpeed * delta

      // Billboard facing camera
      if (camera) {
        p.mesh.quaternion.copy(camera.quaternion)
      }
    }
  }

  clear() {
    this.skidPoints = []
    const posAttr = this.skidGeo.attributes.position
    posAttr.array.fill(0)
    posAttr.needsUpdate = true
    this.currentSkidIndex = 0

    this.particles.forEach((p) => {
      p.mesh.visible = false
    })
  }
}
