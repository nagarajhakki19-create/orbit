import { PlacedBuilding } from '../types/outpost';
import { PowerTelemetry } from '../types/simulation';

export const MODULE_POWER_SPECS = {
  solarGenerationMaxKw: 100, // 100 kWh per day per solar panel array at peak
  habitatConsumptionKw: 35,  // 35 kWh per day
  greenhouseConsumptionKw: 25,// 25 kWh per day
  eclssConsumptionKw: 30,    // 30 kWh per day
  commsConsumptionKw: 15,    // 15 kWh per day
  waterStorageConsumptionKw: 10 // 10 kWh per day
};

export function calculateInitialPower(placedBuildings: PlacedBuilding[] = []): PowerTelemetry {
  const solarCount = placedBuildings.filter(b => b.type === 'solar' && b.isActive).length;
  const habitatCount = placedBuildings.filter(b => b.type === 'habitat' && b.isActive).length;

  const totalCapacityKwh = 200 + (habitatCount * 150) + (solarCount * 60);

  return {
    solarGenerationKw: solarCount * MODULE_POWER_SPECS.solarGenerationMaxKw,
    totalLoadKw: 0,
    netPowerKw: 0,
    batteryChargeKwh: totalCapacityKwh * 0.9,
    batteryCapacityKwh: totalCapacityKwh,
    batteryPercent: 90,
    diurnalPhase: 'day',
    sunlightIntensityPercent: 100,
    solarAngleDegrees: 90,
    isBrownout: false,
    isBlackout: false
  };
}

export function stepPowerSimulation(
  current: PowerTelemetry,
  placedBuildings: PlacedBuilding[],
  timeOfDayHours: number, // 0.0 to 24.0
  solFractionDelta: number,
  dustAtmosphericOpacity: number = 0, // 0 = clear, 0.7 = severe dust storm
  solarEfficiencyMultiplier: number = 1.0 // 1.0 = clean, 0.4 = soiled regolith
): PowerTelemetry {
  // 1. Calculate diurnal phase and solar angle
  // Day is roughly hours 6.0 to 18.0 (peak at 12.0)
  const solarAngleDegrees = ((timeOfDayHours / 24) * 360) % 360;
  
  let sunlightFactor = 0;
  let diurnalPhase: PowerTelemetry['diurnalPhase'] = 'night';

  if (timeOfDayHours >= 5.5 && timeOfDayHours < 7.0) {
    diurnalPhase = 'dawn';
    sunlightFactor = (timeOfDayHours - 5.5) / 1.5 * 0.5;
  } else if (timeOfDayHours >= 7.0 && timeOfDayHours <= 17.0) {
    diurnalPhase = 'day';
    // Smooth sinusoidal peak at noon (12:00)
    const normalized = (timeOfDayHours - 7.0) / 10.0;
    sunlightFactor = 0.5 + 0.5 * Math.sin(normalized * Math.PI);
  } else if (timeOfDayHours > 17.0 && timeOfDayHours <= 18.5) {
    diurnalPhase = 'dusk';
    sunlightFactor = (18.5 - timeOfDayHours) / 1.5 * 0.5;
  } else {
    diurnalPhase = 'night';
    sunlightFactor = 0;
  }

  // Dust storm reduces atmospheric solar transmissivity
  const atmosphericTransmissivity = Math.max(0.08, 1.0 - dustAtmosphericOpacity);
  const effectiveSunlight = sunlightFactor * atmosphericTransmissivity * solarEfficiencyMultiplier;
  const sunlightIntensityPercent = Math.round(effectiveSunlight * 100);

  // 2. Tally generation
  const solarCount = placedBuildings.filter(b => b.type === 'solar' && b.isActive).length;
  const habitatCount = placedBuildings.filter(b => b.type === 'habitat' && b.isActive).length;
  const greenhouseCount = placedBuildings.filter(b => b.type === 'greenhouse' && b.isActive).length;
  const eclssCount = placedBuildings.filter(b => b.type === 'eclss' && b.isActive).length;
  const commsCount = placedBuildings.filter(b => b.type === 'comms' && b.isActive).length;
  const waterCount = placedBuildings.filter(b => b.type === 'water' && b.isActive).length;

  const currentGenerationKw = Number(
    (solarCount * MODULE_POWER_SPECS.solarGenerationMaxKw * effectiveSunlight).toFixed(1)
  );

  // 3. Tally consumer loads
  const currentLoadKw = Number((
    (habitatCount * MODULE_POWER_SPECS.habitatConsumptionKw) +
    (greenhouseCount * MODULE_POWER_SPECS.greenhouseConsumptionKw) +
    (eclssCount * MODULE_POWER_SPECS.eclssConsumptionKw) +
    (commsCount * MODULE_POWER_SPECS.commsConsumptionKw) +
    (waterCount * MODULE_POWER_SPECS.waterStorageConsumptionKw)
  ).toFixed(1));

  // 4. Net Energy Balance
  const netPowerKw = Number((currentGenerationKw - currentLoadKw).toFixed(1));

  // 5. Battery Dynamics
  const totalCapacityKwh = 200 + (habitatCount * 150) + (solarCount * 60);
  const deltaCharge = netPowerKw * solFractionDelta;
  let newCharge = Math.max(0, Math.min(totalCapacityKwh, current.batteryChargeKwh + deltaCharge));

  const batteryPercent = Math.round((newCharge / totalCapacityKwh) * 100);
  const isBrownout = batteryPercent < 15 && netPowerKw < 0;
  const isBlackout = newCharge <= 1.0;

  return {
    solarGenerationKw: currentGenerationKw,
    totalLoadKw: currentLoadKw,
    netPowerKw,
    batteryChargeKwh: Number(newCharge.toFixed(1)),
    batteryCapacityKwh: totalCapacityKwh,
    batteryPercent,
    diurnalPhase,
    sunlightIntensityPercent,
    solarAngleDegrees: Math.round(solarAngleDegrees),
    isBrownout,
    isBlackout
  };
}
