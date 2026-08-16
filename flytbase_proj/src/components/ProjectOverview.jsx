import React from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Users, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Search, 
  Filter,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export default function ProjectOverview({ onSelectProject }) {
  const { 
    projects, 
    owners, 
    searchTerm, 
    setSearchTerm, 
    filterOwner, 
    setFilterOwner, 
    filterStatus, 
    setFilterStatus, 
    filterHealth, 
    setFilterHealth,
    staleProjects,
    viewMode,
    setIsIngestModalOpen
  } = useProject();

  const totalProjects = projects.length;
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
  const blockedProjects = projects.filter(p => p.status === 'blocked' || p.health === 'blocked').length;
  const completedProjects = projects.filter(p => p.status === 'done').length;
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / (totalProjects || 1));

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOwner = filterOwner === 'all' || p.owners.includes(filterOwner);
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesHealth = filterHealth === 'all' || p.health === filterHealth;

    return matchesSearch && matchesOwner && matchesStatus && matchesHealth;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return (
          <span className="badge-clean bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'blocked':
        return (
          <span className="badge-clean bg-red-950/60 text-red-300 border border-red-800/50">
            <AlertOctagon className="w-3 h-3 text-red-400" /> Blocked
          </span>
        );
      case 'in_progress':
        return (
          <span className="badge-clean bg-zinc-800 text-cyan-300 border border-zinc-700">
            <Activity className="w-3 h-3 text-cyan-400" /> In Progress
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

  const getHealthDot = (health) => {
    switch (health) {
      case 'completed':
        return <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Healthy</span>;
      case 'on_track':
        return <span className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> On Track</span>;
      case 'at_risk':
        return <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> At Risk</span>;
      case 'blocked':
        return <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Blocked</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Project Delivery Portfolio
            </h1>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {viewMode === 'customer' ? 'Customer Portal' : 'Internal Delivery'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Track onboarding milestones, flight corridors, and docking deployments across multi-owner teams.
          </p>
        </div>

        <button
          onClick={() => setIsIngestModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold border border-zinc-700 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ingest Update</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card-clean rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Active Deployments</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalProjects}</span>
            <span className="text-xs text-zinc-500">projects</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            {inProgressProjects} active • {completedProjects} completed
          </span>
        </div>

        <div className="card-clean rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Average Progress</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400">{averageProgress}%</span>
            <span className="text-xs text-zinc-500">overall</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1 mt-2">
            <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${averageProgress}%` }} />
          </div>
        </div>

        <div className="card-clean rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Blocked Projects</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${blockedProjects > 0 ? 'text-red-400' : 'text-zinc-200'}`}>
              {blockedProjects}
            </span>
            <span className="text-xs text-zinc-500">halted</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            {blockedProjects > 0 ? 'Action items required' : 'All clear'}
          </span>
        </div>

        <div className="card-clean rounded-xl p-3.5">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-medium">Inactivity Alerts</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${staleProjects.length > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>
              {staleProjects.length}
            </span>
            <span className="text-xs text-zinc-500">&gt;5d idle</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            {staleProjects.length > 0 ? 'Status follow-up advised' : 'Recent activity'}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-clean rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 text-xs text-zinc-200 placeholder-zinc-500 rounded-lg pl-8 pr-3 py-1.5 border border-zinc-800 focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            aria-label="Filter by Owner"
            className="bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Owners</option>
            {owners.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by Status"
            className="bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Scoping</option>
            <option value="in_progress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filterHealth}
            onChange={(e) => setFilterHealth(e.target.value)}
            aria-label="Filter by Health"
            className="bg-zinc-950 text-xs text-zinc-300 border border-zinc-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Health</option>
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const projectOwnersList = project.owners.map(oid => owners.find(o => o.id === oid)).filter(Boolean);
          const isStale = project.daysInactive >= 5 && project.status !== 'done';

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="card-clean-hover rounded-xl p-5 cursor-pointer group space-y-4"
            >
              {/* Top Row: Client, Title & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl shrink-0">
                    {project.clientLogo}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                      {project.client}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {project.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {getStatusBadge(project.status)}
                  {getHealthDot(project.health)}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {viewMode === 'customer' ? project.customerSummary : project.description}
              </p>

              {/* Progress & Target */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Milestone Completion</span>
                  <span className="font-mono text-zinc-200">{project.progress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      project.status === 'blocked'
                        ? 'bg-red-500'
                        : project.status === 'done'
                        ? 'bg-emerald-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Footer: Owners & Date */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 text-[11px]">Owners:</span>
                  <div className="flex items-center -space-x-1.5">
                    {projectOwnersList.map(owner => (
                      <img
                        key={owner.id}
                        src={owner.avatar}
                        alt={owner.name}
                        title={`${owner.name} (${owner.role})`}
                        className="w-5 h-5 rounded-full object-cover border border-zinc-900"
                      />
                    ))}
                  </div>
                  <span className="text-zinc-400 text-[11px] hidden sm:inline ml-1">
                    {projectOwnersList.map(o => o.name.split(' ')[0]).join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isStale && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-800/40">
                      {project.daysInactive}d stale
                    </span>
                  )}
                  <span className="text-zinc-400 text-[11px] font-mono">
                    Target: {new Date(project.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-200 transform group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
