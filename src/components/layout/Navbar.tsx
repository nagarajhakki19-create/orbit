import React from 'react';
import { useMissionStore, AppView } from '../../store/useMissionStore';
import { 
  Compass, 
  Layers, 
  Activity, 
  Award, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Settings2, 
  Home,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setView, 
    isAudioMuted, 
    toggleAudio, 
    config, 
    simulation, 
    incidents,
    openIncidentModal
  } = useMissionStore();

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'landing', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { view: 'setup', label: 'Setup', icon: <Settings2 className="w-4 h-4" /> },
    { view: 'explorer', label: '3D Explorer', icon: <Globe2 className="w-4 h-4" /> },
    { view: 'builder', label: 'Outpost Builder', icon: <Layers className="w-4 h-4" /> },
    { view: 'control', label: 'Mission Control', icon: <Activity className="w-4 h-4" /> },
    { view: 'evaluation', label: 'Evaluation', icon: <Award className="w-4 h-4" /> }
  ];

  const activeIncident = incidents.find(i => !i.resolution);

  return (
    <header className="sticky top-0 z-50 w-full hud-panel border-b border-space-border/60 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Mission Badge */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setView('landing')}
          className="flex items-center space-x-3 group focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-space-cyan/30 via-space-surface to-space-teal/20 border border-space-cyan/50 flex items-center justify-center shadow-glow-cyan">
            <Compass className="w-5 h-5 text-space-cyan group-hover:rotate-45 transition-transform duration-500" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-space-teal animate-ping" />
          </div>
          <div className="text-left">
            <div className="font-display font-black text-lg tracking-widest text-space-light group-hover:text-space-cyan transition-colors">
              ORBIT
            </div>
            <div className="text-[10px] tracking-wider font-mono text-space-muted uppercase">
              Junior Astronaut Mission Trainer
            </div>
          </div>
        </button>

        {/* Destination & Sol indicator */}
        <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-space-border/70 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-space-surface border border-space-border text-space-cyan uppercase font-bold">
            {config.destination.toUpperCase()}
          </span>
          <span className="text-space-muted">
            SOL <strong className="text-space-light">{simulation.currentSol}</strong> / {config.missionDurationSols}
          </span>
          <span className={`w-2 h-2 rounded-full ${simulation.isDaytime ? 'bg-space-amber shadow-glow-amber' : 'bg-blue-400'}`} title={simulation.isDaytime ? 'Daylight Phase' : 'Eclipse Phase'} />
        </div>
      </div>

      {/* Central View Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 bg-space-dark/80 p-1 rounded-xl border border-space-border/70">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                isActive
                  ? 'bg-space-cyan/20 text-space-cyan border border-space-cyan/40 shadow-glow-cyan font-bold'
                  : 'text-space-muted hover:text-space-light hover:bg-space-surface/70'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Active Alert, Audio, Action */}
      <div className="flex items-center space-x-3">
        {activeIncident && (
          <button
            onClick={() => openIncidentModal(activeIncident)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-space-coral/20 border border-space-coral/60 text-space-coral text-xs font-mono animate-pulse hover:bg-space-coral/30"
          >
            <AlertTriangle className="w-4 h-4 text-space-coral" />
            <span className="hidden sm:inline font-bold">ANOMALY DETECTED</span>
          </button>
        )}

        <button
          onClick={toggleAudio}
          className="p-2 rounded-lg bg-space-surface/80 border border-space-border text-space-muted hover:text-space-cyan hover:border-space-cyan/50 transition-colors"
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-space-coral" /> : <Volume2 className="w-4 h-4 text-space-teal" />}
        </button>

        {activeView !== 'control' && activeView !== 'evaluation' ? (
          <button
            onClick={() => setView('control')}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-space-cyan text-space-dark font-display text-xs font-bold hover:bg-space-cyan/90 shadow-glow-cyan transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>MISSION CONTROL</span>
          </button>
        ) : null}
      </div>
    </header>
  );
};
