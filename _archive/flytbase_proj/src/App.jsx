import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Navbar from './components/Navbar';
import SpiderSenseBanner from './components/SpiderSenseBanner';
import ProjectOverview from './components/ProjectOverview';
import ProjectDetail from './components/ProjectDetail';
import DualViewComparison from './components/DualViewComparison';
import SpiderBotModal from './components/SpiderBotModal';
import UnstructuredIngestModal from './components/UnstructuredIngestModal';
import SpiderNudgeModal from './components/SpiderNudgeModal';
import RoleSwitcherModal from './components/RoleSwitcherModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import LiveRadarModal from './components/LiveRadarModal';
import ExecutiveReportModal from './components/ExecutiveReportModal';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('overview'); // 'overview' | 'detail'
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false);

  const { activeProject, setActiveProjectId, viewMode } = useProject();

  const handleSelectProject = (projectId) => {
    setActiveProjectId(projectId);
    setCurrentTab('detail');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-['Outfit',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenRadar={() => setIsRadarOpen(true)}
        onOpenExecutiveReport={() => setIsExecutiveReportOpen(true)}
      />

      {/* Inactivity Alert Banner (>5 days) */}
      <SpiderSenseBanner />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'dual' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <DualViewComparison project={activeProject} />
          </div>
        ) : currentTab === 'overview' ? (
          <ProjectOverview onSelectProject={handleSelectProject} />
        ) : (
          <ProjectDetail onBack={() => setCurrentTab('overview')} />
        )}
      </main>

      {/* Modals */}
      <CommandPaletteModal 
        isOpen={isCommandPaletteOpen}
        onClose={setIsCommandPaletteOpen}
        onSelectProject={handleSelectProject}
      />
      <LiveRadarModal 
        isOpen={isRadarOpen}
        onClose={setIsRadarOpen}
      />
      <ExecutiveReportModal 
        isOpen={isExecutiveReportOpen}
        onClose={setIsExecutiveReportOpen}
      />
      <SpiderBotModal onSelectProject={handleSelectProject} />
      <UnstructuredIngestModal />
      <SpiderNudgeModal />
      <RoleSwitcherModal />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-[#07080D] py-4 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-zinc-300 font-semibold">🕷️ Spider-Sync</span>
            <span>•</span>
            <span>FlytBase Autonomous Fleet Delivery Matrix</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> WebSockets Connected
            </span>
            <span>•</span>
            <span>Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">Cmd+K</kbd> for Command Palette</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainApp />
      </ProjectProvider>
    </AuthProvider>
  );
}
