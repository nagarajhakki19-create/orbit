import { LandingSite } from '../types/mission';

export const LUNAR_LANDING_SITES: LandingSite[] = [
  {
    id: 'shackleton-crater',
    name: 'Shackleton Crater (South Pole)',
    destination: 'moon',
    coordinates: { lat: -89.9, lng: 0.0, display: '89.9°S, 0.0°E' },
    description: 'A 21 km impact crater situated exactly at the lunar South Pole. Its rims receive near-permanent solar illumination, while its permanently shadowed interior traps billions of tons of ancient water ice.',
    scientificValue: 'Water-ice extraction for hydrogen-oxygen rocket propellant and crew life support.',
    tempRange: '-238°C (interior shadow) to -10°C (rim peaks)',
    sunlightExposure: '86% - 92% Continuous Sunlight (Peaks of Eternal Light)',
    waterIceLikelihood: 'Confirmed',
    terrainHazard: 'Moderate',
    elevation: 'Rim: +1,200m | Basin: -4,200m',
    missionRelevance: 'NASA Artemis Base Camp primary designated reconnaissance target.',
    recommendedStrategy: 'Position solar PV arrays along elevated rim crests; deploy robotic cold-trap ice miners into floor depression.'
  },
  {
    id: 'oceanus-procellarum',
    name: 'Oceanus Procellarum (Ocean of Storms)',
    destination: 'moon',
    coordinates: { lat: 18.4, lng: -57.4, display: '18.4°N, 57.4°W' },
    description: 'The vast lunar mare basalt plain on the western edge of the near side. Contains volcanic rilles, mare ridges, and extensive thorium-rich KREEP terrain.',
    scientificValue: 'Studying late-stage lunar thermal evolution and basaltic lava tube sheltering.',
    tempRange: '-130°C (lunar night) to +120°C (lunar noon)',
    sunlightExposure: '50% (14 Earth days daylight, 14 Earth days darkness)',
    waterIceLikelihood: 'Low',
    terrainHazard: 'Low',
    elevation: '-1,400m average mare floor',
    missionRelevance: 'Apollo 12 and Chang\'e 5 sample return region.',
    recommendedStrategy: 'Requires high battery capacity to survive the 354-hour lunar night cycle.'
  },
  {
    id: 'mare-tranquillitatis',
    name: 'Mare Tranquillitatis (Sea of Tranquility)',
    destination: 'moon',
    coordinates: { lat: 8.5, lng: 31.4, display: '8.5°N, 31.4°E' },
    description: 'Historic landing zone of Apollo 11. Known for titanium-rich ilmenite minerals (FeTiO3) that can be processed using thermochemical hydrogen reduction to yield elemental oxygen.',
    scientificValue: 'In-situ resource extraction of oxygen and construction iron from ilmenite.',
    tempRange: '-125°C to +115°C',
    sunlightExposure: '50% (Diurnal 28 Earth day cycle)',
    waterIceLikelihood: 'Low',
    terrainHazard: 'Low',
    elevation: '-2,100m smooth basalt',
    missionRelevance: 'Historic heritage site & primary titanium regolith smelting testing zone.',
    recommendedStrategy: 'Pair life support electrolysis systems directly with ilmenite processing units.'
  },
  {
    id: 'malapert-mountain',
    name: 'Malapert Mountain (Connecting Ridge)',
    destination: 'moon',
    coordinates: { lat: -85.0, lng: 0.0, display: '85.0°S, 0.0°E' },
    description: 'A 5,000-meter elevated massif near the South Pole. Provides unbroken line-of-sight communication with Deep Space Network tracking stations on Earth.',
    scientificValue: 'High-gain deep space optical telemetry relay and solar power generation.',
    tempRange: '-60°C to +5°C (moderate polar crest)',
    sunlightExposure: '93% quasi-continuous solar tracking',
    waterIceLikelihood: 'Moderate',
    terrainHazard: 'Moderate',
    elevation: '+5,100m above datum',
    missionRelevance: 'Prime communications backbone for all lunar circumpolar expedition surface sorties.',
    recommendedStrategy: 'Ideal site for high-gain communications dishes and concentrated solar collector arrays.'
  }
];

export const MARS_LANDING_SITES: LandingSite[] = [
  {
    id: 'jezero-crater',
    name: 'Jezero Crater (Ancient Delta)',
    destination: 'mars',
    coordinates: { lat: 18.38, lng: 77.58, display: '18.38°N, 77.58°E' },
    description: 'An ancient 45-km impact crater hosting an ancient river-lake system with fan-shaped sedimentary delta deposits rich in clay minerals that can preserve biosignatures.',
    scientificValue: 'Astrobiology, fossilized prebiotic biosignatures, and hydrated clay minerals.',
    tempRange: '-90°C (winter night) to +20°C (summer midday)',
    sunlightExposure: '100% Sol cycle (~24.6 hour diurnal period)',
    waterIceLikelihood: 'Moderate',
    terrainHazard: 'Moderate',
    elevation: '-2,500m (dense Martian atmospheric column helps aero-braking)',
    missionRelevance: 'Landing site of NASA Perseverance rover & Ingenuity helicopter.',
    recommendedStrategy: 'Utilize dense sedimentary delta flats for stable habitat foundations and greenhouse moisture traps.'
  },
  {
    id: 'gale-crater',
    name: 'Gale Crater (Mount Sharp / Aeolis Mons)',
    destination: 'mars',
    coordinates: { lat: -5.4, lng: 137.8, display: '5.4°S, 137.8°E' },
    description: 'A 154-km wide crater featuring Mount Sharp rising 5.5 km above the crater floor. Layers of sulfate and clay minerals reveal 3.5 billion years of Martian climatic transition.',
    scientificValue: 'Deciphering Mars environmental drying timeline from habitable lakes to cold hyper-arid desert.',
    tempRange: '-85°C to +15°C',
    sunlightExposure: 'Equatorial maximum (~24.6h sol)',
    waterIceLikelihood: 'Low',
    terrainHazard: 'Moderate',
    elevation: '-4,500m (crater floor)',
    missionRelevance: 'Explored continuously by NASA Curiosity rover since August 2012.',
    recommendedStrategy: 'Leverage rich sulfate soils for experimental crop cultivation once perchlorates are leached.'
  },
  {
    id: 'olympus-mons-base',
    name: 'Olympus Mons (Eastern Aureole Basal Scarp)',
    destination: 'mars',
    coordinates: { lat: 18.65, lng: 226.2, display: '18.65°N, 133.8°W' },
    description: 'The base of the tallest planetary volcano in our Solar System (21.9 km high). Surrounded by sheer 8-km scarps and massive basalt lava tubes capable of housing entire subterranean cities safe from cosmic radiation.',
    scientificValue: 'Subterranean lava tube colonization, volcanic stratigraphy, and geothermal structural sheltering.',
    tempRange: '-100°C to -10°C',
    sunlightExposure: 'High solar insolation, subject to seasonal lee-wave dust clouds',
    waterIceLikelihood: 'Moderate',
    terrainHazard: 'Extreme',
    elevation: '+3,000m to +8,000m scarp foothills',
    missionRelevance: 'Ultimate candidate for natural human radiation shielding against galactic cosmic rays (GCRs).',
    recommendedStrategy: 'Prioritize structural reinforcement and deploy habitats inside volcanic lava tube entrances.'
  },
  {
    id: 'utopia-planitia',
    name: 'Utopia Planitia (Vast Glacial Sheet)',
    destination: 'mars',
    coordinates: { lat: 46.7, lng: 117.5, display: '46.7°N, 117.5°E' },
    description: 'A colossal impact basin containing an immense subsurface deposit of water-ice estimated to hold as much water as Lake Superior, shielded beneath 1 to 10 meters of regolith.',
    scientificValue: 'Direct sub-surface pure water ice extraction for industrial-scale propellant production.',
    tempRange: '-120°C to -25°C',
    sunlightExposure: 'Subject to intense northern seasonal lighting variations',
    waterIceLikelihood: 'Confirmed',
    terrainHazard: 'Low',
    elevation: '-4,100m flat plain',
    missionRelevance: 'Viking 2 landing site (1976) & Zhurong rover (2021). Primary target for ISRU water plants.',
    recommendedStrategy: 'Construct cryogenic water extraction drills early to establish massive fuel and ECLSS buffers.'
  }
];

export const ALL_LANDING_SITES = [...LUNAR_LANDING_SITES, ...MARS_LANDING_SITES];
