import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Activity, Gauge, Clock, TrendingUp } from "lucide-react";
import { Anomaly } from "@/types/anomaly";
import { getCriticalityColor } from "@/lib/criticalityUtils";
import { cn } from "@/lib/utils";
import { useAnomalyTranslations } from "@/i18n/hooks/useTranslations";

interface AnomalyMetricsSectionProps {
  anomaly: Anomaly;
  safetyScore: number;
  availabilityScore: number;
  integrityScore: number;
  formatEstimatedTime: (time: number) => string;
  onMetricsEditClick: () => void;
  anomalyT: any;
}

export const AnomalyMetricsSection = ({
  anomaly,
  safetyScore,
  availabilityScore,
  integrityScore,
  formatEstimatedTime,
  onMetricsEditClick,
  anomalyT,
}: AnomalyMetricsSectionProps) => {
  const anomalyTranslations = useAnomalyTranslations();
  const totalCriticality = safetyScore + availabilityScore + integrityScore;
  const getCriticalityLevel = (score: number) => {
    if (score > 12) return "critical";
    if (score > 9) return "high";
    if (score > 5) return "medium";
    if (score > 0) return "low";
    return "very-low";
  };
  
  const criticalityLevel = getCriticalityLevel(totalCriticality);
  const isSystemShutdownRequired = totalCriticality > 12;

  return (
    <div className="space-y-6">
      {/* Header with feedback badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-heading font-semibold">{anomalyTranslations.aiMetricsAnalysis}</h2>
          <Badge 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
          >
            {anomaly.userFeedBack ? anomalyTranslations.userFeedback : anomalyTranslations.aiGenerated}
          </Badge>
        </div>
        
        {anomaly.status !== "CLOSED" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMetricsEditClick}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {anomalyTranslations.provideFeedback}
          </Button>
        )}
      </div>

      {/* Prominent Criticality Card */}
      <Card className={cn(
        "relative overflow-hidden border-l-4 shadow-md transition-all duration-300 hover:shadow-lg",
        totalCriticality > 12 && "border-l-red-500 bg-gradient-to-r from-red-50 to-red-25 animate-pulse",
        totalCriticality > 9 && totalCriticality <= 12 && "border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-25",
        totalCriticality > 5 && totalCriticality <= 9 && "border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-25",
        totalCriticality > 0 && totalCriticality <= 5 && "border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-25",
        totalCriticality === 0 && "border-l-green-500 bg-gradient-to-r from-green-50 to-green-25"
      )}>
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-md",
                totalCriticality > 12 && "bg-red-100",
                totalCriticality > 9 && totalCriticality <= 12 && "bg-orange-100",
                totalCriticality > 5 && totalCriticality <= 9 && "bg-yellow-100",
                totalCriticality > 0 && totalCriticality <= 5 && "bg-blue-100",
                totalCriticality === 0 && "bg-green-100"
              )}>
                <AlertTriangle className={cn(
                  "h-4 w-4",
                  totalCriticality > 12 && "text-red-600",
                  totalCriticality > 9 && totalCriticality <= 12 && "text-orange-600",
                  totalCriticality > 5 && totalCriticality <= 9 && "text-yellow-600",
                  totalCriticality > 0 && totalCriticality <= 5 && "text-blue-600",
                  totalCriticality === 0 && "text-green-600"
                )} />
              </div>
              {anomalyTranslations.criticality}
            </CardTitle>
            
            <Badge className={cn(
              "text-sm font-bold px-3 py-1",
              getCriticalityColor(criticalityLevel)
            )}>
              {totalCriticality}/15
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 px-4 pb-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-lg font-bold",
                totalCriticality > 12 && "text-red-600",
                totalCriticality > 9 && totalCriticality <= 12 && "text-orange-600",
                totalCriticality > 5 && totalCriticality <= 9 && "text-yellow-600",
                totalCriticality > 0 && totalCriticality <= 5 && "text-blue-600",
                totalCriticality === 0 && "text-green-600"
              )}>
                {totalCriticality > 12 && anomalyTranslations.criticalRisk}
                {totalCriticality > 9 && totalCriticality <= 12 && anomalyTranslations.highRisk}
                {totalCriticality > 5 && totalCriticality <= 9 && anomalyTranslations.mediumRisk}
                {totalCriticality > 0 && totalCriticality <= 5 && anomalyTranslations.lowRisk}
                {totalCriticality === 0 && anomalyTranslations.veryLowRisk}
              </span>
              
              {isSystemShutdownRequired && (
                <Badge variant="destructive" className="animate-pulse text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {anomalyTranslations.systemShutdownRequired}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {totalCriticality > 12 && anomalyTranslations.immediateActionRequired}
              {totalCriticality > 9 && totalCriticality <= 12 && anomalyTranslations.urgentAttentionNeeded}
              {totalCriticality > 5 && totalCriticality <= 9 && anomalyTranslations.scheduleMaintenanceSoon}
              {totalCriticality > 0 && totalCriticality <= 5 && anomalyTranslations.monitorAndPlan}
              {totalCriticality === 0 && anomalyTranslations.noImmediateConcerns}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Safety Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-25 border-red-200 hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-12 h-12 opacity-10">
            <Shield className="h-full w-full text-red-500" />
          </div>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-red-700 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {anomalyT.safety}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-red-600">{safetyScore}</div>
            <div className="text-xs text-red-500 mt-0.5">{anomalyT.safety}</div>
          </CardContent>
        </Card>

        {/* Availability Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-25 border-blue-200 hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-12 h-12 opacity-10">
            <Activity className="h-full w-full text-blue-500" />
          </div>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-blue-700 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {anomalyT.availability}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-blue-600">{availabilityScore}</div>
            <div className="text-xs text-blue-500 mt-0.5">{anomalyT.availability}</div>
          </CardContent>
        </Card>

        {/* Integrity Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-25 border-purple-200 hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-12 h-12 opacity-10">
            <Gauge className="h-full w-full text-purple-500" />
          </div>
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-purple-700 flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              {anomalyT.integrity}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-purple-600">{integrityScore}</div>
            <div className="text-xs text-purple-500 mt-0.5">{anomalyT.integrity}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 