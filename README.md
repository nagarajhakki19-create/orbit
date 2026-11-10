# ORBIT — Junior Astronaut Mission Trainer
### A NASA Space Apps Challenge Project

> **"YOUR MISSION. YOUR OUTPOST. YOUR UNIVERSE."**  
> Explore alien worlds, engineer sustainable habitats, and experience the engineering challenges of human space exploration beyond Earth.

---

## 🚀 1. Project Introduction
**ORBIT** is a state-of-the-art interactive mission simulation and training web platform built for aspiring astronauts, planetary scientists, and engineers. It puts students in command of human expansion to the Moon and Mars—guiding them through destination reconnaissance, landing site selection, 3D modular surface outpost construction, life-support resource management, real-time power grid balancing, and critical emergency failure response.

## 🛰️ 2. Problem Statement
Human space exploration is transitioning from orbital missions (like the ISS) to permanent extraterrestrial surface bases (such as NASA's Artemis Base Camp and Mars Base Alpha). However, most educational tools are either static textbooks or overly gamified fantasy titles disconnected from true engineering realities. Students lack an accessible, realistic, and inspiring sandbox where they can grapple with actual space engineering trade-offs:
- Diurnal power generation and battery discharge cycles
- Closed-loop Environmental Control and Life Support Systems (ECLSS)
- Consumable burn rates (O2, H2O, calories) tied to crew size
- Planetary environmental hazards (lunar dust, Martian dust storms, thermal swings)

## 💡 3. The ORBIT Solution
ORBIT bridges the gap between aerospace engineering principles and interactive digital education:
- **Cinematic Landing Page:** Introduces the vision and mission context with smooth aerospace aesthetics.
- **Mission Setup:** Configure target destination (Moon vs. Mars), crew headcount, mission duration, starting budgets, and difficulty profiles.
- **Interactive 3D Planetary Explorer:** Full Three.js orbital view of the Moon and Mars with realistic shaders, landing site indicators (Shackleton, Jezero, Olympus Mons), and planetary scientific telemetry.
- **3D Modular Outpost Builder:** Interactive construction grid allowing students to place Habitats, Photovoltaic Arrays, Hydroponic Greenhouses, Cryo-Water Silos, High-Gain Comms, and ECLSS Life-Support Modules with live engineering constraints and connection grids.
- **Unified Life Support & Power Simulation:** Dynamic math engine computing oxygen generation, carbon dioxide scrubbing, water reclamation, caloric burn, solar flux, day/night diurnal cycles, and battery depth of discharge.
- **Mission Anomaly Engine & Failure Detective:** An educational diagnostic engine that triggers unexpected challenges (dust storms, ECLSS failures, thermal radiator leaks) and guides students through root-cause analysis and remediation.
- **Mission Control Dashboard:** Real-time visual telemetry with charts (Recharts), historical consumable curves, and live status monitors.
- **Mission Evaluation & Debrief:** Comprehensive post-mission assessment evaluating crew survival, resource efficiency, and power stability with actionable engineering feedback.

---

## 🛠️ 4. Technology Stack
- **Frontend Framework:** React 19 / TypeScript / Vite
- **3D Graphics & Rendering:** Three.js / React Three Fiber / @react-three/drei
- **Styling & UI:** Tailwind CSS (with custom Space Mission Control tokens)
- **State Management:** Zustand (reactive, single source of truth for simulation and mission parameters)
- **Data Visualization:** Recharts (telemetry trends and consumable historical profiles)
- **Icons:** Lucide React
- **Persistence:** LocalStorage (zero cloud dependency required for offline classroom usage)

---

## 📐 5. Architecture Overview
```
ORBIT APPLICATION
├── Landing Page (Cinematic Intro & Navigation)
├── Mission Setup (Destination, Crew, Duration, Difficulty)
├── 3D Planetary Explorer (Moon / Mars orbital inspection & landing sites)
├── 3D Outpost Builder (Modular surface construction & resource budgeting)
├── Simulation Engine
│   ├── Life Support System (O2, H2O, Food, CO2, Thermal)
│   ├── Power Management (Solar arrays, Battery storage, Day/Night)
│   └── Event & Anomaly Engine (Dust storms, ECLSS breakdowns)
├── Mission Control Dashboard (Telemetry, Recharts trends, Active alerts)
├── Mission Evaluation (Debrief, Scoring, Engineering review)
└── Local Save Engine (Session persistence & state restoration)
```

---

## 💻 6. How to Run Locally

### Prerequisites
- Node.js (v18.0.0 or later, v24 recommended)
- npm (v9.0.0 or later)
- Modern web browser with WebGL support (Chrome, Edge, Firefox, Safari)

### Installation
```bash
# Clone or navigate to the repository
cd Orbit

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit the local URL shown in your terminal (typically `http://localhost:5173`).

---

## 👥 7. Team Contributions (5-Student Sequential Workflow)
| Member | Primary Role & Focus |
| :--- | :--- |
| **Member 1** | Project Coordination, Architecture, Store Integration & Build Lead |
| **Member 2** | UI/UX Design System, Cinematic Landing Page & Setup Experience |
| **Member 3** | 3D Planetary Explorer & 3D Outpost Construction Builder |
| **Member 4** | Life Support Engine, Diurnal Power Simulation & Math Models |
| **Member 5** | Mission Anomaly Engine, Failure Detective, Evaluation & QA |
|**Member 6 – Testing, Quality Assurance & Documentation**

Responsible for testing the project, identifying and reporting bugs, checking that all features work correctly, and ensuring smooth integration between different modules. Helped verify the 3D environment, simulation systems, user interface, and mission features. Also contributed to project documentation, user instructions, final presentation, and submission preparation.|

---

## 📜 8. Credits & Acknowledgements
- **NASA Space Apps Challenge** for the design challenge inspiration.
- **NASA Planetary Data System (PDS)** & **LPI (Lunar and Planetary Institute)** for planetary surface reference data.
- **NASA Eyes & MMGIS** as architectural references for planetary exploration concepts.

---

## 🔮 9. Known Limitations & Future Roadmap
- *Current Phase:* Single-player interactive educational training client running smoothly in any modern browser without requiring external heavy downloads.
- *Roadmap:* Multi-crew cooperative mode, custom terrain heightmap streaming, rover traverse physics, and classroom instructor control consoles.
