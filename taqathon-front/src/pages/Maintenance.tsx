import { useEffect, useState } from "react";
import { Calendar, CalendarDays, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useMaintenanceTranslations } from "@/i18n/hooks/useTranslations";
import {
  MaintenanceForm,
  MaintenanceCalendar,
  MaintenanceSidebar,
  DropZoneMaintenanceWindow,
  getStatus,
  AnomalyFormData,
} from "@/components/maintenance";

const Maintenance = () => {
  const {
    maintenanceWindows,
    deleteMaintenanceWindow,
    getMaintenanceWindows,
    updateBothMaintenanceWindows,
    selectedMaintenanceWindow,
  } = useMaintenanceStore();
  const maintenanceT = useMaintenanceTranslations();

  const [draggedAnomaly, setDraggedAnomaly] = useState<AnomalyFormData | null>(
    null,
  );
  const [sourceWindowId, setSourceWindowId] = useState<string | null>(null);
  const [dragOverWindowId, setDragOverWindowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");

  useEffect(() => {
    getMaintenanceWindows();
  }, []);

  const handleAnomalyDragStart = (
    anomaly: AnomalyFormData,
    windowId: string,
  ) => {
    setDraggedAnomaly(anomaly);
    setSourceWindowId(windowId);
  };

  const handleAnomalyDragEnd = () => {
    setDraggedAnomaly(null);
    setSourceWindowId(null);
    setDragOverWindowId(null);
  };

  const handleWindowDragOver = (windowId: string) => {
    if (draggedAnomaly && windowId !== sourceWindowId) {
      setDragOverWindowId(windowId);
    }
  };

  const handleWindowDragLeave = () => {
    setDragOverWindowId(null);
  };

  const handleWindowDrop = (targetWindowId: string) => {
    if (draggedAnomaly && sourceWindowId && targetWindowId !== sourceWindowId) {
      const sourceWindow = maintenanceWindows.find(
        (w) => w.id === sourceWindowId,
      );
      const targetWindow = maintenanceWindows.find(
        (w) => w.id === targetWindowId,
      );

      if (sourceWindow && targetWindow) {
        const updatedSourceAnomalies = sourceWindow.anomalies.filter(
          (a) => a.id !== draggedAnomaly.id,
        );

        const updatedTargetAnomalies = [
          ...targetWindow.anomalies,
          { ...draggedAnomaly, maintenanceWindowId: parseInt(targetWindowId) },
        ];

        updateBothMaintenanceWindows(
          sourceWindowId,
          draggedAnomaly.id,
          targetWindowId,
          {
            sourceWindow: {
              ...sourceWindow,
              anomalies: updatedSourceAnomalies,
            },
            targetWindow: {
              ...targetWindow,
              anomalies: updatedTargetAnomalies,
            },
          },
        );
      }
    }

    setDragOverWindowId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-lg bg-[#003D55] p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="text-white">
                {maintenanceT.industrialMaintenancePlanning}
              </div>
            </div>
            <h1 className="text-lg lg:text-xl font-bold mb-4 text-white truncate">
              {maintenanceT.windowManagement}
            </h1>
            <div className="text-white/90 text-sm">
              {maintenanceT.windowManagementDescription}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MaintenanceForm
              buttonText={maintenanceT.createMaintenanceWindow}
              data={null}
              id={null}
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-14 bg-gradient-to-r from-background to-muted/20 border-border/50 modern-shadow">
          <TabsTrigger
            value="calendar"
            className="flex items-center gap-2 h-12 data-[state=active]:bg-[#003D55] data-[state=active]:text-white font-semibold"
          >
            <CalendarDays className="h-4 w-4" />
            {maintenanceT.calendarView}
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 h-12 data-[state=active]:bg-[#003D55] data-[state=active]:text-white font-semibold"
          >
            <List className="h-4 w-4" />
            {maintenanceT.listView}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-0">
          {maintenanceWindows && maintenanceWindows.length > 0 ? (
            <div className="space-y-4">
              <div className="flex gap-6 items-start">
                <div className="flex-1">
                  <MaintenanceCalendar />
                </div>
                <div className="w-[28rem]">
                  <MaintenanceSidebar
                    selectedWindow={selectedMaintenanceWindow}
                    maintenanceWindows={maintenanceWindows}
                    getStatus={getStatus}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
              <CardContent className="text-center py-16">
                <div className="relative">
                  <div className="p-8 bg-gradient-to-br from-taqa-blue/10 to-taqa-secondary/10 rounded-full mx-auto mb-6 w-32 h-32 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-taqa-blue" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">
                    {maintenanceT.noMaintenanceWindows}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {maintenanceT.createFirstWindow}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-0">
          <div className="grid gap-3">
            {maintenanceWindows && maintenanceWindows.length > 0 ? (
              maintenanceWindows.map((window) => (
                <DropZoneMaintenanceWindow
                  key={window.id}
                  window={window}
                  onDrop={handleWindowDrop}
                  onDragOver={handleWindowDragOver}
                  onDragLeave={handleWindowDragLeave}
                  isDragOver={dragOverWindowId === window.id}
                  deleteMaintenanceWindow={deleteMaintenanceWindow}
                  getStatus={getStatus}
                  draggedAnomaly={draggedAnomaly}
                  onAnomalyDragStart={handleAnomalyDragStart}
                  onAnomalyDragEnd={handleAnomalyDragEnd}
                />
              ))
            ) : (
              <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
                <CardContent className="text-center py-16">
                  <div className="relative">
                    <div className="p-8 bg-gradient-to-br from-taqa-green/10 to-taqa-secondary/10 rounded-full mx-auto mb-6 w-32 h-32 flex items-center justify-center">
                      <List className="h-16 w-16 text-taqa-green" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      {maintenanceT.noMaintenanceWindows}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {maintenanceT.createFirstWindow}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
