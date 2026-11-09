export interface LifeSupportTelemetry {
  oxygenRemainingKg: number;
  oxygenMaxCapacityKg: number;
  oxygenDailyConsumptionKg: number;
  oxygenDailyProductionKg: number;

  co2AtmospherePercent: number; // Normal: 0.04% - 0.4%, Dangerous > 1.2%
  co2ScrubbedDailyKg: number;

  waterRemainingLiters: number;
  waterMaxCapacityLiters: number;
  waterDailyConsumptionLiters: number;
  waterDailyRecycledLiters: number;
  recyclingEfficiencyPercent: number; // 70% to 95%

  foodRationsRemainingKcal: number;
  foodMaxCapacityKcal: number;
  foodDailyConsumptionKcal: number;
  foodDailyHarvestKcal: number;

  habitatTemperatureCelsius: number; // Nominal 21°C
  habitatPressureKPa: number; // Nominal 101.3 kPa
  radiationMilliSievertsPerDay: number;
}

export interface PowerTelemetry {
  solarGenerationKw: number;
  totalLoadKw: number;
  netPowerKw: number; // generation - load
  batteryChargeKwh: number;
  batteryCapacityKwh: number;
  batteryPercent: number;
  diurnalPhase: 'dawn' | 'day' | 'dusk' | 'night';
  sunlightIntensityPercent: number; // 0% to 100%
  solarAngleDegrees: number; // 0 to 360
  isBrownout: boolean;
  isBlackout: boolean;
}

export interface TelemetryHistoryPoint {
  sol: number;
  timeLabel: string;
  oxygenPct: number;
  waterPct: number;
  foodPct: number;
  batteryPct: number;
  powerGenKw: number;
  powerLoadKw: number;
  co2Pct: number;
  temperatureC: number;
}

export interface SimulationState {
  currentSol: number;
  timeOfDayHours: number; // 0.0 to 24.0
  timeScale: 0 | 1 | 2 | 5; // 0 = pause, 1x, 2x, 5x
  isDaytime: boolean;
  totalSolsSurvived: number;
  crewHealthAverage: number; // 0 - 100
  crewMoraleAverage: number; // 0 - 100
  overallOutpostCondition: number; // 0 - 100
  dustAtmosphericOpacity: number; // 0 (clear) to 0.85 (dense storm)
}
