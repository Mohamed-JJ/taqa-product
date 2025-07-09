import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useDashboardTranslations,
  useCommonTranslations,
  useAnomalyTranslations,
  useCriticalityTranslations,
  useMaintenanceTranslations,
  useTranslations,
} from "@/i18n/hooks/useTranslations";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { MaintenanceCalendar } from "@/components/maintenance";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useSearchParams } from "react-router-dom";
import {
  DashboardHeader,
  CriticalAlert,
  ServiceFilter,
  LoadingOverlay,
  AnomalyChart,
  WorkflowStatus,
} from "@/components/dashboard";

interface DashboardData {
  totalAnomalies: number;
  openAnomalies: number;
  anomalyByMonth: Array<{
    month: string;
    count: number;
  }>;
  criticalAnomalies: number;
  highPriorityAnomalies: number;
  averageResolutionTime: number;
  anomaliesByStatus: Record<string, number>;
  anomaliesByCriticality: Record<string, number>;
  anomaliesByUnit: Record<string, number>;
  safetyImpactMetrics: {
    majorRisk: number;
    minorRisk: number;
    noRisk: number;
  };
  availabilityImpactMetrics: {
    significant: number;
    partial: number;
    noImpact: number;
  };
  trendAnalysis: {
    thisMonth: number;
    percentageChange: number;
  };
  recentAnomalies: Array<{
    id: string;
    title: string;
    description: string;
    equipment: {
      equipmentNumber: string;
    };
    unit: string;
    criticalityAssessment: {
      level: string;
      score: number;
    };
  }>;
  upcomingMaintenance: Array<{
    id: string;
    title: string;
    scheduleStart: string;
    scheduleEnd: string;
  }>;
  maintenanceWindowUtilization: number;
}



const Dashboard = () => {
  // All hooks must be called at the top level
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(false);

  const handleServiceChange = (serviceName: string) => {
    // Don't reload if clicking on the already selected service
    if (service === serviceName) {
      return;
    }

    // Only show service loader if we're not on initial load
    if (!loading) {
      setServiceLoading(true);
    }
    setSearchParams({ service: serviceName });
  };

  // Translation hooks - must be called before any conditional returns
  const dashboardT = useDashboardTranslations();
  const commonT = useCommonTranslations();
  const anomalyT = useAnomalyTranslations();
  const criticalityT = useCriticalityTranslations();
  const maintenanceT = useMaintenanceTranslations();
  const { t } = useTranslations();
  const { getMaintenanceWindows } = useMaintenanceStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const service = searchParams.get("service")?.toUpperCase() || "ALL";

  useEffect(() => {
    // Validate service parameter and redirect to ALL if invalid
    if (service && !["ALL", "MC", "MM", "MD", "CT", "EL"].includes(service)) {
      setSearchParams({ service: "ALL" });
      return; // Exit early to prevent API call with invalid service
    }

    const fetchDashBoardData = async () => {
      try {
        // Only set main loading on initial load, not on service changes
        if (!dashboardData) {
          setLoading(true);
        }

        // Send empty string for "ALL" service, otherwise send the service name
        const serviceParam = service === "ALL" ? "" : service;
        const data = await apiClient.get(
          `/anomaly/DashBoard?service=${serviceParam}`,
        );
        setDashboardData(data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
        setServiceLoading(false);
      }
    };
    fetchDashBoardData();
    getMaintenanceWindows();
  }, [service]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-taqa-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to load dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Unable to fetch dashboard data
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Destructure data after conditional checks
  const {
    totalAnomalies,
    openAnomalies,
    criticalAnomalies,
    highPriorityAnomalies,
    averageResolutionTime,
    anomaliesByStatus,
    anomaliesByCriticality,
    anomaliesByUnit,
    safetyImpactMetrics,
    availabilityImpactMetrics,
    trendAnalysis,
    recentAnomalies,
    upcomingMaintenance,
    maintenanceWindowUtilization,
  } = dashboardData;

  return (
    <div className="space-y-8 animate-fade-in relative">
      <LoadingOverlay isVisible={serviceLoading} currentService={service} />

      <div className="space-y-8">
        <DashboardHeader />
        
        <CriticalAlert 
          criticalAnomalies={criticalAnomalies} 
          highPriorityAnomalies={highPriorityAnomalies} 
        />
        
        <ServiceFilter 
          currentService={service} 
          onServiceChange={handleServiceChange} 
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <AnomalyChart anomalyByMonth={dashboardData.anomalyByMonth} />
          <WorkflowStatus 
            anomaliesByStatus={anomaliesByStatus} 
            totalAnomalies={totalAnomalies} 
          />
        </div>
        <MaintenanceCalendar />
      </div>
    </div>
  );
};

export default Dashboard;
