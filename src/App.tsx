import React from 'react';
import { useMissionStore } from './store/useMissionStore';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { MissionSetup } from './components/setup/MissionSetup';
import { PlanetaryExplorer } from './components/explorer3d/PlanetaryExplorer';
import { OutpostBuilder } from './components/builder3d/OutpostBuilder';
import { MissionControl } from './components/dashboard/MissionControl';
import { MissionEvaluation } from './components/evaluation/MissionEvaluation';
import { FailureDetectiveModal } from './components/events/FailureDetectiveModal';

export const App: React.FC = () => {
  const { activeView } = useMissionStore();

  return (
    <div className="min-h-screen bg-space-dark text-space-light flex flex-col font-sans selection:bg-space-cyan selection:text-space-dark">
      {/* Central Mission Control Header */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <div className="flex-1 w-full">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'setup' && <MissionSetup />}
        {activeView === 'explorer' && <PlanetaryExplorer />}
        {activeView === 'builder' && <OutpostBuilder />}
        {activeView === 'control' && <MissionControl />}
        {activeView === 'evaluation' && <MissionEvaluation />}
      </div>

      {/* Global Mission Failure Detective Modal */}
      <FailureDetectiveModal />
    </div>
  );
};

export default App;
