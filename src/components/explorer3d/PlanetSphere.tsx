import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LandingSite } from '../../types/mission';
import { createPlanetTexture, createPlanetBumpMap } from '../../utils/textureGenerators';

interface PlanetSphereProps {
  destination: 'moon' | 'mars';
  landingSites: LandingSite[];
  selectedSiteId: string;
  onSelectSite: (siteId: string) => void;
  autoRotate?: boolean;
}

// Converts spherical lat/lng coordinates to Cartesian 3D (x,y,z) on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export const PlanetSphere: React.FC<PlanetSphereProps> = ({
  destination,
  landingSites,
  selectedSiteId,
  onSelectSite,
  autoRotate = true
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const radius = 3.2;

  // Generate procedural texture & bump map
  const colorMap = useMemo(() => createPlanetTexture(destination), [destination]);
  const bumpMap = useMemo(() => createPlanetBumpMap(destination), [destination]);

  // Subtle natural orbital planetary rotation
  useFrame((_, delta) => {
    if (autoRotate && sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.04;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      {/* Planetary Body Mesh */}
      <mesh ref={sphereRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={destination === 'moon' ? 0.08 : 0.06}
          roughness={destination === 'moon' ? 0.88 : 0.80}
          metalness={0.08}
        />

        {/* Landing Site Beacons attached to the rotating sphere */}
        {landingSites.map((site) => {
          const pos = latLngToVector3(site.coordinates.lat, site.coordinates.lng, radius + 0.03);
          const isSelected = site.id === selectedSiteId;

          return (
            <group
              key={site.id}
              position={pos}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSite(site.id);
              }}
            >
              {/* Pulsing ring beacon */}
              <mesh>
                <ringGeometry args={[0.07, 0.12, 24]} />
                <meshBasicMaterial
                  color={isSelected ? '#42D9FF' : '#FFB547'}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={isSelected ? 0.95 : 0.65}
                />
              </mesh>

              {/* Center locator dot */}
              <mesh position={[0, 0, 0.02]}>
                <circleGeometry args={[0.04, 16]} />
                <meshBasicMaterial color={isSelected ? '#36E0C0' : '#FFFFFF'} />
              </mesh>
            </group>
          );
        })}
      </mesh>

      {/* Atmospheric Glow Shell (Only for Mars; Moon is vacuum) */}
      {destination === 'mars' && (
        <mesh ref={atmosphereRef} scale={[1.04, 1.04, 1.04]}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color="#e8804c"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
