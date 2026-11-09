import { PlacedBuilding } from '../types/outpost';
import { LifeSupportTelemetry } from '../types/simulation';
import { MissionDifficulty } from '../types/mission';

export const BASELINE_CONSUMPTION = {
  o2PerCrewKg: 0.84,        // NASA standard: ~0.84 kg O2 per astronaut per day
  co2PerCrewKg: 1.00,       // Metabolic exhalation
  waterPerCrewL: 3.50,      // Drinking + rehydrating + basic hygiene
  foodPerCrewKcal: 2500,    // Standard daily caloric requirement
  nominalTempC: 21.0,
  nominalPressureKPa: 101.3
};

export const DIFFICULTY_MULTIPLIERS: Record<MissionDifficulty, { burn: number; buffer: number }> = {
  cadet: { burn: 0.85, buffer: 1.25 },
  specialist: { burn: 1.0, buffer: 1.0 },
  commander: { burn: 1.2, buffer: 0.8 }
};

export function calculateInitialLifeSupport(
  crewSize: number,
  missionDurationSols: number,
  difficulty: MissionDifficulty
): LifeSupportTelemetry {
  const mult = DIFFICULTY_MULTIPLIERS[difficulty];
  const safetyMargin = mult.buffer * 1.35; // 35% safety margin baseline

  const totalO2Needed = BASELINE_CONSUMPTION.o2PerCrewKg * crewSize * missionDurationSols * safetyMargin;
  const totalWaterNeeded = BASELINE_CONSUMPTION.waterPerCrewL * crewSize * missionDurationSols * 0.35 * safetyMargin; // Assuming closed loop recycler handles 65%
  const totalFoodNeeded = BASELINE_CONSUMPTION.foodPerCrewKcal * crewSize * missionDurationSols * safetyMargin;

  return {
    oxygenRemainingKg: Math.round(totalO2Needed),
    oxygenMaxCapacityKg: Math.round(totalO2Needed * 1.1),
    oxygenDailyConsumptionKg: Number((BASELINE_CONSUMPTION.o2PerCrewKg * crewSize * mult.burn).toFixed(2)),
    oxygenDailyProductionKg: 0,

    co2AtmospherePercent: 0.04, // Nominal fresh cabin air
    co2ScrubbedDailyKg: 0,

    waterRemainingLiters: Math.round(totalWaterNeeded),
    waterMaxCapacityLiters: Math.round(totalWaterNeeded * 1.2),
    waterDailyConsumptionLiters: Number((BASELINE_CONSUMPTION.waterPerCrewL * crewSize * mult.burn).toFixed(2)),
    waterDailyRecycledLiters: 0,
    recyclingEfficiencyPercent: 80,

    foodRationsRemainingKcal: Math.round(totalFoodNeeded),
    foodMaxCapacityKcal: Math.round(totalFoodNeeded * 1.1),
    foodDailyConsumptionKcal: Math.round(BASELINE_CONSUMPTION.foodPerCrewKcal * crewSize * mult.burn),
    foodDailyHarvestKcal: 0,

    habitatTemperatureCelsius: BASELINE_CONSUMPTION.nominalTempC,
    habitatPressureKPa: BASELINE_CONSUMPTION.nominalPressureKPa,
    radiationMilliSievertsPerDay: 0.45
  };
}

export function stepLifeSupportSimulation(
  current: LifeSupportTelemetry,
  placedBuildings: PlacedBuilding[],
  crewSize: number,
  difficulty: MissionDifficulty,
  solFractionDelta: number, // Fraction of a sol that has elapsed (e.g. 0.05 for 1.2 hours)
  powerAvailable: boolean,
  activeEclssPenalty: number = 1.0, // 1.0 is normal, 0.5 is degraded
  thermalBreach: boolean = false
): LifeSupportTelemetry {
  const mult = DIFFICULTY_MULTIPLIERS[difficulty];

  // Count active modules
  const eclssCount = placedBuildings.filter(b => b.type === 'eclss' && b.isActive).length;
  const greenhouseCount = placedBuildings.filter(b => b.type === 'greenhouse' && b.isActive).length;
  const waterTanksCount = placedBuildings.filter(b => b.type === 'water' && b.isActive).length;

  // 1. Oxygen dynamics
  // Each ECLSS unit electrolyzes and generates up to 2.2 kg O2 / day when powered
  // Each Greenhouse photosynthesizes and generates 0.6 kg O2 / day
  const dailyO2Prod = powerAvailable
    ? (eclssCount * 2.2 * activeEclssPenalty + greenhouseCount * 0.6)
    : 0;
  const dailyO2Cons = BASELINE_CONSUMPTION.o2PerCrewKg * crewSize * mult.burn;
  const deltaO2 = (dailyO2Prod - dailyO2Cons) * solFractionDelta;
  const newO2 = Math.max(0, Math.min(current.oxygenMaxCapacityKg, current.oxygenRemainingKg + deltaO2));

  // 2. Carbon Dioxide dynamics
  // Daily metabolic CO2 production
  const dailyCO2Produced = BASELINE_CONSUMPTION.co2PerCrewKg * crewSize;
  // CO2 scrubbing capacity: ECLSS units scrub CO2 (Sabatier / Amine bed)
  const dailyCO2Scrubbed = powerAvailable
    ? (eclssCount * 3.0 * activeEclssPenalty + greenhouseCount * 0.5)
    : 0;
  
  // Net CO2 accumulation affects atmospheric percentage (0.04% baseline)
  let newCO2Pct = current.co2AtmospherePercent;
  const netCO2 = (dailyCO2Produced - dailyCO2Scrubbed) * solFractionDelta;
  if (netCO2 > 0) {
    newCO2Pct = Math.min(3.5, newCO2Pct + (netCO2 / (crewSize * 15)));
  } else {
    newCO2Pct = Math.max(0.04, newCO2Pct + (netCO2 / (crewSize * 25)));
  }

  // 3. Water dynamics
  // Capacity boosted by water tanks
  const waterCapacity = 1000 + (waterTanksCount * 1200);
  const baseRecyclingRate = eclssCount > 0 ? (0.75 + Math.min(0.18, eclssCount * 0.08)) * activeEclssPenalty : 0.40;
  const recyclingEffPct = Math.round(baseRecyclingRate * 100);

  const dailyWaterCons = BASELINE_CONSUMPTION.waterPerCrewL * crewSize * mult.burn;
  const dailyWaterRecycled = powerAvailable ? dailyWaterCons * baseRecyclingRate : 0;
  const netWaterDaily = dailyWaterRecycled - dailyWaterCons;
  const deltaWater = netWaterDaily * solFractionDelta;
  const newWater = Math.max(0, Math.min(waterCapacity, current.waterRemainingLiters + deltaWater));

  // 4. Food dynamics
  // Greenhouses provide fresh caloric supplement
  const dailyFoodHarvest = powerAvailable ? greenhouseCount * 2800 : 0;
  const dailyFoodCons = BASELINE_CONSUMPTION.foodPerCrewKcal * crewSize * mult.burn;
  const deltaFood = (dailyFoodHarvest - dailyFoodCons) * solFractionDelta;
  const newFood = Math.max(0, Math.min(current.foodMaxCapacityKcal, current.foodRationsRemainingKcal + deltaFood));

  // 5. Thermal & Pressure
  let targetTemp = 21.0;
  if (thermalBreach) {
    targetTemp = 6.0; // severe cooling leak
  } else if (!powerAvailable) {
    targetTemp = 11.0; // heaters off, cold soak
  }
  const tempDiff = targetTemp - current.habitatTemperatureCelsius;
  const newTemp = Number((current.habitatTemperatureCelsius + tempDiff * 0.1 * solFractionDelta * 10).toFixed(1));

  return {
    oxygenRemainingKg: Number(newO2.toFixed(2)),
    oxygenMaxCapacityKg: current.oxygenMaxCapacityKg,
    oxygenDailyConsumptionKg: Number(dailyO2Cons.toFixed(2)),
    oxygenDailyProductionKg: Number(dailyO2Prod.toFixed(2)),

    co2AtmospherePercent: Number(newCO2Pct.toFixed(3)),
    co2ScrubbedDailyKg: Number(dailyCO2Scrubbed.toFixed(2)),

    waterRemainingLiters: Number(newWater.toFixed(1)),
    waterMaxCapacityLiters: waterCapacity,
    waterDailyConsumptionLiters: Number(dailyWaterCons.toFixed(1)),
    waterDailyRecycledLiters: Number(dailyWaterRecycled.toFixed(1)),
    recyclingEfficiencyPercent: recyclingEffPct,

    foodRationsRemainingKcal: Math.round(newFood),
    foodMaxCapacityKcal: current.foodMaxCapacityKcal,
    foodDailyConsumptionKcal: Math.round(dailyFoodCons),
    foodDailyHarvestKcal: Math.round(dailyFoodHarvest),

    habitatTemperatureCelsius: newTemp,
    habitatPressureKPa: current.habitatPressureKPa,
    radiationMilliSievertsPerDay: 0.45
  };
}
