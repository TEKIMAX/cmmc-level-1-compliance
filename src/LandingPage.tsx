import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Shield,
  CheckCircle,
  FileText,
  BarChart3,
  Clock,
  ArrowRight,
  Github,
  BookOpen,
  Sparkles,
  Users,
  Lock,
  Zap,
  Target,
  Database,
  Server,
  Terminal,
  Settings,
} from "lucide-react";

interface LandingPageProps {
  onShowAuth: (goToDocuments?: boolean) => void;
  onShowDocs?: () => void;
}

export function LandingPage({ onShowAuth, onShowDocs }: LandingPageProps) {
  const handleViewDocs = () => {
    // Show documentation without requiring authentication
    if (onShowDocs) {
      onShowDocs();
    }
  };

  const handleGetStarted = () => {
    onShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  CMMC Compass
                </h1>
                <p className="text-xs text-zinc-500">by Tekimax</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleViewDocs}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-white text-zinc-950 hover:bg-zinc-200"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1663895064411-fff0ab8a9797?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "grayscale(100%) opacity(0.3)",
          }}
        />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">
              Built from Our Own CMMC Journey - For Small Businesses, By Small
              Business
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Start here for
            <span className="block text-zinc-400">CMMC Level 1</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-3xl mx-auto">
            Learn CMMC Level 1 compliance while implementing it. Your local AI
            assistant (running on your own machine) helps answer questions with
            contextual guidance based on RAG (Retrieval Augmented Generation)
            from your specific controls and progress. Built by small business
            owners who navigated compliance themselves - this isn't a service we
            sell, it's a community tool.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-zinc-950 hover:bg-zinc-200 text-base"
            >
              Start Your Small Business Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={handleViewDocs}
              size="lg"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-600"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span>Open Source & Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>NIST SP 800-171 Rev.2</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>100% Self-Hosted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>17 Controls Covered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Community-Built CMMC Level 1 Platform
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Self-hosted compliance management with local AI processing. No
              vendor lock-in, no monthly fees, no data leaving your premises.
              Built by small business owners who've been through the CMMC
              journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-zinc-400" />
                </div>
                <CardTitle className="text-white text-lg">
                  Complete Control Tracking
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Monitor all 17 CMMC Level 1 controls across 6 domains with
                  real-time status updates and progress tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-zinc-400" />
                </div>
                <CardTitle className="text-white text-lg">
                  Your Local AI Assistant
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Ask questions about any control and get contextual answers
                  based on your current implementation status using your own
                  local AI models running on your machine with RAG capabilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-zinc-400" />
                </div>
                <CardTitle className="text-white text-lg">
                  Comprehensive Audit Trails
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Maintain detailed records of all compliance activities with
                  automatic logging for audit readiness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-zinc-400" />
                </div>
                <CardTitle className="text-white text-lg">
                  Real-Time Dashboards
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Track implementation progress with live dashboards, status
                  indicators, and comprehensive reporting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <CardTitle className="text-white text-lg">
                  100% Self-Hosted
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Deploy locally with Convex self-hosting. Your data never
                  leaves your premises. Complete control over your deployment
                  and data sovereignty.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                  <Github className="w-5 h-5 text-zinc-400" />
                </div>
                <CardTitle className="text-white text-lg">
                  MIT Licensed & Open Source
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Completely free, transparent, and auditable. Community-driven
                  development with no vendor lock-in or hidden costs. Use,
                  modify, and distribute freely.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CMMC Domains Section */}
      <div className="py-16 bg-zinc-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Complete CMMC Level 1 Coverage
            </h3>
            <p className="text-lg text-zinc-400">
              Track compliance across all 6 NIST SP 800-171 Rev.2 domains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                name: "Access Control",
                controls: 3,
                icon: Lock,
              },
              {
                name: "Awareness and Training",
                controls: 1,
                icon: Users,
              },
              {
                name: "Audit and Accountability",
                controls: 2,
                icon: FileText,
              },
              {
                name: "Configuration Management",
                controls: 2,
                icon: BarChart3,
              },
              {
                name: "Identification and Authentication",
                controls: 2,
                icon: Shield,
              },
              {
                name: "System and Communications Protection",
                controls: 7,
                icon: Zap,
              },
            ].map((domain, index) => {
              const IconComponent = domain.icon;
              return (
                <Card
                  key={domain.name}
                  className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-zinc-400" />
                      </div>
                      <h4 className="font-medium text-white">{domain.name}</h4>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {domain.controls} control
                      {domain.controls !== 1 ? "s" : ""} to track and implement
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center bg-zinc-900 border border-zinc-800 rounded-2xl p-12 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your CMMC Journey?
            </h3>
            <p className="text-lg text-zinc-400 mb-8">
              Join the community of small businesses using this free,
              open-source platform to achieve CMMC Level 1 compliance. Self-host
              locally and maintain complete control over your compliance data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-zinc-950 hover:bg-zinc-200"
              >
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={handleViewDocs}
                size="lg"
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <span className="text-white font-medium text-sm">
                  CMMC Compass by Tekimax
                </span>
                <p className="text-xs text-zinc-500">
                  Securing America's Industrial Base
                </p>
              </div>
            </div>
            <div className="text-zinc-500 text-sm text-center">
              <div>© 2025 Tekimax LLC. MIT Licensed - Free & Open Source.</div>
              <div className="text-xs mt-1">
                Built by small business owners, for small business owners.
                Community-driven CMMC compliance.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
