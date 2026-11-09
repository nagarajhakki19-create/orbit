import React from 'react';
import { useMissionStore } from '../../store/useMissionStore';
import { PlanetDestination, MissionDifficulty } from '../../types/mission';
import { ALL_LANDING_SITES } from '../../utils/planetaryData';
import { 
  Users, 
  Clock, 
  Shield, 
  Coins, 
  Layers, 
  ArrowRight, 
  Rocket, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MissionSetup: React.FC = () => {
  const { config, updateConfig, setDestination, setView, crew } = useMissionStore();

  const currentLandingSites = ALL_LANDING_SITES.filter(s => s.destination === config.destination);
  const selectedSite = currentLandingSites.find(s => s.id === config.selectedLandingSiteId) || currentLandingSites[0];

  const handleDestinationChange = (dest: PlanetDestination) => {
    setDestination(dest);
  };

  const handleCrewChange = (size: number) => {
    updateConfig({ crewSize: size });
  };

  const handleDurationChange = (duration: number) => {
    updateConfig({ missionDurationSols: duration });
  };

  const handleDifficultyChange = (diff: MissionDifficulty) => {
    let credits = 1600;
    let titanium = 120;
    if (diff === 'cadet') {
      credits = 2200;
      titanium = 180;
    } else if (diff === 'commander') {
      credits = 1200;
      titanium = 90;
    }
    updateConfig({ difficulty: diff, credits, titaniumUnits: titanium });
  };

  const handleLaunchToExplorer = () => {
    setView('explorer');
  };

  const handleLaunchToBuilder = () => {
    setView('builder');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-space-border/60 gap-4">
        <div>
          <div className="text-xs font-mono text-space-cyan uppercase tracking-widest">
            Pre-Flight Stage 01 // Configuration
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-space-light mt-1">
            MISSION CONFIGURATION & CREW SETUP
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-space-surface px-4 py-2 rounded-xl border border-space-border">
          <Coins className="w-4 h-4 text-space-amber" />
          <span className="text-space-muted">ALLOCATED BUDGET:</span>
          <strong className="text-space-amber">{config.credits} CREDITS</strong>
          <span className="text-space-border">|</span>
          <strong className="text-space-cyan">{config.titaniumUnits} Ti</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Config Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Destination Selection */}
          <div className="hud-panel p-6 rounded-2xl border border-space-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-space-muted uppercase tracking-wider flex items-center space-x-2">
                <Rocket className="w-4 h-4 text-space-cyan" />
                <span>Step 1: Choose Planetary Destination</span>
              </span>
              <span className="text-xs font-mono text-space-cyan">Selected: {config.destination.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleDestinationChange('moon')}
                className={`p-5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                  config.destination === 'moon'
                    ? 'bg-space-cyan/10 border-space-cyan shadow-glow-cyan'
                    : 'bg-space-dark/80 border-space-border hover:border-space-border/80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-display font-bold text-lg text-space-light">THE MOON</div>
                    <div className="text-xs font-mono text-space-cyan">Earth\'s Natural Satellite</div>
                  </div>
                  {config.destination === 'moon' && <CheckCircle2 className="w-5 h-5 text-space-cyan" />}
                </div>
                <p className="text-xs text-space-muted mt-3 font-sans leading-relaxed">
                  Low gravity (0.166g), 28-day diurnal cycle, extreme vacuum, and polar permanently shadowed water-ice cold traps.
                </p>
                <div className="mt-4 pt-3 border-t border-space-border/50 text-[11px] font-mono text-space-muted flex justify-between">
                  <span>Distance: ~384,400 km</span>
                  <span className="text-space-teal">Light Lag: ~1.3s</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDestinationChange('mars')}
                className={`p-5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                  config.destination === 'mars'
                    ? 'bg-orange-500/15 border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.3)]'
                    : 'bg-space-dark/80 border-space-border hover:border-space-border/80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-display font-bold text-lg text-space-light">MARS</div>
                    <div className="text-xs font-mono text-orange-400">The Red Planet</div>
                  </div>
                  {config.destination === 'mars' && <CheckCircle2 className="w-5 h-5 text-orange-400" />}
                </div>
                <p className="text-xs text-space-muted mt-3 font-sans leading-relaxed">
                  Moderate gravity (0.38g), 24.6h sol diurnal cycle, thin CO2 atmosphere, high radiation, and seasonal global dust storms.
                </p>
                <div className="mt-4 pt-3 border-t border-space-border/50 text-[11px] font-mono text-space-muted flex justify-between">
                  <span>Distance: ~225M km</span>
                  <span className="text-space-amber">Light Lag: 4-24m</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Crew Size Selection */}
          <div className="hud-panel p-6 rounded-2xl border border-space-border/70 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-space-muted uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-4 h-4 text-space-teal" />
                <span>Step 2: Expedition Crew Compliment</span>
              </span>
              <span className="text-xs font-mono text-space-teal">{config.crewSize} Astronauts</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[2, 4, 6, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => handleCrewChange(size)}
                  className={`py-3.5 px-2 rounded-xl border font-mono text-center transition-all ${
                    config.crewSize === size
                      ? 'bg-space-teal/20 border-space-teal text-space-light font-bold shadow-glow-teal'
                      : 'bg-space-dark/80 border-space-border text-space-muted hover:text-space-light hover:border-space-muted'
                  }`}
                >
                  <div className="text-lg font-bold">{size}</div>
                  <div className="text-[10px] text-space-muted uppercase">Crew</div>
                </button>
              ))}
            </div>

            {/* Crew burn rate advisory */}
            <div className="p-3 rounded-lg bg-space-dark/60 border border-space-border text-xs font-mono text-space-muted flex items-center justify-between">
              <span>Metabolic Demand:</span>
              <span className="text-space-light">
                O2: <strong className="text-space-cyan">{(0.84 * config.crewSize).toFixed(1)} kg/day</strong> • 
                H2O: <strong className="text-space-teal">{(3.5 * config.crewSize).toFixed(1)} L/day</strong> • 
                Calories: <strong className="text-space-amber">{2500 * config.crewSize} kcal/day</strong>
              </span>
            </div>
          </div>

          {/* 3. Mission Duration & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Duration */}
            <div className="hud-panel p-6 rounded-2xl border border-space-border/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-space-muted uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-space-amber" />
                  <span>Duration (Sols)</span>
                </span>
                <span className="text-xs font-mono text-space-amber">{config.missionDurationSols} Sols</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { sols: 30, label: 'Sprint' },
                  { sols: 90, label: 'Expedition' },
                  { sols: 180, label: 'Colony' }
                ].map(({ sols, label }) => (
                  <button
                    key={sols}
                    onClick={() => handleDurationChange(sols)}
                    className={`py-3 px-1 rounded-xl border font-mono text-center transition-all ${
                      config.missionDurationSols === sols
                        ? 'bg-space-amber/20 border-space-amber text-space-light font-bold shadow-glow-amber'
                        : 'bg-space-dark/80 border-space-border text-space-muted hover:text-space-light'
                    }`}
                  >
                    <div className="text-base font-bold">{sols}</div>
                    <div className="text-[9px] text-space-muted uppercase">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="hud-panel p-6 rounded-2xl border border-space-border/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-space-muted uppercase tracking-wider flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-space-coral" />
                  <span>Simulation Difficulty</span>
                </span>
                <span className="text-xs font-mono text-space-coral uppercase">{config.difficulty}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cadet', name: 'Cadet', sub: '+Credits' },
                  { id: 'specialist', name: 'Specialist', sub: 'Standard' },
                  { id: 'commander', name: 'Commander', sub: 'Extreme' }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleDifficultyChange(d.id as MissionDifficulty)}
                    className={`py-3 px-1 rounded-xl border font-mono text-center transition-all ${
                      config.difficulty === d.id
                        ? 'bg-space-coral/20 border-space-coral text-space-light font-bold shadow-glow-coral'
                        : 'bg-space-dark/80 border-space-border text-space-muted hover:text-space-light'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.name}</div>
                    <div className="text-[9px] text-space-muted">{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Summary Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hud-panel p-6 rounded-2xl border border-space-cyan/30 shadow-2xl space-y-5 text-left">
            <div className="flex items-center space-x-2 pb-3 border-b border-space-border/60">
              <Info className="w-4 h-4 text-space-cyan" />
              <span className="font-display font-bold text-sm text-space-light tracking-wider">
                MISSION BRIEFING SUMMARY
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-space-border/40">
                <span className="text-space-muted">Mission Codename:</span>
                <span className="text-space-light font-bold">{config.missionName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-border/40">
                <span className="text-space-muted">Target World:</span>
                <span className="text-space-cyan font-bold uppercase">{config.destination}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-border/40">
                <span className="text-space-muted">Landing Zone:</span>
                <span className="text-space-teal font-bold">{selectedSite.name.split(' (')[0]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-border/40">
                <span className="text-space-muted">Astronaut Roster:</span>
                <span className="text-space-light">{config.crewSize} Active Personnel</span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-border/40">
                <span className="text-space-muted">Target Duration:</span>
                <span className="text-space-amber font-bold">{config.missionDurationSols} Sols</span>
              </div>
              <div className="flex justify-between py-1 border-b border-space-border/40">
                <span className="text-space-muted">Logistics Budget:</span>
                <span className="text-space-amber font-bold">{config.credits} CR / {config.titaniumUnits} Ti</span>
              </div>
            </div>

            {/* Scientific Landing Site Highlight */}
            <div className="p-3.5 rounded-xl bg-space-dark/80 border border-space-border space-y-2">
              <div className="text-[11px] font-mono text-space-muted uppercase">Recommended Strategy:</div>
              <p className="text-xs text-space-light font-sans leading-relaxed">
                {selectedSite.recommendedStrategy}
              </p>
            </div>

            {/* Launch Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleLaunchToExplorer}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-space-cyan to-space-teal text-space-dark font-display font-bold text-xs tracking-wider uppercase hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
              >
                <span>SURFACE RECON (3D EXPLORER)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleLaunchToBuilder}
                className="w-full py-3 rounded-xl bg-space-surface hover:bg-space-surface/80 border border-space-border text-space-light font-mono text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2"
              >
                <Layers className="w-4 h-4 text-space-cyan" />
                <span>DIRECT TO OUTPOST BUILDER</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
