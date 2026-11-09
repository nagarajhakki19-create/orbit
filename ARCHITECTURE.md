# ORBIT — Technical Architecture & Engineering Specifications

## 1. System Design Philosophy
ORBIT is designed as a modular, unified single-page application built on React, TypeScript, Three.js, and Zustand. All subsystems interface through a central reactive store to guarantee that changes in outpost geometry immediately influence real-time life support and power simulations without state divergence or race conditions.

```
+-----------------------------------------------------------------------+
|                              ORBIT APP                                |
+-----------------------------------------------------------------------+
                                   |
         +-------------------------+-------------------------+
         |                                                   |
+-------------------+                             +---------------------+
|    PRESENTATION   |                             |    CENTRAL STATE    |
|   (React + 3D)    |                             |      (Zustand)      |
+-------------------+                             +---------------------+
| - Landing View    | <====== Subscribes =======> | - Mission Config    |
| - Setup Wizard    |                             | - Outpost Layout    |
| - Planetary 3D    |                             | - Simulation State  |
| - Outpost 3D      |                             | - Telemetry History |
| - Mission Control |                             | - Incident Queue    |
| - Evaluation HUD  |                             | - Evaluation Score  |
+-------------------+                             +---------------------+
                                                             ^
                                                             |
                                                  +---------------------+
                                                  |  SIMULATION ENGINES |
                                                  |      (Pure TS)      |
                                                  +---------------------+
                                                  | - LifeSupportEngine |
                                                  | - PowerGridEngine   |
                                                  | - AnomalyEngine     |
                                                  +---------------------+
```

---

## 2. Directory Structure
```
src/
├── types/
│   ├── mission.ts          # Destination, crew, landing site interfaces
│   ├── outpost.ts          # Module metadata, grid coords, footprint
│   ├── simulation.ts       # Consumables, power balance, diurnal cycles
│   └── events.ts           # Anomaly definitions, remediation actions
├── store/
│   └── useMissionStore.ts  # Zustand store maintaining single source of truth
├── simulation/
│   ├── lifeSupportEngine.ts# Math calculations for O2, CO2, H2O, Food, Temp
│   ├── powerEngine.ts      # Diurnal cycle, solar flux, battery charge math
│   └── eventEngine.ts      # Incident triggers, failure detective models
├── components/
│   ├── layout/             # Top navbar, sound toggle, status banners
│   ├── landing/            # Cinematic landing page
│   ├── setup/              # Interactive Mission Configuration screen
│   ├── explorer3d/         # Three.js planetary sphere & landing site beacons
│   ├── builder3d/          # Three.js 3D modular outpost builder & grid
│   ├── dashboard/          # Mission control gauges & Recharts visualizers
│   ├── events/             # Failure Detective modal & interactive prompts
│   └── evaluation/         # End-of-mission debriefing & scoring
└── utils/
    ├── planetaryData.ts    # Scientific landing site specs (Moon & Mars)
    ├── textureGenerators.ts# Canvas-based high-performance procedural textures
    └── soundEffects.ts     # Web Audio API procedural mission telemetry sounds
```

---

## 3. Core Mathematical Simulation Models

### 3.1 Life Support Dynamics (Per Sol / Day)
- **Metabolic Baseline:**
  - $Oxygen_{consumed} = 0.84 \text{ kg} \times \text{CrewSize} \times \text{DifficultyMult}$
  - $CO2_{produced} = 1.00 \text{ kg} \times \text{CrewSize}$
  - $Water_{consumed} = 3.50 \text{ L} \times \text{CrewSize}$ (drinking + food rehydration + hygiene)
  - $Calories_{burned} = 2500 \text{ kcal} \times \text{CrewSize}$
- **Production & Reclamation Buffers:**
  - $Oxygen_{produced} = (N_{ECLSS} \times 2.50) + (N_{Greenhouse} \times 0.60)$
  - $CO2_{scrubbed} = N_{ECLSS} \times 3.00$
  - $Water_{recycled} = Water_{consumed} \times (0.70 + 0.15 \times N_{ECLSS}) \times Health_{Recycler}$
  - $Food_{produced} = N_{Greenhouse} \times 3000 \text{ kcal}$

### 3.2 Power Grid Dynamics
- **Diurnal Solar Cycle:**
  - $\Phi(t) = \max(0, \sin(\frac{2\pi \cdot t}{T_{diurnal}})) \times (1 - AtmosphericDust)$
- **Generation:**
  - $Power_{gen} = N_{SolarPanels} \times 100 \text{ kWh} \times \Phi(t) \times Efficiency_{Solar}$
- **Consumption:**
  - $Power_{load} = (N_{Habitat} \times 35) + (N_{Greenhouse} \times 25) + (N_{ECLSS} \times 30) + (N_{Water} \times 10) + (N_{Comms} \times 15)$
- **Net Energy & Storage:**
  - $\Delta E = Power_{gen} - Power_{load}$
  - If $\Delta E > 0$, Battery charges up to $Capacity_{max} = N_{Habitat} \times 150 + N_{Solar} \times 50$.
  - If $\Delta E < 0$, Battery drains. If Battery reaches 0, outpost enters Emergency Brownout.

---

## 4. Visual Identity Tokens
- **Space Navy (Background):** `#080D19`
- **Midnight Blue (Surfaces):** `#101A2B`
- **Electric Cyan (Active / Accent):** `#42D9FF`
- **Aurora Teal (Healthy / Nominal):** `#36E0C0`
- **Solar Amber (Warning):** `#FFB547`
- **Warning Coral (Critical Alarm):** `#FF6B70`
- **Warm White (High Contrast Text):** `#F4F6FA`
