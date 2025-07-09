import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Info, AlertCircle, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useMaintenanceTranslations } from "@/i18n/hooks/useTranslations";
import { AnomalyFormData, MaintenanceWindowFormData, getStatus } from "./types";
import { MaintenanceForm } from "./MaintenanceForm";
import { DraggableAnomaly } from "./DraggableAnomaly";
import { NoAnomalies } from "./NoAnomalies";
import type { MaintenanceWindow } from "@/types/anomaly";

interface DropZoneMaintenanceWindowProps {
  window: MaintenanceWindowFormData & {
    id?: string;
    anomalies?: AnomalyFormData[];
  };
  onDrop: (windowId: string) => void;
  onDragOver: (windowId: string) => void;
  onDragLeave: () => void;
  isDragOver: boolean;
  deleteMaintenanceWindow: (windowId: string) => void;
  getStatus: (window: MaintenanceWindowFormData) => string;
  draggedAnomaly: AnomalyFormData | null;
  onAnomalyDragStart: (
    anomaly: AnomalyFormData,
    sourceWindowId: string,
  ) => void;
  onAnomalyDragEnd: () => void;
}

export const DropZoneMaintenanceWindow = ({
  window,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
  deleteMaintenanceWindow,
  getStatus,
  draggedAnomaly,
  onAnomalyDragStart,
  onAnomalyDragEnd,
}: DropZoneMaintenanceWindowProps) => {
  const navigate = useNavigate();
  const maintenanceT = useMaintenanceTranslations();
  const { setSelectedMaintenanceWindow } = useMaintenanceStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(window.id || "");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(window.id || "");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      onDragLeave();
    }
  };

  const handleCardClick = () => {
    setSelectedMaintenanceWindow(window as MaintenanceWindow);
    navigate(`/maintenance/details/${window.id || ""}`);
  };

  return (
    <Card
      className={`border-gray-200 bg-white hover:bg-gray-50/50 shadow-md hover:shadow-lg transition-all duration-300 ${
        isDragOver ? "border-blue-400 border-2 bg-blue-50/70 shadow-xl" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {window.title}
            <Badge
              variant={
                getStatus(window) === "in-progress"
                  ? "default"
                  : getStatus(window) === "closed"
                    ? "destructive"
                    : "secondary"
              }
            >
              {getStatus(window)}
            </Badge>
            {window.anomalies && window.anomalies.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {window.anomalies.length} {maintenanceT.anomalies}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <MaintenanceForm
              buttonText={maintenanceT.update}
              data={{
                title: window.title,
                scheduleStart: window.scheduleStart,
                scheduleEnd: window.scheduleEnd,
                anomalies: window.anomalies || [],
                type: window.type || "MINOR",
              }}
              id={window.id || null}
            />
            <Button
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={() => deleteMaintenanceWindow(window.id || "")}
            >
              {maintenanceT.delete}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex  items-center gap-2 bg-muted/50 px-3 py-2 rounded-md">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div className="flex flex-row gap-2 items-center">
              <span className="font-medium">
                {new Date(window.scheduleStart).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-muted-foreground text-xs">
                {maintenanceT.to}
              </span>
              <span className="font-medium">
                {new Date(window.scheduleEnd).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-md border border-green-200">
            <Clock className="h-4 w-4 text-green-600" />
            <div className="flex flex-row gap-2 items-center">
              <span className="font-medium text-green-700">
                {Math.round(
                  (new Date(window.scheduleEnd).getTime() -
                    new Date(window.scheduleStart).getTime()) /
                    (1000 * 60 * 60),
                )}
                h
              </span>
              <span className="text-green-600 text-xs">
                {maintenanceT.windowDuration}
              </span>
            </div>
          </div>

          {window.anomalies && window.anomalies.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-md border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div className="flex flex-row gap-2 items-center">
                <span className="font-medium text-red-700">
                  {
                    (window.anomalies || []).filter((a) => a.criticality > 12)
                      .length
                  }
                </span>
                <span className="text-red-600 text-xs">
                  {maintenanceT.criticalIssuesCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isDragOver && (
          <div className="mb-4 p-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-100/70 text-center shadow-inner">
            <p className="text-sm text-blue-700 font-medium">
              {maintenanceT.dropAnomalyHere} "{window.title}"
            </p>
          </div>
        )}

        {(window.anomalies || []).length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {maintenanceT.assignedAnomalies}
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCardClick}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6 p-5"
                >
                  {maintenanceT.viewDetails}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {(window.anomalies || [])
                .slice(0, 3)
                .map(
                  (anomaly) =>
                    anomaly.sysShutDownRequired && (
                      <DraggableAnomaly
                        key={anomaly.id}
                        anomaly={anomaly}
                        sourceWindowId={window.id || ""}
                        onDragStart={onAnomalyDragStart}
                        onDragEnd={onAnomalyDragEnd}
                      />
                    ),
                )}
              {(window.anomalies || []).length > 3 && (
                <div className="flex items-center justify-center col-span-full">
                  <p className="text-xs text-gray-500">
                    {(window.anomalies || []).length - 3} {maintenanceT.more}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="min-h-[100px] flex items-center justify-center">
            <NoAnomalies />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
