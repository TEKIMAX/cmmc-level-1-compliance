import { useState } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import type { Doc } from "../convex/_generated/dataModel";
import { AIModelSettings, type AISettings } from "./AIModelSettings";
import { DocumentManager } from "./DocumentManager";
import { Settings, Bot, Send, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";

interface AIChatProps {
  control: Doc<"controls">;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: number;
}

export function AIChat({ control, isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hello! I'm here to help you with **${control.controlId} - ${control.title}**. I can answer questions about implementation, best practices, compliance requirements, and common challenges for this CMMC Level 1 control. What would you like to know?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    useLocalModel: true,
    selectedModel: "llama3.2:latest",
    ollamaEndpoint: "http://localhost:11434",
    availableModels: ["llama3.2:latest"],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const askQuestion = useAction(api.ai.askControlQuestion);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      let response: string;

      if (aiSettings.useLocalModel) {
        // Call local API server directly for Ollama
        const apiResponse = await fetch(
          "http://localhost:3002/api/ollama/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ollamaEndpoint: aiSettings.ollamaEndpoint,
              model: aiSettings.selectedModel,
              messages: [
                {
                  role: "system",
                  content: `You are a CMMC (Cybersecurity Maturity Model Certification) compliance expert assistant. You are helping with a specific control:

Control ID: ${control.controlId}
Title: ${control.title}
Description: ${control.description}
Requirement: ${control.requirement}

Provide helpful, accurate guidance about implementing this specific CMMC Level 1 control. Focus on practical implementation steps, common challenges, best practices, and compliance requirements. Keep responses concise but comprehensive.`,
                },
                {
                  role: "user",
                  content: inputValue,
                },
              ],
              maxTokens: 500,
              temperature: 0.7,
            }),
          }
        );

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.error || `HTTP ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        response =
          data.content ||
          "Sorry, I couldn't generate a response. Please try again.";
      } else {
        // Use Convex for OpenAI
        response = await askQuestion({
          controlId: control.controlId,
          controlTitle: control.title,
          controlDescription: control.description,
          controlRequirement: control.requirement,
          question: inputValue,
          useLocalModel: false,
          selectedModel: aiSettings.selectedModel,
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          response ||
          "Sorry, I couldn't generate a response. Please try again.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
      console.error("AI chat error:", error);

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-96 bg-background shadow-2xl border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-80 truncate">
                {aiSettings.useLocalModel
                  ? `Local: ${aiSettings.selectedModel}`
                  : `Cloud: ${aiSettings.selectedModel}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDocuments(true)}
              className="text-primary-foreground hover:opacity-80 transition-opacity p-1 rounded"
              title="Manage Documents"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-primary-foreground hover:opacity-80 transition-opacity p-1 rounded"
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-primary-foreground hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Control Info */}
        <div className="bg-muted p-3 border-b border-border">
          <div className="text-xs font-medium text-foreground mb-1">
            {control.title}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {control.description}
          </div>
        </div>

        {/* Model Status Bar */}
        <div className="bg-muted/50 px-3 py-2 border-b border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${aiSettings.useLocalModel ? "bg-green-500" : "bg-blue-500"}`}
              ></div>
              <span className="text-muted-foreground">
                {aiSettings.useLocalModel ? "Local Model" : "Cloud Model"}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Change Model
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.type === "ai" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2 space-y-1">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2 space-y-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-sm">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="bg-background px-1 py-0.5 rounded text-xs font-mono border">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-background p-2 rounded text-xs font-mono overflow-x-auto mb-2 border">
                              {children}
                            </pre>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold mb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-bold mb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-bold mb-1">
                              {children}
                            </h3>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-muted-foreground pl-2 italic mb-2">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.type === "user"
                      ? "opacity-80"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Invisible div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this control..."
              className="flex-1 text-sm border border-input bg-background rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>

      {/* Document Manager Modal */}
      <DocumentManager
        isOpen={showDocuments}
        onClose={() => setShowDocuments(false)}
      />

      {/* AI Model Settings Modal */}
      <AIModelSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={setAiSettings}
        currentSettings={aiSettings}
      />
    </>
  );
}
