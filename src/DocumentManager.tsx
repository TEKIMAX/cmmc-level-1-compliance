import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Plus,
  Upload,
  File,
} from "lucide-react";
import { toast } from "sonner";

interface DocumentManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentManager({ isOpen, onClose }: DocumentManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [newDocType, setNewDocType] = useState<
    "policy" | "procedure" | "evidence" | "other"
  >("other");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documents = useQuery(api.documents.listDocuments, {}) || [];
  const uploadDocument = useMutation(api.documents.uploadDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const handleCreateDocument = async () => {
    if (!newDocName.trim() || !newDocContent.trim()) {
      toast.error("Please provide both name and content for the document");
      return;
    }

    setIsCreating(true);
    try {
      await uploadDocument({
        name: newDocName.trim(),
        content: newDocContent.trim(),
        type: newDocType,
      });

      toast.success("Document created successfully!");
      setNewDocName("");
      setNewDocContent("");
      setNewDocType("other");
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Failed to create document");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, TXT, DOC, or DOCX file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      let content = "";
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension

      // Extract text content based on file type
      if (file.type === "text/plain") {
        content = await file.text();
      } else if (file.type === "application/pdf") {
        // For PDF files, we'll create a placeholder with metadata
        // In a real app, you'd use a PDF parsing library like pdf-parse or PDF.js
        content = `[PDF Document: ${file.name}]

This PDF document has been uploaded to the system. The content would be extracted using a PDF parsing library in a production environment.

File Details:
- Name: ${file.name}
- Size: ${(file.size / 1024).toFixed(1)} KB
- Type: PDF Document
- Upload Date: ${new Date().toLocaleString()}

Note: For full PDF text extraction, consider using libraries like pdf-parse, PDF.js, or similar tools to convert PDF content to searchable text.`;
      } else {
        // For DOC/DOCX files, create a placeholder
        content = `[Document: ${file.name}]

This document has been uploaded to the system. The content would be extracted using a document parsing library in a production environment.

File Details:
- Name: ${file.name}
- Size: ${(file.size / 1024).toFixed(1)} KB
- Type: ${file.type.includes("word") ? "Word Document" : "Document"}
- Upload Date: ${new Date().toLocaleString()}

Note: For full document text extraction, consider using libraries like mammoth.js for Word documents or similar tools to convert document content to searchable text.`;
      }

      // Determine document type based on filename
      let docType: "policy" | "procedure" | "evidence" | "other" = "other";
      const lowerName = fileName.toLowerCase();
      if (lowerName.includes("policy") || lowerName.includes("policies")) {
        docType = "policy";
      } else if (
        lowerName.includes("procedure") ||
        lowerName.includes("process")
      ) {
        docType = "procedure";
      } else if (
        lowerName.includes("evidence") ||
        lowerName.includes("audit") ||
        lowerName.includes("compliance")
      ) {
        docType = "evidence";
      }

      await uploadDocument({
        name: fileName,
        content: content,
        type: docType,
      });

      toast.success(`File "${file.name}" uploaded successfully!`);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (
    documentId: Id<"documents">,
    documentName: string
  ) => {
    if (!confirm(`Are you sure you want to delete "${documentName}"?`)) {
      return;
    }

    try {
      await deleteDocument({ documentId });
      toast.success("Document deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete document");
    }
  };

  const getEmbeddingStatusBadge = (document: any) => {
    if (document.embeddingStatus === "processing") {
      return (
        <Badge variant="secondary" className="bg-blue-600 hover:bg-blue-700">
          <Clock className="h-3 w-3 mr-1 animate-spin" />
          Processing
        </Badge>
      );
    }

    if (document.embeddingStatus === "failed") {
      return (
        <Badge variant="secondary" className="bg-red-600 hover:bg-red-700">
          <AlertCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      );
    }

    if (document.hasEmbeddings && document.embeddingStatus === "completed") {
      return (
        <Badge variant="secondary" className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ready for RAG
        </Badge>
      );
    }

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-zinc-800/90 border-zinc-700 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              Document Manager
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-zinc-300 hover:text-white hover:bg-zinc-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Upload Documents
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-white text-black hover:bg-zinc-200"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload File"}
                    </Button>
                    <Button
                      onClick={() => setIsCreating(!isCreating)}
                      variant="outline"
                      size="sm"
                      className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Document
                    </Button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                />
              </div>

              {/* Text Creation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Create Text Document
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="Document name..."
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Type
                      </label>
                      <select
                        value={newDocType}
                        onChange={(e) =>
                          setNewDocType(
                            e.target.value as
                              | "policy"
                              | "procedure"
                              | "evidence"
                              | "other"
                          )
                        }
                        className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                      >
                        <option value="policy">Policy</option>
                        <option value="procedure">Procedure</option>
                        <option value="evidence">Evidence</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">
                      Content
                    </label>
                    <textarea
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                      placeholder="Enter document content..."
                      rows={4}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white resize-none"
                    />
                  </div>
                  <Button
                    onClick={() => void handleCreateDocument()}
                    disabled={
                      isCreating || !newDocName.trim() || !newDocContent.trim()
                    }
                    className="w-full bg-white text-black hover:bg-zinc-200"
                  >
                    {isCreating ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Document
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Your Documents
                  </h3>
                  <div className="text-sm text-gray-400">
                    {documents.length} document
                    {documents.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No documents created yet</p>
                    <p className="text-sm">
                      Upload files or create text documents to enhance AI
                      responses
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <Card
                        key={doc._id}
                        className="bg-zinc-800 border-zinc-700"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <File className="w-5 h-5 text-blue-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-white truncate">
                                    {doc.name}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className="capitalize text-xs"
                                  >
                                    {doc.type || "other"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span>{formatDate(doc.uploadedAt)}</span>
                                  {getEmbeddingStatusBadge(doc)}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                void handleDelete(doc._id, doc.name)
                              }
                              className="text-red-400 hover:text-red-300 hover:bg-red-600/20 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  • Documents uploaded/created here will be available for RAG
                  functionality
                </p>
                <p>
                  • Use the Documents page to generate embeddings using Ollama
                  models like mxbai-embed-large
                </p>
                <p>
                  • For full PDF/DOC text extraction, consider integrating
                  pdf-parse or mammoth.js libraries
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
