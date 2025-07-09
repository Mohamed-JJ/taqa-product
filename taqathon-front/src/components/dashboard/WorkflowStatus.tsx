import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Settings, CheckCircle, ArrowUpRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { getStatusBadgeColor } from "@/lib/criticalityUtils";
import { useDashboardTranslations } from "@/i18n/hooks/useTranslations";

interface WorkflowStatusProps {
  anomaliesByStatus: Record<string, number>;
  totalAnomalies: number;
}

export const WorkflowStatus = ({ anomaliesByStatus, totalAnomalies }: WorkflowStatusProps) => {
  const dashboardT = useDashboardTranslations();

  const getStatusIcon = (status: string) => {
    if (status === "pending-approval" || status === "traité") {
      return <AlertTriangle className="h-5 w-5 text-status-medium" />;
    }
    if (status === "in-progress" || status === "en-cours") {
      return <Settings className="h-5 w-5 text-status-in-progress animate-spin-slow" />;
    }
    if (status === "closed" || status === "cloturé") {
      return <CheckCircle className="h-5 w-5 text-taqa-green" />;
    }
    return null;
  };

  return (
    <Card className="lg:col-span-2 relative overflow-hidden hover-lift modern-shadow-lg border-border/50 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-20 translate-x-20" />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-xl font-heading">
              <div className="p-2 bg-blue-300 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              {dashboardT.workflowStatus}
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              {dashboardT.currentAnomalyDistribution}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-taqa-primary/10 hover:text-taqa-primary transition-colors"
          >
            <Link to="/anomalies" className="flex items-center gap-1">
              {dashboardT.viewAll}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Main Status Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* En Cours */}
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-500 rounded-full shadow-lg">
                <Settings className="h-8 w-8 text-white animate-spin-slow" />
              </div>
            </div>
            <div className="text-4xl font-bold text-orange-700 mb-2">
              {anomaliesByStatus["en-cours"] || anomaliesByStatus["in-progress"] || 0}
            </div>
            <div className="text-lg font-semibold text-orange-600">En Cours</div>
          </div>

          {/* Traité */}
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-500 rounded-full shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {anomaliesByStatus["traité"] || anomaliesByStatus["treated"] || 0}
            </div>
            <div className="text-lg font-semibold text-blue-600">Traité</div>
          </div>

          {/* Clôturé */}
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-500 rounded-full shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-4xl font-bold text-green-700 mb-2">
              {anomaliesByStatus["cloturé"] || anomaliesByStatus["closed"] || 0}
            </div>
            <div className="text-lg font-semibold text-green-600">Clôturé</div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 text-center p-4 bg-gradient-to-r from-taqa-primary/5 to-taqa-secondary/5 rounded-xl">
          <div className="text-3xl font-bold text-taqa-primary mb-1">{totalAnomalies}</div>
          <div className="text-sm text-muted-foreground">Total Critical Anomalies</div>
        </div>
      </CardContent>
    </Card>
  );
}; 