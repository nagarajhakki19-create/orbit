export type BuildingType =
  | 'habitat'
  | 'solar'
  | 'greenhouse'
  | 'water'
  | 'comms'
  | 'eclss';

export interface BuildingBlueprint {
  type: BuildingType;
  name: string;
  category: 'Habitat & Command' | 'Power' | 'Life Support & Bio' | 'Storage & Logistics' | 'Communication';
  description: string;
  costCredits: number;
  costTitanium: number;
  powerDelta: number; // Positive = generates, Negative = consumes (kWh/day)
  waterDelta: number; // L/day or capacity
  oxygenDelta: number; // kg/day
  foodDelta: number; // kcal/day
  crewSupported: number;
  waterCapacity: number;
  batteryCapacity: number; // kWh
  footprintRadius: number;
  iconName: string;
  realWorldContext: string;
}

export interface PlacedBuilding {
  instanceId: string;
  type: BuildingType;
  x: number; // Grid x (-4 to 4)
  y: number; // Grid y (-4 to 4)
  rotation: number;
  condition: number; // 0 - 100%
  placedAtSol: number;
  isActive: boolean;
}

export interface GridCell {
  x: number;
  y: number;
  isOccupied: boolean;
  buildingId?: string;
  terrainType: 'regolith' | 'basalt' | 'permafrost';
}
