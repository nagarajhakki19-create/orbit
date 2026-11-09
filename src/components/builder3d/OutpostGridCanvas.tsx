import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PlacedBuilding, BuildingType } from '../../types/outpost';
import { createOutpostTerrainTexture } from '../../utils/textureGenerators';

interface OutpostGridCanvasProps {
  destination: 'moon' | 'mars';
  placedBuildings: PlacedBuilding[];
  selectedBuildingType: BuildingType | null;
  onPlaceBuilding: (x: number, y: number) => void;
  onRemoveBuilding: (instanceId: string) => void;
}

// 3D Model: Habitat Geodesic Dome
const HabitatMesh: React.FC<{ isSelected?: boolean }> = ({ isSelected }) => (
  <group>
    {/* Central Geodesic Dome */}
    <mesh position={[0, 0.45, 0]} castShadow>
      <sphereGeometry args={[0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
      <meshStandardMaterial
        color="#e4e8ef"
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
    {/* Foundation ring */}
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.6, 0.65, 0.1, 16]} />
      <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.4} />
    </mesh>
    {/* Airlock Vestibule */}
    <mesh position={[0.5, 0.2, 0]}>
      <boxGeometry args={[0.3, 0.28, 0.25]} />
      <meshStandardMaterial color="#4a5568" metalness={0.5} roughness={0.3} />
    </mesh>
    {/* Observation Viewport (Glowing Cyan) */}
    <mesh position={[0, 0.6, 0.35]}>
      <sphereGeometry args={[0.12, 12, 8]} />
      <meshBasicMaterial color="#42D9FF" />
    </mesh>
  </group>
);

// 3D Model: Dual Solar Tracking Array
const SolarMesh: React.FC = () => {
  const panelRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.35;
    }
  });

  return (
    <group>
      {/* Central Mast */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.8, 12]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Base mount */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.1, 8]} />
        <meshStandardMaterial color="#2d3748" metalness={0.7} />
      </mesh>
      {/* Rotating Solar Wings */}
      <group ref={panelRef} position={[0, 0.75, 0]}>
        {/* Left Wing */}
        <mesh position={[-0.45, 0, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.65, 0.02, 0.45]} />
          <meshStandardMaterial color="#0d2b45" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Right Wing */}
        <mesh position={[0.45, 0, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.65, 0.02, 0.45]} />
          <meshStandardMaterial color="#0d2b45" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

// 3D Model: Hydroponic Greenhouse Cylinder
const GreenhouseMesh: React.FC = () => (
  <group>
    {/* Base container */}
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.5, 0.55, 0.2, 16]} />
      <meshStandardMaterial color="#2d3748" metalness={0.7} />
    </mesh>
    {/* Translucent Bio-Dome Shell */}
    <mesh position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.45, 0.45, 0.6, 16]} />
      <meshPhysicalMaterial
        color="#9ae6b4"
        transmission={0.75}
        opacity={0.85}
        transparent
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
    {/* Interior Glowing Hydroponic Plant Canopy */}
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.3, 12]} />
      <meshBasicMaterial color="#36E0C0" />
    </mesh>
  </group>
);

// 3D Model: Cryogenic Water Storage Tanks
const WaterMesh: React.FC = () => (
  <group>
    {/* Base Frame */}
    <mesh position={[0, 0.06, 0]}>
      <boxGeometry args={[0.9, 0.12, 0.6]} />
      <meshStandardMaterial color="#2d3748" metalness={0.8} />
    </mesh>
    {/* Tank 1 */}
    <mesh position={[-0.22, 0.38, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 0.6, 16]} />
      <meshStandardMaterial color="#63b3ed" metalness={0.7} roughness={0.2} />
    </mesh>
    {/* Tank 2 */}
    <mesh position={[0.22, 0.38, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 0.6, 16]} />
      <meshStandardMaterial color="#63b3ed" metalness={0.7} roughness={0.2} />
    </mesh>
    {/* Connecting Cryo-Pipe */}
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.45, 0.05, 0.05]} />
      <meshStandardMaterial color="#cbd5e0" metalness={0.9} />
    </mesh>
  </group>
);

// 3D Model: Deep Space High-Gain Dish
const CommsMesh: React.FC = () => {
  const dishRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (dishRef.current) {
      dishRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group>
      {/* Pylon Lattice Tower */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.22, 0.9, 8]} />
        <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Rotating Parabolic Dish */}
      <group ref={dishRef} position={[0, 0.9, 0]}>
        <mesh rotation={[-0.6, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.05, 0.15, 16, 1, true]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* Sub-reflector Horn Feed */}
        <mesh position={[0, 0.15, -0.2]} rotation={[-0.6, 0, 0]}>
          <coneGeometry args={[0.05, 0.15, 8]} />
          <meshBasicMaterial color="#b794f4" />
        </mesh>
      </group>
    </group>
  );
};

// 3D Model: ECLSS Recycling Unit
const EclssMesh: React.FC = () => (
  <group>
    {/* Heavy Machinery Housing */}
    <mesh position={[0, 0.35, 0]} castShadow>
      <boxGeometry args={[0.8, 0.65, 0.65]} />
      <meshStandardMaterial color="#319795" metalness={0.6} roughness={0.4} />
    </mesh>
    {/* Sabatier Catalytic Columns */}
    <mesh position={[-0.22, 0.72, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
    </mesh>
    <mesh position={[0.22, 0.72, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
    </mesh>
    {/* Oxygen Pressure Valve (Glowing Teal) */}
    <mesh position={[0, 0.45, 0.34]}>
      <sphereGeometry args={[0.08, 12, 8]} />
      <meshBasicMaterial color="#36E0C0" />
    </mesh>
  </group>
);

export const OutpostGridCanvas: React.FC<OutpostGridCanvasProps> = ({
  destination,
  placedBuildings,
  selectedBuildingType,
  onPlaceBuilding,
  onRemoveBuilding
}) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const terrainTexture = useMemo(() => createOutpostTerrainTexture(destination), [destination]);

  // Grid bounds: -4 to 4 (spacing = 1.3 units)
  const gridSpacing = 1.35;
  const gridSize = 4;

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (!e.point) return;
    const gx = Math.round(e.point.x / gridSpacing);
    const gy = Math.round(e.point.z / gridSpacing);

    if (Math.abs(gx) <= gridSize && Math.abs(gy) <= gridSize) {
      setHoveredCell({ x: gx, y: gy });
    } else {
      setHoveredCell(null);
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!hoveredCell) return;

    const existing = placedBuildings.find(b => b.x === hoveredCell.x && b.y === hoveredCell.y);
    if (existing) {
      // Remove existing
      onRemoveBuilding(existing.instanceId);
    } else if (selectedBuildingType) {
      // Place selected
      onPlaceBuilding(hoveredCell.x, hoveredCell.y);
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 8, 8], fov: 42 }}
      gl={{ antialias: true }}
      className="w-full h-full cursor-pointer"
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <color attach="background" args={['#060A14']} />
      
      {/* Surface Lights */}
      <ambientLight intensity={destination === 'moon' ? 0.45 : 0.55} />
      <directionalLight
        position={[6, 12, 8]}
        intensity={destination === 'moon' ? 2.2 : 1.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 4, 0]} intensity={0.4} color="#42D9FF" />

      {/* Planetary Regolith Ground Plane */}
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          map={terrainTexture}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* Holographic Placement Grid Matrix */}
      <group position={[0, 0.01, 0]}>
        <gridHelper
          args={[gridSpacing * (gridSize * 2 + 1), (gridSize * 2 + 1), '#42D9FF', '#1E3250']}
        />
      </group>

      {/* Render Placed Modules */}
      {placedBuildings.map((building) => {
        const posX = building.x * gridSpacing;
        const posZ = building.y * gridSpacing;

        return (
          <group key={building.instanceId} position={[posX, 0, posZ]}>
            {building.type === 'habitat' && <HabitatMesh />}
            {building.type === 'solar' && <SolarMesh />}
            {building.type === 'greenhouse' && <GreenhouseMesh />}
            {building.type === 'water' && <WaterMesh />}
            {building.type === 'comms' && <CommsMesh />}
            {building.type === 'eclss' && <EclssMesh />}

            {/* Status Beacon Ring */}
            <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.55, 0.62, 16]} />
              <meshBasicMaterial color="#36E0C0" transparent opacity={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* Connection Conduits between adjacent placed modules */}
      {placedBuildings.map((b1, i) =>
        placedBuildings.slice(i + 1).map((b2) => {
          const dx = Math.abs(b1.x - b2.x);
          const dy = Math.abs(b1.y - b2.y);
          if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            const midX = ((b1.x + b2.x) / 2) * gridSpacing;
            const midZ = ((b1.y + b2.y) / 2) * gridSpacing;
            const isHorizontal = dy === 0;

            return (
              <mesh
                key={`conduit_${b1.instanceId}_${b2.instanceId}`}
                position={[midX, 0.04, midZ]}
                rotation={isHorizontal ? [0, 0, 0] : [0, Math.PI * 0.5, 0]}
              >
                <boxGeometry args={[gridSpacing * 0.75, 0.04, 0.12]} />
                <meshStandardMaterial color="#42D9FF" metalness={0.8} emissive="#42D9FF" emissiveIntensity={0.25} />
              </mesh>
            );
          }
          return null;
        })
      )}

      {/* Holographic Placement Cursor */}
      {hoveredCell && (
        <group position={[hoveredCell.x * gridSpacing, 0.05, hoveredCell.y * gridSpacing]}>
          {(() => {
            const isOccupied = placedBuildings.some(
              b => b.x === hoveredCell.x && b.y === hoveredCell.y
            );
            return (
              <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
                <planeGeometry args={[gridSpacing * 0.9, gridSpacing * 0.9]} />
                <meshBasicMaterial
                  color={isOccupied ? '#FF6B70' : '#42D9FF'}
                  transparent
                  opacity={0.35}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })()}
        </group>
      )}

      {/* Controls */}
      <OrbitControls
        maxPolarAngle={Math.PI * 0.44} // Prevent camera going below ground
        minDistance={3.5}
        maxDistance={18}
        dampingFactor={0.08}
      />
    </Canvas>
  );
};
