import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { generateFollowUpDraft } from '../services/aiParser';
import { 
  Zap, 
  Send, 
  X, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

export default function SpiderNudgeModal() {
  const { 
    isNudgeModalOpen, 
    setIsNudgeModalOpen, 
    selectedStaleProject, 
    owners,
    ingestUpdate 
  } = useProject();

  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isNudgeModalOpen || !selectedStaleProject) return null;

  const draft = generateFollowUpDraft(selectedStaleProject, owners);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${draft.subject}\n\nTo: ${draft.to}\n\n${draft.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendNudge = () => {
    // Ingest simulated nudge response update into project
    ingestUpdate(
      `Spider-Sense Status Check requested by Delivery Lead. Client liaison acknowledged follow-up; scheduled technical review call for tomorrow morning.`,
      selectedStaleProject.id
    );

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsNudgeModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-glow rounded-3xl w-full max-w-xl p-6 border border-amber-500/40 bg-[#0B0F19] shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsNudgeModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Spider-Sense Proactive Status Nudger</span>
              <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                {selectedStaleProject.daysInactive}d Inactive
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Prevent delivery bottlenecks by sending an automated status check request.
            </p>
          </div>
        </div>

        {/* Draft Preview Box */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-sans">
          <div>
            <span className="text-slate-500 block text-[10px] font-mono">RECIPIENTS:</span>
            <span className="text-white font-medium">{draft.to}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] font-mono">SUBJECT:</span>
            <span className="text-cyan-400 font-bold">{draft.subject}</span>
          </div>

          <hr className="border-slate-800" />

          <div>
            <span className="text-slate-500 block text-[10px] font-mono mb-1">EMAIL BODY DRAFT:</span>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
              {draft.body}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Email Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleSendNudge}
            disabled={sentSuccess}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
          >
            {sentSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Nudge Dispatched!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Nudge to Stakeholders</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
