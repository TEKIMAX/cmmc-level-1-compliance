import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Switch } from "./components/ui/switch";
import { RefreshCw, Cloud, Monitor, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AIModelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AISettings) => void;
  currentSettings: AISettings;
}

export interface AISettings {
  useLocalModel: boolean;
  selectedModel: string;
  ollamaEndpoint: string;
  availableModels: string[];
}

export function AIModelSettings({
  isOpen,
  onClose,
  onSettingsChange,
  currentSettings,
}: AIModelSettingsProps) {
  const [settings, setSettings] = useState<AISettings>(currentSettings);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "error"
  >("unknown");

  const cloudModels = ["gpt-4.1-nano", "gpt-4o-mini"];

  useEffect(() => {
    if (isOpen && settings.useLocalModel) {
      loadOllamaModels();
    }
  }, [isOpen, settings.useLocalModel, settings.ollamaEndpoint]);

  const loadOllamaModels = async () => {
    setIsLoadingModels(true);
    setConnectionStatus("unknown");

    try {
      // Call local API server instead of Convex action
      const response = await fetch(
        `http://localhost:3002/api/ollama/models?endpoint=${encodeURIComponent(settings.ollamaEndpoint)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const models = data.models || [];

      if (models.length > 0) {
        const modelNames = models.map((model: any) => model.name);
        setSettings((prev) => ({
          ...prev,
          availableModels: modelNames,
          selectedModel: modelNames.includes(prev.selectedModel)
            ? prev.selectedModel
            : modelNames[0],
        }));
        setConnectionStatus("connected");
        toast.success(`Found ${models.length} local models`);
      } else {
        setSettings((prev) => ({ ...prev, availableModels: [] }));
        setConnectionStatus("error");
        toast.error(
          "No models found. Make sure Ollama is running and has models installed."
        );
      }
    } catch (error) {
      console.error("Failed to load Ollama models:", error);
      setSettings((prev) => ({ ...prev, availableModels: [] }));
      setConnectionStatus("error");

      // Show specific error message
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      if (errorMessage.includes("Cannot connect to Ollama")) {
        toast.error(
          "Cannot connect to Ollama. Make sure Ollama is running on the specified endpoint."
        );
      } else if (
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("fetch")
      ) {
        toast.error(
          "Connection failed. Check if the local API server and Ollama are running."
        );
      } else {
        toast.error(`Failed to connect to Ollama: ${errorMessage}`);
      }
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSave = () => {
    onSettingsChange(settings);

    // Save settings to localStorage for embedding generation
    try {
      localStorage.setItem("cmmc_ai_settings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Failed to save AI settings to localStorage:", error);
    }

    onClose();
    toast.success("AI model settings saved");
  };

  const handleToggleModel = (useLocal: boolean) => {
    setSettings((prev) => ({
      ...prev,
      useLocalModel: useLocal,
      selectedModel: useLocal
        ? prev.availableModels.length > 0
          ? prev.availableModels[0]
          : "llama3.2:latest"
        : "gpt-4.1-nano",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              AI Model Configuration
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Model Type Toggle */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Model Provider</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all ${!settings.useLocalModel ? "ring-2 ring-primary" : "hover:bg-muted"}`}
              >
                <CardContent
                  className="p-4"
                  onClick={() => handleToggleModel(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Cloud Models</div>
                      <div className="text-sm text-muted-foreground">
                        OpenAI GPT models
                      </div>
                    </div>
                    <Switch
                      checked={!settings.useLocalModel}
                      onCheckedChange={(checked) => handleToggleModel(!checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${settings.useLocalModel ? "ring-2 ring-primary" : "hover:bg-muted"}`}
              >
                <CardContent
                  className="p-4"
                  onClick={() => handleToggleModel(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Local Models</div>
                      <div className="text-sm text-muted-foreground">
                        Ollama models
                      </div>
                    </div>
                    <Switch
                      checked={settings.useLocalModel}
                      onCheckedChange={handleToggleModel}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Local Model Configuration */}
          {settings.useLocalModel && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Local Model Configuration
              </h3>

              {/* Ollama Endpoint */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ollama Endpoint</label>
                <div className="flex gap-2">
                  <Input
                    value={settings.ollamaEndpoint}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        ollamaEndpoint: e.target.value,
                      }))
                    }
                    placeholder="http://localhost:11434"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={loadOllamaModels}
                    disabled={isLoadingModels}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoadingModels ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Connection Status */}
                <div className="flex items-center gap-2 text-sm">
                  {connectionStatus === "connected" && (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">
                        Connected to Ollama
                      </span>
                    </>
                  )}
                  {connectionStatus === "error" && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">Connection failed</span>
                    </>
                  )}
                  {connectionStatus === "unknown" && (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-muted-foreground">
                        Click refresh to test connection
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Available Models */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Models</label>
                {isLoadingModels ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading models...
                  </div>
                ) : settings.availableModels.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {settings.availableModels.map((model) => (
                      <Card
                        key={model}
                        className={`cursor-pointer transition-all ${
                          settings.selectedModel === model
                            ? "ring-2 ring-primary bg-primary/5"
                            : "hover:bg-muted"
                        }`}
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            selectedModel: model,
                          }))
                        }
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model}</span>
                            {settings.selectedModel === model && (
                              <Badge variant="default" className="text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                    No models found. Make sure Ollama is running and has models
                    installed.
                    <br />
                    <span className="text-xs">
                      Try: <code>ollama pull llama2</code>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cloud Model Configuration */}
          {!settings.useLocalModel && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Cloud Model Configuration
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Available Models</label>
                <div className="grid grid-cols-1 gap-2">
                  {cloudModels.map((model) => (
                    <Card
                      key={model}
                      className={`cursor-pointer transition-all ${
                        settings.selectedModel === model
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          selectedModel: model,
                        }))
                      }
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{model}</span>
                          {settings.selectedModel === model && (
                            <Badge variant="default" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
