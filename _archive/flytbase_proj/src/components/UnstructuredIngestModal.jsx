import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Sparkles, 
  Send, 
  X, 
  CheckCircle2, 
  AlertOctagon, 
  MessageSquare, 
  Bot, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function UnstructuredIngestModal() {
  const { 
    isIngestModalOpen, 
    setIsIngestModalOpen, 
    projects, 
    activeProjectId, 
    ingestUpdate, 
    sampleUnstructuredUpdates 
  } = useProject();

  const [selectedProjectId, setSelectedProjectId] = useState(activeProjectId);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!isIngestModalOpen) return null;

  const handleIngest = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const result = ingestUpdate(inputText, selectedProjectId);
      setParsedResult(result);
      setIsProcessing(false);
    }, 600);
  };

  const handleApplyPreset = (sample) => {
    setInputText(sample.rawText);
    setSelectedProjectId(sample.targetProjectId);
    setParsedResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-glow rounded-3xl w-full max-w-2xl p-6 sm:p-8 border border-red-500/40 bg-[#0B0F19] shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsIngestModalOpen(false);
            setParsedResult(null);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              AI Unstructured Update Ingestor ("Web-Crawler")
            </h3>
            <p className="text-xs text-slate-400">
              Transform unstructured chat, email replies, or call transcripts into structured project status automatically.
            </p>
          </div>
        </div>

        {/* Preset Sample Selector */}
        <div className="my-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
            ⚡ 1-Click Demo Scenarios (Select one to test):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleUnstructuredUpdates.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(sample)}
                className="text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all"
              >
                <div className="font-bold text-white text-[11px] flex items-center gap-1">
                  <span>▶</span> {sample.title}
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{sample.rawText}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleIngest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Target Project Deployment
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-950 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.clientLogo} {p.client} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Raw Unstructured Text Content
            </label>
            <textarea
              rows={4}
              required
              placeholder="Paste any messy communication (e.g. 'Hey Peter, Oscorp vibration test failed on Tower 3 helipad. Corridor clearance is blocked until dampeners are installed...')"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setParsedResult(null);
              }}
              className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              {isProcessing ? 'Analyzing sentiment & extracting deliverables...' : 'Ready to translate into project state.'}
            </span>

            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing NLP...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse & Apply to Project</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Parsed Result Feedback */}
        {parsedResult && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> AI Structure Extracted & Applied Successfully!
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-900/80 text-emerald-200 rounded">
                Sentiment: {parsedResult.sentiment.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Structured Executive Summary</span>
                <span className="text-white font-medium">{parsedResult.parsedSummary}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Extracted Action / State</span>
                <span className="text-cyan-300 font-mono">
                  {parsedResult.isBlocker ? '🚨 Marked Project as Blocked' : '✓ Milestone Movement Recorded'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setIsIngestModalOpen(false);
                  setParsedResult(null);
                  setInputText('');
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                View Updated Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
