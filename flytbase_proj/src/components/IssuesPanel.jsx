import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Bug, 
  Sparkles, 
  HelpCircle, 
  Headphones, 
  Wrench, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter,
  Eye,
  EyeOff,
  User,
  X
} from 'lucide-react';

export default function IssuesPanel({ project }) {
  const { addIssue, updateIssue, viewMode } = useProject();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Issue Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Bug');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newCustomerVisible, setNewCustomerVisible] = useState(true);
  const [newMilestoneId, setNewMilestoneId] = useState(project.milestones[0]?.id || '');
  const [newReportedBy, setNewReportedBy] = useState('Peter Parker');

  const categories = [
    { id: 'all', label: 'All Categories', icon: Filter },
    { id: 'Bug', label: 'Bug', icon: Bug, color: 'text-red-400', badge: 'bg-red-950/60 border-red-500/40 text-red-300' },
    { id: 'Feature Request', label: 'Feature Request', icon: Sparkles, color: 'text-purple-400', badge: 'bg-purple-950/60 border-purple-500/40 text-purple-300' },
    { id: 'Question', label: 'Question', icon: HelpCircle, color: 'text-amber-400', badge: 'bg-amber-950/60 border-amber-500/40 text-amber-300' },
    { id: 'Support', label: 'Support', icon: Headphones, color: 'text-blue-400', badge: 'bg-blue-950/60 border-blue-500/40 text-blue-300' },
    { id: 'Implementation', label: 'Implementation', icon: Wrench, color: 'text-cyan-400', badge: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' }
  ];

  const getCategoryBadge = (cat) => {
    const item = categories.find(c => c.id === cat) || categories[1];
    const Icon = item.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.badge}`}>
        <Icon className="w-3 h-3" />
        {cat}
      </span>
    );
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <span className="text-red-400 text-xs font-bold font-mono">▲ HIGH</span>;
      case 'Medium':
        return <span className="text-amber-400 text-xs font-bold font-mono">■ MED</span>;
      default:
        return <span className="text-slate-400 text-xs font-bold font-mono">▼ LOW</span>;
    }
  };

  // Filter issues
  const filteredIssues = (project?.issues || []).filter(issue => {
    if (viewMode === 'customer' && !issue.customerVisible) return false;
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    return true;
  });

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIssueObj = {
      id: `iss-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'Open',
      customerVisible: newCustomerVisible,
      linkedMilestone: newMilestoneId,
      reportedBy: newReportedBy,
      createdAt: new Date().toISOString()
    };

    addIssue(project.id, newIssueObj);
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Project Issues & Ticket Registry</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Taxonomy: Bug / Feature / Question / Support / Implementation
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'customer'
              ? 'Shared client tickets, inquiries, and customer-facing bug resolutions.'
              : 'Unified internal issue tracker linked directly to flight delivery milestones.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log New Ticket</span>
        </button>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => {
            const Icon = c.icon;
            const count = (project?.issues || []).filter(i => 
              (viewMode === 'internal' || i.customerVisible) && (c.id === 'all' || i.category === c.id)
            ).length;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === c.id
                    ? 'bg-slate-700 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{c.label}</span>
                <span className="text-[10px] font-mono text-slate-400">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by Status"
          className="bg-slate-900 text-xs text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-red-500"
        >
          <option value="all">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-white">No Issues Match Filters</h4>
            <p className="text-xs text-slate-400 mt-1">All tickets in this category are resolved or clear.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const linkedMs = project.milestones.find(m => m.id === issue.linkedMilestone);

            return (
              <div
                key={issue.id}
                className={`glass-panel rounded-xl p-4 border transition-all ${
                  issue.status === 'Resolved'
                    ? 'border-slate-800/80 bg-slate-900/30'
                    : issue.priority === 'High'
                    ? 'border-red-500/40 bg-red-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(issue.category)}
                      {getPriorityBadge(issue.priority)}
                      
                      {linkedMs && (
                        <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                          Linked: {linkedMs.title}
                        </span>
                      )}

                      {viewMode === 'internal' && (
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded flex items-center gap-1 ${
                          issue.customerVisible
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}>
                          {issue.customerVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                          {issue.customerVisible ? 'Customer Visible' : 'Internal Only'}
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-semibold text-white ${issue.status === 'Resolved' ? 'line-through text-slate-400' : ''}`}>
                      {issue.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Reported by: <strong className="text-slate-300">{issue.reportedBy}</strong></span>
                      <span>•</span>
                      <span>Logged: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Status update selector (in Internal mode) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {viewMode === 'internal' ? (
                      <select
                        value={issue.status}
                        onChange={(e) => updateIssue(project.id, issue.id, { status: e.target.value })}
                        aria-label="Update issue resolution status"
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          issue.status === 'Resolved'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                            : issue.status === 'Investigating'
                            ? 'bg-blue-950 text-cyan-300 border-blue-700'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                        issue.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                          : 'bg-blue-950 text-cyan-300 border-blue-700'
                      }`}>
                        {issue.status.toUpperCase()}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create New Issue */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel-glow rounded-2xl w-full max-w-lg p-6 border border-slate-700 bg-slate-900 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-400" /> Log Delivery Ticket / Issue
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Track bugs, questions, and feature requests tied to drone deployment milestones.
            </p>

            <form onSubmit={handleCreateIssue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ticket Summary / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telemetry packet loss in high humidity test"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Taxonomy Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                  >
                    <option value="Bug">Bug</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Question">Question</option>
                    <option value="Support">Support</option>
                    <option value="Implementation">Implementation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Blocker)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Linked Milestone</label>
                  <select
                    value={newMilestoneId}
                    onChange={(e) => setNewMilestoneId(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                  >
                    {project.milestones.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reported By</label>
                  <input
                    type="text"
                    value={newReportedBy}
                    onChange={(e) => setNewReportedBy(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="custVisible"
                  checked={newCustomerVisible}
                  onChange={(e) => setNewCustomerVisible(e.target.checked)}
                  className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="custVisible" className="text-slate-300">
                  Visible to Customer on Warp-Portal (Uncheck for internal engineering tickets)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-600/30"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
