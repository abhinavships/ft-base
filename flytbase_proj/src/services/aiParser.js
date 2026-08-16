/**
 * AI Parsing & NLP Engine for Spider-Sync
 * Handles:
 * 1. Unstructured Text -> Structured Status / Milestone Update / Blocker & Issue Extractor
 * 2. Spider-Sense Inactivity & Follow-up Email Drafter
 * 3. Natural Language Query (NLQ) Engine for Project State Search
 */

export function parseUnstructuredUpdate(rawText, activeProject, allOwners = []) {
  const textLower = rawText.toLowerCase();
  
  // Check for positive resolutions first
  const isPositiveResolution = (
    textLower.includes('resolved') || 
    textLower.includes('resolution') || 
    textLower.includes('all clear') || 
    textLower.includes('success') || 
    textLower.includes('approved') || 
    textLower.includes('passed') || 
    textLower.includes('fixed') || 
    textLower.includes('completed')
  );

  const isExplicitBlocker = (
    textLower.includes('critical') || 
    textLower.includes('blocked') || 
    textLower.includes('halted') || 
    textLower.includes('failed') || 
    textLower.includes('failure') || 
    textLower.includes('drift')
  );

  let sentiment = 'neutral';
  let isBlocker = false;
  let statusChange = null;

  if (isPositiveResolution && !isExplicitBlocker) {
    sentiment = 'positive';
    statusChange = 'in_progress';
  } else if (isExplicitBlocker) {
    sentiment = 'blocker';
    isBlocker = true;
    statusChange = 'blocked';
  } else if (textLower.includes('investigating') || textLower.includes('warning') || textLower.includes('delay') || textLower.includes('testing')) {
    sentiment = 'warning';
  }

  // 2. Identify author
  let author = "Peter Parker";
  if (textLower.includes('gwen') || textLower.includes('ghost-spider')) author = "Gwen Stacy";
  else if (textLower.includes('miles') || textLower.includes('spin')) author = "Miles Morales";
  else if (textLower.includes('ned') || textLower.includes('chair')) author = "Ned Leeds";
  else if (textLower.includes('tony') || textLower.includes('friday') || textLower.includes('stark')) author = "Tony Stark";
  else if (textLower.includes('shuri')) author = "Shuri";

  // 3. Extract Tags
  const possibleTags = ["BVLOS", "Telemetry", "FAA", "Hardware", "Docking", "Firmware", "Sensor", "Video", "Blocker", "Resolved", "LiDAR", "Signoff", "Security"];
  const matchedTags = possibleTags.filter(tag => textLower.includes(tag.toLowerCase()));
  if (matchedTags.length === 0) matchedTags.push("Project Update", "Autonomous Fleet");

  // 4. Generate structured summary
  const sentences = rawText.split(/[.\n!]/).map(s => s.trim()).filter(s => s.length > 5);
  const mainSentence = sentences[0] || rawText.slice(0, 100);
  const structuredSummary = mainSentence.length > 120 ? mainSentence.slice(0, 117) + "..." : mainSentence;

  // 5. Detect linked milestone in active project
  let targetMilestoneId = null;
  let targetMilestoneTitle = null;
  if (activeProject && activeProject.milestones) {
    for (const ms of activeProject.milestones) {
      const msWords = ms.title.toLowerCase().split(' ').filter(w => w.length > 3);
      if (msWords.some(w => textLower.includes(w))) {
        targetMilestoneId = ms.id;
        targetMilestoneTitle = ms.title;
        break;
      }
    }
  }

  // 6. Detect issue updates
  let issueAction = null;
  if (isPositiveResolution) {
    issueAction = { action: 'resolve', query: 'ISS' };
  } else if (isExplicitBlocker || textLower.includes('bug') || textLower.includes('ticket')) {
    issueAction = { action: 'create', category: textLower.includes('bug') ? 'Bug' : 'Support' };
  }

  return {
    parsedSummary: structuredSummary,
    sentiment,
    isBlocker,
    statusChange,
    author,
    tags: matchedTags.slice(0, 3),
    targetMilestoneId,
    targetMilestoneTitle,
    issueAction,
    timestamp: new Date().toISOString(),
    customerVisible: !textLower.includes('secret') && !textLower.includes('internal only') && !textLower.includes('margin')
  };
}

/**
 * Natural Language Query (NLQ) Engine - Spider-Bot
 */
export function queryProjectState(query, projects, owners) {
  const q = query.toLowerCase().trim();
  
  // Query 1: Behind schedule / blocked / at risk
  if (q.includes('behind') || q.includes('schedule') || q.includes('blocked') || q.includes('at risk') || q.includes('trouble') || q.includes('risk')) {
    const troubled = projects.filter(p => p.status === 'blocked' || p.health === 'at_risk' || p.health === 'blocked');
    return {
      type: 'projects_list',
      title: 'Projects Requiring Attention / Blocked Deployments',
      summary: `Identified ${troubled.length} project(s) currently marked as Blocked or At Risk.`,
      projects: troubled,
      insights: troubled.map(p => ({
        projectName: p.name,
        client: p.client,
        reason: p.status === 'blocked' ? 'Active delivery blocker' : 'Health marked as At Risk',
        daysInactive: p.daysInactive,
        primaryOwners: p.owners.map(oid => owners.find(o => o.id === oid)?.name).join(', ')
      }))
    };
  }

  // Query 2: Stale / Inactive / Spider-sense
  if (q.includes('stale') || q.includes('inactive') || q.includes('spider-sense') || q.includes('no movement') || q.includes('dormant') || q.includes('idle')) {
    const staleProjects = projects.filter(p => p.daysInactive >= 5);
    return {
      type: 'stale_projects',
      title: 'Inactivity Monitor: Projects with >5 Days No Update',
      summary: `Found ${staleProjects.length} project(s) with zero recorded status updates in over 5 days.`,
      projects: staleProjects,
      insights: staleProjects.map(p => ({
        projectName: p.name,
        client: p.client,
        daysInactive: `${p.daysInactive} days inactive`,
        lastUpdated: new Date(p.lastUpdated).toLocaleDateString(),
        recommendation: "Send automated status follow-up to project owners."
      }))
    };
  }

  // Query 3: Search by Owner (Peter, Gwen, Miles, Ned, Tony)
  const matchedOwner = owners.find(o => q.includes(o.name.toLowerCase()) || q.includes(o.alias.toLowerCase()) || q.includes(o.name.split(' ')[0].toLowerCase()));
  if (matchedOwner) {
    const ownerProjects = projects.filter(p => p.owners.includes(matchedOwner.id));
    const allTasks = ownerProjects.flatMap(p => 
      p.milestones.flatMap(m => 
        m.tasks.filter(t => t.assignee === matchedOwner.id).map(t => ({ ...t, projectName: p.name, milestoneTitle: m.title }))
      )
    );
    const blockedTasks = allTasks.filter(t => t.status === 'blocked');

    return {
      type: 'owner_summary',
      title: `Workload & Tasks for ${matchedOwner.name} (${matchedOwner.role})`,
      summary: `${matchedOwner.name} is assigned to ${ownerProjects.length} projects with ${allTasks.length} active tasks (${blockedTasks.length} blocked).`,
      projects: ownerProjects,
      owner: matchedOwner,
      totalTasks: allTasks.length,
      blockedTasks: blockedTasks,
      insights: [
        `Active Deployments: ${ownerProjects.map(p => p.client).join(', ')}`,
        `Blocked Tasks: ${blockedTasks.length > 0 ? blockedTasks.map(t => t.title).join('; ') : 'All clear!'}`
      ]
    };
  }

  // Query 4: Bugs & Issues
  if (q.includes('bug') || q.includes('issue') || q.includes('ticket') || q.includes('problem')) {
    const allIssues = projects.flatMap(p => p.issues.map(i => ({ ...i, projectName: p.name, client: p.client })));
    const openBugs = allIssues.filter(i => i.category === 'Bug' && i.status !== 'Resolved');
    return {
      type: 'issues_summary',
      title: 'Active Delivery Bugs & Issues',
      summary: `Found ${openBugs.length} open or investigating bug(s) across deployments.`,
      issues: openBugs,
      insights: openBugs.map(b => ({
        projectName: b.projectName,
        issueTitle: b.title,
        priority: b.priority,
        status: b.status,
        reportedBy: b.reportedBy
      }))
    };
  }

  // Query 5: Completed / Done projects
  if (q.includes('done') || q.includes('complete') || q.includes('finished') || q.includes('delivered')) {
    const completed = projects.filter(p => p.status === 'done' || p.progress === 100);
    return {
      type: 'projects_list',
      title: 'Completed & Live Deployments',
      summary: `${completed.length} project(s) have reached 100% completion and operational handover.`,
      projects: completed,
      insights: completed.map(p => ({
        projectName: p.name,
        client: p.client,
        reason: '100% Milestones achieved & signed off'
      }))
    };
  }

  // Generic fallback query match
  const matchingProjects = projects.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.client.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );

  return {
    type: 'general_search',
    title: `Search Results for "${query}"`,
    summary: `Found ${matchingProjects.length} project(s) matching your query.`,
    projects: matchingProjects.length > 0 ? matchingProjects : projects.slice(0, 2),
    insights: [
      `Try queries like: "Which projects are behind schedule?", "Show Gwen Stacy's tasks", "Show stale projects", or "List open bugs".`
    ]
  };
}

/**
 * Spider-Sense AI Nudge Email Drafter
 */
export function generateFollowUpDraft(project, owners) {
  const projectOwners = project.owners.map(id => owners.find(o => o.id === id)?.name).filter(Boolean);
  return {
    subject: `Status Update Check: ${project.client} - ${project.name}`,
    to: projectOwners.join(', '),
    body: `Hi team,\n\nOur delivery tracker noticed that the project "${project.name}" for ${project.client} has had no status updates logged for ${project.daysInactive} days (Current Health: ${project.health.toUpperCase()}, Progress: ${project.progress}%).\n\nPlease provide a quick update on current milestone progress or blockers so we can keep the customer portal up to date.\n\nBest regards,\nSpider-Sync Delivery Ops`
  };
}
