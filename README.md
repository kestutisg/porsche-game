# 🏎️ Need for Speed: Porsche Unleashed (Web 3D)

A browser-based tribute to the legendary classic **Need for Speed: Porsche Unleashed (2000)**, built with modern WebGL (**Three.js**), 3D rigid-body physics (**Rapier3D**), and Web Audio API synthesis.

Experience iconic Porsche eras, inspect detailed 3D models in the interactive 360° Showroom, customize factory paint colors and wheels, rev the air-cooled flat-6 boxer engine, and test your skills on the circuit in Factory Driver career challenges with authentic analog VDO gauges, dynamic weight transfer, Pacejka tire physics, real-time skidmarks, and tire smoke.

---

## ✨ Features

### 🛞 Advanced Porsche Vehicle Dynamics & Physics
* **Rear-Engine (RR) vs Mid-Engine (MR) Dynamics**: 62% rear weight bias on 911 models with authentic polar moment of inertia, producing the legendary Porsche pendulum swing and trail-braking / lift-off oversteer.
* **Non-Linear Pacejka Tire Slip Model**: Realistic lateral tire grip curves with peak traction at ~7°–9° slip angle transitioning progressively into controllable power slides.
* **Dynamic Weight Transfer & Suspension Motion**:
  * **Braking Dive**: Front axle loads up under heavy braking (+30% front grip), unweighting the rear axle for corner entry rotation.
  * **Acceleration Squat**: Rear tires hook up under power for rapid straightline launches.
  * **Chassis Roll**: Dynamic body lean in high-G turns.
* **Surface Grip Friction Model**: Distinct friction coefficients for Asphalt ($\mu = 1.0$), Track Curbs ($\mu = 0.85$ with chassis vibration), and Off-track Grass ($\mu = 0.45$ with traction loss).
* **Aerodynamic Downforce ($F \propto v^2$)**: High-speed stability scaling quadratically with vehicle velocity for winged models (930 Whale Tail, 993 GT2, 996 GT3 RS, 911 GT1).
* **Real-time 3D Tire Skidmarks & Smoke**: Dynamic ribbon mesh skidmarks left on the track and volumetric bill-boarded smoke particle puffs during drifts, burnouts, and handbrake turns.

---

### ⏱️ Analog Cockpit & VDO Gauge Cluster HUD
* **Central VDO Tachometer**: 0–8,000 / 10,000 RPM circular gauge with high-contrast numerals, redline arc, and sweeping orange needle with physical inertia.
* **Shift Light & Gearbox Badge**: Real-time gear indicator (`R`, `N`, `1`–`6`) with flashing redline shift light.
* **Dual Speedometer Dial**: 0–320 km/h with integrated digital readout and boost calculation.
* **4-Corner Diagnostics Wireframe**: Live chassis damage schematic color-coded from Green (100%) to Pulsing Red (<25%) for Front Bumper, Left & Right Suspension/Tires, Flat-6 Engine, and Transmission.
* **6-Speed Drivetrain & RPM Physics**: Realistic gear ratios, automatic transmission with kickdown, manual shift support, and power-cut gear shift audio effects.
* **Multi-Camera Angles**: Switch between Chase Cam, Close Chase, Hood / Bonnet Cam, and Low Bumper Cam with <kbd>C</kbd>.

---

### 🏛️ Interactive 360° Porsche Showroom
* **Studio Atmosphere**: High-gloss reflective pedestal, 3-point softbox studio lighting, glowing perimeter ring, and auto-turntable spin.
* **360° Orbit Camera**: Smooth mouse drag / touch rotation, zoom (scroll/pinch), and elevation clamps.
* **Historical Specs & Era Filter**: Live technical specification cards (Engine, Horsepower, Top Speed, 0–100 km/h, Weight, Drivetrain layout, and historical lore) for Classic, Golden, and Modern eras.
* **Porsche Exclusive Manufaktur Customizer**:
  * 10 Porsche factory paint colors (*Guards Red, Speed Yellow, Riviera Blue, GT Silver Metallic, British Racing Green, Schwarz Black, Grand Prix White, Viola Metallic, Signal Orange, Gulf Blue*).
  * 5 Wheel finishes (*Silver Alloy, Matte Gold, Gloss Black, Gunmetal Titanium, Guards Red Racing*).
* **Interactive Showroom Actions**: Toggle illuminated headlights & taillights, rev the flat-6 boxer engine with Web Audio acoustic synthesis, and launch directly onto the test track.

---

### 🏁 Porsche Multi-Era Lineup
| Model | Era | Year | Engine | Output | Top Speed | 0–100 km/h |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **356 A Speedster** | Classic Era | 1956 | 1.6L Flat-4 Air-Cooled | 75 hp | 175 km/h | 12.5s |
| **911 Carrera RS 2.7** | Golden Era | 1973 | 2.7L Flat-6 MFI | 210 hp | 245 km/h | 5.8s |
| **911 Turbo 3.3 (930)** | Golden Era | 1978 | 3.3L Turbo Flat-6 | 300 hp | 260 km/h | 5.2s |
| **911 GT2 (993)** | Air-Cooled Climax | 1995 | 3.6L Twin-Turbo Flat-6 | 430 hp | 295 km/h | 3.9s |
| **911 GT3 RS (996)** | Modern Era | 2003 | 3.6L Mezger Flat-6 | 381 hp | 306 km/h | 4.4s |
| **911 GT1 Strassenversion** | Ultimate Exotic | 1998 | 3.2L Twin-Turbo Flat-6 | 544 hp | 310 km/h | 3.7s |

---

## 🎮 Controls

### In Showroom
| Input | Action |
| :--- | :--- |
| **Left Click + Drag / Touch** | Orbit 360° around the Porsche |
| **Mouse Wheel / Pinch** | Zoom in / Zoom out |
| **Auto-Spin Button** | Toggle automatic turntable rotation |
| **Rev Engine Button** | Synthesize high-rev flat-6 boxer throttle sound |
| **Toggle Lights Button** | Turn on/off illuminated headlamps and taillights |

### On Track
| Key | Action |
| :--- | :--- |
| <kbd>W</kbd> / <kbd>▲</kbd> | Accelerate / Throttle |
| <kbd>S</kbd> / <kbd>▼</kbd> | Brake / Reverse |
| <kbd>A</kbd> / <kbd>◄</kbd> | Steer Left |
| <kbd>D</kbd> / <kbd>►</kbd> | Steer Right |
| <kbd>Space</kbd> / <kbd>Shift</kbd> | Handbrake / Drift Initiate |
| <kbd>C</kbd> | Cycle Camera (Chase, Close, Hood, Bumper) |
| <kbd>M</kbd> | Toggle Transmission (Automatic / Manual) |
| <kbd>E</kbd> | Manual Shift Up (in Manual Mode) |
| <kbd>Q</kbd> | Manual Shift Down (in Manual Mode) |

---

## 🛠️ Technology Stack

* **Rendering Engine**: [Three.js](https://threejs.org/) (WebGL with PBR Physical Materials, PCF Soft Shadows & ACES Filmic Tone Mapping)
* **Physics Engine**: [@dimforge/rapier3d-compat](https://rapier.rs/) + Custom `VehicleDynamics` (Pacejka slip curves & weight transfer)
* **Instruments & HUD**: HTML5 High-DPI Canvas 2D (Analog needle kinematics & 4-corner vector diagnostics)
* **Audio Engine**: Web Audio API (Procedural multi-oscillator flat-6 synthesis & filter automation)
* **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
* **Styling**: Modern Vanilla CSS (Glassmorphism, CSS Variables, Typography from Google Fonts)

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
