import React from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  Sparkles, 
  Layers, 
  Eye, 
  ShieldAlert, 
  RotateCcw, 
  ChevronDown,
  User,
  Radio,
  Search,
  Command,
  Compass,
  FileDown,
  Lock
} from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, onOpenCommandPalette, onOpenRadar, onOpenExecutiveReport }) {
  const { 
    projects, 
    activeProject, 
    setActiveProjectId, 
    viewMode, 
    setViewMode, 
    setIsSpiderBotOpen, 
    setIsIngestModalOpen,
    setIsAuthModalOpen,
    resetToMockData 
  } = useProject();

  const { currentUser, isInternal, permissions } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/95 backdrop-blur-xl border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentTab('overview')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/80 flex items-center justify-center text-base shadow-sm group-hover:border-zinc-500 transition-colors">
                🕷️
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-bold text-sm text-white tracking-tight">
                    Spider-Sync
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.2 rounded border border-zinc-700/60">
                    FlytBase
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Autonomous Delivery
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('overview')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  currentTab === 'overview'
                    ? 'text-white bg-zinc-800/90 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                Portfolio ({projects.length})
              </button>
              <button
                onClick={() => setCurrentTab('detail')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  currentTab === 'detail'
                    ? 'text-white bg-zinc-800/90 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                Workspace
              </button>
            </nav>
          </div>

          {/* Center: Command Palette Trigger Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400" />
                <span>Search projects, tasks, or ask AI...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>
          </div>

          {/* Right: Mode Switcher & Unique Quick Actions */}
          <div className="flex items-center gap-2">
            
            {/* View Mode Segmented Control (Hidden or Locked for Client Personas) */}
            {isInternal ? (
              <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setViewMode('internal')}
                  title="Internal Ops View"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'internal'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Internal</span>
                </button>

                <button
                  onClick={() => setViewMode('customer')}
                  title="Customer Portal View"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'customer'
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-800/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Customer</span>
                </button>

                <button
                  onClick={() => setViewMode('dual')}
                  title="Side-by-Side Dual Demo"
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    viewMode === 'dual'
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Dual</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-mono">
                <Lock className="w-3 h-3 text-blue-400" />
                <span>Customer Portal (Read-Only)</span>
              </div>
            )}

            {/* StarkPort Live Radar Button */}
            <button
              onClick={onOpenRadar}
              title="Open Live Drone Fleet & Sky-Corridor Radar"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 text-xs font-medium transition-all"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span className="hidden xl:inline">Live Radar</span>
            </button>

            {/* Executive AI Report Generator */}
            <button
              onClick={onOpenExecutiveReport}
              title="Generate Executive C-Suite Briefing"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-300 text-xs font-medium transition-all"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">AI Briefing</span>
            </button>

            {/* Ingest Unstructured Button (Internal Only) */}
            {isInternal && (
              <button
                onClick={() => setIsIngestModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium border border-zinc-700 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Ingest</span>
              </button>
            )}

            {/* Role Switcher Avatar */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg text-xs transition-colors border ${
                isInternal 
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300' 
                  : 'bg-blue-950/80 hover:bg-blue-900/80 border-blue-700/60 text-blue-200'
              }`}
              title={`Switch user role (Currently: ${currentUser.name})`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-zinc-700"
              />
              <div className="flex flex-col text-left leading-none hidden sm:flex">
                <span className="font-semibold text-xs text-white truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-zinc-400 font-mono">
                  {currentUser.badge}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
