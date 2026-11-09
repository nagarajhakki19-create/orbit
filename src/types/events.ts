export type IncidentSeverity = 'advisory' | 'warning' | 'critical' | 'catastrophic';

export type AffectedSubsystem =
  | 'Power Grid'
  | 'ECLSS (Life Support)'
  | 'Water Reclamation'
  | 'Thermal Regulation'
  | 'Hydroponics & Food'
  | 'Structural Integrity'
  | 'Communications';

export interface RemediationOption {
  id: string;
  label: string;
  description: string;
  engineeringRationale: string;
  creditCost: number;
  titaniumCost: number;
  energyDrainKw: number;
  successProbability: number; // 0 - 1.0
  consequenceText: string;
}

export interface MissionIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  subsystem: AffectedSubsystem;
  solTriggered: number;
  headline: string;
  description: string;
  rootCause: string;
  diagnosticData: {
    telemetryAnomaly: string;
    affectedResources: string[];
    physicalPhenomenon: string;
    nasaReference: string;
  };
  options: RemediationOption[];
  resolution?: {
    chosenOptionId: string;
    success: boolean;
    outcomeSummary: string;
    solResolved: number;
  };
}

export interface MissionEvaluationReport {
  missionCompleted: boolean;
  finalSol: number;
  targetSol: number;
  overallScorePercent: number; // 0 to 100
  rankTitle: string;
  survivalRating: 'Flawless' | 'Nominal' | 'Marginal' | 'Catastrophic Abort';
  lifeSupportEfficiency: number; // 0 - 100
  powerResilienceScore: number;  // 0 - 100
  incidentHandlingScore: number; // 0 - 100
  resourceBufferRemaining: {
    oxygenKg: number;
    waterLiters: number;
    foodKcal: number;
    batteryKwh: number;
  };
  keyIncidentsFaced: string[];
  commendations: string[];
  engineeringLessons: string[];
}
