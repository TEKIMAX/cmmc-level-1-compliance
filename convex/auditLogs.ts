import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAuditLogs = query({
  args: {
    controlId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    if (args.controlId) {
      const logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_org_control", (q) => q.eq("organizationId", "default_org" as any).eq("controlId", args.controlId!))
        .order("desc")
        .take(args.limit || 100);

      // Get user details for each log
      const logsWithUsers = await Promise.all(
        logs.map(async (log) => {
          const user = log.performedBy ? await ctx.db.get(log.performedBy) : null;
          return {
            ...log,
            userName: user?.name || "Unknown User",
          };
        })
      );

      return logsWithUsers;
    }

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_organization", (q) => q.eq("organizationId", "default_org" as any))
      .order("desc")
      .take(args.limit || 100);

    // Get user details for each log
    const logsWithUsers = await Promise.all(
      logs.map(async (log) => {
        const user = log.performedBy ? await ctx.db.get(log.performedBy) : null;
        return {
          ...log,
          userName: user?.name || "Unknown User",
        };
      })
    );

    return logsWithUsers;
  },
});

export const getControlAuditHistory = query({
  args: { controlId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_org_control", (q) => q.eq("organizationId", "default_org" as any).eq("controlId", args.controlId))
      .order("desc")
      .collect();

    // Get user details for each log
    const logsWithUsers = await Promise.all(
      logs.map(async (log) => {
        const user = log.performedBy ? await ctx.db.get(log.performedBy) : null;
        return {
          ...log,
          userName: user?.name || "Unknown User",
        };
      })
    );

    return logsWithUsers;
  },
});

export const getAuditStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_organization", (q) => q.eq("organizationId", "default_org" as any))
      .collect();
    
    const stats = {
      totalChanges: logs.length,
      recentChanges: logs.filter(log => log.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
      statusChanges: logs.filter(log => log.action === "status_update").length,
      uniqueControls: new Set(logs.map(log => log.controlId)).size,
    };

    return stats;
  },
});
