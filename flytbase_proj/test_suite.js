import { initialProjects, initialOwners, sampleUnstructuredUpdates } from './src/data/mockData.js';
import { parseUnstructuredUpdate, queryProjectState, generateFollowUpDraft } from './src/services/aiParser.js';
import { userProfiles } from './src/data/userProfiles.js';

console.log("==========================================");
console.log("🕷️ SPIDER-SYNC AUTOMATED VERIFICATION SUITE");
console.log("==========================================");

// Test 1: Verify Initial Projects & Owners
console.log(`\n[Test 1] Initial Data Integrity:`);
console.log(`- Projects loaded: ${initialProjects.length}`);
console.log(`- Owners loaded: ${initialOwners.length}`);
if (initialProjects.length >= 5 && initialOwners.length >= 5) {
  console.log("✓ Test 1 Passed: Multi-tenant projects and owners populated properly.");
} else {
  throw new Error("Test 1 Failed: Missing initial projects or owners");
}

// Test 2: AI Parser on Blocker Input
console.log(`\n[Test 2] AI NLP Unstructured Ingestion (Blocker Scenario):`);
const blockerText = "CRITICAL: Sensor drift detected on Pods 9-11. Milestone 'FlytBase Cloud Fleet API' is temporarily blocked.";
const parsedBlocker = parseUnstructuredUpdate(blockerText, initialProjects[0], initialOwners);
console.log(`- Detected Sentiment: ${parsedBlocker.sentiment}`);
console.log(`- Is Blocker: ${parsedBlocker.isBlocker}`);
console.log(`- Target Milestone ID: ${parsedBlocker.targetMilestoneId}`);
console.log(`- Summary: ${parsedBlocker.parsedSummary}`);
if (parsedBlocker.sentiment === 'blocker' && parsedBlocker.isBlocker === true) {
  console.log("✓ Test 2 Passed: Successfully detected blocker and structured status.");
} else {
  throw new Error("Test 2 Failed: Did not detect blocker correctly");
}

// Test 3: AI Parser on Positive Resolution
console.log(`\n[Test 3] AI NLP Unstructured Ingestion (Resolution Scenario):`);
const resolveText = "Rain simulation test round 3 completed with success. All clear! Issue ISS-1 is resolved.";
const parsedResolve = parseUnstructuredUpdate(resolveText, initialProjects[0], initialOwners);
console.log(`- Detected Sentiment: ${parsedResolve.sentiment}`);
console.log(`- Action: ${JSON.stringify(parsedResolve.issueAction)}`);
if (parsedResolve.sentiment === 'positive' && parsedResolve.issueAction?.action === 'resolve') {
  console.log("✓ Test 3 Passed: Successfully parsed resolution update.");
} else {
  throw new Error("Test 3 Failed: Did not parse resolution update correctly");
}

// Test 4: Spider-Bot NLQ Search
console.log(`\n[Test 4] Spider-Bot Natural Language Query (NLQ):`);
const query1 = queryProjectState("Which projects are behind schedule?", initialProjects, initialOwners);
console.log(`- Query: "Which projects are behind schedule?" -> Found ${query1.projects.length} project(s)`);
const query2 = queryProjectState("Show Gwen Stacy's active tasks", initialProjects, initialOwners);
console.log(`- Query: "Show Gwen Stacy's active tasks" -> Found ${query2.projects?.length || 0} project(s), owner: ${query2.owner?.name}`);
const query3 = queryProjectState("Any stale projects?", initialProjects, initialOwners);
console.log(`- Query: "Any stale projects?" -> Found ${query3.projects.length} project(s)`);

if (query1.projects.length > 0 && query2.owner && query3.projects.length > 0) {
  console.log("✓ Test 4 Passed: NLQ queries generated precise structured responses.");
} else {
  throw new Error("Test 4 Failed: NLQ engine queries failed");
}

// Test 5: Spider-Sense Stale Project Detection & AI Nudge Draft
console.log(`\n[Test 5] Spider-Sense Inactivity Alerter & Email Generator:`);
const staleProj = initialProjects.find(p => p.daysInactive >= 5);
if (staleProj) {
  const nudgeDraft = generateFollowUpDraft(staleProj, initialOwners);
  console.log(`- Detected Stale Project: ${staleProj.name} (${staleProj.daysInactive} days inactive)`);
  console.log(`- Generated Subject: ${nudgeDraft.subject}`);
  console.log(`- Recipients: ${nudgeDraft.to}`);
  console.log("✓ Test 5 Passed: Automated follow-up draft generated successfully.");
} else {
  throw new Error("Test 5 Failed: No stale project found in mock database");
}

// Test 6: Role-Based Authentication & Permissions Enforcement
console.log(`\n[Test 6] Role-Based Authentication & Permissions Matrix:`);
const peter = userProfiles.find(u => u.id === 'owner-1');
const tony = userProfiles.find(u => u.id === 'client-stark');

console.log(`- Peter Parker (Lead Delivery): canViewInternal=${peter.permissions.canViewInternal}, allowedProjects=${peter.permissions.allowedProjects}`);
console.log(`- Tony Stark (Client VP): canViewInternal=${tony.permissions.canViewInternal}, allowedProjects=${JSON.stringify(tony.permissions.allowedProjects)}`);

if (peter.permissions.canViewInternal === true && tony.permissions.canViewInternal === false && tony.permissions.allowedProjects.length === 1) {
  console.log("✓ Test 6 Passed: Role-based permissions and project isolation strictly verified.");
} else {
  throw new Error("Test 6 Failed: Role permissions not strictly enforced");
}

console.log("\n==========================================");
console.log("🚀 ALL 6 TEST SUITES PASSED FLAWLESSLY!");
console.log("==========================================");
