import { initialOwners } from './mockData.js';

export const userProfiles = [
  {
    id: 'owner-1',
    username: 'peter.parker',
    password: 'peter@123',
    name: 'Peter Parker',
    role: 'Lead Delivery Engineer',
    alias: 'Spider-Prime',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'peter.parker@flytbase.internal',
    badge: 'Lead Delivery',
    roleType: 'internal',
    organization: 'FlytBase Delivery Ops',
    permissions: {
      canViewInternal: true,
      canViewDual: true,
      canEditTasks: true,
      canViewFinances: true,
      canIngestRaw: true,
      canManageIssues: true,
      allowedProjects: 'all'
    }
  },
  {
    id: 'owner-2',
    username: 'gwen.stacy',
    password: 'gwen@123',
    name: 'Gwen Stacy',
    role: 'Solutions Architect',
    alias: 'Ghost-Spider',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'gwen.stacy@flytbase.internal',
    badge: 'Solutions Arch',
    roleType: 'internal',
    organization: 'FlytBase Delivery Ops',
    permissions: {
      canViewInternal: true,
      canViewDual: true,
      canEditTasks: true,
      canViewFinances: true,
      canIngestRaw: true,
      canManageIssues: true,
      allowedProjects: 'all'
    }
  },
  {
    id: 'owner-3',
    username: 'miles.morales',
    password: 'miles@123',
    name: 'Miles Morales',
    role: 'Field Flight Ops Specialist',
    alias: 'Spin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'miles.morales@flytbase.internal',
    badge: 'Field Ops',
    roleType: 'internal',
    organization: 'FlytBase Delivery Ops',
    permissions: {
      canViewInternal: true,
      canViewDual: true,
      canEditTasks: true,
      canViewFinances: false,
      canIngestRaw: true,
      canManageIssues: true,
      allowedProjects: 'all'
    }
  },
  {
    id: 'client-stark',
    username: 'tony.stark',
    password: 'tony@123',
    name: 'Tony Stark (Client VP)',
    role: 'Customer Flight Sponsor',
    alias: 'Iron Man',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    email: 'tony@starkindustries.com',
    badge: 'Client Sponsor',
    roleType: 'client',
    organization: 'Stark Industries Aviation',
    permissions: {
      canViewInternal: false,
      canViewDual: false,
      canEditTasks: false,
      canViewFinances: false,
      canIngestRaw: false,
      canManageIssues: false,
      allowedProjects: ['proj-1']
    }
  },
  {
    id: 'client-oscorp',
    username: 'norman.osborn',
    password: 'norman@123',
    name: 'Norman Osborn (Client Lead)',
    role: 'Customer Project Liaison',
    alias: 'Oscorp Client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'osborn@oscorp.com',
    badge: 'Client Liaison',
    roleType: 'client',
    organization: 'Oscorp Industries',
    permissions: {
      canViewInternal: false,
      canViewDual: false,
      canEditTasks: false,
      canViewFinances: false,
      canIngestRaw: false,
      canManageIssues: false,
      allowedProjects: ['proj-2']
    }
  }
];
