import { Shield, Activity, Settings, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anomaly } from "@/types/anomaly";

interface AnomalyStatsSectionProps {
  anomalies: Anomaly[];
  extraData: any;
  listT: any;
  statusT: any;
  getCriticalityFromTotal: (total: number) => string;
}

export const AnomalyStatsSection = ({ 
  anomalies, 
  extraData, 
  listT, 
  statusT, 
  getCriticalityFromTotal 
}: AnomalyStatsSectionProps) => {
  const criticalCount = anomalies.filter((a) => {
    // Use user feedback metrics if available, otherwise use predicted metrics
    const disponibilityScore = a.userFeedBack && a.disponibility !== undefined 
      ? a.disponibility 
      : (a.predictedDisponibility || 0);
    
    const integrityScore = a.userFeedBack && a.integrity !== undefined 
      ? a.integrity 
      : (a.predictedIntegrity || 0);
    
    const processSafetyScore = a.userFeedBack && a.processSafety !== undefined 
      ? a.processSafety 
      : (a.predictedProcessSafety || 0);

    const totalCriticality = disponibilityScore + integrityScore + processSafetyScore;
    return totalCriticality > 12;
  }).length;

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Card className="relative overflow-hidden hover-lift modern-shadow-lg bg-gradient-to-br from-background to-status-critical/5 border-status-critical/20 group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-status-critical/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 relative z-10">
          <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
            {listT.criticalIssues}
          </CardTitle>
          <div className="relative p-1.5 bg-status-critical/20 rounded-lg backdrop-blur-sm">
            <Shield className="h-3 w-3 text-status-critical" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 px-3 pb-3">
          <div className="text-xl font-heading font-bold text-foreground">
            {criticalCount}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
            {listT.requireImmediateAttention}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden hover-lift modern-shadow-lg bg-gradient-to-br from-background to-taqa-blue/5 border-taqa-blue/20 group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-taqa-blue/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 relative z-10">
          <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
            {listT.totalAnomalies}
          </CardTitle>
          <div className="relative p-1.5 bg-taqa-blue/20 rounded-lg backdrop-blur-sm">
            <Activity className="h-3 w-3 text-taqa-blue" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 px-3 pb-3">
          <div className="text-xl font-heading font-bold text-foreground">
            {extraData?.total}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
            {listT.totalAnomaliesFound}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden hover-lift modern-shadow-lg bg-gradient-to-br from-background to-taqa-green/5 border-taqa-green/20 group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-taqa-green/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 relative z-10">
          <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
            {listT.inProgress}
          </CardTitle>
          <div className="relative p-1.5 bg-taqa-green/20 rounded-lg backdrop-blur-sm">
            <Settings className="h-3 w-3 text-taqa-green" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 px-3 pb-3">
          <div className="text-xl font-heading font-bold text-foreground">
            {extraData?.anomaliesData?.treatedAnomalies}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
            {listT.currentlyBeingResolved}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden hover-lift modern-shadow-lg bg-gradient-to-br from-background to-taqa-secondary/5 border-taqa-secondary/20 group">
        <div className="absolute top-0 right-0 w-20 h-20 bg-taqa-secondary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-3 relative z-10">
          <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
            {statusT.closed}
          </CardTitle>
          <div className="relative p-1.5 bg-taqa-secondary/20 rounded-lg backdrop-blur-sm">
            <CheckCircle className="h-3 w-3 text-taqa-secondary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 px-3 pb-3">
          <div className="text-xl font-heading font-bold text-foreground">
            {extraData?.anomaliesData?.closedAnomalies || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
            Resolved anomalies
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 