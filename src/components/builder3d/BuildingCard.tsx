import React from 'react';
import { BuildingBlueprint, BuildingType } from '../../types/outpost';
import { 
  Home, 
  Sun, 
  Sprout, 
  Droplets, 
  Radio, 
  Activity, 
  Coins, 
  Zap,
  Check
} from 'lucide-react';

interface BuildingCardProps {
  blueprint: BuildingBlueprint;
  isSelected: boolean;
  canAfford: boolean;
  placedCount: number;
  onSelect: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  blueprint,
  isSelected,
  canAfford,
  placedCount,
  onSelect
}) => {
  const getIcon = (type: BuildingType) => {
    switch (type) {
      case 'habitat': return <Home className="w-5 h-5 text-space-cyan" />;
      case 'solar': return <Sun className="w-5 h-5 text-space-amber" />;
      case 'greenhouse': return <Sprout className="w-5 h-5 text-space-teal" />;
      case 'water': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'comms': return <Radio className="w-5 h-5 text-purple-400" />;
      case 'eclss': return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!canAfford && !isSelected}
      className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 relative ${
        isSelected
          ? 'bg-space-cyan/15 border-space-cyan shadow-glow-cyan'
          : canAfford
            ? 'bg-space-surface/80 border-space-border hover:border-space-border/80 hover:bg-space-surface'
            : 'bg-space-dark/50 border-space-border/40 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-space-dark/80 border border-space-border/60">
            {getIcon(blueprint.type)}
          </div>
          <div>
            <div className="font-display font-bold text-xs text-space-light">
              {blueprint.name}
            </div>
            <div className="text-[10px] font-mono text-space-muted">
              {blueprint.category}
            </div>
          </div>
        </div>

        {placedCount > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-space-dark border border-space-border text-[10px] font-mono text-space-cyan font-bold">
            x{placedCount}
          </span>
        )}
      </div>

      <p className="text-[11px] text-space-muted font-sans line-clamp-2 mt-2 leading-relaxed">
        {blueprint.description}
      </p>

      {/* Stats bar */}
      <div className="mt-3 pt-2.5 border-t border-space-border/50 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center space-x-2">
          <span className="text-space-amber font-bold">{blueprint.costCredits} CR</span>
          <span className="text-space-muted">/</span>
          <span className="text-space-cyan">{blueprint.costTitanium} Ti</span>
        </div>

        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3 text-space-amber" />
          <span className={blueprint.powerDelta >= 0 ? 'text-space-teal' : 'text-space-coral'}>
            {blueprint.powerDelta >= 0 ? `+${blueprint.powerDelta}` : blueprint.powerDelta} kW
          </span>
        </div>
      </div>
    </button>
  );
};
