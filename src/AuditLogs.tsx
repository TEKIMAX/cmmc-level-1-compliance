import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export function AuditLogs() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [selectedControl, setSelectedControl] = useState<string>("");
  const auditLogs = useQuery(api.auditLogs.getAuditLogs, {
    controlId: selectedControl || undefined,
    limit: 50,
  });
  const auditStats = useQuery(api.auditLogs.getAuditStats);
  const controls = useQuery(api.controls.listControls, {});

  if (!loggedInUser || !auditLogs || !auditStats || !controls) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "text-zinc-400";
      case "in_progress":
        return "text-yellow-400";
      case "implemented":
        return "text-blue-400";
      case "verified":
        return "text-green-400";
      default:
        return "text-zinc-400";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div
      className="min-h-screen bg-zinc-900 p-4"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1663895064411-fff0ab8a9797)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="min-h-screen p-4"
        style={{
          backgroundColor: "rgba(24, 24, 27, 0.9)",
          backdropFilter: "blur(2px)",
        }}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-xl border p-6">
            <h1 className="text-xl font-bold text-white mb-2">Audit Logs</h1>
            <p className="text-zinc-300 text-sm">
              Track all changes and progress updates to CMMC controls over time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-lg border p-4">
              <div className="text-lg font-bold text-white">
                {auditStats.totalChanges}
              </div>
              <div className="text-xs text-zinc-400">Total Changes</div>
            </div>
            <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-lg border p-4">
              <div className="text-lg font-bold text-white">
                {auditStats.recentChanges}
              </div>
              <div className="text-xs text-zinc-400">This Week</div>
            </div>
            <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-lg border p-4">
              <div className="text-lg font-bold text-white">
                {auditStats.statusChanges}
              </div>
              <div className="text-xs text-zinc-400">Status Updates</div>
            </div>
            <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-lg border p-4">
              <div className="text-lg font-bold text-white">
                {auditStats.uniqueControls}
              </div>
              <div className="text-xs text-zinc-400">Controls Modified</div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-lg border p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-2">
                  Filter by Control
                </label>
                <select
                  value={selectedControl}
                  onChange={(e) => setSelectedControl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 text-white rounded-lg focus:ring-2 focus:ring-white focus:border-white text-sm"
                >
                  <option value="">All Controls</option>
                  {controls.map((control) => (
                    <option key={control._id} value={control.controlId}>
                      {control.controlId} - {control.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Audit Log Entries */}
          <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-lg border">
            <div className="p-4 border-b border-zinc-700">
              <h2 className="text-lg font-semibold text-white">
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-zinc-700">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-sm">
                  No audit logs found for the selected criteria
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log._id} className="p-4 hover:bg-zinc-700/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-zinc-400 bg-zinc-700 px-2 py-1 rounded">
                            {log.controlId}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {log.action.replace("_", " ").toUpperCase()}
                          </span>
                        </div>

                        {log.action === "status_update" && (
                          <div className="text-sm text-zinc-300 mb-2">
                            Status changed from{" "}
                            <span
                              className={`font-medium ${getStatusColor(log.previousStatus || "")}`}
                            >
                              {log.previousStatus?.replace("_", " ")}
                            </span>{" "}
                            to{" "}
                            <span
                              className={`font-medium ${getStatusColor(log.newStatus || "")}`}
                            >
                              {log.newStatus?.replace("_", " ")}
                            </span>
                          </div>
                        )}

                        {log.notes && (
                          <div className="text-sm text-zinc-300 bg-zinc-700/50 p-2 rounded mt-2">
                            {log.notes}
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                          <span>By: {log.userName}</span>
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
