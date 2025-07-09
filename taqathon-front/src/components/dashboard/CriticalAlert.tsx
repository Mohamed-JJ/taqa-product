import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardTranslations, useTranslations } from "@/i18n/hooks/useTranslations";

interface CriticalAlertProps {
  criticalAnomalies: number;
  highPriorityAnomalies: number;
}

export const CriticalAlert = ({ criticalAnomalies, highPriorityAnomalies }: CriticalAlertProps) => {
  const dashboardT = useDashboardTranslations();
  const { t } = useTranslations();

  if (criticalAnomalies <= 0) {
    return null;
  }

  return (
    <Card className="border-status-critical/30 bg-gradient-to-r from-status-critical/10 via-background to-status-high/10 modern-shadow-lg hover-lift animate-slide-up">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-status-critical/20 rounded-xl backdrop-blur-sm">
              <Flame className="h-7 w-7 text-status-critical animate-pulse" />
              <div className="absolute inset-0 bg-status-critical/30 rounded-xl animate-ping" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-status-critical mb-1">
                {dashboardT.criticalAlert}
              </h3>
              <p className="text-muted-foreground font-medium">
                {t("dashboard.criticalAlertMessage", {
                  critical: criticalAnomalies,
                  high: highPriorityAnomalies,
                })}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="lg"
            asChild
            className="btn-modern hover-lift modern-shadow"
          >
            <Link to="/anomalies?filter=critical">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {dashboardT.viewCritical}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 