import React from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Activity, 
  User, 
  Calendar, 
  ArrowRight,
  EyeOff
} from 'lucide-react';

export default function KanbanBoard({ project }) {
  const { owners, updateTaskStatus, viewMode } = useProject();

  // Extract all tasks with milestone info
  const allTasks = (project?.milestones || []).flatMap(ms => 
    (ms.tasks || []).map(task => ({
      ...task,
      milestoneId: ms.id,
      milestoneTitle: ms.title
    }))
  ).filter(t => viewMode === 'internal' || t.customerVisible);

  const columns = [
    {
      id: 'open',
      title: 'Discovery / Open',
      icon: Clock,
      color: 'text-slate-400',
      borderColor: 'border-slate-800',
      bgGlow: 'bg-slate-900/40',
      tasks: allTasks.filter(t => t.status === 'open')
    },
    {
      id: 'in_progress',
      title: 'In Progress / Active',
      icon: Activity,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'bg-blue-950/20',
      tasks: allTasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'blocked',
      title: 'Blocked / Blocker Alert',
      icon: AlertOctagon,
      color: 'text-red-400',
      borderColor: 'border-red-500/40',
      bgGlow: 'bg-red-950/20',
      tasks: allTasks.filter(t => t.status === 'blocked')
    },
    {
      id: 'done',
      title: 'Done / Completed',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'bg-emerald-950/20',
      tasks: allTasks.filter(t => t.status === 'done')
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Kanban Fleet Task Board</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Interactive Workflow View
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Quickly advance or triage flight delivery tasks across phases.
          </p>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column) => {
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className={`glass-panel rounded-2xl p-3.5 border ${column.borderColor} ${column.bgGlow} flex flex-col min-h-[420px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${column.color}`} />
                  <h4 className="text-xs font-bold text-slate-200">{column.title}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-900 border border-slate-800 ${column.color}`}>
                  {column.tasks.length}
                </span>
              </div>

              {/* Tasks Column */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px] pr-1">
                {column.tasks.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-500">No tasks in this lane</span>
                  </div>
                ) : (
                  column.tasks.map((task) => {
                    const taskOwner = owners.find(o => o.id === task.assignee);

                    return (
                      <div
                        key={task.id}
                        className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 hover:border-slate-600 transition-all shadow-md group relative"
                      >
                        {/* Milestone Tag */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[10px] font-mono text-cyan-400/80 truncate max-w-[170px]">
                            {task.milestoneTitle}
                          </span>

                          {viewMode === 'internal' && !task.customerVisible && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-500/10 text-amber-400 rounded border border-amber-500/30 flex items-center gap-0.5">
                              <EyeOff className="w-2.5 h-2.5" /> Internal
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h5 className="text-xs font-semibold text-white leading-snug">
                          {task.title}
                        </h5>

                        {/* Footer: Assignee & Quick Move Controls */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {taskOwner && (
                              <img
                                src={taskOwner.avatar}
                                alt={taskOwner.name}
                                title={`${taskOwner.name} (${taskOwner.role})`}
                                className="w-5 h-5 rounded-full object-cover border border-slate-700"
                              />
                            )}
                            <span className="text-[11px] text-slate-400">
                              {taskOwner ? taskOwner.name.split(' ')[0] : 'Unassigned'}
                            </span>
                          </div>

                          {/* Quick Move Selector */}
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(project.id, task.milestoneId, task.id, e.target.value)}
                            aria-label="Move task state"
                            className="bg-slate-950 text-[10px] font-semibold text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="open">→ Open</option>
                            <option value="in_progress">→ Active</option>
                            <option value="blocked">→ Blocked</option>
                            <option value="done">→ Done</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
