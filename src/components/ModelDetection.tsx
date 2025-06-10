import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Loader2, CheckCircle, AlertTriangle, Zap } from "lucide-react";

interface ModelDetectionProps {
  onComplete: (hasModels: boolean) => void;
}

export const ModelDetection: React.FC<ModelDetectionProps> = ({
  onComplete,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStep, setDetectionStep] = useState<string>("Initializing...");
  const [ollamaStatus, setOllamaStatus] = useState<
    "unknown" | "running" | "stopped"
  >("unknown");
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const checkOllamaStatus = async () => {
    try {
      // Check if Ollama is running by trying to reach the API
      const response = await fetch("http://localhost:11434/api/tags", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        const models = data.models || [];
        setAvailableModels(models.map((m: any) => m.name));
        setOllamaStatus("running");
        return models.length > 0;
      } else {
        setOllamaStatus("stopped");
        return false;
      }
    } catch (error) {
      setOllamaStatus("stopped");
      return false;
    }
  };

  const handleDetection = async () => {
    setIsDetecting(true);

    try {
      setDetectionStep("Checking Ollama service...");
      const hasOllama = await checkOllamaStatus();

      if (hasOllama) {
        setDetectionStep("Models detected successfully!");
        setTimeout(() => onComplete(true), 1500);
      } else {
        setDetectionStep("No models found");
        setTimeout(() => onComplete(false), 2000);
      }
    } catch (error) {
      setDetectionStep("Detection failed");
      setTimeout(() => onComplete(false), 2000);
    }
  };

  useEffect(() => {
    // Auto-start detection after a brief delay
    const timer = setTimeout(() => {
      handleDetection();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl font-bold text-white">AI Setup Detection</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            {isDetecting ? (
              <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
            ) : ollamaStatus === "running" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            )}
            <span className="text-zinc-300">{detectionStep}</span>
          </div>

          {ollamaStatus === "running" && availableModels.length > 0 && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">
                Available Models:
              </h3>
              <div className="space-y-1">
                {availableModels.slice(0, 5).map((model, index) => (
                  <div key={index} className="text-xs text-zinc-400 font-mono">
                    {model}
                  </div>
                ))}
                {availableModels.length > 5 && (
                  <div className="text-xs text-zinc-500">
                    +{availableModels.length - 5} more models
                  </div>
                )}
              </div>
            </div>
          )}

          {ollamaStatus === "stopped" && (
            <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-amber-300 mb-2">
                Ollama Not Running
              </h3>
              <p className="text-xs text-amber-200 mb-3">
                To enable AI features, please start Ollama:
              </p>
              <div className="bg-zinc-800 border border-zinc-700 rounded p-2">
                <code className="text-xs text-cyan-400">ollama serve</code>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleDetection}
            disabled={isDetecting}
            className="flex-1"
          >
            {isDetecting ? "Detecting..." : "Retry Detection"}
          </Button>

          <Button
            onClick={() => onComplete(ollamaStatus === "running")}
            variant="outline"
            className="flex-1"
          >
            Continue
          </Button>
        </div>

        <div className="text-xs text-zinc-500">
          <p>
            This app works best with Ollama models like{" "}
            <code className="bg-zinc-800 px-1 rounded">llama3.2:latest</code>{" "}
            and{" "}
            <code className="bg-zinc-800 px-1 rounded">nomic-embed-text</code>
          </p>
        </div>
      </div>
    </div>
  );
};
