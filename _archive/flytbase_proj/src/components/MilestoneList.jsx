import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  ChevronDown, 
  ChevronRight, 
  User, 
  Calendar, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Plus, 
  Activity,
  Check
} from 'lucide-react';

export default function MilestoneList({ project }) {
  const { owners, updateTaskStatus, updateMilestoneStatus, viewMode } = useProject();
  const [expandedMilestones, setExpandedMilestones] = useState(
    project?.milestones ? project.milestones.map(m => m.id) : []
  );

  const toggleExpand = (milestoneId) => {
    setExpandedMilestones(prev => 
      prev.includes(milestoneId) ? prev.filter(id => id !== milestoneId) : [...prev, milestoneId]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'blocked':
        return <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />;
      case 'in_progress':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
      case 'blocked':
        return 'bg-red-950/60 border-red-500/40 text-red-300';
      case 'in_progress':
        return 'bg-blue-950/60 border-cyan-500/40 text-cyan-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  // Filter tasks based on view mode (Internal vs Customer)
  const visibleMilestones = project.milestones.filter(m => {
    if (viewMode === 'customer') return m.customerVisible;
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Implementation Milestones & Task Breakdown</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {visibleMilestones.length} Milestones
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {viewMode === 'customer' 
              ? "Verified customer deliverables and progress roadmaps."
              : "Full engineering task breakdown including internal architecture & compliance checklist."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setExpandedMilestones(project.milestones.map(m => m.id))}
            className="text-slate-400 hover:text-slate-200 underline"
          >
            Expand All
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setExpandedMilestones([])}
            className="text-slate-400 hover:text-slate-200 underline"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Milestones Accordion */}
      <div className="space-y-3">
        {visibleMilestones.map((milestone) => {
          const isExpanded = expandedMilestones.includes(milestone.id);
          const tasks = milestone.tasks || [];
          const visibleTasks = tasks.filter(t => viewMode === 'internal' || t.customerVisible);

          return (
            <div
              key={milestone.id}
              className={`glass-panel rounded-2xl border transition-all ${
                milestone.status === 'blocked'
                  ? 'border-red-500/40 bg-red-950/10'
                  : milestone.status === 'done'
                  ? 'border-emerald-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Milestone Header */}
              <div 
                onClick={() => toggleExpand(milestone.id)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-800/30 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button className="text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-2 min-w-0">
                    {getStatusIcon(milestone.status)}
                    <h4 className="text-sm font-bold text-white truncate">
                      {milestone.title}
                    </h4>
                  </div>

                  {/* Internal Only Indicator */}
                  {viewMode === 'internal' && !milestone.customerVisible && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Internal Only
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Due date */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Due: {new Date(milestone.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>

                  {/* Status Dropdown (Internal view can update) */}
                  {viewMode === 'internal' ? (
                    <select
                      value={milestone.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateMilestoneStatus(project.id, milestone.id, e.target.value)}
                      aria-label="Update milestone status"
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusClass(milestone.status)}`}
                    >
                      <option value="open">OPEN</option>
                      <option value="in_progress">IN PROGRESS</option>
                      <option value="blocked">BLOCKED</option>
                      <option value="done">DONE</option>
                    </select>
                  ) : (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getStatusClass(milestone.status)}`}>
                      {milestone.status.toUpperCase()}
                    </span>
                  )}

                  {/* Completion percentage */}
                  <span className="text-xs font-mono font-bold text-slate-300 w-10 text-right">
                    {milestone.completion}%
                  </span>
                </div>
              </div>

              {/* Expanded Tasks List */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Action Tasks ({visibleTasks.filter(t => t.status === 'done').length}/{visibleTasks.length} Done)
                  </div>

                  {visibleTasks.map((task) => {
                    const taskOwner = owners.find(o => o.id === task.assignee);

                    return (
                      <div
                        key={task.id}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                          task.status === 'done'
                            ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                            : task.status === 'blocked'
                            ? 'bg-red-950/30 border-red-500/40 text-red-200'
                            : 'bg-slate-900/90 border-slate-700/60 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Task Checkbox (Click to toggle Done/In Progress) */}
                          <button
                            onClick={() => {
                              const next = task.status === 'done' ? 'in_progress' : 'done';
                              updateTaskStatus(project.id, milestone.id, task.id, next);
                            }}
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              task.status === 'done'
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : task.status === 'blocked'
                                ? 'bg-red-600/30 border-red-500 text-red-400'
                                : 'border-slate-600 hover:border-cyan-400'
                            }`}
                          >
                            {task.status === 'done' && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>

                          <span className={`truncate ${task.status === 'done' ? 'line-through text-slate-500' : 'font-medium'}`}>
                            {task.title}
                          </span>

                          {/* Visibility badge in Internal view */}
                          {viewMode === 'internal' && (
                            <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
                              task.customerVisible 
                                ? 'bg-blue-950/60 text-blue-300 border border-blue-800/50'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                            }`}>
                              {task.customerVisible ? 'Public' : 'Internal Only'}
                            </span>
                          )}
                        </div>

                        {/* Assignee & Status changer */}
                        <div className="flex items-center gap-3 shrink-0">
                          {taskOwner && (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <img
                                src={taskOwner.avatar}
                                alt={taskOwner.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span className="hidden md:inline text-[11px]">{taskOwner.name.split(' ')[0]}</span>
                            </div>
                          )}

                          {/* Interactive Status Selector */}
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(project.id, milestone.id, task.id, e.target.value)}
                            aria-label="Update task status"
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                              task.status === 'done'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                                : task.status === 'blocked'
                                ? 'bg-red-950 text-red-400 border-red-700'
                                : task.status === 'in_progress'
                                ? 'bg-blue-950 text-cyan-300 border-blue-700'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
