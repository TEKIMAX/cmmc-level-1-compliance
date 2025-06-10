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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CMMC Compass</h1>
                <p className="text-xs text-gray-300">by Tekimax</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleViewDocs}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-200">
                Built from Our Own CMMC Journey - For Small Businesses, By Small
                Business
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Empower Your
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Small Business
              </span>
              With CMMC Level 1
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              We built this open-source platform during our own CMMC compliance
              journey. This isn't a service we sell - it's a community tool to
              help fellow small businesses navigate NIST SP 800-171 Rev.2
              requirements and achieve CMMC Level 1 certification. Self-host
              everything locally for complete data control.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Start Your Small Business Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={handleViewDocs}
                size="lg"
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 text-lg font-semibold backdrop-blur-sm"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 mb-20">
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
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Community-Built CMMC Level 1 Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Self-hosted compliance management with local AI processing. No
              vendor lock-in, no monthly fees, no data leaving your premises.
              Built by small business owners who've been through the CMMC
              journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Complete Control Tracking
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor all 17 CMMC Level 1 controls across 6 domains with
                  real-time status updates and progress tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  AI-Powered Insights
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Get intelligent recommendations and guidance to accelerate
                  your compliance efforts with local AI models
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Comprehensive Audit Trails
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Maintain detailed records of all compliance activities with
                  automatic logging for audit readiness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Real-Time Dashboards
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track implementation progress with live dashboards, status
                  indicators, and comprehensive reporting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  100% Self-Hosted
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Deploy locally with Convex self-hosting. Your data never
                  leaves your premises. Complete control over your deployment
                  and data sovereignty.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  MIT Licensed & Open Source
                </CardTitle>
                <CardDescription className="text-gray-300">
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
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">
              Complete CMMC Level 1 Coverage
            </h3>
            <p className="text-xl text-gray-300">
              Track compliance across all 6 NIST SP 800-171 Rev.2 domains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Access Control",
                controls: 3,
                color: "from-cyan-500 to-blue-600",
                icon: Lock,
              },
              {
                name: "Awareness and Training",
                controls: 1,
                color: "from-green-500 to-emerald-600",
                icon: Users,
              },
              {
                name: "Audit and Accountability",
                controls: 2,
                color: "from-purple-500 to-pink-600",
                icon: FileText,
              },
              {
                name: "Configuration Management",
                controls: 2,
                color: "from-orange-500 to-red-600",
                icon: BarChart3,
              },
              {
                name: "Identification and Authentication",
                controls: 2,
                color: "from-red-500 to-pink-600",
                icon: Shield,
              },
              {
                name: "System and Communications Protection",
                controls: 7,
                color: "from-blue-500 to-indigo-600",
                icon: Zap,
              },
            ].map((domain, index) => {
              const IconComponent = domain.icon;
              return (
                <Card
                  key={domain.name}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${domain.color} rounded-lg flex items-center justify-center`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-white text-lg">
                        {domain.name}
                      </h4>
                    </div>
                    <p className="text-gray-400">
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
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-16 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your CMMC Journey?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join the community of small businesses using this free,
              open-source platform to achieve CMMC Level 1 compliance. Self-host
              locally and maintain complete control over your compliance data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg font-semibold shadow-xl"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleViewDocs}
                size="lg"
                variant="outline"
                className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 text-lg font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold">
                  CMMC Compass by Tekimax
                </span>
                <p className="text-xs text-gray-400">
                  Securing America's Industrial Base
                </p>
              </div>
            </div>
            <div className="text-gray-400 text-sm text-center">
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
