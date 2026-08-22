/**
 * Authentic Porsche VDO Analog Gauge Cluster & Damage Wireframe HUD
 * Inspired by Need for Speed: Porsche Unleashed (2000)
 */

export class GaugeCluster {
  constructor(canvasEl) {
    this.canvas = canvasEl
    this.ctx = canvasEl.getContext('2d')

    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.resize()

    // Gauge Telemetry State
    this.rpm = 0
    this.targetRpm = 0
    this.maxRpm = 8000
    this.redlineRpm = 6800
    this.speedKmh = 0
    this.maxSpeed = 320
    this.gear = 1
    this.isShiftLightActive = false
    this.isManual = false
    this.boost = 0.0 // Bar (0.0 to 1.4)
    this.hasTurbo = false
    this.damage = {
      engine: 100,
      transmission: 100,
      frontBumper: 100,
      leftSuspension: 100,
      rightSuspension: 100,
    }

    this.needleRpm = 0
    this.needleSpeed = 0
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.width = rect.width || 420
    this.height = rect.height || 210

    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
    this.ctx.scale(this.dpr, this.dpr)
  }

  setCarConfig(config) {
    if (!config) return
    this.hasTurbo = Boolean(config.audioProfile?.hasBlowoff || config.id?.includes('turbo') || config.id?.includes('gt2') || config.id?.includes('gt1'))
    this.maxRpm = config.id === 'gt3_996' ? 9000 : config.id === 'porsche_356' ? 6000 : 8000
    this.redlineRpm = config.id === 'gt3_996' ? 7600 : config.id === 'porsche_356' ? 5200 : 6800
  }

  update(telemetry, delta = 0.016) {
    this.targetRpm = telemetry.rpm || 0
    this.speedKmh = telemetry.speedKmh || 0
    this.gear = telemetry.gear ?? 1
    this.isManual = Boolean(telemetry.isManual)
    this.boost = telemetry.boost || 0
    if (telemetry.damage) {
      this.damage = { ...this.damage, ...telemetry.damage }
    }

    // Needle physics damping / spring effect
    this.needleRpm += (this.targetRpm - this.needleRpm) * Math.min(delta * 22, 1)
    this.needleSpeed += (this.speedKmh - this.needleSpeed) * Math.min(delta * 18, 1)

    this.isShiftLightActive = this.needleRpm >= this.redlineRpm - 250

    this.render()
  }

  render() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    // Center Tachometer Dial
    const tachoCenter = { x: 190, y: 110, radius: 82 }
    this.drawTachometer(tachoCenter)

    // Left Speedometer Sub-dial
    const speedCenter = { x: 68, y: 125, radius: 56 }
    this.drawSpeedometer(speedCenter)

    // Right Chassis Damage Wireframe
    this.drawDamageWireframe(330, 45, 75, 125)
  }

  /**
   * Central Iconic VDO Tachometer Dial (0–8k/9k RPM)
   */
  drawTachometer({ x, y, radius }) {
    const ctx = this.ctx

    // Dial Outer Bezel / Rim
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    const bezelGrad = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius)
    bezelGrad.addColorStop(0, '#475569')
    bezelGrad.addColorStop(0.5, '#1e293b')
    bezelGrad.addColorStop(1, '#0f172a')
    ctx.fillStyle = bezelGrad
    ctx.fill()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'
    ctx.stroke()

    // Inner Dial Face
    ctx.beginPath()
    ctx.arc(x, y, radius - 4, 0, Math.PI * 2)
    ctx.fillStyle = '#090d16'
    ctx.fill()

    // Angle Mapping: 0 RPM at 140° (bottom-left), Max RPM at 40° (bottom-right)
    const startAngle = Math.PI * 0.75 // ~135 deg
    const endAngle = Math.PI * 2.25   // ~405 deg (270 degree sweep)

    // Redline Arc Zone
    const redlineFraction = this.redlineRpm / this.maxRpm
    const redlineStartAngle = startAngle + (endAngle - startAngle) * redlineFraction

    ctx.beginPath()
    ctx.arc(x, y, radius - 14, redlineStartAngle, endAngle)
    ctx.lineWidth = 6
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.85)'
    ctx.stroke()

    // Major & Minor Ticks
    const maxK = Math.round(this.maxRpm / 1000)
    for (let k = 0; k <= maxK; k++) {
      const fraction = k / maxK
      const angle = startAngle + (endAngle - startAngle) * fraction
      const isRedline = k * 1000 >= this.redlineRpm

      const innerR = radius - (k % 1 === 0 ? 18 : 12)
      const outerR = radius - 7

      const x1 = x + Math.cos(angle) * innerR
      const y1 = y + Math.sin(angle) * innerR
      const x2 = x + Math.cos(angle) * outerR
      const y2 = y + Math.sin(angle) * outerR

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineWidth = 2.5
      ctx.strokeStyle = isRedline ? '#ef4444' : '#f8fafc'
      ctx.stroke()

      // Numeral Label
      const numR = radius - 27
      const numX = x + Math.cos(angle) * numR
      const numY = y + Math.sin(angle) * numR
      ctx.font = 'bold 11px Orbitron, sans-serif'
      ctx.fillStyle = isRedline ? '#ef4444' : '#cbd5e1'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(k), numX, numY)
    }

    // Dial Subtitle (RPM x1000)
    ctx.font = '600 7px Outfit, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText('RPM × 1000', x, y - 28)

    // Center Gear Indicator Display Badge
    ctx.beginPath()
    ctx.arc(x, y + 20, 16, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = this.isShiftLightActive ? '#ef4444' : 'rgba(148, 163, 184, 0.35)'
    ctx.stroke()

    ctx.font = 'bold 16px Orbitron, sans-serif'
    let gearText = 'N'
    if (this.gear === -1) gearText = 'R'
    else if (this.gear > 0) gearText = String(this.gear)

    ctx.fillStyle = this.gear === -1 ? '#f59e0b' : this.isShiftLightActive ? '#ef4444' : '#38bdf8'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(gearText, x, y + 21)

    // Shift Light on Top of Tachometer
    if (this.isShiftLightActive) {
      ctx.beginPath()
      ctx.arc(x, y - radius + 10, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#ef4444'
      ctx.shadowColor = '#ef4444'
      ctx.shadowBlur = 12
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Sweeping Orange/Red Needle
    const clampedRpm = Math.max(0, Math.min(this.needleRpm, this.maxRpm))
    const needleFraction = clampedRpm / this.maxRpm
    const needleAngle = startAngle + (endAngle - startAngle) * needleFraction

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(needleAngle)

    // Needle Blade
    ctx.beginPath()
    ctx.moveTo(-10, 0)
    ctx.lineTo(0, -2.5)
    ctx.lineTo(radius - 12, 0)
    ctx.lineTo(0, 2.5)
    ctx.closePath()
    ctx.fillStyle = '#f97316'
    ctx.shadowColor = '#ea580c'
    ctx.shadowBlur = 8
    ctx.fill()

    // Center Hub Cap
    ctx.beginPath()
    ctx.arc(0, 0, 7, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#94a3b8'
    ctx.stroke()

    ctx.restore()
    ctx.restore()
  }

  /**
   * Left Speedometer Dial (0–320 km/h)
   */
  drawSpeedometer({ x, y, radius }) {
    const ctx = this.ctx
    ctx.save()

    // Dial Rim
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#090d16'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.stroke()

    const startAngle = Math.PI * 0.8
    const endAngle = Math.PI * 2.2

    // Major Ticks (0, 40, 80, 120, 160, 200, 240, 280, 320)
    const step = 40
    for (let s = 0; s <= this.maxSpeed; s += step) {
      const frac = s / this.maxSpeed
      const angle = startAngle + (endAngle - startAngle) * frac

      const x1 = x + Math.cos(angle) * (radius - 10)
      const y1 = y + Math.sin(angle) * (radius - 10)
      const x2 = x + Math.cos(angle) * (radius - 4)
      const y2 = y + Math.sin(angle) * (radius - 4)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#94a3b8'
      ctx.stroke()

      const numX = x + Math.cos(angle) * (radius - 18)
      const numY = y + Math.sin(angle) * (radius - 18)
      ctx.font = 'bold 8px Orbitron, sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(s), numX, numY)
    }

    // KM/H Text & Digital Speed
    ctx.font = 'bold 12px Orbitron, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(String(Math.round(this.speedKmh)), x, y + 14)

    ctx.font = '600 7px Outfit, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('KM/H', x, y + 24)

    // Needle
    const clampedSpeed = Math.max(0, Math.min(this.needleSpeed, this.maxSpeed))
    const needleAngle = startAngle + (endAngle - startAngle) * (clampedSpeed / this.maxSpeed)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(needleAngle)

    ctx.beginPath()
    ctx.moveTo(-6, 0)
    ctx.lineTo(0, -1.5)
    ctx.lineTo(radius - 8, 0)
    ctx.lineTo(0, 1.5)
    ctx.closePath()
    ctx.fillStyle = '#f97316'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()

    ctx.restore()
    ctx.restore()
  }

  /**
   * 4-Corner Top-Down Chassis Damage Wireframe
   */
  drawDamageWireframe(x, y, w, h) {
    const ctx = this.ctx
    ctx.save()

    // Panel Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 8)
    ctx.fill()
    ctx.stroke()

    // Section Title
    ctx.font = '700 7px Orbitron, sans-serif'
    ctx.fillStyle = '#94a3b8'
    ctx.textAlign = 'center'
    ctx.fillText('DIAGNOSTICS', x + w / 2, y + 12)

    const getColorForHealth = (health) => {
      if (health > 80) return '#22c55e' // Green
      if (health > 50) return '#eab308' // Yellow
      if (health > 25) return '#f97316' // Orange
      return '#ef4444' // Red
    }

    const cx = x + w / 2
    const cy = y + h / 2 + 4

    // Top-down Porsche Silhouette Outline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    // Front bumper curve
    ctx.moveTo(cx - 14, cy - 36)
    ctx.quadraticCurveTo(cx, cy - 42, cx + 14, cy - 36)
    // Right side
    ctx.lineTo(cx + 16, cy - 18) // Front right wheel arch
    ctx.lineTo(cx + 14, cy)      // Cabin side
    ctx.lineTo(cx + 18, cy + 22) // Rear right wide fender
    ctx.lineTo(cx + 12, cy + 38) // Rear bumper right
    // Rear bumper curve
    ctx.quadraticCurveTo(cx, cy + 40, cx - 12, cy + 38)
    // Left side
    ctx.lineTo(cx - 18, cy + 22) // Rear left wide fender
    ctx.lineTo(cx - 14, cy)      // Cabin side
    ctx.lineTo(cx - 16, cy - 18) // Front left wheel arch
    ctx.closePath()
    ctx.stroke()

    // 1. Front Bumper / Aero Zone
    ctx.fillStyle = getColorForHealth(this.damage.frontBumper)
    ctx.beginPath()
    ctx.roundRect(cx - 11, cy - 38, 22, 6, 2)
    ctx.fill()

    // 2. Left Suspension & Tire
    ctx.fillStyle = getColorForHealth(this.damage.leftSuspension)
    ctx.beginPath()
    ctx.roundRect(cx - 21, cy - 22, 5, 12, 2) // Front Left
    ctx.roundRect(cx - 23, cy + 18, 6, 14, 2) // Rear Left
    ctx.fill()

    // 3. Right Suspension & Tire
    ctx.fillStyle = getColorForHealth(this.damage.rightSuspension)
    ctx.beginPath()
    ctx.roundRect(cx + 16, cy - 22, 5, 12, 2) // Front Right
    ctx.roundRect(cx + 17, cy + 18, 6, 14, 2) // Rear Right
    ctx.fill()

    // 4. Rear Engine (Air-Cooled / Turbo Flat-6)
    ctx.fillStyle = getColorForHealth(this.damage.engine)
    ctx.beginPath()
    ctx.roundRect(cx - 9, cy + 18, 18, 14, 3)
    ctx.fill()

    // Engine Label
    ctx.font = 'bold 6px Outfit, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    ctx.fillText('FLAT-6', cx, cy + 27)

    // 5. Transmission Box (Center)
    ctx.fillStyle = getColorForHealth(this.damage.transmission)
    ctx.beginPath()
    ctx.roundRect(cx - 5, cy + 2, 10, 10, 2)
    ctx.fill()

    ctx.restore()
  }
}
