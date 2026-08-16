import React from 'react';
import { useProject } from '../context/ProjectContext';
import { AlertCircle, Zap, Clock } from 'lucide-react';

export default function SpiderSenseBanner() {
  const { staleProjects, setIsNudgeModalOpen, setSelectedStaleProject, setActiveProjectId } = useProject();

  if (staleProjects.length === 0) return null;

  return (
    <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold text-zinc-200">
            Inactivity Alert:
          </span>
          <span className="text-zinc-400">
            {staleProjects.length} project(s) have no recorded status updates for &gt;5 days.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {staleProjects.map(proj => (
            <div key={proj.id} className="flex items-center gap-2 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              <span className="text-zinc-300 font-medium">{proj.client}</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1 rounded">
                {proj.daysInactive}d stale
              </span>
              <button
                onClick={() => {
                  setSelectedStaleProject(proj);
                  setIsNudgeModalOpen(true);
                }}
                className="text-[11px] font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-1.5 py-0.2 rounded transition-colors"
              >
                Send AI Nudge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
