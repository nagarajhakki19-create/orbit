import React from 'react';
import { LandingSite } from '../../types/mission';
import { 
  MapPin, 
  Thermometer, 
  Sun, 
  Droplets, 
  AlertTriangle, 
  Compass, 
  ArrowRight,
  Mountain
} from 'lucide-react';

interface SiteInfoCardProps {
  site: LandingSite;
  onProceedToBuilder: () => void;
}

export const SiteInfoCard: React.FC<SiteInfoCardProps> = ({ site, onProceedToBuilder }) => {
  return (
    <div className="hud-panel p-6 rounded-2xl border border-space-cyan/40 shadow-2xl space-y-4 text-left max-w-md w-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-space-border/60">
        <div>
          <div className="flex items-center space-x-1.5 text-space-cyan text-xs font-mono">
            <MapPin className="w-3.5 h-3.5" />
            <span>COORDINATES: {site.coordinates.display}</span>
          </div>
          <h2 className="font-display font-bold text-lg text-space-light mt-0.5">
            {site.name}
          </h2>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
          site.waterIceLikelihood === 'Confirmed' 
            ? 'bg-space-teal/20 text-space-teal border border-space-teal/50' 
            : 'bg-space-surface text-space-muted border border-space-border'
        }`}>
          ICE: {site.waterIceLikelihood}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-space-muted font-sans leading-relaxed">
        {site.description}
      </p>

      {/* Scientific Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-space-dark/80 border border-space-border/60 space-y-1">
          <div className="text-[10px] text-space-muted flex items-center space-x-1">
            <Thermometer className="w-3 h-3 text-space-amber" />
            <span>TEMPERATURE:</span>
          </div>
          <div className="text-space-light text-[11px] font-bold">{site.tempRange}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-space-dark/80 border border-space-border/60 space-y-1">
          <div className="text-[10px] text-space-muted flex items-center space-x-1">
            <Sun className="w-3 h-3 text-space-amber" />
            <span>SOLAR INSOLATION:</span>
          </div>
          <div className="text-space-light text-[11px] font-bold">{site.sunlightExposure}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-space-dark/80 border border-space-border/60 space-y-1">
          <div className="text-[10px] text-space-muted flex items-center space-x-1">
            <Mountain className="w-3 h-3 text-space-cyan" />
            <span>ELEVATION:</span>
          </div>
          <div className="text-space-light text-[11px] font-bold">{site.elevation}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-space-dark/80 border border-space-border/60 space-y-1">
          <div className="text-[10px] text-space-muted flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-space-coral" />
            <span>TERRAIN HAZARD:</span>
          </div>
          <div className={`text-[11px] font-bold ${
            site.terrainHazard === 'Low' ? 'text-space-teal' : site.terrainHazard === 'Moderate' ? 'text-space-amber' : 'text-space-coral'
          }`}>
            {site.terrainHazard}
          </div>
        </div>
      </div>

      {/* Recommended Strategy Box */}
      <div className="p-3 rounded-xl bg-space-surface/90 border border-space-border/80 text-xs space-y-1">
        <div className="text-[10px] font-mono text-space-cyan uppercase tracking-wider">
          NASA Engineering Recommendation:
        </div>
        <p className="text-space-light text-xs font-sans leading-relaxed">
          {site.recommendedStrategy}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onProceedToBuilder}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-space-cyan to-space-teal text-space-dark font-display font-bold text-xs tracking-wider uppercase hover:shadow-glow-cyan transition-all flex items-center justify-center space-x-2"
      >
        <span>SELECT SITE & BUILD OUTPOST</span>
        <ArrowRight className="w-4 h-4 text-space-dark" />
      </button>
    </div>
  );
};
