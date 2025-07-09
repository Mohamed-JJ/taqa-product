import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Edit3,
  Trash2,
  Info,
  AlertCircle,
  Settings,
  List,
  Activity,
  TrendingUp,
  CheckCircle,
  Factory,
  Wrench,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MaintenanceForm,
  NoAnomalies,
  MaintenanceWindowFormData,
  RexIntegration,
} from "@/components/maintenance";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnomalyCard } from "@/components/anomalies/list/AnomalyCard";
import { useAnomalyList } from "@/hooks/useAnomalyList";

export const MaintenanceWindowDetails = () => {
  const navigate = useNavigate();
  const {
    selectedMaintenanceWindow: window,
    deleteMaintenanceWindow,
    getMaintenanceWindow,
  } = useMaintenanceStore();

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get utilities and translations from anomaly list hook
  const {
    getCriticalityFromTotal,
    getEquipmentName,
    formatDateWithLocale,
    translateStatus,
    anomalyT,
    t,
    language,
  } = useAnomalyList();

  const getStatus = (window: MaintenanceWindowFormData) => {
    const now = new Date();
    const startDate = new Date(window.scheduleStart);
    const endDate = new Date(window.scheduleEnd);

    if (now >= startDate && now <= endDate) {
      return "in-progress";
    } else if (now > endDate) {
      return "completed";
    } else {
      return "scheduled";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-taqa-orange/20 text-taqa-orange border-taqa-orange/30";
      case "completed":
        return "bg-taqa-green/20 text-taqa-green border-taqa-green/30";
      case "scheduled":
        return "bg-taqa-blue/20 text-taqa-blue border-taqa-blue/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getDuration = () => {
    const start = new Date(window.scheduleStart).getTime();
    const end = new Date(window.scheduleEnd).getTime();
    const hours = Math.round((end - start) / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  const getEstimatedWork = () => {
    return (
      window.anomalies?.reduce((total, anomaly) => {
        return total + (anomaly.estimatedTime || 0);
      }, 0) || 0
    );
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMaintenanceWindow(window.id);
      navigate("/maintenance");
    } catch (error) {
      console.error("Failed to delete maintenance window:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getWindow = async () => {
    setIsLoading(true);
    await getMaintenanceWindow(id);
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getWindow();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-taqa-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground font-medium">
            Loading maintenance window...
          </p>
        </div>
      </div>
    );
  }

  if (!window) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardContent className="text-center py-16">
            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-status-critical/10 to-status-high/10 rounded-full mx-auto mb-6 w-32 h-32 flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-status-critical" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Maintenance Window Not Found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                The requested maintenance window could not be found.
              </p>
              <Button
                onClick={() => navigate("/maintenance")}
                variant="outline"
                className="hover-lift modern-shadow"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getStatus(window);
  const statusColor = getStatusColor(status);
  const startDateTime = formatDateTime(window.scheduleStart);
  const endDateTime = formatDateTime(window.scheduleEnd);
  const duration = getDuration();
  const estimatedWork = getEstimatedWork();
  const criticalAnomalies =
    window.anomalies?.filter((a) => a.criticality > 12).length || 0;
  const shutdownRequired =
    window.anomalies?.filter((a) => a.sysShutDownRequired).length || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/maintenance")}
                  className="text-black/80 hover:text-black hover:bg-black/10 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Maintenance
                </Button>
                <Separator orientation="vertical" className="h-6 bg-black/30" />
                <div className="p-3 bg-black/10 rounded-xl backdrop-blur-sm">
                  <Wrench className="h-4 w-4 text-black" />
                </div>
                <div className="text-black/90 text-sm font-medium tracking-wide">
                  Maintenance Window Details
                </div>
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-xl lg:text-2xl font-heading font-bold tracking-tight">
                  {window.title}
                </h1>
                <Badge className={cn("font-bold text-sm", statusColor)}>
                  {status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MaintenanceForm
                buttonText="Edit Window"
                data={{
                  title: window.title,
                  scheduleStart: window.scheduleStart,
                  scheduleEnd: window.scheduleEnd,
                  anomalies: window.anomalies,
                  type: window.type || "MINOR",
                }}
                id={window.id}
              />
              <Button
                variant="destructive"
                size="lg"
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn-modern hover-lift modern-shadow"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-5 mr-2" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {status === "in-progress" && (
        <Alert className="border-taqa-orange/30 bg-gradient-to-r from-taqa-orange/10 via-background to-taqa-orange/5 modern-shadow-lg">
          <AlertCircle className="h-4 w-4 text-taqa-orange" />
          <AlertDescription className="text-foreground font-medium">
            This maintenance window is currently in progress. Any changes should
            be coordinated with the maintenance team.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Main Content */}
      <div className="space-y-8">
        {/* Schedule & Status Card */}
        <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-taqa-primary" />
              Schedule & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Schedule Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Start Date & Time
                </div>
                <div className="pl-6 bg-taqa-blue/10 rounded-lg p-4 border border-taqa-blue/20">
                  <p className="font-heading font-bold text-lg">
                    {startDateTime.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {startDateTime.time}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  End Date & Time
                </div>
                <div className="pl-6 bg-taqa-green/10 rounded-lg p-4 border border-taqa-green/20">
                  <p className="font-heading font-bold text-lg">
                    {endDateTime.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {endDateTime.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar for In-Progress Windows */}
            {status === "in-progress" && (
              <div className="space-y-4">
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(
                        (Date.now() -
                          new Date(window.scheduleStart).getTime()) /
                          (1000 * 60 * 60),
                      )}
                      h elapsed
                    </span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-taqa-orange to-taqa-primary h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          ((Date.now() -
                            new Date(window.scheduleStart).getTime()) /
                            (new Date(window.scheduleEnd).getTime() -
                              new Date(window.scheduleStart).getTime())) *
                            100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-taqa-blue/10 to-taqa-blue/5 rounded-xl border border-taqa-blue/20">
                <Clock className="w-6 h-6 text-taqa-blue mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-taqa-blue">
                  {duration}
                </p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              {/* <div className="text-center p-4 bg-gradient-to-br from-taqa-orange/10 to-taqa-orange/5 rounded-xl border border-taqa-orange/20">
                <Settings className="w-6 h-6 text-taqa-orange mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-taqa-orange">
                  {estimatedWork}h
                </p>
                <p className="text-xs text-muted-foreground">Est. Work</p>
              </div> */}
              <div className="text-center p-4 bg-gradient-to-br from-taqa-green/10 to-taqa-green/5 rounded-xl border border-taqa-green/20">
                <List className="w-6 h-6 text-taqa-green mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-taqa-green">
                  {window.anomalies?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Anomalies</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-status-critical/10 to-status-critical/5 rounded-xl border border-status-critical/20">
                <AlertCircle className="w-6 h-6 text-status-critical mx-auto mb-2" />
                <p className="text-2xl font-heading font-bold text-status-critical">
                  {criticalAnomalies}
                </p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Anomalies */}
        <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-taqa-primary" />
                  Assigned Anomalies
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Anomalies scheduled for this maintenance window
                </p>
              </div>
              {window.anomalies?.length > 0 && (
                <Badge className="bg-taqa-primary/20 text-taqa-primary border-taqa-primary/30 font-bold">
                  {window.anomalies.length}{" "}
                  {window.anomalies.length === 1 ? "anomaly" : "anomalies"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {window.anomalies?.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {window.anomalies.map((anomaly, index) => (
                  <div
                    key={anomaly.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AnomalyCard
                      anomaly={anomaly}
                      index={index}
                      getCriticalityFromTotal={getCriticalityFromTotal}
                      getEquipmentName={getEquipmentName}
                      formatDateWithLocale={formatDateWithLocale}
                      translateStatus={translateStatus}
                      anomalyT={anomalyT}
                      t={t}
                      language={language}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-8 bg-muted/20 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <NoAnomalies />
              </div>
            )}
          </CardContent>
        </Card>

        {/* REX Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Placeholder for additional content */}
          </div>
          <div className="lg:col-span-1">
            <RexIntegration
              maintenanceWindow={window}
              isCompleted={status === "completed"}
              onRexCreated={(rex) => {
                console.log("REX created:", rex);
                // In a real app, this would update the REX store/state
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
