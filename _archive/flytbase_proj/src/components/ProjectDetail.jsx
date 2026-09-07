import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import MilestoneList from './MilestoneList';
import KanbanBoard from './KanbanBoard';
import IssuesPanel from './IssuesPanel';
import ActivityFeed from './ActivityFeed';
import DocumentVault from './DocumentVault';
import DualViewComparison from './DualViewComparison';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Activity, 
  Users, 
  Calendar, 
  DollarSign, 
  Layers, 
  LayoutGrid, 
  Bug, 
  MessageSquare, 
  FileText, 
  ShieldAlert, 
  Eye, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function ProjectDetail({ onBack }) {
  const { 
    activeProject, 
    owners, 
    viewMode, 
    setIsIngestModalOpen 
  } = useProject();

  const { isInternal } = useAuth();
  const [activeTab, setActiveTab] = useState('milestones');

  if (!activeProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-zinc-400">
        No project selected.
      </div>
    );
  }

  const projectOwners = (activeProject.owners || []).map(oid => owners.find(o => o.id === oid)).filter(Boolean);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return (
          <span className="badge-clean bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" /> Done / Live
          </span>
        );
      case 'blocked':
        return (
          <span className="badge-clean bg-red-950/60 text-red-300 border border-red-800/50">
            <AlertOctagon className="w-3 h-3 text-red-400" /> Blocked Deployment
          </span>
        );
      case 'in_progress':
        return (
          <span className="badge-clean bg-zinc-800 text-cyan-300 border border-zinc-700">
            <Activity className="w-3 h-3 text-cyan-400" /> In Active Delivery
          </span>
        );
      default:
        return (
          <span className="badge-clean bg-zinc-900 text-zinc-400 border border-zinc-800">
            <Clock className="w-3 h-3" /> Scoping
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center gap-2">
          {viewMode === 'customer' ? (
            <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">
              Customer Portal View
            </span>
          ) : viewMode === 'dual' ? (
            <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">
              Dual Synchronized Mode
            </span>
          ) : (
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
              Internal Ops View
            </span>
          )}
        </div>
      </div>

      {/* Project Header Banner Card */}
      <div className="card-clean rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* Left: Info */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shrink-0">
                {activeProject.clientLogo}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {activeProject.client}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {activeProject.id}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                  {activeProject.name}
                </h1>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {viewMode === 'customer' ? activeProject.customerSummary : activeProject.description}
            </p>

            {/* Internal Notes (Internal View only) */}
            {viewMode === 'internal' && activeProject.internalNotes && (
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-300">Internal Delivery Notes: </span>
                  <span>{activeProject.internalNotes}</span>
                </div>
              </div>
            )}

            {/* Owners */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-zinc-500">Owners:</span>
              {projectOwners.map((owner) => (
                <div
                  key={owner.id}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg text-xs"
                >
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-zinc-300 font-medium">{owner.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">({owner.badge})</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Status, Progress & Metrics */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 min-w-[240px] space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Status</span>
              {getStatusBadge(activeProject.status)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Progress</span>
                <span className="font-mono font-bold text-white">{activeProject.progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    activeProject.status === 'blocked'
                      ? 'bg-red-500'
                      : activeProject.status === 'done'
                      ? 'bg-emerald-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${activeProject.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 text-xs space-y-1 text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Target Delivery:</span>
                <span className="font-mono text-zinc-200">
                  {new Date(activeProject.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {viewMode === 'internal' && activeProject.budget && (
                <div className="flex items-center justify-between">
                  <span>Internal Budget:</span>
                  <span className="font-mono text-zinc-200">{activeProject.budget}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'milestones'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Milestones & Tasks</span>
            <span className="text-[10px] font-mono text-zinc-400">({activeProject.milestones.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'kanban'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'issues'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Issues Registry</span>
            <span className="text-[10px] font-mono text-zinc-400">({activeProject.issues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'activity'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Activity Stream</span>
            <span className="text-[10px] font-mono text-zinc-400">({activeProject.updates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'vault'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Vault</span>
            <span className="text-[10px] font-mono text-zinc-400">({activeProject.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'dual'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Dual Live Demo</span>
          </button>
        </div>

        <button
          onClick={() => setIsIngestModalOpen(true)}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ingest Update</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-1">
        {activeTab === 'milestones' && <MilestoneList project={activeProject} />}
        {activeTab === 'kanban' && <KanbanBoard project={activeProject} />}
        {activeTab === 'issues' && <IssuesPanel project={activeProject} />}
        {activeTab === 'activity' && <ActivityFeed project={activeProject} />}
        {activeTab === 'vault' && <DocumentVault project={activeProject} />}
        {activeTab === 'dual' && <DualViewComparison project={activeProject} />}
      </div>

    </div>
  );
}
