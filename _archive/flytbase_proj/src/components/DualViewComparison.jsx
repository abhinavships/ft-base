import React from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  ShieldAlert, 
  Eye, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Users, 
  FileText, 
  Lock, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function DualViewComparison({ project }) {
  const { owners } = useProject();
  const projectOwners = (project.owners || []).map(oid => owners.find(o => o.id === oid)).filter(Boolean);

  // Internal data
  const internalMilestones = project.milestones;
  const internalIssues = project.issues;
  const internalDocs = project.documents;
  const internalUpdates = project.updates;

  // Customer data (Filtered)
  const customerMilestones = project.milestones.filter(m => m.customerVisible);
  const customerIssues = project.issues.filter(i => i.customerVisible);
  const customerDocs = project.documents.filter(d => d.customerVisible);
  const customerUpdates = project.updates.filter(u => u.customerVisible);

  return (
    <div className="space-y-6">
      
      {/* Dual Comparison Explainer Banner */}
      <div className="glass-panel-glow rounded-2xl p-5 border border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Side-by-Side Dual Synchronized Live Demo</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700">
                  Single Source of Truth
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Observe how the same underlying project state simultaneously surfaces in internal engineering consoles versus customer-facing warp-portals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-red-950/80 text-red-300 border border-red-500/40">
              Left: Internal Only Data
            </span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="px-2 py-1 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40">
              Right: Customer Sanitized
            </span>
          </div>
        </div>
      </div>

      {/* Split Screen 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: INTERNAL OPS VIEW */}
        <div className="glass-panel rounded-2xl p-5 border-2 border-red-500/40 bg-slate-950/90 shadow-xl space-y-5 relative">
          
          {/* Header Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest">
                  // Console: Spider-Lair Internal
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  Internal Ops View (Engineering & Ops)
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-700">
              Full Unrestricted Depth
            </span>
          </div>

          {/* Internal Notes & Costing Box */}
          <div className="bg-red-950/20 rounded-xl p-3.5 border border-red-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-red-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Confidential Internal Notes & Costing:
              </span>
              <span className="font-mono">{project.budget}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{project.internalNotes}"
            </p>
          </div>

          {/* Internal Milestones (Includes Internal-Only tasks) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                All Milestones & Engineering Subtasks ({internalMilestones.length})
              </span>
              <span className="text-[10px] font-mono text-red-400">Internal Checklist Included</span>
            </div>

            <div className="space-y-2">
              {internalMilestones.map(m => (
                <div key={m.id} className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[220px]">{m.title}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {m.status.toUpperCase()} ({m.completion}%)
                    </span>
                  </div>

                  {/* Tasks with visibility tags */}
                  <div className="space-y-1 pl-2 border-l border-slate-800">
                    {m.tasks.map(t => (
                      <div key={t.id} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="truncate max-w-[200px]">{t.title}</span>
                        <span className={`text-[9px] font-mono px-1 rounded ${
                          t.customerVisible 
                            ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {t.customerVisible ? 'Public' : '🔒 Internal'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Issues (Includes private support tickets) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                Internal Tickets & Vulnerabilities ({internalIssues.length})
              </span>
              <span className="text-[10px] font-mono text-red-400">Unfiltered</span>
            </div>

            <div className="space-y-1.5">
              {internalIssues.map(iss => (
                <div key={iss.id} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-cyan-400 rounded">
                      {iss.category}
                    </span>
                    <span className="text-white truncate">{iss.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">
                    {iss.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Activity Feed */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Raw Ingested Updates & Slack Feeds ({internalUpdates.length})
            </span>
            <div className="space-y-1.5">
              {internalUpdates.map(u => (
                <div key={u.id} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-white">{u.author} ({u.source})</span>
                    <span>{new Date(u.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">{u.summary}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CUSTOMER-FACING PORTAL VIEW */}
        <div className="glass-panel rounded-2xl p-5 border-2 border-blue-500/40 bg-slate-950/90 shadow-xl space-y-5 relative">
          
          {/* Header Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-blue-500/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                  // Portal: Client Warp-Portal
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  Customer-Facing Portal ({project.client})
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
              Curated Deliverables Only
            </span>
          </div>

          {/* Customer Summary Box */}
          <div className="bg-blue-950/20 rounded-xl p-3.5 border border-blue-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Executive Delivery Progress:
              </span>
              <span className="text-emerald-400">{project.progress}% Complete</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {project.customerSummary}
            </p>
          </div>

          {/* Customer Milestones (Only customerVisible = true) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                Public Flight Roadmap & Deliverables ({customerMilestones.length})
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Sanitized View</span>
            </div>

            <div className="space-y-2">
              {customerMilestones.map(m => (
                <div key={m.id} className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[220px]">{m.title}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      m.status === 'done'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                        : m.status === 'blocked'
                        ? 'bg-red-950 text-red-400 border border-red-700'
                        : 'bg-blue-950 text-cyan-300 border border-blue-700'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Public tasks only */}
                  <div className="space-y-1 pl-2 border-l border-slate-800">
                    {m.tasks.filter(t => t.customerVisible).map(t => (
                      <div key={t.id} className="flex items-center justify-between text-[11px] text-slate-300">
                        <span className="truncate max-w-[220px]">{t.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {t.status === 'done' ? '✓ Done' : 'In Flight'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Issues (Only customerVisible = true) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                Shared Ticket Inquiries ({customerIssues.length})
              </span>
              <span className="text-[10px] font-mono text-blue-400">Client Visible</span>
            </div>

            <div className="space-y-1.5">
              {customerIssues.map(iss => (
                <div key={iss.id} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-cyan-400 rounded">
                      {iss.category}
                    </span>
                    <span className="text-white truncate">{iss.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 shrink-0">
                    {iss.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Document Vault (Public docs only) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Customer Compliance & SOW Vault ({customerDocs.length} Files)
            </span>
            <div className="space-y-1.5">
              {customerDocs.map(doc => (
                <div key={doc.id} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-white truncate">{doc.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{doc.size}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
