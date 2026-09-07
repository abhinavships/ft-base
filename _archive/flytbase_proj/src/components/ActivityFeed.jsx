import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Activity, 
  Sparkles, 
  Send, 
  Clock, 
  MessageSquare, 
  AlertOctagon, 
  CheckCircle2, 
  Tag, 
  Eye, 
  EyeOff, 
  FileText, 
  ChevronRight,
  Code
} from 'lucide-react';

export default function ActivityFeed({ project }) {
  const { ingestUpdate, viewMode, sampleUnstructuredUpdates } = useProject();
  const [inputText, setInputText] = useState('');
  const [expandedRawId, setExpandedRawId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const updates = (project?.updates || []).filter(u => {
    if (viewMode === 'customer') return u.customerVisible;
    return true;
  });

  const handleSendUpdate = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      ingestUpdate(inputText, project.id);
      setInputText('');
      setIsProcessing(false);
    }, 400);
  };

  const handleApplyPreset = (sample) => {
    setInputText(sample.rawText);
  };

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'blocker':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-950/80 text-red-300 border border-red-500/40 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> BLOCKER DETECTED
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
            ▲ ATTENTION
          </span>
        );
      case 'positive':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> POSITIVE MOVEMENT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-900 text-slate-400 border border-slate-700">
            STATUS UPDATE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Project Status Timeline & Activity Ingestion</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              AI NLP Structured Stream
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'customer'
              ? 'Real-time verified operational updates and delivery milestones.'
              : 'Automated ingestion pipeline translating messy chat & email logs into structured state.'}
          </p>
        </div>
      </div>

      {/* Ingestion Box (Active in Internal Ops mode) */}
      {viewMode === 'internal' && (
        <div className="glass-panel rounded-2xl p-4 border border-red-500/30 bg-slate-900/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                Live Unstructured Text Ingestor (Chat / Email / Call Notes)
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              Auto-Extracts Milestones & Blockers
            </span>
          </div>

          <form onSubmit={handleSendUpdate} className="space-y-2">
            <textarea
              rows={3}
              placeholder="Paste raw Slack message, email reply, or call notes here (e.g. 'Hey Peter, weather tests passed, docking accuracy 99%. Ready to begin 24hr trial')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {/* Preset Sample Quick Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500 font-medium">Quick Demo Inputs:</span>
                {sampleUnstructuredUpdates.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(sample)}
                    className="text-[10px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded-lg border border-slate-700 transition-colors truncate max-w-[150px]"
                    title={sample.rawText}
                  >
                    {sample.title}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition-all ml-auto"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin text-sm">🕷️</span>
                    <span>Parsing AI Structure...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Ingest & Update Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {updates.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center border border-slate-800">
            <Clock className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No activity recorded for this project yet.</p>
          </div>
        ) : (
          updates.map((update) => {
            const isRawExpanded = expandedRawId === update.id;

            return (
              <div key={update.id} className="relative group">
                {/* Timeline node */}
                <div className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                  update.sentiment === 'blocker'
                    ? 'bg-red-500'
                    : update.sentiment === 'positive'
                    ? 'bg-emerald-500'
                    : 'bg-cyan-500'
                }`} />

                {/* Card */}
                <div className={`glass-panel rounded-2xl p-4 border transition-all ${
                  update.sentiment === 'blocker'
                    ? 'border-red-500/40 bg-red-950/15'
                    : 'border-slate-800 hover:border-slate-700'
                }`}>
                  
                  {/* Top Bar: Author, Source, Sentiment, Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{update.author}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-900 text-cyan-400 border border-slate-800 rounded">
                        {update.source}
                      </span>
                      {getSentimentBadge(update.sentiment)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(update.timestamp).toLocaleString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>

                      {viewMode === 'internal' && (
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                          update.customerVisible
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        }`}>
                          {update.customerVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                          {update.customerVisible ? 'Public' : 'Internal'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Structured Summary */}
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {update.summary}
                  </p>

                  {/* Tags */}
                  {update.tags && update.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {update.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 bg-slate-900/90 text-slate-300 border border-slate-800 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Raw Unstructured Log Accordion (For engineering auditing) */}
                  {update.rawText && viewMode === 'internal' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                      <button
                        onClick={() => setExpandedRawId(isRawExpanded ? null : update.id)}
                        className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        <Code className="w-3 h-3 text-red-400" />
                        <span>{isRawExpanded ? 'Hide Raw Ingested Message' : 'Inspect Raw Ingested Source Snippet'}</span>
                      </button>

                      {isRawExpanded && (
                        <div className="mt-2 p-2.5 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {update.rawText}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
