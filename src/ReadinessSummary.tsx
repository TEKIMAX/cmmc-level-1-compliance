import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

export function ReadinessSummary() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const stats = useQuery(api.controls.getComplianceStats, {});
  const aiSummary = useQuery(api.ai.getReadinessSummary, {});
  const generateSummary = useMutation(api.ai.generateReadinessSummary);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (loggedInUser && stats && !aiSummary && !isGenerating) {
      handleGenerateSummary();
    }
  }, [loggedInUser, stats, aiSummary, isGenerating]);

  const handleGenerateSummary = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      await generateSummary({});
      toast.success("AI summary generated successfully");
    } catch (error) {
      toast.error("Failed to generate AI summary");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!loggedInUser || !stats) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completionPercentage = Math.round(
    ((stats.implemented + stats.verified) / stats.total) * 100
  );

  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 90)
      return { level: "Excellent", color: "text-green-400" };
    if (percentage >= 75) return { level: "Good", color: "text-cyan-400" };
    if (percentage >= 50) return { level: "Fair", color: "text-yellow-400" };
    return { level: "Needs Improvement", color: "text-red-400" };
  };

  const readiness = getReadinessLevel(completionPercentage);

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl text-white">
                  Readiness Summary
                </CardTitle>
                <CardDescription className="text-zinc-300 text-sm">
                  AI-powered compliance readiness analysis and recommendations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - AI Summary */}
          <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">
                  AI Analysis & Recommendations
                </CardTitle>
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="px-3 py-1.5 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Generating..." : "Refresh"}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                  <p className="text-zinc-400 text-sm">
                    AI is analyzing your compliance status...
                  </p>
                </div>
              ) : aiSummary ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3 text-sm">
                      Executive Summary
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-700/50 p-4 rounded-lg">
                      {aiSummary.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3 text-sm">
                      Key Recommendations
                    </h3>
                    <div className="space-y-3">
                      {aiSummary.recommendations?.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-zinc-700/30 p-3 rounded-lg"
                        >
                          <div className="w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-white font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-zinc-300 text-sm">{rec}</p>
                        </div>
                      )) || (
                        <p className="text-zinc-400 text-sm">
                          No specific recommendations available.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3 text-sm">
                      Priority Actions
                    </h3>
                    <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4">
                      <p className="text-amber-200 text-sm">
                        {aiSummary.priorityActions ||
                          "Focus on completing remaining controls to improve overall compliance readiness."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <svg
                    className="w-12 h-12 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-zinc-400 text-sm">
                    Click "Refresh" to generate AI analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Side - Circle Graph */}
          <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">
                Overall Readiness
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {/* Large Circle Graph */}
              <div className="relative w-48 h-48 mb-6">
                <svg
                  className="w-48 h-48 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-zinc-700"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${completionPercentage * 2.827}, 282.7`}
                    strokeLinecap="round"
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-white">
                    {completionPercentage}%
                  </div>
                  <div className={`text-sm font-medium ${readiness.color}`}>
                    {readiness.level}
                  </div>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-zinc-700/30 rounded-lg">
                  <span className="text-zinc-300 text-sm">Total Controls</span>
                  <span className="text-white font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-900/30 rounded-lg">
                  <span className="text-green-300 text-sm">Implemented</span>
                  <span className="text-green-400 font-medium">
                    {stats.implemented}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-900/30 rounded-lg">
                  <span className="text-blue-300 text-sm">Verified</span>
                  <span className="text-blue-400 font-medium">
                    {stats.verified}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-900/30 rounded-lg">
                  <span className="text-yellow-300 text-sm">In Progress</span>
                  <span className="text-yellow-400 font-medium">
                    {stats.inProgress}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-900/30 rounded-lg">
                  <span className="text-red-300 text-sm">Not Started</span>
                  <span className="text-red-400 font-medium">
                    {stats.notStarted}
                  </span>
                </div>
              </div>

              {/* Readiness Badge */}
              <div
                className={`mt-6 px-4 py-2 rounded-full text-sm font-medium ${
                  readiness.level === "Excellent"
                    ? "bg-green-900/50 text-green-300 border border-green-700"
                    : readiness.level === "Good"
                      ? "bg-cyan-900/50 text-cyan-300 border border-cyan-700"
                      : readiness.level === "Fair"
                        ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                        : "bg-red-900/50 text-red-300 border border-red-700"
                }`}
              >
                {readiness.level} Readiness Level
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
