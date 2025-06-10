import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import type { Doc } from "../convex/_generated/dataModel";

export function Configuration() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const controls = useQuery(api.controls.listControls, {}) || [];
  const updateControlConfiguration = useMutation(
    api.controls.updateControlConfiguration
  );

  if (!loggedInUser) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [expandedControl, setExpandedControl] = useState<string | null>(null);
  const [editingControl, setEditingControl] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    title: string;
    description: string;
    requirement: string;
    revisionNotes: string;
  }>({
    title: "",
    description: "",
    requirement: "",
    revisionNotes: "",
  });

  const domains = [
    "all",
    ...Array.from(new Set(controls.map((c) => c.domain))),
  ];
  const filteredControls =
    selectedDomain === "all"
      ? controls
      : controls.filter((c) => c.domain === selectedDomain);

  const handleEditStart = (control: Doc<"controls">) => {
    setEditingControl(control._id);
    setEditData({
      title: control.title,
      description: control.description,
      requirement: control.requirement,
      revisionNotes: "",
    });
  };

  const handleSave = async (controlId: string) => {
    try {
      await updateControlConfiguration({
        controlId: controlId as any,
        title: editData.title,
        description: editData.description,
        requirement: editData.requirement,
        revisionNotes: editData.revisionNotes,
      });

      setEditingControl(null);
      toast.success("Control configuration updated successfully");
    } catch (error) {
      toast.error("Failed to update control configuration");
    }
  };

  const handleCancel = () => {
    setEditingControl(null);
    setEditData({
      title: "",
      description: "",
      requirement: "",
      revisionNotes: "",
    });
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Control Configuration
                </h1>
                <p className="text-zinc-300 text-sm">
                  Customize control definitions to match your organization's
                  requirements
                </p>
              </div>
            </div>

            <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 text-yellow-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">
                    Important Notice
                  </h3>
                  <p className="text-zinc-300 text-xs">
                    Modifying control definitions will mark them as "Revised"
                    and create an audit trail. Ensure changes align with CMMC
                    requirements and your organization's compliance needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Filter */}
          <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-xl border p-6">
            <h3 className="font-semibold text-white mb-4 text-sm">
              Filter by Domain
            </h3>
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedDomain === domain
                      ? "bg-white text-black"
                      : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                  }`}
                >
                  {domain === "all" ? "All Domains" : domain}
                </button>
              ))}
            </div>
          </div>

          {/* Controls List */}
          <div className="space-y-4">
            {filteredControls.map((control) => (
              <div
                key={control._id}
                className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-xl border"
              >
                {/* Control Header */}
                <div className="p-6 border-b border-zinc-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-700 px-3 py-1 rounded-full border border-zinc-600">
                          {control.controlId}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {control.domain}
                        </span>
                        {control.isRevised && (
                          <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full font-medium border border-purple-700">
                            Revised
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-white text-lg mb-2">
                        {control.title}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setExpandedControl(
                            expandedControl === control._id ? null : control._id
                          )
                        }
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        {expandedControl === control._id
                          ? "Collapse"
                          : "Expand"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedControl === control._id && (
                  <div className="p-6">
                    {editingControl === control._id ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Control Title
                          </label>
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                title: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-zinc-700 border-zinc-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                description: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-zinc-700 border-zinc-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            rows={4}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Requirement
                          </label>
                          <textarea
                            value={editData.requirement}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                requirement: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-zinc-700 border-zinc-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Revision Notes
                          </label>
                          <textarea
                            value={editData.revisionNotes}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                revisionNotes: e.target.value,
                              })
                            }
                            className="w-full text-sm bg-zinc-700 border-zinc-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-zinc-400"
                            rows={2}
                            placeholder="Explain why this control was modified..."
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => handleSave(control._id)}
                            className="flex-1 bg-cyan-600 text-white text-sm py-2.5 px-4 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex-1 bg-zinc-700 text-zinc-300 text-sm py-2.5 px-4 rounded-lg hover:bg-zinc-600 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-white mb-2">
                            Description
                          </h4>
                          <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-700/50 p-4 rounded-lg">
                            {control.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-white mb-2">
                            Requirement
                          </h4>
                          <p className="text-zinc-300 text-sm leading-relaxed bg-cyan-900/30 p-4 rounded-lg border-l-4 border-cyan-500">
                            {control.requirement}
                          </p>
                        </div>

                        {control.isRevised && (
                          <div>
                            <h4 className="font-medium text-white mb-2">
                              Revision Information
                            </h4>
                            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
                              <div className="text-sm text-purple-300 mb-2">
                                <strong>Revised on:</strong>{" "}
                                {control.revisionDate
                                  ? new Date(
                                      control.revisionDate
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </div>
                              {control.revisionNotes && (
                                <div className="text-sm text-purple-300">
                                  <strong>Notes:</strong>{" "}
                                  {control.revisionNotes}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleEditStart(control)}
                          className="w-full bg-purple-600 text-white text-sm py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Edit Control Configuration
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredControls.length === 0 && (
            <div className="bg-zinc-800/50 border-zinc-700 backdrop-blur rounded-xl border p-12 text-center">
              <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No Controls Found
              </h3>
              <p className="text-zinc-400">
                No controls match the selected domain filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
