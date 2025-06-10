import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { Dashboard } from "./Dashboard";
import { AuditLogs } from "./AuditLogs";
import { Configuration } from "./Configuration";
import { ReadinessSummary } from "./ReadinessSummary";
import { Documents } from "./components/Documents";
import { LandingPage } from "./LandingPage";
import { Documentation } from "./components/Documentation";
import { AuthLayout } from "./AuthLayout";
import { SignOutButton } from "./SignOutButton";
import { ModelDetection } from "./components/ModelDetection";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Shield, Menu, X } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "readiness" | "documents" | "audit" | "config" | "docs"
  >("dashboard");
  const [showAuth, setShowAuth] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [modelsDetected, setModelsDetected] = useState<boolean | null>(null);
  const [redirectToDocuments, setRedirectToDocuments] = useState(false);
  const [docsFromAuthenticated, setDocsFromAuthenticated] = useState(false);

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Check if we've already detected models before
  useEffect(() => {
    const hasDetectedModels = localStorage.getItem("cmmc_models_detected");
    if (hasDetectedModels === "true") {
      setModelsDetected(true);
    }
  }, []);

  const handleModelDetectionComplete = (hasModels: boolean) => {
    setModelsDetected(hasModels);
    if (hasModels) {
      localStorage.setItem("cmmc_models_detected", "true");
    }

    // If we were supposed to redirect to documents, do it now
    if (redirectToDocuments) {
      setCurrentView("documents");
      setRedirectToDocuments(false);
    }
  };

  const resetModelDetection = () => {
    localStorage.removeItem("cmmc_models_detected");
    setModelsDetected(null);
  };

  const handleShowAuth = (goToDocuments = false) => {
    if (goToDocuments) {
      setRedirectToDocuments(true);
    }
    setShowAuth(true);
  };

  function Content() {
    const user = useQuery(api.auth.loggedInUser);

    // Handle redirect to documents after successful authentication
    // This useEffect must be called before any conditional returns to maintain hook order
    useEffect(() => {
      if (user && redirectToDocuments && modelsDetected !== null) {
        setCurrentView("documents");
        setRedirectToDocuments(false);
      }
    }, [user, redirectToDocuments, modelsDetected]);

    if (!user) {
      return null; // Hide the authentication required section
    }

    // Show model detection if we haven't detected models yet
    if (modelsDetected === null) {
      return <ModelDetection onComplete={handleModelDetectionComplete} />;
    }

    // Show warning if no models were detected
    if (modelsDetected === false) {
      return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              Limited Functionality
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              The application will work but AI features will be limited without
              Ollama models. You can proceed with manual compliance management.
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetModelDetection}
                className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-sm"
              >
                Retry Setup
              </button>
              <button
                onClick={() => setModelsDetected(true)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-zinc-900">
        {/* Header */}
        <header className="bg-zinc-800/50 border-b border-zinc-700 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">CMMC Level 1</h1>
                  <p className="text-xs text-zinc-400">Compliance Manager</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant={currentView === "dashboard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("dashboard")}
                  className="text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === "readiness" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("readiness")}
                  className="text-sm"
                >
                  Readiness
                </Button>
                <Button
                  variant={currentView === "documents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("documents")}
                  className="text-sm"
                >
                  Documents
                </Button>
                <Button
                  variant={currentView === "audit" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("audit")}
                  className="text-sm"
                >
                  Audit Logs
                </Button>
                <Button
                  variant={currentView === "config" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("config")}
                  className="text-sm"
                >
                  Configuration
                </Button>
                <Button
                  variant={currentView === "docs" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setDocsFromAuthenticated(true);
                    setCurrentView("docs");
                  }}
                  className="text-sm"
                >
                  Docs
                </Button>
              </nav>

              {/* User Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={resetModelDetection}
                  className="hidden md:block px-3 py-1.5 text-xs bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                  title="Reset AI Model Detection"
                >
                  Reset AI
                </button>
                <SignOutButton />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden"
                >
                  {showMobileMenu ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden bg-zinc-800 border-t border-zinc-700">
              <nav className="px-4 py-3 space-y-1">
                <Button
                  variant={currentView === "dashboard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setCurrentView("dashboard");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === "readiness" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setCurrentView("readiness");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Readiness
                </Button>
                <Button
                  variant={currentView === "documents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setCurrentView("documents");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Documents
                </Button>
                <Button
                  variant={currentView === "audit" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setCurrentView("audit");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Audit Logs
                </Button>
                <Button
                  variant={currentView === "config" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setCurrentView("config");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Configuration
                </Button>
                <Button
                  variant={currentView === "docs" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setDocsFromAuthenticated(true);
                    setCurrentView("docs");
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  Documentation
                </Button>
                <button
                  onClick={() => {
                    resetModelDetection();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  Reset AI Models
                </button>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main>
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "readiness" && <ReadinessSummary />}
          {currentView === "documents" && <Documents />}
          {currentView === "audit" && <AuditLogs />}
          {currentView === "config" && <Configuration />}
        </main>
      </div>
    );
  }

  // Show documentation outside of authentication if selected
  if (currentView === "docs") {
    // Pass callback only if accessed from authenticated context
    const backCallback = docsFromAuthenticated
      ? () => setCurrentView("dashboard")
      : undefined;

    return (
      <div>
        <Documentation onBackToDashboard={backCallback} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        {showAuth ? (
          <AuthLayout onBack={() => setShowAuth(false)} />
        ) : (
          <LandingPage
            onShowAuth={() => handleShowAuth()}
            onShowDocs={() => {
              setDocsFromAuthenticated(false);
              setCurrentView("docs");
            }}
          />
        )}
      </Unauthenticated>
      <Toaster position="top-right" />
    </div>
  );
}
