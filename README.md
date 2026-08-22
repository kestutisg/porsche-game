# 🏎️ Need for Speed: Porsche Unleashed (Web 3D)

A browser-based tribute to the legendary classic **Need for Speed: Porsche Unleashed (2000)**, built with modern WebGL (**Three.js**), 3D rigid-body physics (**Rapier3D**), and Web Audio API synthesis.

Experience iconic Porsche eras, inspect detailed 3D models in the interactive 360° Showroom, customize factory paint colors and wheels, rev the air-cooled flat-6 boxer engine, and test your skills on the circuit in Factory Driver career challenges.

---

## ✨ Features

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

### 🕹️ Physics & Factory Driver Gameplay
* **Rear-Engine Handling**: Realistic pendulum weight transfer, snap oversteer, lateral tire grip curves, and handbrake power slides.
* **Component Damage Model**: Real-time wear and tear on Engine, Transmission, Suspension, and Bodywork impacting performance.
* **Career Missions**:
  * **Slalom Drift Test**: Navigate checkpoint gates and rack up drift points.
  * **Precision Line**: Hit clean apexes and finish laps within time constraints.
  * **Prototype Showdown**: High-speed endurance while managing vehicle condition.
* **Circuit Garage**: Upgrade Engine Tuning, Suspension Kits, Brake Systems, Tire Compounds, and Aero Downforce.

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

---

## 🛠️ Technology Stack

* **Rendering Engine**: [Three.js](https://threejs.org/) (WebGL with PBR Physical Materials, PCF Soft Shadows & ACES Filmic Tone Mapping)
* **Physics Engine**: [@dimforge/rapier3d-compat](https://rapier.rs/) (Fast WASM rigid-body 3D physics)
* **Audio Engine**: Web Audio API (Procedural multi-oscillator flat-6 synthesis & filter automation)
* **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
* **Styling**: Modern Vanilla CSS (Glassmorphism, CSS Variables, Typography from Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18+ recommended)
* `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/porsche-game.git

# Navigate into project directory
cd porsche-game

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Building for Production
```bash
npm run build
```
The optimized production bundle will be created in the `dist/` directory.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
