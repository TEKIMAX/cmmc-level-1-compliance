import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// CMMC Level 1 baseline controls
const BASELINE_CONTROLS = [
  // Access Control (AC)
  {
    controlId: "AC.L1-3.1.1",
    domain: "Access Control",
    title: "Authorized Access Control",
    description: "Limit information system access to authorized users, processes acting on behalf of authorized users, or devices (including other information systems).",
    requirement: "Implement access controls to limit system access to authorized users only."
  },
  {
    controlId: "AC.L1-3.1.2", 
    domain: "Access Control",
    title: "Transaction & Function Control",
    description: "Limit information system access to the types of transactions and functions that authorized users are permitted to execute.",
    requirement: "Control user access to specific system functions and transactions based on user roles."
  },
  {
    controlId: "AC.L1-3.1.20",
    domain: "Access Control", 
    title: "External System Connections",
    description: "Verify and control/limit connections to and use of external information systems.",
    requirement: "Monitor and control connections to external systems."
  },
  {
    controlId: "AC.L1-3.1.22",
    domain: "Access Control",
    title: "Publicly Accessible Content",
    description: "Control information posted or processed on publicly accessible information systems.",
    requirement: "Review and control information posted on public-facing systems."
  },

  // Identification & Authentication (IA)
  {
    controlId: "IA.L1-3.5.1",
    domain: "Identification & Authentication",
    title: "User Identification & Authentication", 
    description: "Identify information system users, processes acting on behalf of users, or devices.",
    requirement: "Implement user identification and authentication mechanisms."
  },
  {
    controlId: "IA.L1-3.5.2",
    domain: "Identification & Authentication",
    title: "Multi-factor Authentication",
    description: "Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems.",
    requirement: "Verify user identities before granting system access."
  },

  // Media Protection (MP)
  {
    controlId: "MP.L1-3.8.1",
    domain: "Media Protection",
    title: "Media Access Control",
    description: "Protect (i.e., physically control and securely store) information system media containing covered defense information, both paper and digital.",
    requirement: "Physically protect and securely store media containing CUI."
  },
  {
    controlId: "MP.L1-3.8.2",
    domain: "Media Protection", 
    title: "Media Access Limitation",
    description: "Limit access to information on information system media to authorized users.",
    requirement: "Restrict media access to authorized personnel only."
  },
  {
    controlId: "MP.L1-3.8.3",
    domain: "Media Protection",
    title: "Media Sanitization",
    description: "Sanitize or destroy information system media containing covered defense information before disposal or release for reuse.",
    requirement: "Properly sanitize or destroy media before disposal or reuse."
  },

  // Physical Protection (PE)
  {
    controlId: "PE.L1-3.10.1",
    domain: "Physical Protection",
    title: "Physical Access Limits",
    description: "Limit physical access to organizational information systems, equipment, and the respective operating environments to authorized individuals.",
    requirement: "Control physical access to systems and facilities."
  },
  {
    controlId: "PE.L1-3.10.3",
    domain: "Physical Protection",
    title: "Escort Visitors",
    description: "Escort visitors and monitor visitor activity.",
    requirement: "Escort and monitor all visitors in secure areas."
  },
  {
    controlId: "PE.L1-3.10.4",
    domain: "Physical Protection",
    title: "Physical Access Logs",
    description: "Maintain audit logs of physical access.",
    requirement: "Log and review physical access to secure areas."
  },
  {
    controlId: "PE.L1-3.10.5",
    domain: "Physical Protection",
    title: "Workstation Use Controls",
    description: "Control and manage physical access to information systems within organizational facilities.",
    requirement: "Control physical access to workstations and devices."
  },

  // System & Communications Protection (SC)
  {
    controlId: "SC.L1-3.13.1",
    domain: "System & Communications Protection",
    title: "Boundary Protection",
    description: "Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational information systems) at the external boundaries and key internal boundaries of the information systems.",
    requirement: "Monitor and protect communications at system boundaries."
  },
  {
    controlId: "SC.L1-3.13.5",
    domain: "System & Communications Protection",
    title: "Public-Key Infrastructure",
    description: "Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.",
    requirement: "Separate public-facing systems from internal networks."
  },

  // System & Information Integrity (SI)
  {
    controlId: "SI.L1-3.14.1",
    domain: "System & Information Integrity",
    title: "Flaw Remediation",
    description: "Identify, report, and correct information and information system flaws in a timely manner.",
    requirement: "Identify and remediate system flaws promptly."
  },
  {
    controlId: "SI.L1-3.14.2",
    domain: "System & Information Integrity", 
    title: "Malicious Code Protection",
    description: "Provide protection from malicious code at appropriate locations within organizational information systems.",
    requirement: "Implement malware protection across systems."
  },
  {
    controlId: "SI.L1-3.14.4",
    domain: "System & Information Integrity",
    title: "Security Alerts & Advisories",
    description: "Update malicious code protection mechanisms when new releases are available in accordance with organizational configuration management policy and procedures.",
    requirement: "Keep security tools updated with latest signatures and patches."
  }
];

export const initializeControls = mutation({
  args: { organizationId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated");
    }

    // For now, we'll create controls without organization requirement
    // In a real enterprise setup, you'd want to ensure proper organization context
    const orgId = args.organizationId || "default_org";

    // Check if controls already exist for this organization
    const existingControls = await ctx.db
      .query("controls")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();
    
    if (existingControls.length > 0) {
      return { message: "Controls already initialized" };
    }

    // Insert baseline controls
    for (const control of BASELINE_CONTROLS) {
      await ctx.db.insert("controls", {
        organizationId: orgId,
        ...control,
        status: "not_started",
        lastUpdated: Date.now(),
        updatedBy: userId,
      });
    }

    return { message: "Controls initialized successfully" };
  },
});

export const listControls = query({
  args: { organizationId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const orgId = args.organizationId || "default_org";

    return await ctx.db
      .query("controls")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();
  },
});

export const getControlsByDomain = query({
  args: { 
    domain: v.optional(v.string()),
    organizationId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const orgId = args.organizationId || "default_org";

    if (args.domain) {
      return await ctx.db
        .query("controls")
        .withIndex("by_org_domain", (q) => q.eq("organizationId", orgId).eq("domain", args.domain!))
        .collect();
    }

    return await ctx.db
      .query("controls")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();
  },
});

export const updateControlStatus = mutation({
  args: {
    controlId: v.id("controls"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("implemented"), 
      v.literal("verified")
    ),
    implementationNotes: v.optional(v.string()),
    assignedTo: v.optional(v.union(v.id("users"), v.string())),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated");
    }

    const control = await ctx.db.get(args.controlId);
    if (!control) {
      throw new Error("Control not found");
    }

    // Log the status change
    await ctx.db.insert("auditLogs", {
      organizationId: control.organizationId,
      action: "status_update",
      details: `Status changed from ${control.status} to ${args.status}`,
      performedBy: userId,
      timestamp: Date.now(),
      entityType: "control",
      entityId: args.controlId,
    });

    // Update the control
    await ctx.db.patch(args.controlId, {
      status: args.status,
      implementationNotes: args.implementationNotes,
      assignedTo: args.assignedTo,
      dueDate: args.dueDate,
      lastUpdated: Date.now(),
      updatedBy: userId,
    });

    return { success: true };
  },
});

export const updateControlConfiguration = mutation({
  args: {
    controlId: v.id("controls"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    requirement: v.optional(v.string()),
    revisionNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated");
    }

    const control = await ctx.db.get(args.controlId);
    if (!control) {
      throw new Error("Control not found");
    }

    // Log the configuration change
    await ctx.db.insert("auditLogs", {
      organizationId: control.organizationId,
      action: "configuration_update",
      details: args.revisionNotes || "Control configuration updated",
      performedBy: userId,
      timestamp: Date.now(),
      entityType: "control",
      entityId: args.controlId,
    });

    // Update the control with revision information
    await ctx.db.patch(args.controlId, {
      ...(args.title && { title: args.title }),
      ...(args.description && { description: args.description }),
      ...(args.requirement && { requirement: args.requirement }),
      isRevised: true,
      revisionDate: Date.now(),
      revisionNotes: args.revisionNotes,
      lastUpdated: Date.now(),
      updatedBy: userId,
    });

    return { success: true };
  },
});

export const getComplianceStats = query({
  args: { organizationId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const orgId = args.organizationId || "default_org";

    const controls = await ctx.db
      .query("controls")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();
    
    const stats = {
      total: controls.length,
      notStarted: 0,
      inProgress: 0,
      implemented: 0,
      verified: 0,
      revised: controls.filter(c => c.isRevised).length,
      byDomain: {} as Record<string, any>,
    };

    controls.forEach((control) => {
      // Map status to correct property name
      const statusKey = control.status === "not_started" ? "notStarted" :
                       control.status === "in_progress" ? "inProgress" :
                       control.status;
      
      (stats as any)[statusKey]++;
      
      if (!stats.byDomain[control.domain]) {
        stats.byDomain[control.domain] = {
          total: 0,
          notStarted: 0,
          inProgress: 0,
          implemented: 0,
          verified: 0,
          revised: 0,
        };
      }
      
      stats.byDomain[control.domain].total++;
      (stats.byDomain[control.domain] as any)[statusKey]++;
      
      if (control.isRevised) {
        stats.byDomain[control.domain].revised++;
      }
    });

    return stats;
  },
});

// Internal functions for AI to access data
export const getComplianceStatsInternal = internalQuery({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      total: v.number(),
      notStarted: v.number(),
      inProgress: v.number(),
      implemented: v.number(),
      verified: v.number(),
      revised: v.number(),
      byDomain: v.any(),
    })
  ),
  handler: async (ctx) => {
    const orgId = "default_org";

    const controls = await ctx.db
      .query("controls")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();
    
    const stats = {
      total: controls.length,
      notStarted: 0,
      inProgress: 0,
      implemented: 0,
      verified: 0,
      revised: controls.filter(c => c.isRevised).length,
      byDomain: {} as Record<string, any>,
    };

    controls.forEach((control) => {
      // Map status to correct property name
      const statusKey = control.status === "not_started" ? "notStarted" :
                       control.status === "in_progress" ? "inProgress" :
                       control.status;
      
      (stats as any)[statusKey]++;
      
      if (!stats.byDomain[control.domain]) {
        stats.byDomain[control.domain] = {
          total: 0,
          notStarted: 0,
          inProgress: 0,
          implemented: 0,
          verified: 0,
          revised: 0,
        };
      }
      
      stats.byDomain[control.domain].total++;
      (stats.byDomain[control.domain] as any)[statusKey]++;
      
      if (control.isRevised) {
        stats.byDomain[control.domain].revised++;
      }
    });

    return stats;
  },
});

export const listControlsInternal = internalQuery({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const orgId = "default_org";

    return await ctx.db
      .query("controls")
      .filter((q) => q.eq(q.field("organizationId"), orgId))
      .collect();
  },
});
