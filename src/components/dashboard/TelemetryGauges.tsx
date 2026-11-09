import React from 'react';
import { LifeSupportTelemetry, PowerTelemetry, SimulationState } from '../../types/simulation';
import { 
  Wind, 
  Droplets, 
  Apple, 
  Zap, 
  Heart, 
  Thermometer, 
  Activity, 
  AlertTriangle,
  Sun,
  ShieldCheck
} from 'lucide-react';

interface TelemetryGaugesProps {
  lifeSupport: LifeSupportTelemetry;
  power: PowerTelemetry;
  simulation: SimulationState;
}

export const TelemetryGauges: React.FC<TelemetryGaugesProps> = ({
  lifeSupport,
  power,
  simulation
}) => {
  const o2Percent = Math.min(100, Math.round((lifeSupport.oxygenRemainingKg / lifeSupport.oxygenMaxCapacityKg) * 100));
  const waterPercent = Math.min(100, Math.round((lifeSupport.waterRemainingLiters / lifeSupport.waterMaxCapacityLiters) * 100));
  const foodPercent = Math.min(100, Math.round((lifeSupport.foodRationsRemainingKcal / lifeSupport.foodMaxCapacityKcal) * 100));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-left">
      
      {/* 1. Oxygen (O2) */}
      <div className="hud-panel p-3.5 rounded-xl border border-space-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Wind className="w-3.5 h-3.5 text-space-cyan" />
            <span>OXYGEN</span>
          </span>
          <span className="text-space-cyan font-bold">{o2Percent}%</span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {lifeSupport.oxygenRemainingKg} <span className="text-[10px] text-space-muted font-normal">kg</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-space-cyan h-full transition-all duration-300"
            style={{ width: `${o2Percent}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Burn: -{lifeSupport.oxygenDailyConsumptionKg} kg</span>
          <span className="text-space-teal">+{lifeSupport.oxygenDailyProductionKg}</span>
        </div>
      </div>

      {/* 2. Water (H2O) */}
      <div className="hud-panel p-3.5 rounded-xl border border-space-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>WATER</span>
          </span>
          <span className="text-blue-400 font-bold">{waterPercent}%</span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {lifeSupport.waterRemainingLiters} <span className="text-[10px] text-space-muted font-normal">L</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-400 h-full transition-all duration-300"
            style={{ width: `${waterPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Recycle: {lifeSupport.recyclingEfficiencyPercent}%</span>
          <span className="text-space-teal">+{lifeSupport.waterDailyRecycledLiters}L</span>
        </div>
      </div>

      {/* 3. Food Calories */}
      <div className="hud-panel p-3.5 rounded-xl border border-space-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Apple className="w-3.5 h-3.5 text-space-teal" />
            <span>FOOD</span>
          </span>
          <span className="text-space-teal font-bold">{foodPercent}%</span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {Math.round(lifeSupport.foodRationsRemainingKcal / 1000)}k <span className="text-[10px] text-space-muted font-normal">kcal</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-space-teal h-full transition-all duration-300"
            style={{ width: `${foodPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Cons: {lifeSupport.foodDailyConsumptionKcal}</span>
          <span className="text-space-teal">+{lifeSupport.foodDailyHarvestKcal}</span>
        </div>
      </div>

      {/* 4. Battery Bank */}
      <div className={`hud-panel p-3.5 rounded-xl border space-y-2 ${
        power.batteryPercent < 20 ? 'border-space-coral/70 bg-space-coral/10' : 'border-space-border/70'
      }`}>
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-space-amber" />
            <span>BATTERY</span>
          </span>
          <span className={`font-bold ${power.batteryPercent < 20 ? 'text-space-coral animate-pulse' : 'text-space-amber'}`}>
            {power.batteryPercent}%
          </span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {power.batteryChargeKwh} <span className="text-[10px] text-space-muted font-normal">kWh</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${power.batteryPercent < 20 ? 'bg-space-coral' : 'bg-space-amber'}`}
            style={{ width: `${power.batteryPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Capacity: {power.batteryCapacityKwh}</span>
          <span className={power.netPowerKw >= 0 ? 'text-space-teal' : 'text-space-coral'}>
            {power.netPowerKw >= 0 ? `+${power.netPowerKw}` : power.netPowerKw}kW
          </span>
        </div>
      </div>

      {/* 5. Carbon Dioxide (CO2) */}
      <div className={`hud-panel p-3.5 rounded-xl border space-y-2 ${
        lifeSupport.co2AtmospherePercent > 0.8 ? 'border-space-coral/60 bg-space-coral/10' : 'border-space-border/70'
      }`}>
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>CO2 CABIN</span>
          </span>
          <span className={`font-bold ${lifeSupport.co2AtmospherePercent > 0.8 ? 'text-space-coral' : 'text-purple-400'}`}>
            {lifeSupport.co2AtmospherePercent}%
          </span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {lifeSupport.co2AtmospherePercent} <span className="text-[10px] text-space-muted font-normal">vol %</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${lifeSupport.co2AtmospherePercent > 0.8 ? 'bg-space-coral' : 'bg-purple-400'}`}
            style={{ width: `${Math.min(100, (lifeSupport.co2AtmospherePercent / 1.5) * 100)}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Scrubbed: {lifeSupport.co2ScrubbedDailyKg}kg</span>
          <span>Max: 1.2%</span>
        </div>
      </div>

      {/* 6. Habitat Temperature */}
      <div className="hud-panel p-3.5 rounded-xl border border-space-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Thermometer className="w-3.5 h-3.5 text-space-amber" />
            <span>CLIMATE</span>
          </span>
          <span className="text-space-teal font-bold">{lifeSupport.habitatTemperatureCelsius}°C</span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {lifeSupport.habitatTemperatureCelsius}° <span className="text-[10px] text-space-muted font-normal">Celsius</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-space-teal h-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, (lifeSupport.habitatTemperatureCelsius / 35) * 100))}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Target: 21.0°C</span>
          <span>101.3 kPa</span>
        </div>
      </div>

      {/* 7. Crew Wellbeing */}
      <div className={`hud-panel p-3.5 rounded-xl border space-y-2 ${
        simulation.crewHealthAverage < 50 ? 'border-space-coral/70 bg-space-coral/10' : 'border-space-border/70'
      }`}>
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-space-coral" />
            <span>CREW VITALS</span>
          </span>
          <span className={`font-bold ${simulation.crewHealthAverage < 50 ? 'text-space-coral' : 'text-space-teal'}`}>
            {Math.round(simulation.crewHealthAverage)}%
          </span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {Math.round(simulation.crewHealthAverage)} <span className="text-[10px] text-space-muted font-normal">Vitality</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${simulation.crewHealthAverage < 50 ? 'bg-space-coral' : 'bg-space-teal'}`}
            style={{ width: `${simulation.crewHealthAverage}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span>Morale: {simulation.crewMoraleAverage}%</span>
          <span>Nominal</span>
        </div>
      </div>

      {/* 8. Solar Flux & Dust */}
      <div className="hud-panel p-3.5 rounded-xl border border-space-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs text-space-muted">
          <span className="flex items-center space-x-1">
            <Sun className="w-3.5 h-3.5 text-space-amber" />
            <span>SOLAR FLUX</span>
          </span>
          <span className="text-space-amber font-bold">{power.sunlightIntensityPercent}%</span>
        </div>
        <div className="text-lg font-bold text-space-light">
          {power.solarGenerationKw} <span className="text-[10px] text-space-muted font-normal">kW Gen</span>
        </div>
        <div className="w-full bg-space-dark rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-space-amber h-full transition-all duration-300"
            style={{ width: `${power.sunlightIntensityPercent}%` }}
          />
        </div>
        <div className="text-[10px] text-space-muted flex justify-between">
          <span className="capitalize">{power.diurnalPhase}</span>
          <span className="text-space-muted">Dust: {Math.round(simulation.dustAtmosphericOpacity * 100)}%</span>
        </div>
      </div>

    </div>
  );
};
