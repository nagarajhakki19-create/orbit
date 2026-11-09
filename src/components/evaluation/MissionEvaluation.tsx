import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useMissionStore } from '../../store/useMissionStore';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Wind, 
  Apple, 
  BookOpen, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const MissionEvaluation: React.FC = () => {
  const { evaluationReport, config, resetMission, setView } = useMissionStore();

  useEffect(() => {
    if (evaluationReport && evaluationReport.overallScorePercent >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // gracefully handle
      }
    }
  }, [evaluationReport]);

  if (!evaluationReport) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center font-mono">
        <p className="text-space-muted">No evaluation report generated yet.</p>
        <button
          onClick={() => setView('control')}
          className="mt-4 px-4 py-2 rounded-lg bg-space-cyan text-space-dark text-xs font-bold"
        >
          Return to Mission Control
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans text-left">
      
      {/* Header Banner */}
      <div className="hud-panel p-8 rounded-3xl border border-space-teal/50 shadow-[0_0_50px_rgba(54,224,192,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-mono text-space-teal uppercase tracking-widest flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>NASA JUNIOR ASTRONAUT EVALUATION REPORT</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-space-light mt-1">
            {evaluationReport.rankTitle}
          </h1>
          <div className="text-sm font-mono text-space-muted mt-2">
            Target: {evaluationReport.targetSol} Sols • Completed: {evaluationReport.finalSol} Sols • Status: <strong className="text-space-teal">{evaluationReport.survivalRating}</strong>
          </div>
        </div>

        {/* Big Score Radial Badge */}
        <div className="flex items-center space-x-4">
          <div className="relative w-28 h-28 rounded-full border-4 border-space-teal/40 bg-space-dark/80 flex flex-col items-center justify-center shadow-glow-teal">
            <span className="font-display font-black text-3xl text-space-light">
              {evaluationReport.overallScorePercent}%
            </span>
            <span className="text-[10px] font-mono text-space-teal uppercase tracking-wider">
              SCORE
            </span>
          </div>
        </div>
      </div>

      {/* 3 Core Scoring Factor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        
        <div className="hud-panel p-5 rounded-2xl border border-space-border/70 space-y-3">
          <div className="flex justify-between items-center text-space-muted">
            <span className="flex items-center space-x-1.5 text-space-cyan">
              <Wind className="w-4 h-4" />
              <span>LIFE SUPPORT EFFICIENCY</span>
            </span>
            <span className="text-space-light font-bold">{evaluationReport.lifeSupportEfficiency}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-2 overflow-hidden">
            <div className="bg-space-cyan h-full" style={{ width: `${evaluationReport.lifeSupportEfficiency}%` }} />
          </div>
          <p className="text-[11px] font-sans text-space-muted leading-relaxed">
            Measures closed-loop water distillation, Sabatier CO2 scrubbing, and O2 reserves maintenance.
          </p>
        </div>

        <div className="hud-panel p-5 rounded-2xl border border-space-border/70 space-y-3">
          <div className="flex justify-between items-center text-space-muted">
            <span className="flex items-center space-x-1.5 text-space-amber">
              <Zap className="w-4 h-4" />
              <span>POWER RESILIENCE</span>
            </span>
            <span className="text-space-light font-bold">{evaluationReport.powerResilienceScore}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-2 overflow-hidden">
            <div className="bg-space-amber h-full" style={{ width: `${evaluationReport.powerResilienceScore}%` }} />
          </div>
          <p className="text-[11px] font-sans text-space-muted leading-relaxed">
            Evaluates battery storage depth-of-discharge and solar array generation during darkness cycles.
          </p>
        </div>

        <div className="hud-panel p-5 rounded-2xl border border-space-border/70 space-y-3">
          <div className="flex justify-between items-center text-space-muted">
            <span className="flex items-center space-x-1.5 text-space-teal">
              <ShieldCheck className="w-4 h-4" />
              <span>ANOMALY RESOLUTION</span>
            </span>
            <span className="text-space-light font-bold">{evaluationReport.incidentHandlingScore}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-2 overflow-hidden">
            <div className="bg-space-teal h-full" style={{ width: `${evaluationReport.incidentHandlingScore}%` }} />
          </div>
          <p className="text-[11px] font-sans text-space-muted leading-relaxed">
            Assesses promptness, diagnostic accuracy, and engineering trade-offs during surface failures.
          </p>
        </div>

      </div>

      {/* Commendations & Engineering Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Commendations */}
        <div className="hud-panel p-6 rounded-2xl border border-space-border/80 space-y-4">
          <div className="flex items-center space-x-2 text-space-teal font-display font-bold text-sm tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>MISSION COMMENDATIONS</span>
          </div>
          <div className="space-y-2.5">
            {evaluationReport.commendations.map((c, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-space-dark/60 border border-space-border/60 text-xs font-sans text-space-light leading-relaxed flex items-start space-x-2">
                <span className="text-space-teal font-bold">•</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Lessons */}
        <div className="hud-panel p-6 rounded-2xl border border-space-border/80 space-y-4">
          <div className="flex items-center space-x-2 text-space-cyan font-display font-bold text-sm tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>POST-MORTEM ENGINEERING LESSONS</span>
          </div>
          <div className="space-y-2.5">
            {evaluationReport.engineeringLessons.map((l, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-space-dark/60 border border-space-border/60 text-xs font-sans text-space-muted leading-relaxed flex items-start space-x-2">
                <span className="text-space-cyan font-bold">•</span>
                <span className="text-space-light">{l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Action CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-space-border/60">
        <button
          onClick={resetMission}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-space-surface hover:bg-space-surface/80 border border-space-border text-space-light font-mono text-xs uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-space-cyan" />
          <span>RE-FLY MISSION / NEW SETUP</span>
        </button>

        <button
          onClick={() => setView('control')}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-space-cyan to-space-teal text-space-dark font-display font-bold text-xs uppercase tracking-wider hover:shadow-glow-cyan transition-all"
        >
          <span>REVIEW LIVE TELEMETRY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
