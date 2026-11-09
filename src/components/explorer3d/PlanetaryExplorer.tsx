import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useMissionStore } from '../../store/useMissionStore';
import { ALL_LANDING_SITES } from '../../utils/planetaryData';
import { PlanetSphere } from './PlanetSphere';
import { SiteInfoCard } from './SiteInfoCard';
import { 
  RotateCw, 
  Layers, 
  Globe2, 
  Crosshair, 
  ZoomIn, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const PlanetaryExplorer: React.FC = () => {
  const { config, setDestination, setLandingSite, setView } = useMissionStore();
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const landingSites = ALL_LANDING_SITES.filter(s => s.destination === config.destination);
  const selectedSite = landingSites.find(s => s.id === config.selectedLandingSiteId) || landingSites[0];

  const handleSelectSite = (siteId: string) => {
    setLandingSite(siteId);
  };

  const handleProceedToBuilder = () => {
    setView('builder');
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-space-dark overflow-hidden select-none">
      
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 1.8, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#050811']} />
        
        {/* Lights */}
        <ambientLight intensity={config.destination === 'moon' ? 0.35 : 0.45} />
        <directionalLight 
          position={[10, 6, 8]} 
          intensity={config.destination === 'moon' ? 2.0 : 1.8} 
          castShadow 
        />
        <pointLight position={[-10, -5, -8]} intensity={0.2} color="#42D9FF" />

        {/* Space Starfield */}
        <Stars radius={120} depth={50} count={3500} factor={4} saturation={0} fade speed={1} />

        <Suspense fallback={null}>
          <PlanetSphere
            destination={config.destination}
            landingSites={landingSites}
            selectedSiteId={selectedSite.id}
            onSelectSite={handleSelectSite}
            autoRotate={autoRotate}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={4.2}
          maxDistance={14.0}
          dampingFactor={0.06}
          rotateSpeed={0.6}
        />
      </Canvas>

      {/* Top HUD Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        
        {/* Left: Destination switch & auto-rotate */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="flex p-1 rounded-xl hud-panel border border-space-border/80">
            <button
              onClick={() => setDestination('moon')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                config.destination === 'moon'
                  ? 'bg-space-cyan/20 text-space-cyan border border-space-cyan/40 shadow-glow-cyan'
                  : 'text-space-muted hover:text-space-light'
              }`}
            >
              MOON (LUNA)
            </button>
            <button
              onClick={() => setDestination('mars')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                config.destination === 'mars'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_20px_rgba(251,146,60,0.3)]'
                  : 'text-space-muted hover:text-space-light'
              }`}
            >
              MARS (RED PLANET)
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-xl hud-panel border text-xs font-mono flex items-center space-x-1.5 transition-colors ${
              autoRotate ? 'border-space-teal/50 text-space-teal' : 'border-space-border text-space-muted'
            }`}
            title="Toggle Orbital Rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            <span className="hidden sm:inline">{autoRotate ? 'ROTATION: ON' : 'ROTATION: OFF'}</span>
          </button>
        </div>

        {/* Right: Quick link back to setup or forward to builder */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setView('builder')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-space-cyan text-space-dark font-display font-bold text-xs tracking-wider uppercase hover:bg-space-cyan/90 shadow-glow-cyan transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>OPEN OUTPOST BUILDER</span>
          </button>
        </div>
      </div>

      {/* Bottom Landing Site Selector Ribbon */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        
        {/* Site Pill Ribbon */}
        <div className="flex flex-wrap gap-2 pointer-events-auto max-w-xl">
          {landingSites.map((site) => {
            const isSelected = site.id === selectedSite.id;
            return (
              <button
                key={site.id}
                onClick={() => handleSelectSite(site.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl hud-panel text-xs font-mono transition-all text-left ${
                  isSelected
                    ? 'border-space-cyan text-space-light bg-space-cyan/15 shadow-glow-cyan font-bold scale-105'
                    : 'border-space-border/70 text-space-muted hover:text-space-light hover:border-space-muted'
                }`}
              >
                <Crosshair className={`w-3.5 h-3.5 ${isSelected ? 'text-space-cyan' : 'text-space-muted'}`} />
                <span>{site.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Site Details HUD */}
        <div className="pointer-events-auto w-full md:w-auto">
          <SiteInfoCard site={selectedSite} onProceedToBuilder={handleProceedToBuilder} />
        </div>
      </div>

      {/* OrbitControls Hint */}
      <div className="absolute top-20 left-4 pointer-events-none hidden lg:flex items-center space-x-2 text-[11px] font-mono text-space-muted/70 bg-space-dark/50 px-2.5 py-1 rounded-md border border-space-border/40">
        <ZoomIn className="w-3.5 h-3.5" />
        <span>Click & drag to orbit • Scroll to zoom • Click markers to inspect sites</span>
      </div>
    </div>
  );
};
