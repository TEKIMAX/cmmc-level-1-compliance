import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Shield,
  BookOpen,
  Settings,
  Users,
  Database,
  ArrowLeft,
  ExternalLink,
  Github,
  Download,
  Server,
  Lock,
  Zap,
} from "lucide-react";

interface DocumentationProps {
  onBack: () => void;
}

export function Documentation({ onBack }: DocumentationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-white to-zinc-200 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                CMMC Compass Documentation
              </h1>
              <p className="text-zinc-300">
                Complete guide to using the open-source CMMC compliance platform
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="bg-zinc-800/50 border-zinc-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-white" />
              Quick Start
            </CardTitle>
            <CardDescription className="text-zinc-300">
              Get up and running with CMMC Compass in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-600">
                <div className="text-white font-semibold mb-2">1. Sign Up</div>
                <p className="text-sm text-zinc-300">
                  Create your account or sign in anonymously to get started
                </p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-600">
                <div className="text-white font-semibold mb-2">
                  2. Initialize Controls
                </div>
                <p className="text-sm text-zinc-300">
                  The system automatically loads all 17 CMMC Level 1 controls
                </p>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-600">
                <div className="text-white font-semibold mb-2">
                  3. Start Tracking
                </div>
                <p className="text-sm text-zinc-300">
                  Begin updating control statuses and tracking your progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                Core Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">
                      Control Management
                    </div>
                    <p className="text-sm text-zinc-400">
                      Track all 17 CMMC Level 1 controls with status updates,
                      notes, and assignments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">
                      Progress Tracking
                    </div>
                    <p className="text-sm text-zinc-400">
                      Real-time dashboards showing compliance progress across
                      all domains
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">AI Assistant</div>
                    <p className="text-sm text-zinc-400">
                      Get contextual help and guidance for each control
                      implementation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-200 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Audit Logs</div>
                    <p className="text-sm text-zinc-400">
                      Complete audit trail of all changes and activities
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-white" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">
                      Built with Convex
                    </div>
                    <p className="text-sm text-zinc-400">
                      Real-time database with automatic synchronization
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">React Frontend</div>
                    <p className="text-sm text-zinc-400">
                      Modern, responsive interface built with React and Tailwind
                      CSS
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">TypeScript</div>
                    <p className="text-sm text-zinc-400">
                      Fully typed codebase for better development experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-200 rounded-full mt-2"></div>
                  <div>
                    <div className="text-white font-medium">Open Source</div>
                    <p className="text-sm text-zinc-400">
                      Apache 2.0 licensed, community-driven development
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CMMC Level 1 Controls */}
        <Card className="bg-zinc-800/50 border-zinc-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-white" />
              CMMC Level 1 Controls Coverage
            </CardTitle>
            <CardDescription className="text-zinc-300">
              Complete coverage of all NIST SP 800-171 Rev.2 practices required
              for CMMC Level 1
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  domain: "Access Control",
                  controls: ["3.1.1", "3.1.2", "3.1.20"],
                  color: "bg-blue-600",
                },
                {
                  domain: "Awareness and Training",
                  controls: ["3.2.1"],
                  color: "bg-green-600",
                },
                {
                  domain: "Audit and Accountability",
                  controls: ["3.3.1", "3.3.2"],
                  color: "bg-purple-600",
                },
                {
                  domain: "Configuration Management",
                  controls: ["3.4.2", "3.4.5"],
                  color: "bg-yellow-600",
                },
                {
                  domain: "Identification and Authentication",
                  controls: ["3.5.1", "3.5.2"],
                  color: "bg-red-600",
                },
                {
                  domain: "System and Communications Protection",
                  controls: [
                    "3.13.1",
                    "3.13.2",
                    "3.13.5",
                    "3.13.8",
                    "3.13.10",
                    "3.13.11",
                    "3.13.16",
                  ],
                  color: "bg-indigo-600",
                },
              ].map((domain) => (
                <div
                  key={domain.domain}
                  className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-600"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full ${domain.color}`}
                    ></div>
                    <h4 className="font-semibold text-white text-sm">
                      {domain.domain}
                    </h4>
                  </div>
                  <div className="space-y-1">
                    {domain.controls.map((control) => (
                      <Badge
                        key={control}
                        variant="outline"
                        className="text-xs mr-1 mb-1 border-zinc-600 text-zinc-300"
                      >
                        {control}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="bg-zinc-800/50 border-zinc-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-white" />
              AI Assistant Features
            </CardTitle>
            <CardDescription className="text-zinc-300">
              Get intelligent help with CMMC compliance implementation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Cloud Models</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white border-blue-500">
                      GPT-4o-mini
                    </Badge>
                    <span className="text-sm text-zinc-400">
                      Enhanced reasoning
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Local Models</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white border-green-500">
                      Ollama Support
                    </Badge>
                    <span className="text-sm text-zinc-400">
                      Self-hosted AI
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white border-green-500">
                      Privacy First
                    </Badge>
                    <span className="text-sm text-zinc-400">
                      Data stays local
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Help */}
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-white" />
              Getting Help & Contributing
            </CardTitle>
            <CardDescription className="text-zinc-300">
              Join the community and contribute to the project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Community Support</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Issues
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-semibold">Contributing</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Fork Repository
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    <Server className="w-4 h-4 mr-2" />
                    Development Setup
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
