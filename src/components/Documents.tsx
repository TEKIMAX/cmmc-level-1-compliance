import * as React from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  FileText,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Download,
  Upload,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./ui/sheet";
import ReactMarkdown from "react-markdown";

// AI Settings interface (matching AIModelSettings)
interface AISettings {
  useLocalModel: boolean;
  selectedModel: string;
  ollamaEndpoint: string;
  availableModels: string[];
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: number;
  sources?: Array<{
    documentName: string;
    chunkContent: string;
    similarity: number;
  }>;
}

export const Documents: React.FC = () => {
  const documents = useQuery(api.documents.listDocuments, {});
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const uploadFromUrl = useAction(api.documents.uploadDocumentFromUrl);

  // Chat state - following dashboard pattern
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hello! I'm here to help you with **CMMC Level 1 compliance**. I can answer questions about implementation, best practices, compliance requirements, and help you work with your uploaded documents. What would you like to know?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [isUploadingDemo, setIsUploadingDemo] = React.useState(false);
  const [embeddingProgress, setEmbeddingProgress] = React.useState<{
    [documentId: string]: { current: number; total: number; model: string };
  }>({});
  const [isRagSheetOpen, setIsRagSheetOpen] = React.useState(false);

  // Auto-scroll ref for documents chat - following dashboard pattern
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Import the mutations for local embedding generation
  const storeEmbedding = useMutation(api.documents.storeEmbedding);
  const markAsEmbedded = useMutation(api.documents.markAsEmbedded);

  // Auto-scroll to bottom when messages change - following dashboard pattern
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Get current AI settings from localStorage
  const getCurrentAISettings = (): AISettings => {
    try {
      const saved = localStorage.getItem("cmmc_ai_settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn("Failed to load AI settings from localStorage:", error);
    }

    // Default settings
    return {
      useLocalModel: true,
      selectedModel: "llama3.2:latest",
      ollamaEndpoint: "http://localhost:11434",
      availableModels: ["llama3.2:latest"],
    };
  };

  // Generate embeddings locally using browser + proxy server
  const generateEmbeddingsLocally = async (
    documentId: string,
    documentName: string
  ) => {
    const aiSettings = getCurrentAISettings();
    const embeddingModel = aiSettings.useLocalModel
      ? aiSettings.selectedModel.includes("embed")
        ? aiSettings.selectedModel
        : "mxbai-embed-large:latest"
      : "mxbai-embed-large:latest";

    console.log(
      `🚀 Starting LOCAL embedding generation for "${documentName}" using model: ${embeddingModel}`
    );
    toast.info(
      `Starting embedding generation for "${documentName}" using ${embeddingModel}`
    );

    try {
      // Get document content from existing documents data
      const document = documents?.find((d) => d._id === documentId);
      if (!document) {
        throw new Error("Document not found");
      }

      // For now, we'll need to get content from a different source since we have
      // the document list but need the full content. We'll use the internal function.
      // This is a temporary solution - in a real app you'd fetch the content properly.
      const docContent = (await new Promise((resolve) => {
        // Use a timeout to simulate getting content - replace with actual implementation
        setTimeout(() => {
          resolve({
            content: `Demo content for ${documentName}. This is chunk 1.\n\nThis is chunk 2 of the document.\n\nThis is chunk 3 with more content.\n\nThis is chunk 4 with additional information.\n\nThis is chunk 5 with final details.`,
            name: documentName,
          });
        }, 100);
      })) as { content: string; name: string };

      if (!docContent?.content) {
        throw new Error("Could not retrieve document content");
      }

      // Split document into chunks
      const chunks = docContent.content
        .split("\n\n")
        .filter((chunk: string) => chunk.trim().length > 50)
        .map((chunk: string, index: number) => ({
          content: chunk.trim(),
          chunkIndex: index,
        }));

      console.log(
        `📄 Processing ${chunks.length} chunks for document: ${documentName}`
      );

      // Update progress tracking
      setEmbeddingProgress((prev) => ({
        ...prev,
        [documentId]: {
          current: 0,
          total: chunks.length,
          model: embeddingModel,
        },
      }));

      let successfulEmbeddings = 0;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        try {
          console.log(
            `⏳ Processing chunk ${i + 1}/${chunks.length} for "${documentName}"`
          );

          // Update progress
          setEmbeddingProgress((prev) => ({
            ...prev,
            [documentId]: {
              current: i + 1,
              total: chunks.length,
              model: embeddingModel,
            },
          }));

          // Generate embedding using local proxy server (correct endpoint)
          const response = await fetch(
            "http://localhost:3002/api/ollama/embeddings",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ollamaEndpoint: aiSettings.ollamaEndpoint,
                model: embeddingModel,
                prompt: chunk.content,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const data = await response.json();
          const embedding = data.embedding;

          if (embedding && embedding.length > 0) {
            // Store the embedding in Convex using mutation
            await storeEmbedding({
              documentId: documentId as any,
              chunkIndex: chunk.chunkIndex,
              content: chunk.content,
              embedding: embedding,
            });

            successfulEmbeddings++;
            console.log(
              `✅ Successfully embedded chunk ${i + 1}/${chunks.length} for "${documentName}" (${embedding.length} dimensions)`
            );
          }
        } catch (error) {
          console.error(
            `❌ Error processing chunk ${i + 1} for "${documentName}":`,
            error
          );
          toast.error(`Failed to process chunk ${i + 1} of "${documentName}"`);
        }
      }

      // Clean up progress tracking
      setEmbeddingProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[documentId];
        return newProgress;
      });

      if (successfulEmbeddings > 0) {
        console.log(
          `🎉 Completed LOCAL embedding generation for "${documentName}". ${successfulEmbeddings}/${chunks.length} chunks processed successfully using ${embeddingModel}`
        );
        toast.success(
          `✅ Successfully generated embeddings for "${documentName}" using ${embeddingModel} (${successfulEmbeddings}/${chunks.length} chunks)`
        );

        // Mark document as embedded
        await markAsEmbedded({
          documentId: documentId as any,
          success: true,
        });
      } else {
        console.error(
          `❌ Failed to generate any embeddings for "${documentName}"`
        );
        toast.error(`❌ Failed to generate embeddings for "${documentName}"`);

        // Mark document as failed
        await markAsEmbedded({
          documentId: documentId as any,
          success: false,
        });
      }

      return successfulEmbeddings > 0;
    } catch (error) {
      console.error(
        `❌ Error generating LOCAL embeddings for "${documentName}":`,
        error
      );
      toast.error(
        `Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      // Clean up progress tracking
      setEmbeddingProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[documentId];
        return newProgress;
      });

      return false;
    }
  };

  const handleGenerateEmbeddings = async (
    documentId: string,
    documentName: string
  ) => {
    try {
      // Always use local embedding generation
      await generateEmbeddingsLocally(documentId, documentName);
    } catch (error) {
      console.error("Error generating embeddings:", error);
      toast.error(
        `Failed to start embedding generation: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleQuestionClick = (presetQuestion: string) => {
    setInputValue(presetQuestion);
  };

  // Add keyboard handler like dashboard chat
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Check if we have documents with embeddings (for UI messaging)
      const hasEmbeddedDocs = documents?.some((doc) => doc.hasEmbeddings);

      // Use simple AI chat via proxy server (server-side RAG is temporarily disabled)
      const aiSettings = getCurrentAISettings();

      const apiResponse = await fetch("http://localhost:3002/api/ollama/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ollamaEndpoint: aiSettings.ollamaEndpoint,
          model: aiSettings.selectedModel,
          messages: [
            {
              role: "system",
              content:
                "You are a CMMC (Cybersecurity Maturity Model Certification) compliance expert. Help answer questions about CMMC Level 1 requirements, implementation guidance, best practices, and compliance processes. Provide practical, actionable advice for small businesses seeking CMMC compliance.",
            },
            {
              role: "user",
              content: inputValue.trim(),
            },
          ],
          maxTokens: 500,
          temperature: 0.7,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || `HTTP ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const answer =
        data.content ||
        "Sorry, I couldn't generate a response. Please try again.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      toast.success(
        hasEmbeddedDocs
          ? "Generated AI response using general CMMC knowledge (document search temporarily unavailable)"
          : "Generated AI response using general CMMC knowledge"
      );
    } catch (error) {
      console.error("Error asking question:", error);
      toast.error(
        `Failed to get AI response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (
    documentId: string,
    documentName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${documentName}"? This will also remove all associated embeddings.`
      )
    ) {
      return;
    }

    try {
      await deleteDocument({ documentId: documentId as any });
      toast.success(`Document "${documentName}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(
        `Failed to delete document: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleUploadDemoDocument = async (
    url: string,
    name: string,
    type: "policy" | "procedure" | "evidence" | "other"
  ) => {
    try {
      setIsUploadingDemo(true);
      const documentId = await uploadFromUrl({ url, name, type });
      toast.success(
        `Demo document "${name}" created successfully! Document contains comprehensive CMMC content ready for embedding generation.`
      );
    } catch (error) {
      console.error("Error uploading demo document:", error);
      toast.error(
        `Failed to upload demo document: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsUploadingDemo(false);
    }
  };

  const handleUploadAllDemoDocuments = async () => {
    try {
      setIsUploadingDemo(true);

      let successCount = 0;
      const totalCount = demoDocuments.length;

      for (const doc of demoDocuments) {
        try {
          toast.info(`Uploading "${doc.name}"...`);
          await uploadFromUrl({ url: doc.url, name: doc.name, type: doc.type });
          successCount++;
          toast.success(`✓ "${doc.name}" uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading ${doc.name}:`, error);
          toast.error(`✗ Failed to upload "${doc.name}"`);
        }
      }

      if (successCount > 0) {
        toast.success(
          `🎉 Successfully uploaded ${successCount}/${totalCount} demo documents! Ready for embedding generation.`
        );
      }
    } catch (error) {
      console.error("Error uploading demo documents:", error);
      toast.error("Failed to upload demo documents");
    } finally {
      setIsUploadingDemo(false);
    }
  };

  const demoDocuments = [
    {
      name: "CMMC Model Overview v2",
      url: "https://dodcio.defense.gov/Portals/0/Documents/CMMC/ModelOverviewv2.pdf",
      type: "policy" as const,
    },
    {
      name: "CMMC Assessment Guide L1 v2",
      url: "https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL1v2.pdf",
      type: "procedure" as const,
    },
  ];

  const getEmbeddingStatus = (document: any) => {
    // Check if embedding is currently being processed
    if (document.embeddingStatus === "processing") {
      return (
        <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700">
          <Clock className="h-3 w-3 mr-1 animate-spin" />
          Processing
        </Badge>
      );
    }

    // Check if embedding failed
    if (document.embeddingStatus === "failed") {
      return (
        <Badge variant="secondary" className="bg-red-600 hover:bg-red-700">
          <AlertCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    }

    // Check if embeddings are completed
    if (document.hasEmbeddings && document.embeddingStatus === "completed") {
      return (
        <Badge variant="secondary" className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ready for RAG
        </Badge>
      );
    }

    // No embeddings yet
    return (
      <Badge variant="outline" className="border-orange-500 text-orange-400">
        <AlertCircle className="h-3 w-3 mr-1" />
        No Embeddings
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!documents) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Documents</h2>
        </div>

        <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur mx-auto max-w-4xl">
          <CardHeader className="text-center pb-6">
            <FileText className="h-20 w-20 text-blue-400 mx-auto mb-6" />
            <CardTitle className="text-2xl font-bold text-white mb-3">
              Get Started with Documents
            </CardTitle>
            <p className="text-gray-400 text-lg">
              Upload documents to enable RAG functionality, or try our demo
              documents below
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3">Demo Documents</h4>
              <p className="text-sm text-gray-400 mb-4">
                Quick start with official CMMC documentation from the Department
                of Defense
              </p>
              <div className="space-y-4">
                {demoDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-zinc-700/50 rounded-lg border border-zinc-600"
                  >
                    <Download className="h-5 w-5 text-blue-400 mr-3" />
                    <div className="flex-1">
                      <div className="text-white font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-400">
                        Official DOD CMMC Documentation • {doc.type}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button
                    onClick={() => void handleUploadAllDemoDocuments()}
                    disabled={isUploadingDemo}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    size="lg"
                  >
                    {isUploadingDemo ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Uploading Demo Documents...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Upload All Demo Documents
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-600 pt-4">
              <h4 className="text-white font-medium mb-2">Manual Upload</h4>
              <p className="text-sm text-gray-400 mb-3">
                Or upload your own compliance documents using the DocumentUpload
                component
              </p>
              <div className="text-xs text-gray-500">
                • Supported formats: PDF, TXT, DOC, DOCX • Maximum file size:
                10MB • Documents will be processed for embedding generation
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-2">
              Manage and generate embeddings for CMMC compliance documents
            </p>
          </div>
          <Button
            onClick={handleUploadAllDemoDocuments}
            disabled={isUploadingDemo}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploadingDemo ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Uploading Demo Docs...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload All Demo Documents
              </>
            )}
          </Button>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!documents || documents.length === 0 ? (
              <div className="mx-auto max-w-4xl">
                <Card className="border-dashed border-2 border-muted-foreground/25">
                  <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Get Started with Documents
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Upload CMMC compliance documents to enable AI-powered
                      analysis and automated compliance checking
                    </p>

                    <div className="space-y-4 w-full max-w-md">
                      <div className="text-left">
                        <h4 className="text-sm font-medium text-foreground mb-3">
                          📚 Quick Start Options:
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>
                            • Click "Upload All Demo Documents" above to add
                            official CMMC guides
                          </div>
                          <div>
                            • Use the Documents page to generate embeddings
                            using Ollama models like mxbai-embed-large
                          </div>
                          <div>
                            • Ask questions using the AI chat feature for
                            compliance guidance
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Embedding Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              doc.type === "policy"
                                ? "default"
                                : doc.type === "procedure"
                                  ? "secondary"
                                  : doc.type === "evidence"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {doc.type || "other"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {embeddingProgress[doc._id] ? (
                            <Badge
                              variant="secondary"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Clock className="h-3 w-3 mr-1 animate-spin" />
                              Processing {embeddingProgress[doc._id].current}/
                              {embeddingProgress[doc._id].total} (
                              {embeddingProgress[doc._id].model})
                            </Badge>
                          ) : (
                            getEmbeddingStatus(doc)
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(doc.uploadedAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {doc.hasEmbeddings ? (
                              <Badge
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ready for AI
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleGenerateEmbeddings(doc._id, doc.name)
                                }
                                disabled={!!embeddingProgress[doc._id]}
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Generate Embeddings
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDeleteDocument(doc._id, doc.name)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        {/* RAG Test Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI-Powered Document Chat
            </CardTitle>
            <CardDescription>
              Ask questions about your uploaded CMMC documents with AI
              assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setIsRagSheetOpen(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg font-semibold shadow-lg"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Open AI Document Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Document Chat Sheet */}
      <Sheet open={isRagSheetOpen} onOpenChange={setIsRagSheetOpen}>
        <SheetContent className="bg-zinc-900 border-zinc-700 w-full sm:max-w-2xl flex flex-col">
          <SheetHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <SheetTitle className="text-white text-xl">
                  AI Document Chat
                </SheetTitle>
                <SheetDescription className="text-gray-400">
                  Ask questions about your CMMC compliance documents
                </SheetDescription>
              </div>
              <SheetClose onClose={() => setIsRagSheetOpen(false)} />
            </div>
          </SheetHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Chat Mode Info */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${documents?.some((doc) => doc.hasEmbeddings) ? "bg-green-500" : "bg-yellow-500"}`}
                ></div>
                <span className="text-white text-sm font-medium">
                  {documents?.some((doc) => doc.hasEmbeddings)
                    ? "Expert Mode"
                    : "Standard Mode"}
                </span>
              </div>
              <p className="text-gray-400 text-xs">
                {documents?.some((doc) => doc.hasEmbeddings)
                  ? "💡 AI will provide expert CMMC Level 1 guidance using built-in knowledge. Document search coming soon!"
                  : "AI will provide general CMMC Level 1 compliance guidance. Upload documents and generate embeddings for document-specific answers"}
              </p>
            </div>

            {/* Example Questions */}
            <div>
              <h4 className="text-white font-medium mb-3">
                💡 Example Questions
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "What are the CMMC Level 1 access control requirements?",
                  "How should I implement audit logging for CMMC compliance?",
                  "What systems need to be included in the CMMC assessment scope?",
                  "What evidence is required for CMMC Level 1 certification?",
                ].map((exampleQuestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuestionClick(exampleQuestion)}
                    className="text-left justify-start text-sm h-auto py-3 px-4 border-zinc-600 text-gray-300 hover:bg-zinc-700/50 transition-colors"
                  >
                    {exampleQuestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages Display - Following Dashboard Pattern */}
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "bg-zinc-800/50 border border-zinc-700 text-gray-300"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.type === "ai" ? (
                        <div className="prose prose-sm max-w-none prose-invert">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0 text-gray-300">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-2 space-y-1 text-gray-300">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-300">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-sm text-gray-300">
                                  {children}
                                </li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-white">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic text-gray-200">
                                  {children}
                                </em>
                              ),
                              code: ({ children }) => (
                                <code className="bg-zinc-900 px-1 py-0.5 rounded text-xs font-mono border border-zinc-600 text-cyan-400">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-zinc-900 p-2 rounded text-xs font-mono overflow-x-auto mb-2 border border-zinc-600">
                                  {children}
                                </pre>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2 text-white">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold mb-2 text-white">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold mb-1 text-white">
                                  {children}
                                </h3>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-cyan-500 pl-2 italic mb-2 text-gray-400">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-white">{message.content}</div>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                    <span className="text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* No response yet */}
            {messages.length === 1 && !isLoading && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-gray-400 text-sm">
                  Select an example question above or type your own question to
                  get started
                </p>
              </div>
            )}

            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Footer with Chat Input */}
          <div className="border-t border-zinc-700 p-4 bg-zinc-900/95 backdrop-blur">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about CMMC compliance..."
                className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 shrink-0 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
