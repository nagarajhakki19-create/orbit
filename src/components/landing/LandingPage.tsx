import React, { useState } from 'react';
import { useMissionStore } from '../../store/useMissionStore';
import { 
  Rocket, 
  Globe2, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Droplet, 
  Wind,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setView, setDestination, config } = useMissionStore();
  const [selectedPreview, setSelectedPreview] = useState<'moon' | 'mars'>('moon');

  const handleStartMission = (dest?: 'moon' | 'mars') => {
    if (dest) setDestination(dest);
    setView('setup');
  };

  const handleExploreUniverse = () => {
    setView('explorer');
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden space-stars pb-16">
      {/* Dynamic ambient backdrop gradients */}
      <div className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000 ${
        selectedPreview === 'moon' ? 'bg-cyan-500/10' : 'bg-orange-500/15'
      }`} />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-space-surface border border-space-cyan/30 text-space-cyan text-xs font-mono shadow-glow-cyan">
              <Sparkles className="w-3.5 h-3.5 text-space-teal animate-spin-slow" />
              <span>NASA SPACE APPS CHALLENGE • EDUCATIONAL TRAINER</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-space-light leading-[1.08]">
                YOUR MISSION.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-space-cyan via-space-teal to-space-light">
                  YOUR OUTPOST.
                </span><br />
                YOUR UNIVERSE.
              </h1>
              <p className="text-space-muted text-base sm:text-lg lg:text-xl font-normal max-w-2xl pt-2 leading-relaxed">
                Explore alien worlds, engineer sustainable habitats, and experience the engineering challenges of human space exploration beyond Earth.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleStartMission(selectedPreview)}
                className="group flex items-center space-x-3 px-8 py-4 rounded-xl bg-gradient-to-r from-space-cyan to-space-teal text-space-dark font-display font-bold text-sm tracking-wider uppercase hover:shadow-glow-cyan transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Rocket className="w-5 h-5 text-space-dark group-hover:rotate-12 transition-transform" />
                <span>START YOUR MISSION</span>
                <ArrowRight className="w-4 h-4 text-space-dark group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleExploreUniverse}
                className="flex items-center space-x-3 px-7 py-4 rounded-xl bg-space-surface/80 hover:bg-space-surface text-space-light border border-space-border/80 hover:border-space-cyan/60 font-mono text-sm tracking-wider uppercase transition-all duration-200"
              >
                <Globe2 className="w-5 h-5 text-space-cyan" />
                <span>EXPLORE THE UNIVERSE</span>
              </button>
            </div>

            {/* Micro Stats Bar */}
            <div className="pt-6 border-t border-space-border/60 grid grid-cols-3 gap-6 font-mono">
              <div>
                <div className="text-2xl font-bold text-space-cyan">2</div>
                <div className="text-xs text-space-muted uppercase">Worlds (Moon & Mars)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-space-teal">6</div>
                <div className="text-xs text-space-muted uppercase">Modular Outpost Units</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-space-amber">100%</div>
                <div className="text-xs text-space-muted uppercase">Interactive Physics</div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Celestial Preview Box */}
          <div className="lg:col-span-5">
            <div className="relative hud-panel rounded-2xl p-6 border border-space-border/80 shadow-2xl overflow-hidden">
              {/* Destination selector tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-space-border/60">
                <span className="text-xs font-mono text-space-muted uppercase tracking-wider">
                  Target Reconnaissance
                </span>
                <div className="flex space-x-1 bg-space-dark p-1 rounded-lg border border-space-border">
                  <button
                    onClick={() => setSelectedPreview('moon')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                      selectedPreview === 'moon' 
                        ? 'bg-space-cyan/20 text-space-cyan border border-space-cyan/40 font-bold' 
                        : 'text-space-muted hover:text-space-light'
                    }`}
                  >
                    MOON
                  </button>
                  <button
                    onClick={() => setSelectedPreview('mars')}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                      selectedPreview === 'mars' 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold' 
                        : 'text-space-muted hover:text-space-light'
                    }`}
                  >
                    MARS
                  </button>
                </div>
              </div>

              {/* Preview Graphic Representation */}
              <div className="relative my-6 h-64 flex items-center justify-center">
                {/* Orbital concentric rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full border border-space-cyan/20 animate-spin-slow" />
                  <div className="w-48 h-48 rounded-full border border-dashed border-space-border/60" />
                </div>

                {/* Celestial body representation */}
                <div 
                  className={`w-36 h-36 rounded-full shadow-2xl relative transition-all duration-700 flex items-center justify-center cursor-pointer group ${
                    selectedPreview === 'moon'
                      ? 'bg-gradient-to-tr from-[#1f242c] via-[#7d8591] to-[#cbd3dc] shadow-[0_0_50px_rgba(203,211,220,0.35)]'
                      : 'bg-gradient-to-tr from-[#42160d] via-[#b34927] to-[#e8804c] shadow-[0_0_50px_rgba(232,128,76,0.45)]'
                  }`}
                  onClick={() => handleStartMission(selectedPreview)}
                >
                  {/* Subtle surface texture overlay */}
                  <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,#fff,transparent_70%)]" />
                  
                  {/* Rotating orbital tag */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-space-dark/90 px-3 py-1 rounded border border-space-cyan/60 text-[10px] font-mono text-space-cyan uppercase font-bold tracking-wider">
                    Inspect 3D
                  </div>
                </div>
              </div>

              {/* Preview Details Card */}
              <div className="space-y-3 font-mono text-xs text-left bg-space-dark/60 p-4 rounded-xl border border-space-border/50">
                <div className="flex justify-between">
                  <span className="text-space-muted">Celestial Body:</span>
                  <span className="text-space-light font-bold">
                    {selectedPreview === 'moon' ? 'Earth\'s Moon (Luna)' : 'Mars (Red Planet)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-muted">Primary Surface Base:</span>
                  <span className="text-space-cyan font-bold">
                    {selectedPreview === 'moon' ? 'Shackleton Crater' : 'Jezero Crater'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-space-muted">Key Environmental Factor:</span>
                  <span className="text-space-amber">
                    {selectedPreview === 'moon' ? 'Permanent polar cold-traps' : 'Diurnal global dust storms'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStartMission(selectedPreview)}
                className="w-full mt-4 py-2.5 rounded-lg bg-space-surface hover:bg-space-surface/70 border border-space-cyan/40 text-space-cyan text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <span>CHOOSE {selectedPreview.toUpperCase()} & CONFIGURE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <section className="mt-24 pt-16 border-t border-space-border/60">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-space-light">
              ENGINEERED FOR SPACE EDUCATION
            </h2>
            <p className="text-space-muted text-sm font-mono mt-2">
              ORBIT provides real aerospace trade-offs in an engaging interactive digital environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Feature 1 */}
            <div className="hud-panel p-6 rounded-xl border border-space-border/70 hover:border-space-cyan/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-space-cyan/10 border border-space-cyan/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Globe2 className="w-6 h-6 text-space-cyan" />
              </div>
              <h3 className="font-display font-bold text-base text-space-light mb-2">
                3D Planetary Explorer
              </h3>
              <p className="text-space-muted text-xs leading-relaxed font-sans">
                Orbit around realistic Three.js 3D models of the Moon and Mars with real NASA scientific coordinates, elevation profiles, and landing site telemetry.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="hud-panel p-6 rounded-xl border border-space-border/70 hover:border-space-teal/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-space-teal/10 border border-space-teal/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6 text-space-teal" />
              </div>
              <h3 className="font-display font-bold text-base text-space-light mb-2">
                3D Outpost Construction
              </h3>
              <p className="text-space-muted text-xs leading-relaxed font-sans">
                Construct modular habitats, hydroponics, solar grids, and ECLSS modules on an interactive 3D surface grid governed by real titanium and credit budgets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="hud-panel p-6 rounded-xl border border-space-border/70 hover:border-space-amber/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-space-amber/10 border border-space-amber/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-space-amber" />
              </div>
              <h3 className="font-display font-bold text-base text-space-light mb-2">
                ECLSS & Power Engines
              </h3>
              <p className="text-space-muted text-xs leading-relaxed font-sans">
                Live mathematical simulation of oxygen generation, CO2 scrubbing, water recycling, caloric consumption, solar flux, and battery charge cycles.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="hud-panel p-6 rounded-xl border border-space-border/70 hover:border-space-coral/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-space-coral/10 border border-space-coral/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-space-coral" />
              </div>
              <h3 className="font-display font-bold text-base text-space-light mb-2">
                Failure Detective
              </h3>
              <p className="text-space-muted text-xs leading-relaxed font-sans">
                Respond to unexpected dust storms, distillation stalls, and battery blackouts with an educational diagnostic HUD explaining root causes and solutions.
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};
