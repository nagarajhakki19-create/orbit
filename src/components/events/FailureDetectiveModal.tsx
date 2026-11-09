import React from 'react';
import { useMissionStore } from '../../store/useMissionStore';
import { MissionIncident, RemediationOption } from '../../types/events';
import { 
  AlertTriangle, 
  HelpCircle, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  Zap, 
  Layers, 
  BookOpen, 
  X,
  ArrowRight
} from 'lucide-react';

export const FailureDetectiveModal: React.FC = () => {
  const { activeIncidentModal, closeIncidentModal, resolveIncident, config } = useMissionStore();

  if (!activeIncidentModal) return null;

  const isResolved = Boolean(activeIncidentModal.resolution);

  const handleChooseOption = (optionId: string) => {
    resolveIncident(activeIncidentModal.id, optionId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-dark/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl hud-panel rounded-2xl border border-space-coral/60 shadow-[0_0_50px_rgba(255,107,112,0.3)] overflow-hidden max-h-[90vh] flex flex-col text-left">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-space-coral/20 via-space-surface to-space-surface border-b border-space-border/70 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-space-coral/30 border border-space-coral/60 text-space-coral">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-space-coral font-bold uppercase tracking-wider">
                MISSION FAILURE DETECTIVE // {activeIncidentModal.subsystem.toUpperCase()}
              </div>
              <h2 className="font-display font-black text-xl text-space-light mt-0.5">
                {activeIncidentModal.title}
              </h2>
            </div>
          </div>

          <button
            onClick={closeIncidentModal}
            className="p-1.5 rounded-lg text-space-muted hover:text-space-light hover:bg-space-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Diagnostic Telemetry + Root Cause Explanation */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Diagnostic Box: What happened & Physical Phenomenon */}
          <div className="hud-panel p-4 rounded-xl border border-space-border/70 space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-2 text-space-cyan font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>DIAGNOSTIC TELEMETRY REPORT</span>
            </div>

            <p className="text-space-light font-sans text-sm leading-relaxed">
              {activeIncidentModal.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-space-dark/80 border border-space-border">
                <span className="text-space-muted block mb-1">TELEMETRY ANOMALY:</span>
                <span className="text-space-coral font-bold">{activeIncidentModal.diagnosticData.telemetryAnomaly}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-space-dark/80 border border-space-border">
                <span className="text-space-muted block mb-1">AFFECTED METRICS:</span>
                <span className="text-space-light">{activeIncidentModal.diagnosticData.affectedResources.join(' • ')}</span>
              </div>
            </div>
          </div>

          {/* Educational Root-Cause Analysis: Why did it happen? */}
          <div className="p-4 rounded-xl bg-space-surface/90 border border-space-border/80 space-y-2">
            <div className="flex items-center space-x-2 text-space-amber font-mono text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>WHY DID THIS HAPPEN? (ROOT CAUSE ANALYSIS)</span>
            </div>
            <p className="text-xs text-space-light font-sans leading-relaxed">
              {activeIncidentModal.rootCause}
            </p>
            <div className="text-[11px] font-mono text-space-muted pt-1 border-t border-space-border/50">
              NASA Reference: <span className="text-space-cyan">{activeIncidentModal.diagnosticData.nasaReference}</span>
            </div>
          </div>

          {/* Remediation Options or Resolution Banner */}
          {isResolved ? (
            <div className="p-4 rounded-xl hud-panel-teal border border-space-teal/50 space-y-2">
              <div className="flex items-center space-x-2 text-space-teal font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>INCIDENT RESOLVED // SOL {activeIncidentModal.resolution?.solResolved}</span>
              </div>
              <p className="text-sm font-sans text-space-light">
                {activeIncidentModal.resolution?.outcomeSummary}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-mono text-space-light font-bold uppercase tracking-wider flex items-center justify-between">
                <span>SELECT ENGINEERING REMEDIATION OPTION:</span>
                <span className="text-space-muted font-normal text-[11px]">
                  Available: {config.credits} CR / {config.titaniumUnits} Ti
                </span>
              </div>

              <div className="space-y-3">
                {activeIncidentModal.options.map((opt) => {
                  const canAfford = config.credits >= opt.creditCost && config.titaniumUnits >= opt.titaniumCost;

                  return (
                    <div
                      key={opt.id}
                      className={`p-4 rounded-xl border transition-all text-left space-y-2 ${
                        canAfford
                          ? 'bg-space-dark/80 border-space-border hover:border-space-cyan/60 hover:bg-space-surface/90'
                          : 'bg-space-dark/40 border-space-border/30 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="font-display font-bold text-sm text-space-light">
                          {opt.label}
                        </div>
                        <div className="flex items-center space-x-3 text-xs font-mono">
                          {opt.creditCost > 0 && (
                            <span className="text-space-amber font-bold">{opt.creditCost} CR</span>
                          )}
                          {opt.titaniumCost > 0 && (
                            <span className="text-space-cyan font-bold">{opt.titaniumCost} Ti</span>
                          )}
                          <span className="text-space-teal font-bold">
                            {Math.round(opt.successProbability * 100)}% Success
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-space-muted font-sans leading-relaxed">
                        {opt.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-space-border/40">
                        <span className="text-[11px] font-mono text-space-muted">
                          Trade-off: <strong className="text-space-light">{opt.engineeringRationale}</strong>
                        </span>

                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => handleChooseOption(opt.id)}
                          className={`px-4 py-2 rounded-lg font-display text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-1.5 ${
                            canAfford
                              ? 'bg-space-cyan text-space-dark hover:bg-space-cyan/90 shadow-glow-cyan'
                              : 'bg-space-surface text-space-muted cursor-not-allowed'
                          }`}
                        >
                          <span>EXECUTE ACTION</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-space-dark/90 border-t border-space-border/60 flex items-center justify-between">
          <div className="text-[11px] font-mono text-space-muted">
            NASA Junior Astronaut Mission Trainer • Engineering Incident Management
          </div>

          <button
            onClick={closeIncidentModal}
            className="px-4 py-2 rounded-lg bg-space-surface hover:bg-space-surface/80 border border-space-border text-xs font-mono text-space-light transition-colors"
          >
            DISMISS HUD
          </button>
        </div>

      </div>
    </div>
  );
};
