import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  FileDown, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  CheckCircle2, 
  AlertOctagon, 
  TrendingUp,
  FileText
} from 'lucide-react';

export default function ExecutiveReportModal({ isOpen, onClose }) {
  const { activeProject, owners } = useProject();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activeProject) return null;

  const projectOwners = (activeProject.owners || []).map(oid => owners.find(o => o.id === oid)?.name).filter(Boolean);
  const doneMilestones = activeProject.milestones.filter(m => m.status === 'done');
  const blockedMilestones = activeProject.milestones.filter(m => m.status === 'blocked');
  const openIssues = activeProject.issues.filter(i => i.status !== 'Resolved');

  const reportDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const markdownReport = `# EXECUTIVE DELIVERY BRIEFING: ${activeProject.name.toUpperCase()}
**Client:** ${activeProject.client} | **Date:** ${reportDate} | **Delivery Health:** ${activeProject.health.toUpperCase()}

## 1. Executive Summary
${activeProject.customerSummary}

## 2. Key Metrics
- Overall Milestone Progress: ${activeProject.progress}%
- Completed Milestones: ${doneMilestones.length} / ${activeProject.milestones.length}
- Target Completion Date: ${new Date(activeProject.targetDate).toLocaleDateString()}
- Project Owners: ${projectOwners.join(', ')}

## 3. Milestones & Deliverables
${activeProject.milestones.map(m => `- [${m.status === 'done' ? 'X' : ' '}] **${m.title}** (${m.completion}%) - Due: ${m.dueDate}`).join('\n')}

## 4. Active Blockers & Risk Register
${blockedMilestones.length > 0 
  ? blockedMilestones.map(b => `- 🚨 **BLOCKER:** ${b.title}`).join('\n')
  : '- ✅ No critical flight path blockers detected.'}

## 5. Next 14-Day Delivery Horizon
- Complete scheduled autonomous flight trials and verify telemetry logging with customer NOC.
- Sign off on final site safety protocols and transition into operational SLA readiness.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="card-clean rounded-2xl w-full max-w-2xl p-6 border border-zinc-800 bg-[#0E1119] shadow-2xl relative max-h-[88vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              AI Executive Stakeholder Briefing
            </h3>
            <p className="text-xs text-zinc-400">
              One-click C-suite progress report generated for {activeProject.client}.
            </p>
          </div>
        </div>

        {/* Report Content Preview */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 space-y-3 whitespace-pre-wrap leading-relaxed shadow-inner">
          {markdownReport}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <FileText className="w-4 h-4 text-zinc-500" />
            <span>Format: Standard Markdown / C-Suite Brief</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold border border-zinc-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Briefing' : 'Copy Report'}</span>
            </button>

            <button
              onClick={() => {
                const blob = new Blob([markdownReport], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Executive-Briefing-${activeProject.client.replace(/\s+/g, '_')}.md`;
                a.click();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download .MD</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
