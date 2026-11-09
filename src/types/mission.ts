export type PlanetDestination = 'moon' | 'mars';

export type MissionDifficulty = 'cadet' | 'specialist' | 'commander';

export interface LandingSite {
  id: string;
  name: string;
  destination: PlanetDestination;
  coordinates: {
    lat: number;
    lng: number;
    display: string;
  };
  description: string;
  scientificValue: string;
  tempRange: string;
  sunlightExposure: string; // e.g. "92% Annual Solar Illumination"
  waterIceLikelihood: 'High' | 'Moderate' | 'Low' | 'Confirmed';
  terrainHazard: 'Low' | 'Moderate' | 'Extreme';
  recommendedStrategy: string;
  elevation: string;
  missionRelevance: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'Commander' | 'Life Support Engineer' | 'Power Systems Specialist' | 'Botanist / Astrobiologist' | 'Geologist';
  vitality: number; // 0 - 100
  morale: number;   // 0 - 100
  specialtyBonus: string;
}

export interface MissionConfig {
  destination: PlanetDestination;
  crewSize: number;
  missionDurationSols: number; // 30, 90, 180
  difficulty: MissionDifficulty;
  selectedLandingSiteId: string;
  missionName: string;
  credits: number;
  titaniumUnits: number;
}
