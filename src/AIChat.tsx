import { useState } from "react";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import type { Doc } from "../convex/_generated/dataModel";
import { AIModelSettings, type AISettings } from "./AIModelSettings";
import { DocumentManager } from "./DocumentManager";
import { Settings, Bot, Send, FileText, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";

interface AIChatProps {
  control: Doc<"controls">;
  onClose: () => void;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: number;
}

export function AIChat({ control, onClose }: AIChatProps) {
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

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-96 bg-zinc-800 shadow-2xl border-l border-zinc-700 z-50 flex flex-col backdrop-blur">
        {/* Header */}
        <div className="bg-zinc-700 text-white p-4 flex items-center justify-between border-b border-zinc-600">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-zinc-300 truncate">
                {aiSettings.useLocalModel
                  ? `Local: ${aiSettings.selectedModel}`
                  : `Cloud: ${aiSettings.selectedModel}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDocuments(true)}
              className="text-zinc-300 hover:text-white transition-colors p-1 rounded"
              title="Manage Documents"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-zinc-300 hover:text-white transition-colors p-1 rounded"
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-white text-black"
                    : "bg-zinc-700 text-zinc-100"
                }`}
              >
                <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0 text-sm leading-relaxed">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-2 last:mb-0">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm mb-1">{children}</li>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-700 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-zinc-700 p-4">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this control..."
              className="flex-1 resize-none bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 px-3 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <AIModelSettings
          isOpen={showSettings}
          currentSettings={aiSettings}
          onSettingsChange={setAiSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Documents Modal */}
      {showDocuments && (
        <DocumentManager
          isOpen={showDocuments}
          onClose={() => setShowDocuments(false)}
        />
      )}
    </>
  );
}
