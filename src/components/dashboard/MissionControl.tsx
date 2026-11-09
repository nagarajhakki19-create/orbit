import React, { useEffect } from 'react';
import { useMissionStore } from '../../store/useMissionStore';
import { TelemetryGauges } from './TelemetryGauges';
import { ResourceTrendsChart } from './ResourceTrendsChart';
import { 
  Play, 
  Pause, 
  FastForward, 
  Clock, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Layers, 
  Award, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const MissionControl: React.FC = () => {
  const {
    config,
    simulation,
    lifeSupport,
    power,
    placedBuildings,
    telemetryHistory,
    setTimeScale,
    tickSimulation,
    incidents,
    openIncidentModal,
    evaluateMission,
    setView
  } = useMissionStore();

  // Simulation tick loop (runs continuously when timeScale > 0)
  useEffect(() => {
    const interval = setInterval(() => {
      tickSimulation(0.2); // 200ms step
    }, 200);

    return () => clearInterval(interval);
  }, [tickSimulation]);

  const activeIncident = incidents.find(i => !i.resolution);
  const resolvedIncidents = incidents.filter(i => i.resolution);

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 font-sans text-left">
      
      {/* Top Header & Simulation Controls */}
      <div className="hud-panel p-5 rounded-2xl border border-space-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Mission & Time Readout */}
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-space-dark border border-space-border flex items-center justify-center">
            {simulation.isDaytime ? (
              <Sun className="w-6 h-6 text-space-amber animate-spin-slow" />
            ) : (
              <Moon className="w-6 h-6 text-blue-400" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-space-cyan uppercase font-bold">{config.missionName}</span>
              <span className="text-space-border">•</span>
              <span className="text-space-muted">{config.destination.toUpperCase()} SURFACE BASE</span>
            </div>

            <div className="font-display font-black text-2xl text-space-light mt-0.5 flex items-center space-x-3">
              <span>SOL {simulation.currentSol}</span>
              <span className="text-space-border text-lg">/</span>
              <span className="text-space-muted text-lg font-mono font-normal">
                {formatHours(simulation.timeOfDayHours)} UTC
              </span>
            </div>
          </div>
        </div>

        {/* Center: Sol Progress Bar */}
        <div className="w-full md:w-64 space-y-1 font-mono text-xs">
          <div className="flex justify-between text-[11px] text-space-muted">
            <span>MISSION PROGRESS:</span>
            <span className="text-space-cyan font-bold">
              {Math.min(100, Math.round((simulation.currentSol / config.missionDurationSols) * 100))}%
            </span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-2 overflow-hidden border border-space-border">
            <div 
              className="bg-gradient-to-r from-space-cyan to-space-teal h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (simulation.currentSol / config.missionDurationSols) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-space-muted text-right">
            Target: {config.missionDurationSols} Sols
          </div>
        </div>

        {/* Right: Time Speed Buttons & Evaluation CTA */}
        <div className="flex items-center space-x-3">
          {/* Time scale buttons */}
          <div className="flex p-1 rounded-xl bg-space-dark border border-space-border">
            <button
              onClick={() => setTimeScale(0)}
              className={`p-2 rounded-lg text-xs font-mono transition-colors ${
                simulation.timeScale === 0 ? 'bg-space-coral/30 text-space-coral font-bold' : 'text-space-muted hover:text-space-light'
              }`}
              title="Pause Simulation"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeScale(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                simulation.timeScale === 1 ? 'bg-space-cyan/20 text-space-cyan font-bold' : 'text-space-muted hover:text-space-light'
              }`}
              title="1x Real-time Simulation"
            >
              1x
            </button>
            <button
              onClick={() => setTimeScale(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                simulation.timeScale === 2 ? 'bg-space-cyan/20 text-space-cyan font-bold' : 'text-space-muted hover:text-space-light'
              }`}
              title="2x Accelerated"
            >
              2x
            </button>
            <button
              onClick={() => setTimeScale(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                simulation.timeScale === 5 ? 'bg-space-teal/20 text-space-teal font-bold' : 'text-space-muted hover:text-space-light'
              }`}
              title="5x Warp"
            >
              5x
            </button>
          </div>

          <button
            onClick={evaluateMission}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-space-teal to-space-cyan text-space-dark font-display font-bold text-xs tracking-wider uppercase hover:shadow-glow-teal transition-all"
          >
            <Award className="w-4 h-4" />
            <span>END MISSION & EVALUATE</span>
          </button>
        </div>
      </div>

      {/* Emergency Anomaly Banner (if active) */}
      {activeIncident && (
        <div 
          onClick={() => openIncidentModal(activeIncident)}
          className="hud-panel-coral p-4 rounded-xl border border-space-coral/70 flex items-center justify-between cursor-pointer hover:bg-space-coral/20 transition-all animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-space-coral/30 text-space-coral">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-space-coral font-bold uppercase tracking-wider">
                ACTIVE SUBSYSTEM FAILURE // {activeIncident.subsystem}
              </div>
              <div className="font-display font-bold text-sm text-space-light">
                {activeIncident.title}: {activeIncident.headline}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-space-coral font-bold">
            <span>DIAGNOSE & REMEDIATE</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Real-time Telemetry Gauges (O2, H2O, Food, Battery, CO2, Temp, Crew, Solar) */}
      <TelemetryGauges
        lifeSupport={lifeSupport}
        power={power}
        simulation={simulation}
      />

      {/* Middle Grid: Recharts Telemetry Chart + Outpost Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Recharts Historical Graph (8 Cols) */}
        <div className="lg:col-span-8">
          <ResourceTrendsChart data={telemetryHistory} />
        </div>

        {/* Right: Outpost Status & Incident Log (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Outpost Summary Card */}
          <div className="hud-panel p-5 rounded-2xl border border-space-border/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-space-border/60">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-space-cyan" />
                <h3 className="font-display font-bold text-xs text-space-light tracking-wider">
                  SURFACE ARCHITECTURE
                </h3>
              </div>
              <button
                onClick={() => setView('builder')}
                className="text-xs font-mono text-space-cyan hover:underline"
              >
                Modify Grid →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-space-dark/60 border border-space-border/50">
                <div className="text-[10px] text-space-muted">MODULES PLACED:</div>
                <div className="text-space-light font-bold text-sm mt-0.5">{placedBuildings.length} Units</div>
              </div>

              <div className="p-2.5 rounded-lg bg-space-dark/60 border border-space-border/50">
                <div className="text-[10px] text-space-muted">HABITAT INTEGRITY:</div>
                <div className="text-space-teal font-bold text-sm mt-0.5">100% Nominal</div>
              </div>
            </div>

            {/* List of placed module types */}
            <div className="space-y-1.5 font-mono text-xs">
              {['habitat', 'solar', 'greenhouse', 'water', 'comms', 'eclss'].map((type) => {
                const count = placedBuildings.filter(b => b.type === type).length;
                if (count === 0) return null;
                return (
                  <div key={type} className="flex justify-between py-1 border-b border-space-border/30 text-space-muted">
                    <span className="capitalize">{type} Module</span>
                    <span className="text-space-light font-bold">x{count}</span>
                  </div>
                );
              })}
            </div>

            {placedBuildings.length === 0 && (
              <div className="p-3 rounded-xl bg-space-dark/80 border border-space-coral/40 text-xs font-mono text-space-coral text-center">
                No surface modules built! Outpost is unpowered.
              </div>
            )}
          </div>

          {/* Incident History Log */}
          <div className="hud-panel p-5 rounded-2xl border border-space-border/80 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-space-border/60">
              <ShieldCheck className="w-4 h-4 text-space-teal" />
              <h3 className="font-display font-bold text-xs text-space-light tracking-wider">
                INCIDENT TELEMETRY LOG
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {incidents.length === 0 ? (
                <div className="text-xs font-mono text-space-muted py-4 text-center">
                  All systems nominal. No mission anomalies detected.
                </div>
              ) : (
                incidents.map((inc) => (
                  <div 
                    key={inc.id}
                    onClick={() => openIncidentModal(inc)}
                    className="p-2.5 rounded-lg bg-space-dark/60 border border-space-border hover:border-space-border/80 cursor-pointer text-left text-xs font-mono space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-space-light font-bold truncate max-w-[180px]">{inc.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        inc.resolution ? 'bg-space-teal/20 text-space-teal' : 'bg-space-coral/20 text-space-coral animate-pulse'
                      }`}>
                        {inc.resolution ? 'RESOLVED' : 'ACTIVE'}
                      </span>
                    </div>
                    <div className="text-[10px] text-space-muted">
                      Triggered Sol {inc.solTriggered} • {inc.subsystem}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
