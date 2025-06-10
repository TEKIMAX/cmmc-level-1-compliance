import { v } from "convex/values";
import { mutation, query, action, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Ollama API base URL (via proxy server)
const OLLAMA_PROXY_URL = "http://localhost:3002/api/ollama";
const OLLAMA_BASE_URL = "http://localhost:11434";

// Detect available Ollama models
export const detectOllamaModels = action({
  args: {},
  returns: v.object({
    available: v.boolean(),
    models: v.array(v.object({
      name: v.string(),
      size: v.number(),
      digest: v.string(),
      details: v.object({
        family: v.string(),
        families: v.optional(v.array(v.string())),
        parameter_size: v.string(),
        quantization_level: v.string(),
      }),
    })),
    capabilities: v.object({
      textGeneration: v.boolean(),
      embeddings: v.boolean(),
      chatCompletion: v.boolean(),
    }),
  }),
  handler: async () => {
    try {
      // Use a more robust fetch with timeout and proper error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Ollama API responded with status: ${response.status}`);
        return {
          available: false,
          models: [],
          capabilities: {
            textGeneration: false,
            embeddings: false,
            chatCompletion: false,
          },
        };
      }

      const data = await response.json();
      const models = data.models || [];

      console.log(`Found ${models.length} Ollama models:`, models.map((m: any) => m.name));

      // Check capabilities based on available models
      const hasEmbeddingModel = models.some((m: any) => 
        m.name.includes('nomic-embed') || 
        m.name.includes('embed') ||
        m.name.includes('sentence')
      );
      
      const hasTextModel = models.some((m: any) => 
        m.name.includes('llama') || 
        m.name.includes('gemma') ||
        m.name.includes('mistral') ||
        m.name.includes('qwen') ||
        m.name.includes('codellama')
      );

      return {
        available: models.length > 0,
        models: models.map((model: any) => ({
          name: model.name,
          size: model.size || 0,
          digest: model.digest || "",
          details: {
            family: model.details?.family || "unknown",
            families: model.details?.families,
            parameter_size: model.details?.parameter_size || "unknown",
            quantization_level: model.details?.quantization_level || "unknown",
          },
        })),
        capabilities: {
          textGeneration: hasTextModel,
          embeddings: hasEmbeddingModel,
          chatCompletion: hasTextModel,
        },
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn("Ollama connection timed out - is Ollama running on http://localhost:11434?");
      } else {
        console.warn("Cannot connect to Ollama:", error instanceof Error ? error.message : String(error));
      }
      
      return {
        available: false,
        models: [],
        capabilities: {
          textGeneration: false,
          embeddings: false,
          chatCompletion: false,
        },
      };
    }
  },
});

// Generate embeddings for document chunks using Ollama
export const generateEmbeddings = action({
  args: {
    text: v.string(),
    model: v.optional(v.string()),
  },
  returns: v.array(v.number()),
  handler: async (ctx, args) => {
    const model = args.model || "mxbai-embed-large:latest";
    
    try {
      // Call Ollama directly from Convex action (no CORS issues on server side)
      const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          prompt: args.text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama embeddings API error: ${response.status}`);
      }

      const data = await response.json();
      const embedding = data.embedding;

      if (!embedding || !Array.isArray(embedding)) {
        throw new Error("Invalid embedding response from Ollama");
      }

      return embedding;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Ask control questions using only Ollama
export const askControlQuestion = action({
  args: {
    question: v.string(),
    controlId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  returns: v.object({
    answer: v.string(),
    sources: v.array(v.object({
      content: v.string(),
      metadata: v.object({
        documentName: v.string(),
        pageNumber: v.optional(v.number()),
        sectionTitle: v.optional(v.string()),
      }),
    })),
  }),
  handler: async (ctx, args) => {
    const model = args.model || "llama3.2:latest";
    
    // Get relevant document chunks using search
    let chunks: any[] = [];
    try {
      chunks = await ctx.runQuery("documents:searchDocuments" as any, {
        query: args.question,
        organizationId: args.organizationId || "default_org",
        limit: 3,
      });
    } catch (error) {
      console.warn("Could not search documents:", error);
    }
    
    // If we have a specific control, get its details
    let controlContext = "";
    if (args.controlId) {
      try {
        const controls: any[] = await ctx.runQuery("controls:listControlsInternal" as any, {});
        const control = controls.find((c: any) => c.controlId === args.controlId);
        if (control) {
          controlContext = `
Control Context:
- ID: ${control.controlId}
- Title: ${control.title}
- Description: ${control.description}
- Requirement: ${control.requirement}
- Current Status: ${control.status}
`;
        }
      } catch (error) {
        console.warn("Could not fetch control details:", error);
      }
    }

    const context: string = chunks.map((chunk: any) => chunk.content).join("\n\n");
    
    const prompt: string = `You are a CMMC (Cybersecurity Maturity Model Certification) expert assistant. Answer the following question based on the provided context and your knowledge of CMMC Level 1 requirements.

${controlContext}

Context from documents:
${context}

Question: ${args.question}

Please provide a comprehensive answer that:
1. Directly addresses the question
2. References relevant CMMC controls when applicable
3. Provides practical implementation guidance
4. Cites specific information from the provided context when relevant

Answer:`;

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const answer: string = data.response || "I'm unable to provide an answer at this time.";

      // Format sources
      const sources = chunks.map((chunk: any) => ({
        content: chunk.content.substring(0, 200) + "...",
        metadata: {
          documentName: chunk.document?.name || "Unknown Document",
          pageNumber: undefined,
          sectionTitle: undefined,
        },
      }));

      return {
        answer,
        sources,
      };
    } catch (error) {
      console.error("Error calling Ollama:", error);
      return {
        answer: "I'm unable to provide an answer at this time. Please ensure Ollama is running and the model is available.",
        sources: [],
      };
    }
  },
});

// Store the AI summary in the database (internal function)
export const storeReadinessSummary = internalMutation({
  args: {
    summary: v.string(),
    recommendations: v.optional(v.array(v.string())),
    priorityActions: v.optional(v.string()),
    analysisDate: v.number(),
  },
  returns: v.id("aiSummaries"),
  handler: async (ctx, args) => {
    // For now, we'll use a default user since this is called from an action
    // In a production app, you'd pass the userId through the action chain
    const userId = "default_user";

    // Delete any existing summary for this user
    const existingSummary = await ctx.db
      .query("aiSummaries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingSummary) {
      await ctx.db.delete(existingSummary._id);
    }

    return await ctx.db.insert("aiSummaries", {
      userId: userId,
      summary: args.summary,
      recommendations: args.recommendations,
      priorityActions: args.priorityActions,
      analysisDate: args.analysisDate,
    });
  },
});

// Get the current AI summary
export const getReadinessSummary = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("aiSummaries"),
      summary: v.string(),
      recommendations: v.optional(v.array(v.string())),
      priorityActions: v.optional(v.string()),
      analysisDate: v.number(),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // For now, use default user to match the storage
    const defaultUserId = "default_user";

    const summary = await ctx.db
      .query("aiSummaries")
      .withIndex("by_user", (q) => q.eq("userId", defaultUserId))
      .first();

    if (!summary) return null;

    // Return only the fields specified in the validator
    return {
      _id: summary._id,
      summary: summary.summary,
      recommendations: summary.recommendations,
      priorityActions: summary.priorityActions,
      analysisDate: summary.analysisDate,
    };
  },
});

// Generate a new AI summary
export const generateReadinessSummary = mutation({
  args: {
    model: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Schedule the AI action to run
    await ctx.scheduler.runAfter(0, "ai:generateSummaryAction" as any, {
      model: args.model || "llama3.2:latest",
    });
    return null;
  },
});

// Internal action to generate AI summary using Ollama
export const generateSummaryAction = action({
  args: {
    model: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const model = args.model || "llama3.2:latest";
    
    try {
      // Get compliance stats
      const stats: any = await ctx.runQuery("controls:getComplianceStatsInternal" as any, {});
      if (!stats) throw new Error("Unable to get compliance stats");

      // Get control details for context
      const controls: any[] = await ctx.runQuery("controls:listControlsInternal" as any, {});
      if (!controls) throw new Error("Unable to get controls");

      const completionPercentage: number = Math.round(
        ((stats.implemented + stats.verified) / stats.total) * 100
      );

      // Prepare context for AI
      const controlsByStatus = {
        implemented: controls.filter((c: any) => c.status === "implemented"),
        verified: controls.filter((c: any) => c.status === "verified"), 
        inProgress: controls.filter((c: any) => c.status === "in_progress"),
        notStarted: controls.filter((c: any) => c.status === "not_started"),
      };

      const domainBreakdown = stats.byDomain;

      // Create prompt for Ollama
      const prompt: string = `You are a CMMC (Cybersecurity Maturity Model Certification) compliance expert. Analyze the following CMMC Level 1 compliance data and provide a comprehensive readiness summary.

COMPLIANCE STATISTICS:
- Total Controls: ${stats.total}
- Implemented: ${stats.implemented}
- Verified: ${stats.verified}
- In Progress: ${stats.inProgress}
- Not Started: ${stats.notStarted}
- Overall Completion: ${completionPercentage}%

DOMAIN BREAKDOWN:
${Object.entries(domainBreakdown).map(([domain, stats]: [string, any]) => 
  `- ${domain}: ${stats.implemented + stats.verified}/${stats.total} complete (${Math.round(((stats.implemented + stats.verified) / stats.total) * 100)}%)`
).join('\n')}

CONTROLS NEEDING ATTENTION:
${controlsByStatus.notStarted.slice(0, 5).map((c: any) => `- ${c.controlId}: ${c.title}`).join('\n')}

Please provide:
1. A concise executive summary (2-3 sentences) about the organization's current compliance readiness
2. 3-5 specific, actionable recommendations for improving compliance
3. Priority actions focusing on the most critical gaps

Format your response as a JSON object with these fields:
{
  "summary": "executive summary text",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "priorityActions": "priority actions text"
}

Keep the language professional but accessible, focusing on practical next steps.`;

      // Call Ollama API
      const response: Response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: any = await response.json();
      let aiResponse: string = data.response;

      // Try to parse JSON from the response
      let parsedResponse: any;
      try {
        // Extract JSON from the response if it's wrapped in text
        const jsonStart: number = aiResponse.indexOf('{');
        const jsonEnd: number = aiResponse.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          aiResponse = aiResponse.substring(jsonStart, jsonEnd);
        }
        parsedResponse = JSON.parse(aiResponse);
      } catch (parseError) {
        // If JSON parsing fails, create a fallback response
        parsedResponse = {
          summary: "Based on current compliance data analysis, your organization shows progress in CMMC Level 1 implementation with ongoing opportunities for improvement.",
          recommendations: [
            "Focus on completing not-started controls in critical domains",
            "Implement documentation and evidence collection processes",
            "Establish regular compliance monitoring and review cycles",
            "Prioritize access control and incident response capabilities"
          ],
          priorityActions: "Immediate focus should be on completing foundational security controls and establishing robust documentation practices to support compliance verification."
        };
      }

      // Store the AI summary
      await ctx.runMutation("ai:storeReadinessSummary" as any, {
        summary: parsedResponse.summary || "AI analysis completed successfully.",
        recommendations: parsedResponse.recommendations || [],
        priorityActions: parsedResponse.priorityActions || "Continue working on compliance implementation.",
        analysisDate: Date.now(),
      });

    } catch (error) {
      console.error("Error generating AI summary:", error);
      
      // Store a fallback summary if AI generation fails
      await ctx.runMutation("ai:storeReadinessSummary" as any, {
        summary: "Unable to generate AI analysis at this time. Please ensure Ollama is running and try again.",
        recommendations: [
          "Check Ollama service status",
          "Verify model availability", 
          "Review system connectivity"
        ],
        priorityActions: "Resolve AI service issues to enable automated compliance analysis.",
        analysisDate: Date.now(),
      });
    }

    return null;
  },
});

// Query documents using RAG with embeddings
export const queryDocuments = action({
  args: {
    question: v.string(),
    embeddingModel: v.optional(v.string()),
    chatModel: v.optional(v.string()),
    maxResults: v.optional(v.number()),
  },
  returns: v.object({
    answer: v.string(),
    sources: v.array(v.object({
      documentName: v.string(),
      chunkContent: v.string(),
      similarity: v.number(),
    })),
  }),
  handler: async (ctx, args) => {
    // Disable server-side RAG for now since Convex actions can't access localhost:11434
    // The frontend will handle RAG using the proxy server or fall back to simple chat
    throw new Error("Server-side RAG is disabled. Using frontend fallback.");
  },
});

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Get all embeddings for RAG
export const getAllEmbeddings = query({
  args: {},
  returns: v.array(v.object({
    documentId: v.id("documents"),
    documentName: v.string(),
    chunkIndex: v.number(),
    content: v.string(),
    embedding: v.array(v.number()),
  })),
  handler: async (ctx) => {
    // Get all embeddings with document information
    const embeddings = await ctx.db.query("documentEmbeddings").collect();
    
    const results = [];
    for (const embedding of embeddings) {
      const document = await ctx.db.get(embedding.documentId);
      if (document) {
        results.push({
          documentId: embedding.documentId,
          documentName: document.name,
          chunkIndex: embedding.chunkIndex,
          content: embedding.content,
          embedding: embedding.embedding,
        });
      }
    }
    
    return results;
  },
});
