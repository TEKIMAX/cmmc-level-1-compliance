import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import type { Doc } from "../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { ChevronDown, ChevronUp, Edit3, MessageCircle } from "lucide-react";
import { AIChat } from "./AIChat";

interface ControlCardProps {
  control: Doc<"controls">;
}

export function ControlCard({ control }: ControlCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [status, setStatus] = useState(control.status);
  const [notes, setNotes] = useState(control.implementationNotes || "");
  const [assignedTo, setAssignedTo] = useState(control.assignedTo || "");

  const updateControlStatus = useMutation(api.controls.updateControlStatus);

  const handleSave = async () => {
    try {
      await updateControlStatus({
        controlId: control._id,
        status,
        implementationNotes: notes,
        assignedTo: assignedTo,
      });
      setIsEditing(false);
      toast.success("Control updated successfully");
    } catch (error) {
      toast.error("Failed to update control");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-zinc-700 text-zinc-300 border-zinc-600";
      case "in_progress":
        return "bg-yellow-600 text-white border-yellow-500";
      case "implemented":
        return "bg-blue-600 text-white border-blue-500";
      case "verified":
        return "bg-green-600 text-white border-green-500";
      default:
        return "bg-zinc-700 text-zinc-300 border-zinc-600";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  return (
    <>
      <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs font-mono font-medium border-zinc-600 text-zinc-300"
                >
                  {control.controlId}
                </Badge>
                {control.isRevised && (
                  <Badge className="bg-purple-600 text-white border-purple-500 text-xs font-medium">
                    Revised
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base leading-tight font-semibold text-white">
                {control.title}
              </CardTitle>
            </div>
            <Badge
              className={`${getStatusColor(control.status)} text-xs font-medium px-2 py-1`}
            >
              {getStatusLabel(control.status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
              {control.description}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 px-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    More
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-8 px-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAIChatOpen(true)}
                className="h-8 px-2 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                AI Help
              </Button>
            </div>

            {isExpanded && (
              <div className="space-y-3 pt-3 border-t border-zinc-700">
                <div>
                  <h4 className="text-sm font-medium mb-1 text-white">
                    Requirement
                  </h4>
                  <p className="text-sm text-zinc-300 bg-zinc-700/50 p-3 rounded leading-relaxed">
                    {control.requirement}
                  </p>
                </div>

                {control.implementationNotes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-white">
                      Implementation Notes
                    </h4>
                    <p className="text-sm text-zinc-300 bg-zinc-700/50 p-3 rounded leading-relaxed">
                      {control.implementationNotes}
                    </p>
                  </div>
                )}

                {control.assignedTo && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-white">
                      Assigned To
                    </h4>
                    <p className="text-sm text-zinc-300 font-medium">
                      {control.assignedTo}
                    </p>
                  </div>
                )}
              </div>
            )}

            {isEditing && (
              <div className="space-y-3 pt-3 border-t border-zinc-700">
                <div>
                  <label className="text-sm font-medium mb-1 block text-white">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="implemented">Implemented</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-white">
                    Implementation Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 text-sm bg-zinc-700 border border-zinc-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white resize-none placeholder:text-zinc-400"
                    placeholder="Add implementation notes..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-white">
                    Assigned To
                  </label>
                  <Input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Enter assignee name..."
                    className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="flex-1 bg-white text-black hover:bg-zinc-200"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isAIChatOpen && (
        <AIChat control={control} onClose={() => setIsAIChatOpen(false)} />
      )}
    </>
  );
}
