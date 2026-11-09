# ORBIT — Features Specification

## 1. Landing Experience
- [x] Headline: "YOUR MISSION. YOUR OUTPOST. YOUR UNIVERSE."
- [x] Subtitle: "Explore alien worlds, engineer sustainable habitats and experience the challenges of human exploration beyond Earth."
- [x] Interactive Destination Switcher (Moon / Mars 3D preview).
- [x] Call to Action buttons: "START YOUR MISSION" & "EXPLORE THE UNIVERSE".
- [x] Mission features grid: Engineering Principles, 3D Outpost Construction, Real-time ECLSS Simulation, Anomaly Detective.

## 2. Mission Setup Wizard
- [x] Target Destination: **The Moon** (Artemis Base) or **Mars** (Ares Outpost).
- [x] Crew Size Selector: 2, 4, 6, or 8 astronauts with live resource burn preview.
- [x] Mission Duration: 30 sols (Sprint), 90 sols (Expedition), or 180 sols (Colonization).
- [x] Difficulty Tier:
  - *Cadet (Beginner):* Higher starting supplies, reduced solar storm frequency.
  - *Specialist (Intermediate):* Standard NASA baseline consumable burn.
  - *Commander (Advanced):* Extreme diurnal swings, frequent regolith fouling.
- [x] Starting Budget & Logistics Allocation.
- [x] Real-time Mission Pre-flight Summary.

## 3. 3D Planetary Explorer
- [x] Realistic Three.js 3D Celestial Body (Moon / Mars) with procedural bump, craters, and atmospheric scattering.
- [x] Camera controls: Smooth OrbitControls with distance dampening.
- [x] Interactive Scientific Landing Sites:
  - **Moon:** Shackleton Crater (South Pole, water ice), Oceanus Procellarum, Mare Tranquillitatis.
  - **Mars:** Jezero Crater (Perseverance site), Gale Crater (Curiosity site), Olympus Mons (Volcanic plateau).
- [x] Clickable landing beacons displaying real scientific telemetry:
  - Surface Temperature range (°C)
  - Solar Exposure (% day vs. darkness)
  - Water Ice Proximity
  - Engineering Hazard rating
- [x] Direct "Select Site & Build Outpost" workflow transition.

## 4. 3D Modular Outpost Builder
- [x] Interactive 3D Terrain Construction Grid with holographic placement grid.
- [x] 6 Functional Structural Modules:
  1. **Habitat Core:** Houses 4 crew members, provides command center.
  2. **Solar PV Array:** Produces 100 kWh/sol during daylight.
  3. **Hydroponic Greenhouse:** Generates calories and supplements O2.
  4. **Cryo-Water Storage Tank:** Expands water reserve capacity by 1,000 L.
  5. **High-Gain Communication Array:** Maintains Earth link, telemetry uplinks.
  6. **ECLSS Life Support Module:** Recycles greywater and scrubs CO2.
- [x] Holographic building preview with validity highlight (cyan = valid, coral = obstructed).
- [x] Real-time Resource & Budget counter (Credits / Titanium / Energy requirement).
- [x] Module Inspection & Deconstruction (dismantle with 80% refund).

## 5. Life Support (ECLSS) Simulation
- [x] Dynamic Oxygen Reserve & Consumption Tracking.
- [x] Carbon Dioxide build-up with toxic thresholds (> 1.2% triggers cognitive decline warning).
- [x] Water Storage & closed-loop greywater reclamation (70–95% recycling efficiency).
- [x] Food rations depletion & greenhouse caloric harvest.
- [x] Habitat thermal insulation & internal temperature regulation (target 21°C).

## 6. Power Grid Simulation
- [x] Diurnal day/night solar flux curve (Sunlight phase vs. Eclipse phase).
- [x] Solar PV generation scaled to atmospheric dust and sunlight angle.
- [x] Battery bank storage capacity and depth-of-discharge telemetry.
- [x] Power priority load shedder (Non-essential -> Science -> ECLSS).
- [x] Brownout and blackout emergency states.

## 7. Mission Events & Failure Detective
- [x] Dynamic and scheduled challenge events:
  - Global Dust Storm (Mars) / Lunar Regolith Storm (Moon)
  - Battery Array Thermal Runaway
  - Sabatier Oxygen Scrubber Membrane Breach
  - Hydroponic Irrigation Pipe Freeze
  - Solar Flare Radiation Warning
- [x] **Failure Detective Interface:**
  - Emergency Alarm HUD with audio-visual pulsing.
  - Incident Briefing: What failed? Which subsystem is affected?
  - Root-Cause Engineering Explanation.
  - Three actionable student remediation options with distinct trade-offs (e.g., Quick patch vs. Redundant reroute vs. Power shedding).
  - Immediate & lasting consequences recorded in mission log.

## 8. Mission Control Dashboard
- [x] Live Status Monitors for O2, H2O, Food, Power, Crew Vitals, Habitat Status.
- [x] Historical Trend Visualizers (Recharts) charting 14-sol supply curves.
- [x] Diurnal Day/Night indicator with solar position angle.
- [x] Simulation Speed Control: Pause (0x), Normal (1x), Fast (2x), Ultra (5x).
- [x] Audio telemetry cues (ambient space rumble, alarm chimes, click feedback).

## 9. Mission Evaluation & Debrief
- [x] Comprehensive End-of-Mission debrief triggered upon mission completion or emergency evacuation.
- [x] Overall Performance Score (0–100%) and Badge Award (e.g., "Master Martian Architect", "Lunar Survivor").
- [x] Engineering Breakdown:
  - Life Support Efficiency
  - Power Grid Resilience
  - Incident Response Effectiveness
  - Remaining Consumables Buffer
- [x] Detailed "Lessons for Next Mission" post-mortem analysis.

## 10. Persistence & Usability
- [x] LocalStorage auto-save and quick-resume.
- [x] Full responsive design optimized for standard student laptop screens (1366x768 and up).
- [x] Accessible high-contrast typography and clear visual hierarchy.
