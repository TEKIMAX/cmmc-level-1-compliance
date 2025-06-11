import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ControlCard } from "./ControlCard";
import { StatsOverview } from "./StatsOverview";
import { DomainFilter } from "./DomainFilter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { AlertTriangle, X } from "lucide-react";

export function Dashboard() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const controls = useQuery(api.controls.listControls, {});
  const stats = useQuery(api.controls.getComplianceStats, {});
  const initializeControls = useMutation(api.controls.initializeControls);

  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Check if disclaimer has been dismissed before
  useEffect(() => {
    const disclaimerDismissed = localStorage.getItem("cmmc_disclaimer_dismissed");
    if (disclaimerDismissed === "true") {
      setShowDisclaimer(false);
    }
  }, []);

  const handleDismissDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem("cmmc_disclaimer_dismissed", "true");
  };

  useEffect(() => {
    if (loggedInUser && controls && controls.length === 0) {
      initializeControls({})
        .then(() => {
          toast.success("CMMC Level 1 controls initialized");
        })
        .catch((error) => {
          toast.error("Failed to initialize controls: " + error.message);
        });
    }
  }, [loggedInUser, controls, initializeControls]);

  if (!loggedInUser || !controls || !stats) {
    return (
      <div className="flex justify-center items-center min-h-96 bg-zinc-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const domains = ["all", ...Object.keys(stats.byDomain)];

  const filteredControls = controls.filter((control) => {
    const matchesDomain =
      selectedDomain === "all" || control.domain === selectedDomain;
    const matchesSearch =
      control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.controlId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const completionPercentage = Math.round(
    ((stats.implemented + stats.verified) / stats.total) * 100
  );

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* AI Disclaimer Badge */}
        {showDisclaimer && (
          <Card className="bg-amber-900/20 border-amber-600/30 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-amber-200">
                      Important Disclaimer
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismissDisclaimer}
                      className="h-6 w-6 p-0 text-amber-400 hover:text-amber-200 hover:bg-amber-800/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-amber-100/90 leading-relaxed">
                    <strong>AI Interpretation Notice:</strong> This tool uses AI to help interpret CMMC requirements and may not always provide accurate information. 
                    The AI might misinterpret or provide incomplete guidance. This platform is designed to help you get started with your CMMC Level 1 compliance journey, 
                    but should not be your only resource. Always consult with certified CMMC professionals and official NIST documentation for authoritative guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-white">
                  CMMC Level 1 Compliance
                </CardTitle>
                <CardDescription className="text-zinc-300 text-sm">
                  Monitor compliance with 17 NIST SP 800-171 Rev.2 practices
                  across 6 domains
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {completionPercentage}%
                  </div>
                  <div className="text-xs text-zinc-400">Complete</div>
                </div>
                <div className="w-12 h-12 relative">
                  <svg
                    className="w-12 h-12 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-zinc-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-white"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${completionPercentage}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Filters */}
        <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search controls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 text-sm"
                />
              </div>
              <DomainFilter
                domains={domains}
                selectedDomain={selectedDomain}
                onDomainChange={setSelectedDomain}
              />
            </div>
          </CardContent>
        </Card>

        {/* Controls Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredControls.map((control) => (
            <ControlCard key={control._id} control={control} />
          ))}
        </div>

        {filteredControls.length === 0 && (
          <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
            <CardContent className="text-center py-12">
              <div className="text-zinc-400 text-sm">
                No controls found matching your criteria
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
