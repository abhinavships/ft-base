import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProjects, initialOwners, sampleUnstructuredUpdates } from '../data/mockData';
import { parseUnstructuredUpdate } from '../services/aiParser';
import { wsService } from '../services/websocketService';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const { currentUser, isInternal, permissions } = useAuth();

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('spider_sync_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [owners] = useState(initialOwners);
  const [activeProjectId, setActiveProjectId] = useState('proj-1');
  const [viewMode, setViewModeInternal] = useState('internal'); // 'internal' | 'customer' | 'dual'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');
  const [isSpiderBotOpen, setIsSpiderBotOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedStaleProject, setSelectedStaleProject] = useState(null);
  const [lastWsMessage, setLastWsMessage] = useState(null);

  // Sync viewMode with user permissions whenever currentUser changes
  useEffect(() => {
    if (!permissions.canViewInternal) {
      setViewModeInternal('customer');
      if (Array.isArray(permissions.allowedProjects) && permissions.allowedProjects.length > 0) {
        setActiveProjectId(permissions.allowedProjects[0]);
      }
    }
  }, [currentUser, permissions]);

  // Wrapped setViewMode enforcing role permissions
  const setViewMode = (mode) => {
    if (!permissions.canViewInternal && (mode === 'internal' || mode === 'dual')) {
      alert(`Access Restricted: ${currentUser.name} (${currentUser.role}) is a customer stakeholder and cannot access internal engineering consoles.`);
      return;
    }
    setViewModeInternal(mode);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('spider_sync_projects', JSON.stringify(projects));
  }, [projects]);

  // Subscribe to real-time WebSockets & BroadcastChannel
  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg) => {
      setLastWsMessage(msg);

      if (msg.type === 'PROJECT_STATE_UPDATE') {
        if (msg.payload && msg.payload.projects) {
          setProjects(msg.payload.projects);
        }
      } else if (msg.type === 'LIVE_FLIGHT_UPDATE') {
        const { projectId, summary, author, sentiment } = msg.payload;
        setProjects(prev => prev.map(p => {
          if (p.id !== projectId) return p;
          const liveEntry = {
            id: `upd-live-${Date.now()}`,
            timestamp: new Date().toISOString(),
            author: author || 'FlytBase Telemetry',
            source: '#WebSocket-Live',
            sentiment: sentiment || 'positive',
            customerVisible: true,
            summary: summary,
            rawText: `[Live Broadcast Telemetry] ${summary}`,
            tags: ["Live-Stream", "WebSocket"]
          };
          return {
            ...p,
            lastUpdated: new Date().toISOString(),
            updates: [liveEntry, ...p.updates]
          };
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter projects by permission
  const authorizedProjects = projects.filter(p => {
    if (permissions.allowedProjects === 'all') return true;
    if (Array.isArray(permissions.allowedProjects)) {
      return permissions.allowedProjects.includes(p.id);
    }
    return true;
  });

  const activeProject = authorizedProjects.find(p => p.id === activeProjectId) || authorizedProjects[0] || projects[0];

  // Helper: Stale projects with daysInactive >= 5
  const staleProjects = authorizedProjects.filter(p => p.daysInactive >= 5 && p.status !== 'done');

  // Task Status Update with Broadcast
  const updateTaskStatus = (projectId, milestoneId, taskId, newStatus) => {
    if (!permissions.canEditTasks) {
      alert("Permission Denied: Client stakeholders have read-only access to tasks.");
      return;
    }

    setProjects(prevProjects => {
      const updated = prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        const updatedMilestones = proj.milestones.map(ms => {
          if (ms.id !== milestoneId) return ms;

          const updatedTasks = ms.tasks.map(t => {
            if (t.id !== taskId) return t;
            return { ...t, status: newStatus };
          });

          const doneTasks = updatedTasks.filter(t => t.status === 'done').length;
          const completion = Math.round((doneTasks / updatedTasks.length) * 100);
          let msStatus = ms.status;
          if (completion === 100) msStatus = 'done';
          else if (updatedTasks.some(t => t.status === 'blocked')) msStatus = 'blocked';
          else if (completion > 0) msStatus = 'in_progress';
          else msStatus = 'open';

          return { ...ms, tasks: updatedTasks, completion, status: msStatus };
        });

        const totalMilestones = updatedMilestones.length;
        const totalCompletion = updatedMilestones.reduce((acc, m) => acc + (m.completion || 0), 0);
        const avgProgress = Math.round(totalCompletion / totalMilestones);

        return {
          ...proj,
          milestones: updatedMilestones,
          progress: avgProgress,
          lastUpdated: new Date().toISOString(),
          daysInactive: 0
        };
      });

      wsService.broadcast('PROJECT_STATE_UPDATE', { projects: updated });
      return updated;
    });
  };

  // Milestone Status Update with Broadcast
  const updateMilestoneStatus = (projectId, milestoneId, newStatus) => {
    if (!permissions.canEditTasks) {
      alert("Permission Denied: Client stakeholders have read-only access to milestones.");
      return;
    }

    setProjects(prevProjects => {
      const updated = prevProjects.map(proj => {
        if (proj.id !== projectId) return proj;

        const updatedMilestones = proj.milestones.map(ms => {
          if (ms.id !== milestoneId) return ms;
          let comp = ms.completion;
          if (newStatus === 'done') comp = 100;
          else if (newStatus === 'open') comp = 0;
          else if (newStatus === 'in_progress' && comp === 0) comp = 50;

          return { ...ms, status: newStatus, completion: comp };
        });

        const totalMilestones = updatedMilestones.length;
        const totalCompletion = updatedMilestones.reduce((acc, m) => acc + (m.completion || 0), 0);
        const avgProgress = Math.round(totalCompletion / totalMilestones);

        return {
          ...proj,
          milestones: updatedMilestones,
          progress: avgProgress,
          lastUpdated: new Date().toISOString(),
          daysInactive: 0
        };
      });

      wsService.broadcast('PROJECT_STATE_UPDATE', { projects: updated });
      return updated;
    });
  };

  // Ingest Unstructured text with AI & Broadcast
  const ingestUpdate = (rawText, targetProjectId) => {
    if (!permissions.canIngestRaw) {
      alert("Permission Denied: Only internal engineers can ingest raw updates.");
      return;
    }

    const targetProj = projects.find(p => p.id === targetProjectId) || activeProject;
    const parsed = parseUnstructuredUpdate(rawText, targetProj, owners);

    const newUpdateEntry = {
      id: `upd-ai-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author: currentUser.name,
      source: '#AI-WebCrawler',
      sentiment: parsed.sentiment,
      customerVisible: parsed.customerVisible,
      summary: parsed.parsedSummary,
      rawText: rawText,
      tags: parsed.tags
    };

    setProjects(prevProjects => {
      const updated = prevProjects.map(proj => {
        if (proj.id !== targetProj.id) return proj;

        let updatedMilestones = [...proj.milestones];
        let updatedIssues = [...proj.issues];
        let updatedHealth = proj.health;
        let updatedStatus = proj.status;

        if (parsed.targetMilestoneId && parsed.statusChange) {
          updatedMilestones = updatedMilestones.map(ms => {
            if (ms.id === parsed.targetMilestoneId) {
              return {
                ...ms,
                status: parsed.statusChange,
                completion: parsed.statusChange === 'done' ? 100 : (parsed.statusChange === 'blocked' ? ms.completion : Math.max(ms.completion, 50))
              };
            }
            return ms;
          });
        }

        if (parsed.isBlocker) {
          updatedHealth = 'blocked';
          updatedStatus = 'blocked';
        } else if (parsed.statusChange === 'in_progress' && proj.status === 'blocked') {
          updatedHealth = 'on_track';
          updatedStatus = 'in_progress';
        }

        if (parsed.issueAction?.action === 'create') {
          updatedIssues.push({
            id: `iss-ai-${Date.now()}`,
            title: `[AI Extracted] ${parsed.parsedSummary}`,
            category: parsed.issueAction.category || 'Bug',
            priority: parsed.isBlocker ? 'High' : 'Medium',
            status: 'Open',
            customerVisible: parsed.customerVisible,
            linkedMilestone: parsed.targetMilestoneId || proj.milestones[0]?.id,
            reportedBy: currentUser.name,
            createdAt: new Date().toISOString()
          });
        } else if (parsed.issueAction?.action === 'resolve') {
          updatedIssues = updatedIssues.map(iss => {
            if (iss.category === 'Bug' && iss.status !== 'Resolved') {
              return { ...iss, status: 'Resolved' };
            }
            return iss;
          });
        }

        return {
          ...proj,
          health: updatedHealth,
          status: updatedStatus,
          lastUpdated: new Date().toISOString(),
          daysInactive: 0,
          milestones: updatedMilestones,
          issues: updatedIssues,
          updates: [newUpdateEntry, ...proj.updates]
        };
      });

      wsService.broadcast('PROJECT_STATE_UPDATE', { projects: updated });
      return updated;
    });

    return parsed;
  };

  // Add Issue
  const addIssue = (projectId, issue) => {
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          issues: [issue, ...p.issues],
          lastUpdated: new Date().toISOString()
        };
      });
      wsService.broadcast('PROJECT_STATE_UPDATE', { projects: updated });
      return updated;
    });
  };

  // Resolve or Update Issue
  const updateIssue = (projectId, issueId, updates) => {
    if (!permissions.canManageIssues && !isInternal) {
      alert("Permission Denied: Client stakeholders cannot resolve internal tickets.");
      return;
    }
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          issues: p.issues.map(iss => iss.id === issueId ? { ...iss, ...updates } : iss),
          lastUpdated: new Date().toISOString()
        };
      });
      wsService.broadcast('PROJECT_STATE_UPDATE', { projects: updated });
      return updated;
    });
  };

  // Add Document
  const addDocument = (projectId, doc) => {
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          documents: [doc, ...p.documents]
        };
      });
      wsService.broadcast('PROJECT_STATE_UPDATE', { projects: updated });
      return updated;
    });
  };

  // Reset to initial demo data
  const resetToMockData = () => {
    setProjects(initialProjects);
    localStorage.removeItem('spider_sync_projects');
    wsService.broadcast('PROJECT_STATE_UPDATE', { projects: initialProjects });
  };

  return (
    <ProjectContext.Provider value={{
      projects: authorizedProjects,
      allProjects: projects,
      owners,
      activeProject,
      activeProjectId,
      setActiveProjectId,
      viewMode,
      setViewMode,
      staleProjects,
      searchTerm,
      setSearchTerm,
      filterOwner,
      setFilterOwner,
      filterStatus,
      setFilterStatus,
      filterHealth,
      setFilterHealth,
      isSpiderBotOpen,
      setIsSpiderBotOpen,
      isIngestModalOpen,
      setIsIngestModalOpen,
      isNudgeModalOpen,
      setIsNudgeModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      selectedStaleProject,
      setSelectedStaleProject,
      lastWsMessage,
      updateTaskStatus,
      updateMilestoneStatus,
      ingestUpdate,
      addIssue,
      updateIssue,
      addDocument,
      resetToMockData,
      sampleUnstructuredUpdates
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}
