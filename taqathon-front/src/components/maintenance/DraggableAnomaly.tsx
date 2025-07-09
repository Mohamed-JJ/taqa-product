import { useState } from "react";
import { GripVertical, Settings, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { getStatusBadgeColor } from "@/lib/criticalityUtils";
import {
  useMaintenanceTranslations,
  useAnomalyStatusTranslations,
  useAnomalyTranslations,
} from "@/i18n/hooks/useTranslations";
import { AnomalyFormData } from "./types";
import { PendingApprovalDialog } from "./PendingApprovalDialog";
import { useNavigate } from "react-router-dom";

interface DraggableAnomalyProps {
  anomaly: AnomalyFormData;
  sourceWindowId: string;
  onDragStart: (
    anomaly: AnomalyFormData,
    sourceWindowId: string,
  ) => void | null;
  onDragEnd: () => void | null;
}

export const DraggableAnomaly = ({
  anomaly,
  sourceWindowId,
  onDragStart,
  onDragEnd,
}: DraggableAnomalyProps) => {
  const { unassignAnomaly, changeAnomalyStatusInMaintenanceWindow } =
    useMaintenanceStore();
  const [status, setStatus] = useState(anomaly.status);
  const [showPendingApprovalDialog, setShowPendingApprovalDialog] =
    useState(false);
  const navigate = useNavigate();
  const maintenanceT = useMaintenanceTranslations();
  const statusT = useAnomalyStatusTranslations();
  const anomalyT = useAnomalyTranslations();

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(anomaly, sourceWindowId);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd();
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleStatusChange = (value: string) => {
    if ("TREATED" === value) {
      setShowPendingApprovalDialog(true);
    } else {
      setStatus(value);
      changeAnomalyStatusInMaintenanceWindow(anomaly.id.toString(), value);
    }
  };

  const handlePendingApprovalSuccess = () => {
    setStatus("TREATED");
  };

  const criticality =
    Math.ceil(anomaly.disponibility || anomaly.predictedDisponibility) +
    Math.ceil(anomaly.integrity || anomaly.predictedIntegrity) +
    Math.ceil(anomaly.processSafety || anomaly.predictedProcessSafety);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center border border-gray-300 rounded-lg p-3 bg-card hover:bg-accent/50 hover:shadow-md cursor-move transition-all duration-500 w-full min-h-[120px] relative group"
    >
      <PendingApprovalDialog
        isOpen={showPendingApprovalDialog}
        onClose={() => setShowPendingApprovalDialog(false)}
        anomaly={anomaly}
        onSubmitSuccess={handlePendingApprovalSuccess}
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div
        onClick={() => {
          navigate(`/anomalies/${anomaly.id}`);
        }}
        className="flex items-start justify-between h-full w-full"
      >
        <div className="flex-1 space-y-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-md line-clamp-2">{anomaly.description}</p>
              <Badge
                className={`text-xs flex-shrink-0 ${
                  criticality > 12
                    ? "bg-status-critical"
                    : criticality > 9
                      ? "bg-status-high"
                      : criticality > 5
                        ? "bg-status-medium"
                        : criticality > 0
                          ? "bg-status-low"
                          : "bg-status-very-low"
                }`}
              >
                {criticality}
              </Badge>
            </div>
          </div>

          <span className="flex items-center gap-4 underline">
            <Settings className="h-3 w-3" />
            <span className="truncate text-xs text-muted-foreground">
              {anomaly.equipment}
            </span>
            {/* Detection date, Service, Estimated time */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted-foreground">
              {anomaly.detectionDate && (
                <span className="flex items-center gap-1 min-w-0">
                  <Clock className="h-3 w-3" />
                  {new Date(anomaly.detectionDate).toLocaleString()}
                  {anomaly.estimatedTime && (
                    <span className="text-xs text-muted-foreground bg-gray-300 rounded-md p-1">
                      {anomaly.estimatedTime}h
                    </span>
                  )}
                </span>
              )}
            </div>
          </span>

          {/* System shutdown required */}
          {anomaly.sysShutDownRequired && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-600 font-medium">
                {maintenanceT.systemShutdownRequired}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                unassignAnomaly(anomaly.id.toString(), sourceWindowId)
              }
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-xs h-6 px-2"
            >
              {maintenanceT.unassign}
            </Button>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-28 h-6 text-xs p-1 ${getStatusBadgeColor(status)}`}
              >
                <SelectValue placeholder={anomalyT.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_PROGRESS">
                  {statusT.inProgress}
                </SelectItem>
                <SelectItem value="TREATED">
                  {statusT.pendingApproval}
                </SelectItem>
                <SelectItem value="CLOSED">{statusT.closed}</SelectItem>
              </SelectContent>
            </Select>
            {/* Predictions (Disponibilité, Intégrité, Process Safety) */}
            {("predictedDisponibility" in anomaly ||
              "predictedIntegrity" in anomaly ||
              "predictedProcessSafety" in anomaly) && (
              <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span>
                  <span className="font-semibold">Disponibilité:</span>{" "}
                  {Math.ceil(
                    anomaly.disponibility ||
                      (anomaly as any).predictedDisponibility,
                  )}
                </span>
                <span>
                  <span className="font-semibold">Intégrité:</span>{" "}
                  {Math.ceil(
                    anomaly.integrity || (anomaly as any).predictedIntegrity,
                  )}
                </span>
                <span>
                  <span className="font-semibold">Process Safety:</span>{" "}
                  {Math.ceil(
                    anomaly.processSafety ||
                      (anomaly as any).predictedProcessSafety,
                  )}
                </span>
              </div>
            )}
            {"service" in anomaly && (anomaly as any).service && (
              <span className="flex items-center gap-1 absolute right-2 p-1 rounded-md bg-gray-300 min-w-0">
                <span className="font-semibold text-xs text-muted-foreground">
                  {(anomaly as any).service}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
