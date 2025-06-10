import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

export function StatsOverview() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const stats = useQuery(api.controls.getComplianceStats, {});

  if (!loggedInUser || !stats) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-700 rounded mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-zinc-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completionPercentage =
    stats.total > 0
      ? Math.round(((stats.implemented + stats.verified) / stats.total) * 100)
      : 0;

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            Compliance Overview
          </CardTitle>
          <div className="text-sm text-zinc-300 font-medium">
            {completionPercentage}% Complete
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-zinc-700/50 rounded-lg border border-zinc-600">
            <div className="text-2xl font-bold mb-1 text-white">
              {stats.total}
            </div>
            <div className="text-xs text-zinc-300 font-medium">
              Total Controls
            </div>
          </div>

          <div className="text-center p-4 bg-zinc-700/50 rounded-lg border border-zinc-600">
            <div className="text-2xl font-bold text-zinc-400 mb-1">
              {stats.notStarted}
            </div>
            <div className="text-xs text-zinc-400 font-medium">Not Started</div>
          </div>

          <div className="text-center p-4 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {stats.inProgress}
            </div>
            <div className="text-xs text-yellow-400 font-medium">
              In Progress
            </div>
          </div>

          <div className="text-center p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {stats.implemented}
            </div>
            <div className="text-xs text-blue-400 font-medium">Implemented</div>
          </div>

          <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-600/30">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.verified}
            </div>
            <div className="text-xs text-green-400 font-medium">Verified</div>
          </div>

          <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-600/30">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {stats.revised}
            </div>
            <div className="text-xs text-purple-400 font-medium">Revised</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-zinc-300 mb-2">
            <span className="font-medium">Implementation Progress</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Domain Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white">
            Domain Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byDomain).map(([domain, domainStats]) => {
              const domainCompletion =
                domainStats.total > 0
                  ? Math.round(
                      ((domainStats.implemented + domainStats.verified) /
                        domainStats.total) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={domain}
                  className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-white leading-tight pr-2">
                      {domain}
                    </h4>
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      {domainStats.revised > 0 && (
                        <Badge className="bg-purple-600 text-white border-purple-500 text-xs px-2 py-0.5">
                          {domainStats.revised} revised
                        </Badge>
                      )}
                      <span className="text-zinc-300 font-medium">
                        {domainCompletion}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${domainCompletion}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>
                        {domainStats.implemented + domainStats.verified} of{" "}
                        {domainStats.total} complete
                      </span>
                      <span>{domainStats.inProgress} in progress</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
