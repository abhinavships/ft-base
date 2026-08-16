import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { queryProjectState } from '../services/aiParser';
import { 
  Bot, 
  Search, 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Zap,
  CornerDownLeft
} from 'lucide-react';

export default function SpiderBotModal({ onSelectProject }) {
  const { 
    isSpiderBotOpen, 
    setIsSpiderBotOpen, 
    projects, 
    owners, 
    setActiveProjectId 
  } = useProject();

  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(() => 
    queryProjectState("Which projects are behind schedule?", projects, owners)
  );

  if (!isSpiderBotOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const result = queryProjectState(query, projects, owners);
    setQueryResult(result);
  };

  const handlePresetClick = (presetQuery) => {
    setQuery(presetQuery);
    const result = queryProjectState(presetQuery, projects, owners);
    setQueryResult(result);
  };

  const sampleQueries = [
    "Which projects are behind schedule?",
    "Show Gwen Stacy's active tasks",
    "Spider-Sense: Any stale projects?",
    "List all open delivery bugs",
    "Show completed projects"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-glow rounded-3xl w-full max-w-3xl p-6 sm:p-8 border border-cyan-500/40 bg-[#0A0F1D] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSpiderBotOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Spider-Bot Natural Language Query (NLQ)</span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                AI Knowledge Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Query cross-project delivery state, owner workloads, blockers, and schedules in plain English.
            </p>
          </div>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="relative mt-2">
          <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ask anything (e.g., 'which projects are behind schedule', 'show Peter Parker's blocked tasks')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-24 py-3.5 border border-cyan-500/30 focus:outline-none focus:border-cyan-400 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
          >
            <span>Query</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Preset Query Chips */}
        <div className="flex items-center gap-1.5 flex-wrap my-3">
          <span className="text-[11px] text-slate-500 font-medium">Quick Prompts:</span>
          {sampleQueries.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => handlePresetClick(prompt)}
              className="text-[11px] bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Results Display */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 mt-2">
          {queryResult && (
            <div className="space-y-3 animate-fadeIn">
              
              {/* Response Summary Header */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> {queryResult.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Live Real-Time Index
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {queryResult.summary}
                </p>
              </div>

              {/* Matched Projects List */}
              {queryResult.projects && queryResult.projects.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Matching Projects ({queryResult.projects.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {queryResult.projects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveProjectId(p.id);
                          onSelectProject(p.id);
                          setIsSpiderBotOpen(false);
                        }}
                        className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex items-start justify-between gap-2"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{p.clientLogo}</span>
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              {p.client}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{p.name}</p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <span className="text-cyan-400 font-bold">{p.progress}% done</span>
                            <span>•</span>
                            <span className={p.status === 'blocked' ? 'text-red-400' : 'text-slate-400'}>
                              {p.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Issues List (If applicable) */}
              {queryResult.issues && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Open Engineering Tickets ({queryResult.issues.length})
                  </span>
                  <div className="space-y-1.5">
                    {queryResult.issues.map((iss, iIdx) => (
                      <div key={iIdx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-red-400 font-mono text-[10px]">[{iss.priority}]</span>
                          <span className="text-white font-medium truncate">{iss.title}</span>
                          <span className="text-slate-500 text-[10px]">({iss.client})</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 shrink-0">
                          {iss.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Owner Tasks List (If applicable) */}
              {queryResult.owner && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                  <img
                    src={queryResult.owner.avatar}
                    alt={queryResult.owner.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {queryResult.owner.name} ({queryResult.owner.alias})
                    </h5>
                    <p className="text-[11px] text-slate-400">{queryResult.owner.role}</p>
                    <p className="text-[11px] text-cyan-400 mt-0.5">
                      Direct Email: {queryResult.owner.email}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
