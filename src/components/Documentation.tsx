import * as React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Shield,
  BookOpen,
  Settings,
  Upload,
  MessageSquare,
  Zap,
  GitBranch,
  Download,
  ExternalLink,
  ChevronRight,
  Code,
  Database,
  Globe,
  Lock,
  Users,
  CheckCircle,
  AlertTriangle,
  Play,
  Server,
  FileText,
  Terminal,
} from "lucide-react";

interface DocSection {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  subsections?: { id: string; title: string }[];
}

const sections: DocSection[] = [
  {
    id: "overview",
    title: "Overview",
    icon: BookOpen,
    subsections: [
      { id: "introduction", title: "Introduction" },
      { id: "features", title: "Key Features" },
      { id: "architecture", title: "Architecture" },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    subsections: [
      { id: "installation", title: "Installation" },
      { id: "setup", title: "Initial Setup" },
      { id: "configuration", title: "Configuration" },
    ],
  },
  {
    id: "cmmc-compliance",
    title: "CMMC Compliance",
    icon: Shield,
    subsections: [
      { id: "level-1-controls", title: "Level 1 Controls" },
      { id: "implementation", title: "Implementation Guide" },
      { id: "assessment", title: "Assessment Process" },
    ],
  },
  {
    id: "ai-features",
    title: "AI Features",
    icon: MessageSquare,
    subsections: [
      { id: "local-ai", title: "Local AI with Ollama" },
      { id: "document-embedding", title: "Document Embedding" },
      { id: "rag-system", title: "RAG System" },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Code,
    subsections: [
      { id: "convex-functions", title: "Convex Functions" },
      { id: "data-models", title: "Data Models" },
      { id: "authentication", title: "Authentication" },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    icon: Globe,
    subsections: [
      { id: "production", title: "Production Setup" },
      { id: "environment", title: "Environment Variables" },
      { id: "monitoring", title: "Monitoring" },
    ],
  },
];

interface DocumentationProps {
  onBackToDashboard?: () => void;
}

export const Documentation: React.FC<DocumentationProps> = ({
  onBackToDashboard,
}) => {
  const [activeSection, setActiveSection] = React.useState("introduction");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Determine if we're in an authenticated context
  const isFromDashboard = !!onBackToDashboard;
  const backButtonText = isFromDashboard ? "Back to Dashboard" : "Back to Home";

  const handleBackClick = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      // If no callback provided, reload the page to go back to landing
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-700 bg-zinc-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  CMMC Compass Documentation
                </h1>
                <p className="text-sm text-zinc-400">
                  Open-source CMMC Level 1 compliance platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                {backButtonText}
              </Button>
              <Badge
                variant="outline"
                className="border-green-600 text-green-400 bg-green-900/20"
              >
                v1.0.0
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/tekimax/cmmc-level-1-compliance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <GitBranch className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white">
                      {section.icon && <section.icon className="w-4 h-4" />}
                      {section.title}
                    </div>
                    {section.subsections && (
                      <div className="ml-6 space-y-1">
                        {section.subsections.map((subsection) => (
                          <button
                            key={subsection.id}
                            onClick={() => scrollToSection(subsection.id)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              activeSection === subsection.id
                                ? "bg-cyan-900/50 text-cyan-400 font-medium"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                            }`}
                          >
                            {subsection.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 py-8">
            <div className="prose prose-lg prose-invert max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-16">
                <h1 className="text-4xl font-bold text-white mb-6">
                  CMMC Compass - Community CMMC Platform
                </h1>
                <p className="text-xl text-zinc-300 mb-8">
                  A free, open-source platform built during our own CMMC
                  compliance journey. Self-host everything locally - no vendor
                  lock-in, no monthly fees, complete data control. By small
                  business owners, for small business owners.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                      <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-white mb-2">
                        CMMC Compliant
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Covers all 17 CMMC Level 1 controls with implementation
                        guidance
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                      <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-white mb-2">
                        AI-Powered
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Local AI assistance with document embedding and RAG
                        capabilities
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-white mb-2">
                        Small Business Focused
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Designed specifically for small businesses entering the
                        defense supply chain
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-cyan-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-cyan-300 mb-2">
                        Why We Built This
                      </h4>
                      <p className="text-cyan-200 text-sm">
                        When we went through CMMC compliance as a small
                        business, we found existing solutions too expensive or
                        not designed for our needs. We built this platform
                        during our own journey and open-sourced it so other
                        small businesses can benefit. This isn't a service we
                        sell - it's a community tool.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section id="features" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Key Features
                </h2>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-cyan-400" />
                          </div>
                          <CardTitle className="text-white">
                            Control Management
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Track all 17 CMMC Level 1 controls
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Implementation status tracking
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Assignment and due date management
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Progress visualization and reporting
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
                            <Upload className="w-5 h-5 text-purple-400" />
                          </div>
                          <CardTitle className="text-white">
                            Document Management
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Upload policies, procedures, evidence
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Automatic document embedding
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Semantic search capabilities
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Document version tracking
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-400" />
                          </div>
                          <CardTitle className="text-white">
                            AI Assistant
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Local AI with Ollama integration
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            CMMC-specific knowledge base
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Document-aware responses (RAG)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Implementation guidance
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-900/50 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-orange-400" />
                          </div>
                          <CardTitle className="text-white">
                            Privacy & Security
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Local AI processing (no data leaves premises)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Secure authentication with Convex Auth
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Encrypted data storage
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Audit logging and compliance tracking
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

              {/* Architecture */}
              <section id="architecture" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Architecture Overview
                </h2>

                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">
                        Frontend
                      </h3>
                      <p className="text-sm text-zinc-400">
                        React + TypeScript + Tailwind CSS
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Database className="w-8 h-8 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">Backend</h3>
                      <p className="text-sm text-zinc-400">
                        Convex (self-hosted recommended)
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">AI</h3>
                      <p className="text-sm text-zinc-400">
                        Ollama (local) + Proxy Server
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Technology Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Frontend Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li>
                          <strong className="text-white">React 18</strong> - UI
                          framework
                        </li>
                        <li>
                          <strong className="text-white">TypeScript</strong> -
                          Type safety
                        </li>
                        <li>
                          <strong className="text-white">Tailwind CSS</strong> -
                          Styling
                        </li>
                        <li>
                          <strong className="text-white">Shadcn/ui</strong> -
                          Component library
                        </li>
                        <li>
                          <strong className="text-white">Vite</strong> - Build
                          tool
                        </li>
                        <li>
                          <strong className="text-white">React Router</strong> -
                          Navigation
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Backend Stack
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li>
                          <strong className="text-white">Convex</strong> -
                          Backend-as-a-Service
                        </li>
                        <li>
                          <strong className="text-white">Convex Auth</strong> -
                          Authentication
                        </li>
                        <li>
                          <strong className="text-white">Ollama</strong> - Local
                          AI models
                        </li>
                        <li>
                          <strong className="text-white">Express.js</strong> -
                          Proxy server
                        </li>
                        <li>
                          <strong className="text-white">Node.js</strong> -
                          Runtime
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Installation */}
              <section id="installation" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Installation
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Prerequisites
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300">
                      <li>Node.js 18+ and npm/pnpm</li>
                      <li>Git</li>
                      <li>Ollama (for local AI features)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Quick Start
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-white mb-2">
                          1. Clone the repository
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto border border-zinc-700">
                          <code className="text-green-400 text-sm">
                            git clone
                            https://github.com/tekimax/cmmc-level-1-compliance.git
                            <br />
                            cd cmmc-level-1-compliance
                          </code>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">
                          2. Install dependencies
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto border border-zinc-700">
                          <code className="text-green-400 text-sm">
                            pnpm install
                            <br /># or npm install
                          </code>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">
                          3. Set up Convex backend
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto border border-zinc-700">
                          <code className="text-green-400 text-sm">
                            npx convex dev
                          </code>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">
                          4. Install and configure Ollama
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto border border-zinc-700">
                          <code className="text-green-400 text-sm">
                            # Install Ollama (macOS)
                            <br />
                            brew install ollama
                            <br />
                            <br />
                            # Start Ollama service
                            <br />
                            ollama serve
                            <br />
                            <br />
                            # Pull recommended models
                            <br />
                            ollama pull llama3.2:latest
                            <br />
                            ollama pull mxbai-embed-large:latest
                          </code>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-white mb-2">
                          5. Start the development server
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto border border-zinc-700">
                          <code className="text-green-400 text-sm">
                            pnpm run dev
                            <br /># App will be available at
                            http://localhost:5175
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CMMC Level 1 Controls */}
              <section id="level-1-controls" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  CMMC Level 1 Controls
                </h2>
                <p className="text-zinc-300 mb-8">
                  CMMC Level 1 requires implementation of 17 basic safeguards
                  for Federal Contract Information (FCI).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Shield className="w-5 h-5 text-cyan-400" />
                        Access Control (AC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li>AC.L1-3.1.1 - Authorized Access Control</li>
                        <li>AC.L1-3.1.2 - Transaction and Function Control</li>
                        <li>AC.L1-3.1.20 - External Connection Control</li>
                        <li>AC.L1-3.1.22 - Control Public Information</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Lock className="w-5 h-5 text-purple-400" />
                        Identification & Authentication (IA)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li>IA.L1-3.5.1 - User Identification</li>
                        <li>IA.L1-3.5.2 - User Authentication</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <FileText className="w-5 h-5 text-green-400" />
                        Media Protection (MP)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li>MP.L1-3.8.1 - Media Access</li>
                        <li>MP.L1-3.8.2 - Media Marking</li>
                        <li>MP.L1-3.8.3 - Media Storage</li>
                        <li>MP.L1-3.8.4 - Media Transport</li>
                        <li>MP.L1-3.8.5 - Media Accountability</li>
                        <li>MP.L1-3.8.6 - Media Sanitization</li>
                        <li>MP.L1-3.8.9 - Media Protection</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Server className="w-5 h-5 text-orange-400" />
                        Physical Protection (PE)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li>PE.L1-3.10.1 - Physical Access Authorizations</li>
                        <li>PE.L1-3.10.3 - Physical Access Control</li>
                        <li>PE.L1-3.10.4 - Physical Access Monitoring</li>
                        <li>PE.L1-3.10.5 - Physical Access Device Control</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Settings className="w-5 h-5 text-blue-400" />
                        System & Communications Protection (SC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li>SC.L1-3.13.1 - Boundary Protection</li>
                        <li>SC.L1-3.13.5 - Public-Access System Separation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        <Database className="w-5 h-5 text-indigo-400" />
                        System & Information Integrity (SI)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li>SI.L1-3.14.1 - Flaw Remediation</li>
                        <li>SI.L1-3.14.2 - Malicious Code Protection</li>
                        <li>SI.L1-3.14.4 - Update Malicious Code Protection</li>
                        <li>SI.L1-3.14.5 - System Monitoring</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Local AI Setup */}
              <section id="local-ai" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Local AI with Ollama
                </h2>
                <p className="text-zinc-300 mb-8">
                  CMMC Compass uses Ollama for local AI processing, ensuring
                  your data never leaves your premises.
                </p>

                <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300 mb-2">
                        Privacy First Approach
                      </h4>
                      <p className="text-amber-200 text-sm">
                        All AI processing happens locally on your machine. No
                        sensitive compliance data is sent to external services.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Recommended Models
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Chat Models
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li>
                          <strong className="text-white">
                            llama3.2:latest
                          </strong>{" "}
                          - General purpose chat
                        </li>
                        <li>
                          <strong className="text-white">llama3.1:8b</strong> -
                          Faster responses
                        </li>
                        <li>
                          <strong className="text-white">
                            codellama:latest
                          </strong>{" "}
                          - Code assistance
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Embedding Models
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-zinc-300">
                        <li>
                          <strong className="text-white">
                            mxbai-embed-large:latest
                          </strong>{" "}
                          - Document embedding
                        </li>
                        <li>
                          <strong className="text-white">
                            nomic-embed-text:latest
                          </strong>{" "}
                          - Alternative embedding
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  Pull Models
                </h3>
                <div className="bg-black rounded-lg p-4 overflow-x-auto mb-8 border border-zinc-700">
                  <code className="text-green-400 text-sm">
                    # Essential models for CMMC Compass
                    <br />
                    ollama pull llama3.2:latest
                    <br />
                    ollama pull mxbai-embed-large:latest
                    <br />
                    <br />
                    # Optional additional models
                    <br />
                    ollama pull llama3.1:8b
                    <br />
                    ollama pull codellama:latest
                  </code>
                </div>
              </section>

              {/* API Reference */}
              <section id="convex-functions" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Convex Functions Reference
                </h2>

                <div className="space-y-8">
                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Queries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-white">
                            api.controls.list
                          </h4>
                          <p className="text-sm text-zinc-400">
                            List all CMMC controls with their implementation
                            status
                          </p>
                          <div className="bg-zinc-900 rounded mt-2 p-2 border border-zinc-700">
                            <code className="text-xs text-green-400">
                              const controls = useQuery(api.controls.list);
                            </code>
                          </div>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-white">
                            api.documents.list
                          </h4>
                          <p className="text-sm text-zinc-400">
                            List all uploaded documents
                          </p>
                          <div className="bg-zinc-900 rounded mt-2 p-2 border border-zinc-700">
                            <code className="text-xs text-green-400">
                              const documents = useQuery(api.documents.list);
                            </code>
                          </div>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-white">
                            api.chat.getMessages
                          </h4>
                          <p className="text-sm text-zinc-400">
                            Get chat messages for a control
                          </p>
                          <div className="bg-zinc-900 rounded mt-2 p-2 border border-zinc-700">
                            <code className="text-xs text-green-400">
                              const messages = useQuery(api.chat.getMessages,{" "}
                              {"{"}controlId{"}"});
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Mutations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-white">
                            api.controls.update
                          </h4>
                          <p className="text-sm text-zinc-400">
                            Update control implementation status
                          </p>
                          <div className="bg-zinc-900 rounded mt-2 p-2 border border-zinc-700">
                            <code className="text-xs text-green-400">
                              await updateControl({"{"}id, status, assignedTo,
                              dueDate{"}"});
                            </code>
                          </div>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-white">
                            api.documents.upload
                          </h4>
                          <p className="text-sm text-zinc-400">
                            Upload and process document
                          </p>
                          <div className="bg-zinc-900 rounded mt-2 p-2 border border-zinc-700">
                            <code className="text-xs text-green-400">
                              await uploadDocument({"{"}name, content, size{"}"}
                              );
                            </code>
                          </div>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-medium text-white">
                            api.chat.sendMessage
                          </h4>
                          <p className="text-sm text-zinc-400">
                            Send chat message for control assistance
                          </p>
                          <div className="bg-zinc-900 rounded mt-2 p-2 border border-zinc-700">
                            <code className="text-xs text-green-400">
                              await sendMessage({"{"}controlId, content{"}"});
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Production Deployment */}
              <section id="production" className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Self-Hosted Deployment (Recommended)
                </h2>

                <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300 mb-2">
                        Self-Hosting Recommended
                      </h4>
                      <p className="text-amber-200 text-sm">
                        For maximum data control and compliance, we recommend
                        self-hosting all components locally. Convex Cloud is
                        available as an option, but self-hosting ensures your
                        compliance data never leaves your premises.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Convex Self-Hosted Setup (Recommended)
                    </h3>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto mb-4 border border-zinc-700">
                      <code className="text-green-400 text-sm">
                        # Set up Convex for self-hosting
                        <br />
                        # Follow Convex self-hosting documentation
                        <br />
                        # All data stays on your infrastructure
                        <br />
                        <br />
                        # Alternative: Convex Cloud (optional)
                        <br />
                        npx convex deploy --cloud
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Frontend Deployment
                    </h3>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto mb-4 border border-zinc-700">
                      <code className="text-green-400 text-sm">
                        # Build for production
                        <br />
                        pnpm run build
                        <br />
                        <br />
                        # Deploy to your preferred platform
                        <br /># (Vercel, Netlify, AWS S3, etc.)
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Ollama Production Considerations
                    </h3>
                    <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
                      <ul className="space-y-2 text-sm text-blue-200">
                        <li>
                          • Ensure Ollama service starts automatically on system
                          boot
                        </li>
                        <li>
                          • Configure proper firewall rules for localhost:11434
                        </li>
                        <li>• Set up monitoring for Ollama service health</li>
                        <li>• Consider resource allocation for AI models</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Disclaimer & License */}
              <div className="border-t border-zinc-700 pt-8 mt-16">
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Disclaimer & License
                  </h3>
                  <div className="space-y-4 text-sm text-zinc-300">
                    <p>
                      <strong className="text-white">MIT License:</strong> This
                      software is provided "as is" without warranty of any kind.
                      Use at your own risk. We built this during our own CMMC
                      journey and share it freely with the community.
                    </p>
                    <p>
                      <strong className="text-white">
                        Not Professional Services:
                      </strong>{" "}
                      This is a free, open-source tool - not professional
                      consulting services. For official CMMC guidance, consult
                      with certified CMMC professionals and assessors.
                    </p>
                    <p>
                      <strong className="text-white">Community Project:</strong>{" "}
                      Built by small business owners who went through CMMC
                      compliance. We welcome contributions, feedback, and
                      improvements from the community.
                    </p>
                    <p>
                      <strong className="text-white">Data Sovereignty:</strong>{" "}
                      When self-hosted as recommended, all your compliance data
                      stays on your infrastructure. You maintain complete
                      control over your sensitive information.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">
                      © 2025 Tekimax LLC. MIT Licensed - Free & Open Source
                      Community Tool.
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Built by small business owners, for small business owners.
                      Community-driven CMMC compliance.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href="https://github.com/tekimax/cmmc-level-1-compliance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
