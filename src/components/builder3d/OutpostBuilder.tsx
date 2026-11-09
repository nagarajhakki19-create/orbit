import React from 'react';
import { useMissionStore, BUILDING_BLUEPRINTS } from '../../store/useMissionStore';
import { BuildingType } from '../../types/outpost';
import { BuildingCard } from './BuildingCard';
import { OutpostGridCanvas } from './OutpostGridCanvas';
import { 
  Coins, 
  Layers, 
  Zap, 
  Trash2, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const OutpostBuilder: React.FC = () => {
  const {
    config,
    placedBuildings,
    selectedBuildingType,
    setSelectedBuildingType,
    placeBuilding,
    removeBuilding,
    power,
    setView,
    loadInitialOutpostPreset
  } = useMissionStore();

  const handlePlace = (x: number, y: number) => {
    if (!selectedBuildingType) return;
    placeBuilding(selectedBuildingType, x, y);
  };

  const handleRemove = (instanceId: string) => {
    removeBuilding(instanceId);
  };

  const buildingTypes: BuildingType[] = ['habitat', 'solar', 'greenhouse', 'water', 'comms', 'eclss'];

  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex flex-col lg:flex-row bg-space-dark overflow-hidden font-sans select-none">
      
      {/* Main 3D Grid Canvas Area */}
      <div className="relative flex-1 h-full">
        {/* Top Status Bar HUD */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          
          {/* Resources & Budget */}
          <div className="flex items-center space-x-2 pointer-events-auto">
            <div className="hud-panel px-4 py-2 rounded-xl flex items-center space-x-3 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-space-amber font-bold">
                <Coins className="w-4 h-4" />
                <span>{config.credits} CREDITS</span>
              </div>
              <span className="text-space-border">|</span>
              <div className="flex items-center space-x-1.5 text-space-cyan font-bold">
                <Layers className="w-4 h-4" />
                <span>{config.titaniumUnits} Ti</span>
              </div>
            </div>

            {/* Power balance quick indicator */}
            <div className="hud-panel px-3.5 py-2 rounded-xl flex items-center space-x-2 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-space-amber" />
              <span className="text-space-muted">GRID:</span>
              <span className={power.netPowerKw >= 0 ? 'text-space-teal font-bold' : 'text-space-coral font-bold'}>
                {power.netPowerKw >= 0 ? `+${power.netPowerKw}` : power.netPowerKw} kW
              </span>
            </div>
          </div>

          {/* Action CTAs: Preset & Launch */}
          <div className="flex items-center space-x-2 pointer-events-auto">
            <button
              onClick={loadInitialOutpostPreset}
              className="px-3.5 py-2 rounded-xl hud-panel hover:bg-space-surface border border-space-teal/40 text-space-teal text-xs font-mono flex items-center space-x-1.5 transition-colors"
              title="Spawn standard initial base (Habitat + Solar + ECLSS + Water + Comms)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">NASA BASELINE PRESET</span>
            </button>

            <button
              onClick={() => setView('control')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-space-cyan to-space-teal text-space-dark font-display font-bold text-xs tracking-wider uppercase hover:shadow-glow-cyan transition-all"
            >
              <span>COMMENCE SIMULATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instructions banner at bottom of canvas */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center space-x-2 text-[11px] font-mono text-space-muted bg-space-dark/75 px-3 py-1.5 rounded-lg border border-space-border/60">
          <span>Click empty cell to construct • Click placed module to dismantle (80% refund) • Right click + drag to orbit</span>
        </div>

        {/* 3D Canvas */}
        <OutpostGridCanvas
          destination={config.destination}
          placedBuildings={placedBuildings}
          selectedBuildingType={selectedBuildingType}
          onPlaceBuilding={handlePlace}
          onRemoveBuilding={handleRemove}
        />
      </div>

      {/* Right Construction Palette Sidebar */}
      <div className="w-full lg:w-96 hud-panel border-l border-space-border/80 flex flex-col justify-between p-4 z-20 overflow-y-auto max-h-[45vh] lg:max-h-full">
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-space-border/60">
            <div>
              <div className="text-[10px] font-mono text-space-cyan uppercase tracking-wider">
                Modular Fabrication
              </div>
              <h2 className="font-display font-bold text-sm text-space-light">
                OUTPOST BLUEPRINTS
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-space-surface text-[10px] font-mono text-space-muted border border-space-border">
              {placedBuildings.length} PLACED
            </span>
          </div>

          {/* Module selection list */}
          <div className="space-y-2.5">
            {buildingTypes.map((type) => {
              const bp = BUILDING_BLUEPRINTS[type];
              const isSelected = selectedBuildingType === type;
              const canAfford = config.credits >= bp.costCredits && config.titaniumUnits >= bp.costTitanium;
              const placedCount = placedBuildings.filter(b => b.type === type).length;

              return (
                <BuildingCard
                  key={type}
                  blueprint={bp}
                  isSelected={isSelected}
                  canAfford={canAfford}
                  placedCount={placedCount}
                  onSelect={() => setSelectedBuildingType(type)}
                />
              );
            })}
          </div>
        </div>

        {/* Footer info box */}
        <div className="mt-4 pt-3 border-t border-space-border/60 text-left">
          <div className="p-3 rounded-xl bg-space-dark/80 border border-space-border/60 text-[11px] font-mono text-space-muted space-y-1">
            <div className="text-space-light font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-space-teal" />
              <span>Engineering Tip:</span>
            </div>
            <p className="font-sans leading-relaxed text-space-muted">
              Always install solar arrays and an ECLSS recycling module before expanding crew quarters to avoid brownouts or rapid consumable depletion.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
