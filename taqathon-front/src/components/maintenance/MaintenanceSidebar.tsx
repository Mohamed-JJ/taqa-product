import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CalendarDays,
  Factory,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useMaintenanceTranslations } from "@/i18n/hooks/useTranslations";
import { MaintenanceWindowFormData, getStatus } from "./types";

interface MaintenanceSidebarProps {
  selectedWindow: MaintenanceWindowFormData | null;
  maintenanceWindows: MaintenanceWindowFormData[];
  getStatus: (window: MaintenanceWindowFormData) => string;
}

export const MaintenanceSidebar = ({
  selectedWindow,
  maintenanceWindows,
}: MaintenanceSidebarProps) => {
  const [filter, setFilter] = useState("all");
  const { setSelectedMaintenanceWindow } = useMaintenanceStore();
  const navigate = useNavigate();
  const maintenanceT = useMaintenanceTranslations();

  const filteredWindows = maintenanceWindows.filter((window: any) => {
    if (filter === "all") return true;
    return getStatus(window) === filter;
  });

  const statusCounts = {
    total: maintenanceWindows.length,
    scheduled: maintenanceWindows.filter(
      (w: any) => getStatus(w) === "scheduled",
    ).length,
    inProgress: maintenanceWindows.filter(
      (w: any) => getStatus(w) === "in-progress",
    ).length,
    completed: maintenanceWindows.filter(
      (w: any) => getStatus(w) === "completed",
    ).length,
  };

  // Calculate windows for current year
  const currentYear = new Date().getFullYear();
  const currentYearWindows = maintenanceWindows.filter((w: any) => {
    const windowYear = new Date(w.scheduleStart).getFullYear();
    return windowYear === currentYear;
  });

  const handleWindowClick = (window: any) => {
    setSelectedMaintenanceWindow(window);
    navigate(`/maintenance/details/${window.id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-taqa-primary/20 rounded-xl backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-taqa-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                {maintenanceT.maintenanceOverview}
              </h3>
              <p className="text-xs text-muted-foreground">
                {maintenanceT.realTimeOverview}
              </p>
            </div>
          </div>
          <div className="bg-taqa-blue/10 text-taqa-blue px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm border border-taqa-blue/20">
            {maintenanceT.yearWindows
              .replace("{{year}}", currentYear.toString())
              .replace("{{count}}", currentYearWindows.length.toString())}
          </div>
        </div>

        {/* Enhanced Status Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200 hover:bg-gray-100 transition-colors duration-150">
            <div className="flex items-center gap-2 mb-2">
              <Factory className="h-4 w-4 text-gray-600" />
              <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                {maintenanceT.total}
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {statusCounts.total}
            </div>
            <div className="text-xs text-gray-500">
              {maintenanceT.totalWindows}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded border border-orange-200 hover:bg-orange-100 transition-colors duration-150">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-4 w-4 text-orange-600" />
              <div className="text-orange-600 text-xs font-medium uppercase tracking-wide">
                {maintenanceT.active}
              </div>
            </div>
            <div className="text-2xl font-semibold text-orange-900">
              {statusCounts.inProgress}
            </div>
            <div className="text-xs text-orange-600">
              {maintenanceT.inProgress}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded border border-blue-200 hover:bg-blue-100 transition-colors duration-150">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <div className="text-blue-600 text-xs font-medium uppercase tracking-wide">
                {maintenanceT.planned}
              </div>
            </div>
            <div className="text-2xl font-semibold text-blue-900">
              {statusCounts.scheduled}
            </div>
            <div className="text-xs text-blue-600">
              {maintenanceT.scheduled}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-200 hover:bg-green-100 transition-colors duration-150">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-green-600 text-xs font-medium uppercase tracking-wide">
                {maintenanceT.done}
              </div>
            </div>
            <div className="text-2xl font-semibold text-green-900">
              {statusCounts.completed}
            </div>
            <div className="text-xs text-green-600">
              {maintenanceT.completed}
            </div>
          </div>
        </div>

        {/* Enhanced Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {maintenanceT.filterWindows}
            </span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full modern-shadow border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-lg border-border/50 modern-shadow">
              <SelectItem value="all" className="hover:bg-taqa-primary/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  {maintenanceT.allWindows}
                </div>
              </SelectItem>
              <SelectItem value="scheduled" className="hover:bg-taqa-blue/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-taqa-blue rounded-full" />
                  {maintenanceT.scheduled}
                </div>
              </SelectItem>
              <SelectItem
                value="in-progress"
                className="hover:bg-taqa-orange/10"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-taqa-orange rounded-full animate-pulse" />
                  {maintenanceT.inProgress}
                </div>
              </SelectItem>
              <SelectItem value="completed" className="hover:bg-taqa-green/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-taqa-green rounded-full" />
                  {maintenanceT.completed}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Windows List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium text-sm text-foreground">
            {maintenanceT.upcomingWindows}
          </h4>
          <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
        </div>

        <div className="h-48 overflow-y-auto space-y-3 scrollbar-hide">
          {filteredWindows.slice(0, 10).map((window: any, index: number) => {
            const status = getStatus(window);
            const isSelected = selectedWindow?.id === window.id;

            return (
              <div
                key={window.id}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 group
                  ${
                    isSelected
                      ? "border-taqa-primary bg-taqa-primary/5 modern-shadow-lg"
                      : "border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:border-taqa-primary/50 modern-shadow hover:modern-shadow-lg"
                  }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeIn 0.5s ease-out forwards",
                }}
                onClick={() => handleWindowClick(window)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-heading font-semibold text-sm text-foreground group-hover:text-taqa-primary transition-colors leading-tight">
                    {window.title}
                  </h5>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1
                    ${
                      status === "in-progress"
                        ? "bg-taqa-orange/20 text-taqa-orange border border-taqa-orange/30"
                        : status === "completed"
                          ? "bg-taqa-green/20 text-taqa-green border border-taqa-green/30"
                          : "bg-taqa-blue/20 text-taqa-blue border border-taqa-blue/30"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === "in-progress"
                          ? "bg-taqa-orange animate-pulse"
                          : status === "completed"
                            ? "bg-taqa-green"
                            : "bg-taqa-blue"
                      }`}
                    />
                    {status.replace("-", " ")}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">
                      {new Date(window.scheduleStart).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">
                        {Math.round(
                          (new Date(window.scheduleEnd).getTime() -
                            new Date(window.scheduleStart).getTime()) /
                            (1000 * 60 * 60),
                        )}
                        h duration
                      </span>
                    </div>

                    {window.anomalies?.length > 0 && (
                      <div className="flex items-center gap-1 bg-status-critical/10 text-status-critical px-2 py-0.5 rounded-full">
                        <AlertCircle className="h-3 w-3" />
                        <span className="font-medium">
                          {window.anomalies.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-taqa-primary to-taqa-secondary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 