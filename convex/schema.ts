import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(),
    joinedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"]),

  controls: defineTable({
    organizationId: v.optional(v.string()),
    controlId: v.string(),
    domain: v.string(),
    title: v.string(),
    description: v.string(),
    requirement: v.string(),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("implemented"),
      v.literal("verified")
    ),
    implementationNotes: v.optional(v.string()),
    evidenceLinks: v.optional(v.array(v.string())),
    assignedTo: v.optional(v.union(v.id("users"), v.string())),
    dueDate: v.optional(v.number()),
    lastUpdated: v.number(),
    isRevised: v.optional(v.boolean()),
    updatedBy: v.optional(v.id("users")),
    revisionDate: v.optional(v.number()),
    revisionNotes: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_domain", ["domain"])
    .index("by_org_domain", ["organizationId", "domain"]),

  assessments: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    status: v.union(
      v.literal("draft"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    completionDate: v.optional(v.number()),
    overallScore: v.optional(v.number()),
  }).index("by_organization", ["organizationId"]),

  auditLogs: defineTable({
    organizationId: v.optional(v.string()),
    action: v.string(),
    details: v.optional(v.string()),
    performedBy: v.optional(v.id("users")),
    timestamp: v.number(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    controlId: v.optional(v.string()),
    previousStatus: v.optional(v.string()),
    newStatus: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    notes: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_org_control", ["organizationId", "controlId"]),

  aiSummaries: defineTable({
    userId: v.string(),
    summary: v.string(),
    recommendations: v.optional(v.array(v.string())),
    priorityActions: v.optional(v.string()),
    analysisDate: v.number(),
  }).index("by_user", ["userId"]),

  documents: defineTable({
    name: v.string(),
    content: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    type: v.optional(v.union(v.literal("policy"), v.literal("procedure"), v.literal("evidence"), v.literal("other"))),
    uploadedBy: v.optional(v.string()),
    uploadedAt: v.number(),
    hasEmbeddings: v.optional(v.boolean()),
    embeddedAt: v.optional(v.number()),
    embeddingStatus: v.optional(v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed"))),
    // Legacy fields for backward compatibility
    fileId: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    fileType: v.optional(v.string()),
    originalName: v.optional(v.string()),
    status: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_type", ["type"])
    .index("by_embeddings", ["hasEmbeddings"]),

  documentEmbeddings: defineTable({
    documentId: v.id("documents"),
    chunkIndex: v.number(),
    content: v.string(),
    embedding: v.array(v.number()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_chunk", ["documentId", "chunkIndex"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
