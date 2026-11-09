import { MissionIncident } from '../types/events';

export const INCIDENT_TEMPLATES: Record<string, Omit<MissionIncident, 'id' | 'solTriggered'>> = {
  'dust-storm': {
    title: 'Atmospheric Regolith Dust Storm',
    severity: 'warning',
    subsystem: 'Power Grid',
    headline: 'High-velocity regolith dust storm occluding solar arrays',
    description: 'A regional dust storm has swept across the landing site basin. Fine micron-sized electrostatically charged dust particles have formed a dense atmospheric veil, drastically reducing solar irradiance reaching the outpost photovoltaics.',
    rootCause: 'Low atmospheric pressure and electrostatic charging on planetary surfaces allow high winds to loft micron-scale mineral particles into prolonged atmospheric suspension.',
    diagnosticData: {
      telemetryAnomaly: 'Solar array irradiance dropped by 65%. Battery net discharge rate accelerated to -42 kW.',
      affectedResources: ['Solar Generation (kW)', 'Battery Storage (kWh)', 'Outpost Net Energy'],
      physicalPhenomenon: 'Mie scattering by airborne mineral aerosols blocking direct and diffuse sunlight.',
      nasaReference: 'NASA Mars Opportunity & InSight missions power loss analysis (JPL/NASA).'
    },
    options: [
      {
        id: 'opt_piezo_shake',
        label: 'Activate Electrostatic Dust Removal (EDR)',
        description: 'Run high-frequency AC standing wave pulses across the solar cover glass to repel charged particles.',
        engineeringRationale: 'Uses 15 kW of reserve battery power but cleans 85% of dust buildup immediately.',
        creditCost: 150,
        titaniumCost: 0,
        energyDrainKw: 25,
        successProbability: 0.95,
        consequenceText: 'EDR pulse successfully cleared 85% of dust blanket. Power generation restored to nominal.'
      },
      {
        id: 'opt_load_shed',
        label: 'Implement Automated Emergency Load Shedding',
        description: 'Power down non-vital science arrays and reduce habitat lighting to conserve battery reserves until the storm abates.',
        engineeringRationale: 'Preserves battery reserves for critical life support with zero titanium or credit cost.',
        creditCost: 0,
        titaniumCost: 0,
        energyDrainKw: 0,
        successProbability: 0.85,
        consequenceText: 'Load shedding cut power drain by 30 kW. Batteries held safely above brownout thresholds.'
      },
      {
        id: 'opt_eva_brush',
        label: 'Deploy Astronaut EVA Mechanical Sweep',
        description: 'Send two astronauts on surface EVA to physically sweep arrays with anti-static regolith brushes.',
        engineeringRationale: 'High physical labor and risks suit abrasion, but restores 100% surface transparency.',
        creditCost: 80,
        titaniumCost: 0,
        energyDrainKw: 0,
        successProbability: 0.88,
        consequenceText: 'Crew completed EVA safely. Photovoltaic surfaces restored to 100% clean baseline.'
      }
    ]
  },

  'water-recovery-failure': {
    title: 'ECLSS Water Recovery Distillation Stall',
    severity: 'critical',
    subsystem: 'Water Reclamation',
    headline: 'Centrifugal vacuum distillation assembly experiencing seal friction',
    description: 'The automated urine and greywater reclamation centrifuge (VCD) has detected mechanical seal degradation and mineral scale fouling, dropping reclamation efficiency from 85% down to 35%.',
    rootCause: 'Precipitation of calcium sulfate and uric acid crystals along the rotary vacuum seals causing thermal friction and vacuum loss.',
    diagnosticData: {
      telemetryAnomaly: 'Water reclamation efficiency collapsed to 35%. Daily fresh water reserve burning 3x faster.',
      affectedResources: ['Potable Water Reserve (L)', 'Recycling Efficiency (%)'],
      physicalPhenomenon: 'Phase-change vacuum distillation failure and scaling in low-gravity fluid dynamics.',
      nasaReference: 'ISS Water Recovery System (WRS) Vacuum Distillation Assembly telemetry (NASA MSFC).'
    },
    options: [
      {
        id: 'opt_acid_flush',
        label: 'Execute Phosphoric Acid Flush Cycle',
        description: 'Inject chemical descaling solution into the rotary drum to dissolve mineral precipitates.',
        engineeringRationale: 'Chemical dissolution clears scale without dismantling the pressurized plumbing.',
        creditCost: 200,
        titaniumCost: 5,
        energyDrainKw: 10,
        successProbability: 0.90,
        consequenceText: 'Chemical flush dissolved 95% of scale. Distillation restored to 88% efficiency.'
      },
      {
        id: 'opt_swap_filter',
        label: 'Replace Ion-Exchange Sorbent Bed Core',
        description: 'Install a spare multi-filtration bed from emergency outpost logistics storage.',
        engineeringRationale: 'Immediate hardware replacement guarantees fresh capacity but consumes precious spare inventory.',
        creditCost: 350,
        titaniumCost: 15,
        energyDrainKw: 5,
        successProbability: 0.98,
        consequenceText: 'New sorbent bed operational. Water recycling restored to maximum 92% efficiency.'
      },
      {
        id: 'opt_water_ration',
        label: 'Impose Strict Water Rationing Protocol',
        description: 'Cut daily crew water allotment by 40% (hygiene suspended) while operating the degraded distiller at low throughput.',
        engineeringRationale: 'Conserves water without spending credits or spare parts, but degrades crew morale.',
        creditCost: 0,
        titaniumCost: 0,
        energyDrainKw: 0,
        successProbability: 0.75,
        consequenceText: 'Rationing stabilized consumption, but crew fatigue and stress increased.'
      }
    ]
  },

  'oxygen-scrubber-breach': {
    title: 'CO2 Removal Amine Bed Saturation',
    severity: 'critical',
    subsystem: 'ECLSS (Life Support)',
    headline: 'Carbon dioxide partial pressure climbing past 0.8% threshold',
    description: 'The Carbon Dioxide Removal Assembly (CDRA) desiccant amine bed has suffered a thermal desorber heater short, preventing the regeneration cycle from venting trapped CO2 into the Sabatier reactor.',
    rootCause: 'Thermocouple failure preventing amine zeolite beds from reaching the 200°C desorption temperature.',
    diagnosticData: {
      telemetryAnomaly: 'Cabin CO2 concentration rising at 0.08% per hour. Hypercapnia warning armed.',
      affectedResources: ['CO2 Atmosphere (%)', 'Oxygen Reserves (kg)', 'Crew Cognitive Vitality'],
      physicalPhenomenon: 'Zeolite 5A molecular sieve adsorption capacity saturation.',
      nasaReference: 'NASA CDRA Carbon Dioxide Removal Assembly thermal-vacuum anomaly logs (JSC).'
    },
    options: [
      {
        id: 'opt_reroute_sabatier',
        label: 'Bypass Secondary Loop into Sabatier Reactor',
        description: 'Reroute hot exhaust gases from the fuel cell loop to thermally bake the amine beds.',
        engineeringRationale: 'Thermal integration restores desorption without requiring new electrical components.',
        creditCost: 180,
        titaniumCost: 10,
        energyDrainKw: 15,
        successProbability: 0.92,
        consequenceText: 'Thermal bypass successful. Zeolite beds desorbed and cabin CO2 dropped back to 0.08%.'
      },
      {
        id: 'opt_li_canister',
        label: 'Deploy Emergency Lithium Hydroxide (LiOH) Canisters',
        description: 'Manually unseal single-use expendable chemical LiOH canisters (Apollo/Artemis emergency reserve).',
        engineeringRationale: 'Provides rapid 100% reliable CO2 absorption, but permanently consumes non-renewable consumables.',
        creditCost: 300,
        titaniumCost: 0,
        energyDrainKw: 0,
        successProbability: 0.99,
        consequenceText: 'LiOH canisters captured 100% of excess CO2. Cabin atmosphere normalized immediately.'
      },
      {
        id: 'opt_greenhouse_vent',
        label: 'Overdrive Hydroponic Greenhouse Gas Exchange',
        description: 'Pump high-CO2 cabin air directly into the Hydroponic Greenhouse to accelerate photosynthetic uptake.',
        engineeringRationale: 'Plants thrive on high CO2, converting it into oxygen naturally.',
        creditCost: 50,
        titaniumCost: 0,
        energyDrainKw: 20,
        successProbability: 0.80,
        consequenceText: 'Greenhouse plant canopy absorbed excess CO2 and generated extra oxygen pulse.'
      }
    ]
  },

  'battery-blackout-risk': {
    title: 'Battery Bank Depth-of-Discharge Warning',
    severity: 'warning',
    subsystem: 'Power Grid',
    headline: 'Nighttime power draw exceeding sustainable battery envelope',
    description: 'The outpost battery storage bank has plummeted to 18% during the dark diurnal phase. Prolonged deep discharge risks cell reverse polarity and permanent lithium capacity loss.',
    rootCause: 'High concurrent power draws from heating, lighting, and life support exceeding installed storage capacity.',
    diagnosticData: {
      telemetryAnomaly: 'Battery state-of-charge at 18%. Estimated time to complete brownout: 1.8 hours.',
      affectedResources: ['Battery Charge (kWh)', 'Outpost Electrical Stability'],
      physicalPhenomenon: 'Lithium-ion voltage drop and electrochemical dendrite formation under deep discharge.',
      nasaReference: 'NASA High-Energy-Density Space Battery Standards (NASA-STD-4009).'
    },
    options: [
      {
        id: 'opt_sleep_mode',
        label: 'Trigger Habitat Hibernation Sleep Cycle',
        description: 'Command all crew to sleep quarters, seal peripheral modules, and throttle HVAC heaters.',
        engineeringRationale: 'Drastically reduces base load by 45 kW until the morning solar terminator arrives.',
        creditCost: 0,
        titaniumCost: 0,
        energyDrainKw: 0,
        successProbability: 0.95,
        consequenceText: 'Base load trimmed to 18 kW. Outpost safely survived the night with 8% battery reserve.'
      },
      {
        id: 'opt_rover_plug',
        label: 'Couple Surface Exploration Rover Fuel Cells',
        description: 'Tether the pressurized exploration rover to back-feed power into the central outpost bus.',
        engineeringRationale: 'Leverages mobile rover battery reserves as an emergency grid buffer.',
        creditCost: 120,
        titaniumCost: 5,
        energyDrainKw: 0,
        successProbability: 0.90,
        consequenceText: 'Rover battery coupled successfully, supplying +35 kWh buffer to the outpost grid.'
      }
    ]
  },

  'greenhouse-irrigation-freeze': {
    title: 'Hydroponic Root-Zone Thermal Chilling',
    severity: 'warning',
    subsystem: 'Hydroponics & Food',
    headline: 'External temperature drop chilled nutrient fluid below 12°C',
    description: 'Sub-zero external planetary conditions have conducted through foundation pylons, chilling hydroponic nutrient reservoirs. Root zones are nearing freeze limits, threatening crops.',
    rootCause: 'Thermal bridge in lower greenhouse sub-floor insulation during the cold diurnal minimum.',
    diagnosticData: {
      telemetryAnomaly: 'Hydroponic root zone at 11.2°C. Photosynthetic productivity halved.',
      affectedResources: ['Food Harvest (kcal/day)', 'Greenhouse Oxygen Output'],
      physicalPhenomenon: 'Thermal conductive loss through structural footings into cold regolith.',
      nasaReference: 'NASA Advanced Plant Habitat (APH) thermal control systems.'
    },
    options: [
      {
        id: 'opt_heat_trace',
        label: 'Energize Auxiliary Heating Trace Lines',
        description: 'Power resistive heating cables wrapped around the hydroponic plumbing.',
        engineeringRationale: 'Quickly restores nutrient solution temperature to optimal 22°C.',
        creditCost: 90,
        titaniumCost: 0,
        energyDrainKw: 15,
        successProbability: 0.95,
        consequenceText: 'Heating cables warmed root beds to 21.5°C. Crop harvest fully preserved.'
      },
      {
        id: 'opt_aeroponic_mist',
        label: 'Convert Root Delivery to Warm Aeroponic Vapor',
        description: 'Switch continuous liquid immersion to heated pressurized nutrient misting.',
        engineeringRationale: 'Uses 90% less water and keeps roots insulated with warm humid air.',
        creditCost: 220,
        titaniumCost: 8,
        energyDrainKw: 8,
        successProbability: 0.88,
        consequenceText: 'Aeroponic conversion complete. Plant growth accelerated with 30% water savings.'
      }
    ]
  },

  'thermal-radiator-leak': {
    title: 'External Heat Rejection Loop Pressure Drop',
    severity: 'critical',
    subsystem: 'Thermal Regulation',
    headline: 'Micro-meteoroid penetration in ammonia cooling radiator fin',
    description: 'A hyper-velocity micro-meteoroid has pierced an exterior deployable radiator panel. Liquid ammonia coolant is venting into the vacuum, threatening habitat climate control.',
    rootCause: 'Hyper-velocity impact puncturing thin-walled aluminum heat pipe tubes.',
    diagnosticData: {
      telemetryAnomaly: 'Coolant loop pressure declining at 12 kPa/min. Habitat internal temp trending toward freeze.',
      affectedResources: ['Habitat Temperature (°C)', 'Coolant Loop Integrity'],
      physicalPhenomenon: 'Two-phase fluid venting and loss of thermal rejection capacity.',
      nasaReference: 'ISS External Active Thermal Control System (EATCS) radiator puncture protocols.'
    },
    options: [
      {
        id: 'opt_isolate_loop',
        label: 'Remotely Isolate Damaged Radiator Segment',
        description: 'Actuate automated solenoid isolation valves to seal off the punctured radiator fin.',
        engineeringRationale: 'Stops fluid venting instantly while retaining 75% of total base heat rejection capacity.',
        creditCost: 100,
        titaniumCost: 0,
        energyDrainKw: 5,
        successProbability: 0.96,
        consequenceText: 'Punctured loop isolated with 80% coolant remaining. Internal temperature stabilized at 20.8°C.'
      },
      {
        id: 'opt_braze_patch',
        label: 'Perform Astronaut EVA Vacuum Patch & Refill',
        description: 'Dispatch crew on EVA with vacuum welding brazing torch and spare coolant reservoir.',
        engineeringRationale: 'Restores 100% radiator surface area at the cost of materials and crew EVA time.',
        creditCost: 260,
        titaniumCost: 12,
        energyDrainKw: 10,
        successProbability: 0.89,
        consequenceText: 'Radiator welded and repressurized. 100% cooling capability restored.'
      }
    ]
  }
};

/**
 * Checks simulation state and triggers events based on conditions or scheduled milestones
 */
export function evaluateIncidentTriggers(
  currentSol: number,
  timeOfDayHours: number,
  batteryPercent: number,
  co2AtmospherePercent: number,
  placedBuildingCount: number,
  existingIncidents: MissionIncident[]
): MissionIncident | null {
  // Avoid retriggering if an unresolved incident is active
  const unresolved = existingIncidents.find(i => !i.resolution);
  if (unresolved) return null;

  const resolvedIds = new Set(existingIncidents.map(i => i.title));

  // 1. Condition: Low Battery (< 20% and nighttime)
  if (batteryPercent < 20 && (timeOfDayHours < 6 || timeOfDayHours > 18) && !resolvedIds.has('Battery Bank Depth-of-Discharge Warning')) {
    return createIncident('battery-blackout-risk', currentSol);
  }

  // 2. Condition: CO2 build-up (> 0.7%)
  if (co2AtmospherePercent > 0.65 && !resolvedIds.has('CO2 Removal Amine Bed Saturation')) {
    return createIncident('oxygen-scrubber-breach', currentSol);
  }

  // 3. Milestone: Sol 4 - 6 Dust Storm
  if (currentSol >= 4 && currentSol <= 7 && !resolvedIds.has('Atmospheric Regolith Dust Storm') && placedBuildingCount >= 3) {
    return createIncident('dust-storm', currentSol);
  }

  // 4. Milestone: Sol 12 - 15 Water Distillation
  if (currentSol >= 12 && currentSol <= 16 && !resolvedIds.has('ECLSS Water Recovery Distillation Stall') && placedBuildingCount >= 4) {
    return createIncident('water-recovery-failure', currentSol);
  }

  // 5. Milestone: Sol 20+ Radiator leak
  if (currentSol >= 20 && !resolvedIds.has('External Heat Rejection Loop Pressure Drop') && placedBuildingCount >= 5) {
    return createIncident('thermal-radiator-leak', currentSol);
  }

  return null;
}

export function createIncident(templateKey: string, currentSol: number): MissionIncident {
  const t = INCIDENT_TEMPLATES[templateKey];
  return {
    ...t,
    id: `inc_${templateKey}_sol${currentSol}_${Date.now()}`,
    solTriggered: currentSol
  };
}
