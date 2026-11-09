import { create } from 'zustand';
import { MissionConfig, PlanetDestination, MissionDifficulty, CrewMember } from '../types/mission';
import { PlacedBuilding, BuildingType, BuildingBlueprint } from '../types/outpost';
import { LifeSupportTelemetry, PowerTelemetry, SimulationState, TelemetryHistoryPoint } from '../types/simulation';
import { MissionIncident, MissionEvaluationReport } from '../types/events';
import { ALL_LANDING_SITES } from '../utils/planetaryData';
import { calculateInitialLifeSupport, stepLifeSupportSimulation } from '../simulation/lifeSupportEngine';
import { calculateInitialPower, stepPowerSimulation } from '../simulation/powerEngine';
import { evaluateIncidentTriggers } from '../simulation/eventEngine';
import { sound } from '../utils/soundEffects';

export type AppView = 'landing' | 'setup' | 'explorer' | 'builder' | 'control' | 'evaluation';

export const BUILDING_BLUEPRINTS: Record<BuildingType, BuildingBlueprint> = {
  habitat: {
    type: 'habitat',
    name: 'Habitat & Command Core',
    category: 'Habitat & Command',
    description: 'Pressurized crew quarters, sleep pods, environmental seals, and telemetry command center. Crucial foundation for any human mission.',
    costCredits: 400,
    costTitanium: 30,
    powerDelta: -35, // Consumes 35 kWh/day
    waterDelta: 0,
    oxygenDelta: 0,
    foodDelta: 0,
    crewSupported: 4,
    waterCapacity: 500,
    batteryCapacity: 150,
    footprintRadius: 1,
    iconName: 'Home',
    realWorldContext: 'Inspired by NASA TransHab inflatable module and Artemis Habitation and Logistics Outpost (HALO).'
  },
  solar: {
    type: 'solar',
    name: 'Photovoltaic Solar Matrix',
    category: 'Power',
    description: 'High-efficiency dual-axis tracking gallium-arsenide solar arrays with integrated lithium-ion battery buffer. Generates clean power during daylight.',
    costCredits: 200,
    costTitanium: 15,
    powerDelta: 100, // Generates up to 100 kWh/day in sunlight
    waterDelta: 0,
    oxygenDelta: 0,
    foodDelta: 0,
    crewSupported: 0,
    waterCapacity: 0,
    batteryCapacity: 60,
    footprintRadius: 1,
    iconName: 'Sun',
    realWorldContext: 'Derived from ISS Solar Alpha Rotary Joint (SARJ) and Ultraflex solar blanket arrays.'
  },
  greenhouse: {
    type: 'greenhouse',
    name: 'Hydroponic Biomass Greenhouse',
    category: 'Life Support & Bio',
    description: 'Closed-loop automated hydroponic agriculture module producing fresh nutrient-dense caloric crops and supplementary oxygen through photosynthesis.',
    costCredits: 320,
    costTitanium: 20,
    powerDelta: -25, // Consumes 25 kWh/day for grow lights & pumps
    waterDelta: -5,
    oxygenDelta: 0.6,
    foodDelta: 2800, // Produces 2,800 kcal/day
    crewSupported: 0,
    waterCapacity: 200,
    batteryCapacity: 0,
    footprintRadius: 1,
    iconName: 'Sprout',
    realWorldContext: 'Based on the EDEN ISS Antarctic greenhouse and NASA Kennedy Space Center Veggie experiment.'
  },
  water: {
    type: 'water',
    name: 'Cryogenic Water Extraction & Storage Tank',
    category: 'Storage & Logistics',
    description: 'Thermal-vacuum insulated reservoir that stores melted sub-surface permafrost and recycled greywater with active pump manifolds.',
    costCredits: 180,
    costTitanium: 25,
    powerDelta: -10, // Consumes 10 kWh/day for heating
    waterDelta: 0,
    oxygenDelta: 0,
    foodDelta: 0,
    crewSupported: 0,
    waterCapacity: 1200, // Adds 1,200 L storage capacity
    batteryCapacity: 0,
    footprintRadius: 1,
    iconName: 'Droplets',
    realWorldContext: 'Analogous to lunar polar In-Situ Resource Utilization (ISRU) thermal water-ice sublimation processors.'
  },
  comms: {
    type: 'comms',
    name: 'High-Gain Deep Space Optical Array',
    category: 'Communication',
    description: 'Steerable high-gain microwave and laser optical terminal establishing continuous wideband telemetry links with NASA Deep Space Network on Earth.',
    costCredits: 250,
    costTitanium: 15,
    powerDelta: -15, // Consumes 15 kWh/day
    waterDelta: 0,
    oxygenDelta: 0,
    foodDelta: 0,
    crewSupported: 0,
    waterCapacity: 0,
    batteryCapacity: 0,
    footprintRadius: 1,
    iconName: 'Radio',
    realWorldContext: 'Employs NASA Deep Space Optical Communications (DSOC) laser transceiver technology.'
  },
  eclss: {
    type: 'eclss',
    name: 'Advanced ECLSS Recycling Plant',
    category: 'Life Support & Bio',
    description: 'Comprehensive Environmental Control and Life Support System: Sabatier CO2 scrubbers, catalytic oxidizers, and urine distillation processors.',
    costCredits: 450,
    costTitanium: 35,
    powerDelta: -30, // Consumes 30 kWh/day
    waterDelta: 0,
    oxygenDelta: 2.2, // Generates 2.2 kg O2/day
    foodDelta: 0,
    crewSupported: 4,
    waterCapacity: 600,
    batteryCapacity: 0,
    footprintRadius: 1,
    iconName: 'Activity',
    realWorldContext: 'Directly mirrors the ISS Exploration ECLSS rack delivering 98% closed-loop water recovery.'
  }
};

const DEFAULT_MISSION_CONFIG: MissionConfig = {
  destination: 'moon',
  crewSize: 4,
  missionDurationSols: 30,
  difficulty: 'specialist',
  selectedLandingSiteId: 'shackleton-crater',
  missionName: 'Artemis Surface Trainer I',
  credits: 1600,
  titaniumUnits: 120
};

interface MissionStoreState {
  // Navigation
  activeView: AppView;
  setView: (view: AppView) => void;

  // Sound
  isAudioMuted: boolean;
  toggleAudio: () => void;

  // Mission setup
  config: MissionConfig;
  updateConfig: (patch: Partial<MissionConfig>) => void;
  setDestination: (dest: PlanetDestination) => void;
  setLandingSite: (siteId: string) => void;

  // Crew details
  crew: CrewMember[];

  // Outpost Buildings
  placedBuildings: PlacedBuilding[];
  selectedBuildingType: BuildingType | null;
  setSelectedBuildingType: (type: BuildingType | null) => void;
  placeBuilding: (type: BuildingType, x: number, y: number) => boolean;
  removeBuilding: (instanceId: string) => void;

  // Telemetry & Simulation
  lifeSupport: LifeSupportTelemetry;
  power: PowerTelemetry;
  simulation: SimulationState;
  telemetryHistory: TelemetryHistoryPoint[];
  setTimeScale: (scale: 0 | 1 | 2 | 5) => void;
  tickSimulation: (deltaTimeSeconds: number) => void;

  // Incidents & Failure Detective
  incidents: MissionIncident[];
  activeIncidentModal: MissionIncident | null;
  openIncidentModal: (incident: MissionIncident) => void;
  closeIncidentModal: () => void;
  resolveIncident: (incidentId: string, optionId: string) => void;

  // Evaluation & Reset
  evaluationReport: MissionEvaluationReport | null;
  evaluateMission: () => void;
  resetMission: () => void;
  loadInitialOutpostPreset: () => void;
}

const INITIAL_LIFE_SUPPORT = calculateInitialLifeSupport(4, 30, 'specialist');
const INITIAL_POWER = calculateInitialPower([]);

export const useMissionStore = create<MissionStoreState>((set, get) => ({
  activeView: 'landing',
  setView: (view) => {
    sound.playClick();
    set({ activeView: view });
  },

  isAudioMuted: false,
  toggleAudio: () => {
    const muted = sound.toggleMute();
    set({ isAudioMuted: muted });
  },

  config: DEFAULT_MISSION_CONFIG,
  updateConfig: (patch) => {
    sound.playClick();
    set((state) => {
      const newConfig = { ...state.config, ...patch };
      const newLifeSupport = calculateInitialLifeSupport(
        newConfig.crewSize,
        newConfig.missionDurationSols,
        newConfig.difficulty
      );
      return { config: newConfig, lifeSupport: newLifeSupport };
    });
  },

  setDestination: (destination) => {
    sound.playClick();
    set((state) => {
      const defaultSite = destination === 'moon' ? 'shackleton-crater' : 'jezero-crater';
      const missionName = destination === 'moon' ? 'Artemis Surface Trainer I' : 'Ares Red Horizon I';
      return {
        config: {
          ...state.config,
          destination,
          selectedLandingSiteId: defaultSite,
          missionName
        }
      };
    });
  },

  setLandingSite: (siteId) => {
    sound.playClick();
    set((state) => ({
      config: { ...state.config, selectedLandingSiteId: siteId }
    }));
  },

  crew: [
    { id: 'c1', name: 'Dr. Elena Vance', role: 'Commander', vitality: 100, morale: 95, specialtyBonus: '+10% Incident Resolution' },
    { id: 'c2', name: 'Marcus Chen', role: 'Life Support Engineer', vitality: 100, morale: 92, specialtyBonus: '+15% Water Recycling' },
    { id: 'c3', name: 'Amina Al-Sayed', role: 'Power Systems Specialist', vitality: 100, morale: 90, specialtyBonus: '+12% Solar Generation' },
    { id: 'c4', name: 'Dr. Leo Thorne', role: 'Botanist / Astrobiologist', vitality: 100, morale: 94, specialtyBonus: '+20% Crop Yield' }
  ],

  placedBuildings: [],
  selectedBuildingType: 'habitat',
  setSelectedBuildingType: (type) => {
    sound.playClick();
    set({ selectedBuildingType: type });
  },

  placeBuilding: (type, x, y) => {
    const { config, placedBuildings } = get();
    const blueprint = BUILDING_BLUEPRINTS[type];

    // Check collision
    const existing = placedBuildings.find(b => b.x === x && b.y === y);
    if (existing) return false;

    // Check budget
    if (config.credits < blueprint.costCredits || config.titaniumUnits < blueprint.costTitanium) {
      sound.playAlert();
      return false;
    }

    const newBuilding: PlacedBuilding = {
      instanceId: `b_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      x,
      y,
      rotation: 0,
      condition: 100,
      placedAtSol: get().simulation.currentSol,
      isActive: true
    };

    sound.playPlaceBuilding();

    set((state) => {
      const updatedBuildings = [...state.placedBuildings, newBuilding];
      const newCredits = state.config.credits - blueprint.costCredits;
      const newTitanium = state.config.titaniumUnits - blueprint.costTitanium;

      // Update power & life support parameters
      const newPower = stepPowerSimulation(
        state.power,
        updatedBuildings,
        state.simulation.timeOfDayHours,
        0.001,
        state.simulation.dustAtmosphericOpacity
      );

      return {
        placedBuildings: updatedBuildings,
        config: { ...state.config, credits: newCredits, titaniumUnits: newTitanium },
        power: newPower
      };
    });

    return true;
  },

  removeBuilding: (instanceId) => {
    const { placedBuildings } = get();
    const b = placedBuildings.find(x => x.instanceId === instanceId);
    if (!b) return;

    sound.playClick();
    const blueprint = BUILDING_BLUEPRINTS[b.type];
    const refundCredits = Math.round(blueprint.costCredits * 0.8);
    const refundTitanium = Math.round(blueprint.costTitanium * 0.8);

    set((state) => {
      const updatedBuildings = state.placedBuildings.filter(x => x.instanceId !== instanceId);
      return {
        placedBuildings: updatedBuildings,
        config: {
          ...state.config,
          credits: state.config.credits + refundCredits,
          titaniumUnits: state.config.titaniumUnits + refundTitanium
        }
      };
    });
  },

  lifeSupport: INITIAL_LIFE_SUPPORT,
  power: INITIAL_POWER,
  simulation: {
    currentSol: 1,
    timeOfDayHours: 8.0,
    timeScale: 1,
    isDaytime: true,
    totalSolsSurvived: 0,
    crewHealthAverage: 100,
    crewMoraleAverage: 95,
    overallOutpostCondition: 100,
    dustAtmosphericOpacity: 0
  },

  telemetryHistory: [
    {
      sol: 1,
      timeLabel: 'Sol 1 08:00',
      oxygenPct: 100,
      waterPct: 100,
      foodPct: 100,
      batteryPct: 90,
      powerGenKw: 100,
      powerLoadKw: 35,
      co2Pct: 0.04,
      temperatureC: 21.0
    }
  ],

  setTimeScale: (scale) => {
    sound.playClick();
    set((state) => ({
      simulation: { ...state.simulation, timeScale: scale }
    }));
  },

  tickSimulation: (deltaTimeSeconds) => {
    const state = get();
    if (state.simulation.timeScale === 0) return; // Paused

    // Standard scale: 1 real second = 0.5 hours in game time at 1x
    const hoursElapsed = deltaTimeSeconds * 0.5 * state.simulation.timeScale;
    let newHours = state.simulation.timeOfDayHours + hoursElapsed;
    let newSol = state.simulation.currentSol;

    if (newHours >= 24.0) {
      newSol += Math.floor(newHours / 24.0);
      newHours = newHours % 24.0;
    }

    const solFractionDelta = hoursElapsed / 24.0;
    const isDaytime = newHours >= 6.0 && newHours <= 18.0;

    // Check if any active incidents modify conditions
    const unresolvedIncidents = state.incidents.filter(i => !i.resolution);
    let eclssPenalty = 1.0;
    let dustOpacity = 0.0;
    let thermalBreach = false;

    unresolvedIncidents.forEach(inc => {
      if (inc.title.includes('Dust Storm')) dustOpacity = 0.65;
      if (inc.title.includes('Water Recovery') || inc.title.includes('CO2 Removal')) eclssPenalty = 0.45;
      if (inc.title.includes('Heat Rejection')) thermalBreach = true;
    });

    // Step power simulation
    const updatedPower = stepPowerSimulation(
      state.power,
      state.placedBuildings,
      newHours,
      solFractionDelta,
      dustOpacity
    );

    const powerAvailable = !updatedPower.isBlackout;

    // Step life support simulation
    const updatedLifeSupport = stepLifeSupportSimulation(
      state.lifeSupport,
      state.placedBuildings,
      state.config.crewSize,
      state.config.difficulty,
      solFractionDelta,
      powerAvailable,
      eclssPenalty,
      thermalBreach
    );

    // Compute crew health & outpost condition
    let healthDrop = 0;
    if (updatedLifeSupport.co2AtmospherePercent > 1.0) healthDrop += 0.5 * solFractionDelta * 10;
    if (updatedLifeSupport.oxygenRemainingKg <= 5) healthDrop += 2.0 * solFractionDelta * 10;
    if (updatedLifeSupport.waterRemainingLiters <= 5) healthDrop += 1.5 * solFractionDelta * 10;
    if (updatedPower.isBlackout) healthDrop += 0.8 * solFractionDelta * 10;

    const newCrewHealth = Math.max(0, Math.min(100, state.simulation.crewHealthAverage - healthDrop));

    // Evaluate incident triggers
    const triggeredIncident = evaluateIncidentTriggers(
      newSol,
      newHours,
      updatedPower.batteryPercent,
      updatedLifeSupport.co2AtmospherePercent,
      state.placedBuildings.length,
      state.incidents
    );

    let updatedIncidents = state.incidents;
    let newIncidentModal = state.activeIncidentModal;

    if (triggeredIncident) {
      sound.playAlert();
      updatedIncidents = [triggeredIncident, ...state.incidents];
      newIncidentModal = triggeredIncident;
    }

    // Telemetry history update (record every ~2 hours in game time)
    let newHistory = state.telemetryHistory;
    const lastPoint = newHistory[newHistory.length - 1];
    if (!lastPoint || Math.abs(newHours - parseFloat(lastPoint.timeLabel.split(' ')[2]?.split(':')[0] || '0')) >= 2.0 || newSol !== lastPoint.sol) {
      const oxygenPct = Math.round((updatedLifeSupport.oxygenRemainingKg / updatedLifeSupport.oxygenMaxCapacityKg) * 100);
      const waterPct = Math.round((updatedLifeSupport.waterRemainingLiters / updatedLifeSupport.waterMaxCapacityLiters) * 100);
      const foodPct = Math.round((updatedLifeSupport.foodRationsRemainingKcal / updatedLifeSupport.foodMaxCapacityKcal) * 100);

      const newPoint: TelemetryHistoryPoint = {
        sol: newSol,
        timeLabel: `Sol ${newSol} ${Math.floor(newHours).toString().padStart(2, '0')}:00`,
        oxygenPct,
        waterPct,
        foodPct,
        batteryPct: updatedPower.batteryPercent,
        powerGenKw: updatedPower.solarGenerationKw,
        powerLoadKw: updatedPower.totalLoadKw,
        co2Pct: updatedLifeSupport.co2AtmospherePercent,
        temperatureC: updatedLifeSupport.habitatTemperatureCelsius
      };

      // Keep up to 50 latest telemetry points
      newHistory = [...newHistory.slice(-49), newPoint];
    }

    // Auto-complete mission when target sols reached or crew health critical
    if (newSol > state.config.missionDurationSols || newCrewHealth <= 0) {
      get().evaluateMission();
      return;
    }

    set({
      simulation: {
        ...state.simulation,
        currentSol: newSol,
        timeOfDayHours: newHours,
        isDaytime,
        crewHealthAverage: Number(newCrewHealth.toFixed(1)),
        dustAtmosphericOpacity: dustOpacity
      },
      power: updatedPower,
      lifeSupport: updatedLifeSupport,
      incidents: updatedIncidents,
      activeIncidentModal: newIncidentModal,
      telemetryHistory: newHistory
    });
  },

  incidents: [],
  activeIncidentModal: null,

  openIncidentModal: (incident) => {
    sound.playClick();
    set({ activeIncidentModal: incident });
  },

  closeIncidentModal: () => {
    sound.playClick();
    set({ activeIncidentModal: null });
  },

  resolveIncident: (incidentId, optionId) => {
    const { incidents, config } = get();
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    const opt = inc.options.find(o => o.id === optionId);
    if (!opt) return;

    // Check budget
    if (config.credits < opt.creditCost || config.titaniumUnits < opt.titaniumCost) {
      sound.playAlert();
      return;
    }

    sound.playSuccess();
    const success = Math.random() <= opt.successProbability;
    const outcomeSummary = success ? opt.consequenceText : `Emergency intervention suffered delays; partial stabilization achieved.`;

    set((state) => {
      const updatedIncidents = state.incidents.map(i => {
        if (i.id === incidentId) {
          return {
            ...i,
            resolution: {
              chosenOptionId: optionId,
              success,
              outcomeSummary,
              solResolved: state.simulation.currentSol
            }
          };
        }
        return i;
      });

      return {
        incidents: updatedIncidents,
        activeIncidentModal: null,
        config: {
          ...state.config,
          credits: state.config.credits - opt.creditCost,
          titaniumUnits: state.config.titaniumUnits - opt.titaniumCost
        }
      };
    });
  },

  evaluationReport: null,

  evaluateMission: () => {
    sound.playSuccess();
    const { config, simulation, lifeSupport, power, incidents, placedBuildings } = get();

    const solsCompleted = simulation.currentSol;
    const targetSol = config.missionDurationSols;
    const survived = simulation.crewHealthAverage > 10;

    // Scoring factors
    const survivalWeight = (simulation.crewHealthAverage / 100) * 40;
    const resourceWeight = Math.min(30, (lifeSupport.oxygenRemainingKg > 10 ? 10 : 0) + (lifeSupport.waterRemainingLiters > 10 ? 10 : 0) + (lifeSupport.foodRationsRemainingKcal > 1000 ? 10 : 0));
    const powerWeight = power.batteryPercent > 20 ? 15 : 5;
    const incidentResolvedCount = incidents.filter(i => i.resolution?.success).length;
    const incidentTotal = Math.max(1, incidents.length);
    const incidentScore = Math.round((incidentResolvedCount / incidentTotal) * 15);

    const totalScore = Math.min(100, Math.round(survivalWeight + resourceWeight + powerWeight + incidentScore));

    let rankTitle = 'Junior Astronaut Cadet';
    let survivalRating: MissionEvaluationReport['survivalRating'] = 'Nominal';

    if (totalScore >= 90) {
      rankTitle = config.destination === 'moon' ? 'Master Artemis Base Architect' : 'Pioneer Commander of Mars';
      survivalRating = 'Flawless';
    } else if (totalScore >= 75) {
      rankTitle = 'Senior Expedition Specialist';
      survivalRating = 'Nominal';
    } else if (totalScore >= 50) {
      rankTitle = 'Surface Operations Officer';
      survivalRating = 'Marginal';
    } else {
      rankTitle = 'Emergency Evacuee';
      survivalRating = 'Catastrophic Abort';
    }

    const commendations: string[] = [];
    if (placedBuildings.some(b => b.type === 'greenhouse')) commendations.push('Self-Sustaining Biosphere: Successfully deployed bio-regenerative agriculture.');
    if (power.batteryPercent > 50) commendations.push('Energy Resilient: Maintained robust battery buffers against planetary eclipses.');
    if (incidentResolvedCount > 0) commendations.push(`Rapid Response: Resolved ${incidentResolvedCount} critical mission anomalies with zero crew fatalities.`);

    const engineeringLessons: string[] = [
      'Balance solar surface area against the longest anticipated darkness window; never rely solely on real-time solar generation without battery storage.',
      'Closed-loop water recycling reduces total mission launch mass by up to 90%, freeing payload capacity for scientific instruments.',
      'Electrochemical CO2 scrubbing must maintain dual redundant zeolite or amine beds to prevent rapid cabin hypercapnia.'
    ];

    const report: MissionEvaluationReport = {
      missionCompleted: survived && solsCompleted >= targetSol,
      finalSol: solsCompleted,
      targetSol,
      overallScorePercent: totalScore,
      rankTitle,
      survivalRating,
      lifeSupportEfficiency: Math.round(lifeSupport.recyclingEfficiencyPercent),
      powerResilienceScore: Math.round(power.batteryPercent),
      incidentHandlingScore: Math.round((incidentResolvedCount / incidentTotal) * 100),
      resourceBufferRemaining: {
        oxygenKg: lifeSupport.oxygenRemainingKg,
        waterLiters: lifeSupport.waterRemainingLiters,
        foodKcal: lifeSupport.foodRationsRemainingKcal,
        batteryKwh: power.batteryChargeKwh
      },
      keyIncidentsFaced: incidents.map(i => i.title),
      commendations,
      engineeringLessons
    };

    set({
      evaluationReport: report,
      activeView: 'evaluation',
      simulation: { ...simulation, timeScale: 0 }
    });
  },

  resetMission: () => {
    sound.playClick();
    set({
      activeView: 'setup',
      config: DEFAULT_MISSION_CONFIG,
      placedBuildings: [],
      lifeSupport: calculateInitialLifeSupport(4, 30, 'specialist'),
      power: calculateInitialPower([]),
      simulation: {
        currentSol: 1,
        timeOfDayHours: 8.0,
        timeScale: 1,
        isDaytime: true,
        totalSolsSurvived: 0,
        crewHealthAverage: 100,
        crewMoraleAverage: 95,
        overallOutpostCondition: 100,
        dustAtmosphericOpacity: 0
      },
      telemetryHistory: [],
      incidents: [],
      activeIncidentModal: null,
      evaluationReport: null
    });
  },

  loadInitialOutpostPreset: () => {
    const defaultModules: PlacedBuilding[] = [
      { instanceId: 'b_hab_init', type: 'habitat', x: 0, y: 0, rotation: 0, condition: 100, placedAtSol: 1, isActive: true },
      { instanceId: 'b_sol1_init', type: 'solar', x: -1, y: 0, rotation: 0, condition: 100, placedAtSol: 1, isActive: true },
      { instanceId: 'b_sol2_init', type: 'solar', x: 1, y: 0, rotation: 0, condition: 100, placedAtSol: 1, isActive: true },
      { instanceId: 'b_eclss_init', type: 'eclss', x: 0, y: 1, rotation: 0, condition: 100, placedAtSol: 1, isActive: true },
      { instanceId: 'b_water_init', type: 'water', x: -1, y: 1, rotation: 0, condition: 100, placedAtSol: 1, isActive: true },
      { instanceId: 'b_comms_init', type: 'comms', x: 0, y: -1, rotation: 0, condition: 100, placedAtSol: 1, isActive: true }
    ];

    set((state) => {
      const newPower = stepPowerSimulation(state.power, defaultModules, 8.0, 0.001);
      return {
        placedBuildings: defaultModules,
        power: newPower
      };
    });
  }
}));
