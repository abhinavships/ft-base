import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Layers, 
  Bot, 
  Sparkles, 
  User, 
  ShieldAlert, 
  Eye, 
  X, 
  ArrowRight, 
  FileText, 
  Bug, 
  Compass,
  Command
} from 'lucide-react';

export default function CommandPaletteModal({ isOpen, onClose, onSelectProject }) {
  const { 
    projects, 
    activeProject, 
    setActiveProjectId, 
    viewMode, 
    setViewMode, 
    setIsSpiderBotOpen, 
    setIsIngestModalOpen,
    setIsAuthModalOpen 
  } = useProject();

  const { userProfiles, switchUser } = useAuth();
  const [search, setSearch] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = search.toLowerCase();

  const matchingProjects = projects.filter(p => 
    p.name.toLowerCase().includes(query) || p.client.toLowerCase().includes(query)
  );

  const matchingUsers = userProfiles.filter(u => 
    u.name.toLowerCase().includes(query) || u.role.toLowerCase().includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="card-clean rounded-2xl w-full max-w-xl border border-zinc-800 bg-[#0F1118] shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 gap-3">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, project name, persona, or question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button 
            onClick={() => onClose(false)}
            className="text-zinc-500 hover:text-zinc-300 text-xs px-1.5 py-0.5 rounded bg-zinc-800"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          
          {/* Quick Actions */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 px-3 font-semibold">Quick Actions</span>
            
            <button
              onClick={() => {
                setIsSpiderBotOpen(true);
                onClose(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Ask Spider-Bot Natural Language Query</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">NLQ</span>
            </button>

            <button
              onClick={() => {
                setIsIngestModalOpen(true);
                onClose(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ingest Unstructured Slack/Email Update</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">AI Ingest</span>
            </button>
          </div>

          {/* Perspective Switching */}
          <div className="space-y-1 pt-1 border-t border-zinc-800/80">
            <span className="text-[10px] font-mono uppercase text-zinc-500 px-3 font-semibold">Switch View Perspective</span>
            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                onClick={() => { setViewMode('internal'); onClose(false); }}
                className={`p-2 rounded-lg text-left border ${viewMode === 'internal' ? 'bg-zinc-800 border-zinc-600 text-white' : 'border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50'}`}
              >
                <div className="font-semibold text-xs">Internal Ops</div>
                <span className="text-[10px] text-zinc-500">Full logs & notes</span>
              </button>
              <button
                onClick={() => { setViewMode('customer'); onClose(false); }}
                className={`p-2 rounded-lg text-left border ${viewMode === 'customer' ? 'bg-blue-950 border-blue-700 text-blue-200' : 'border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50'}`}
              >
                <div className="font-semibold text-xs">Customer Portal</div>
                <span className="text-[10px] text-zinc-500">Sanitized view</span>
              </button>
              <button
                onClick={() => { setViewMode('dual'); onClose(false); }}
                className={`p-2 rounded-lg text-left border ${viewMode === 'dual' ? 'bg-purple-950 border-purple-700 text-purple-200' : 'border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50'}`}
              >
                <div className="font-semibold text-xs">Dual Demo</div>
                <span className="text-[10px] text-zinc-500">Side-by-side</span>
              </button>
            </div>
          </div>

          {/* Projects Navigation */}
          {matchingProjects.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-zinc-800/80">
              <span className="text-[10px] font-mono uppercase text-zinc-500 px-3 font-semibold">Navigate Projects</span>
              {matchingProjects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    onSelectProject(proj.id);
                    onClose(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{proj.clientLogo}</span>
                    <span className="font-semibold text-white truncate">{proj.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 shrink-0">{proj.progress}%</span>
                </button>
              ))}
            </div>
          )}

          {/* Persona Switching */}
          {matchingUsers.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-zinc-800/80">
              <span className="text-[10px] font-mono uppercase text-zinc-500 px-3 font-semibold">Switch User Persona</span>
              {matchingUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    if (user.roleType === 'client') setViewMode('customer');
                    onClose(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{user.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({user.role})</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Switch</span>
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
