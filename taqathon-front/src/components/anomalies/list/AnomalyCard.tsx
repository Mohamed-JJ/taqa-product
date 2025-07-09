import { Link } from "react-router-dom";
import { Eye, Factory, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Anomaly } from "@/types/anomaly";
import { getCriticalityColor, getStatusBadgeColor } from "@/lib/criticalityUtils";
import { cn } from "@/lib/utils";

interface AnomalyCardProps {
  anomaly: Anomaly;
  index: number;
  getCriticalityFromTotal: (total: number) => string;
  getEquipmentName: (equipment: string | any) => string;
  formatDateWithLocale: (date: string, locale: string) => string;
  translateStatus: (status: string, t: any) => string;
  anomalyT: any;
  t: any;
  language: string;
}

export const AnomalyCard = ({
  anomaly,
  index,
  getCriticalityFromTotal,
  getEquipmentName,
  formatDateWithLocale,
  translateStatus,
  anomalyT,
  t,
  language,
}: AnomalyCardProps) => {
  // Use user feedback metrics if available, otherwise use predicted metrics
  const disponibilityScore = anomaly.userFeedBack && anomaly.disponibility !== undefined 
    ? anomaly.disponibility 
    : (anomaly.predictedDisponibility || 0);
  
  const integrityScore = anomaly.userFeedBack && anomaly.integrity !== undefined 
    ? anomaly.integrity 
    : (anomaly.predictedIntegrity || 0);
  
  const processSafetyScore = anomaly.userFeedBack && anomaly.processSafety !== undefined 
    ? anomaly.processSafety 
    : (anomaly.predictedProcessSafety || 0);

  const totalCriticality = 
    Math.ceil(disponibilityScore) +
    Math.ceil(integrityScore) +
    Math.ceil(processSafetyScore);
  const criticalityLevel = getCriticalityFromTotal(totalCriticality);

  return (
    <Card
      className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50 backdrop-blur-sm group transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-4">
              <div className="relative">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full mt-1 shadow-lg",
                    totalCriticality > 12 && "bg-status-critical animate-pulse",
                    totalCriticality > 9 && totalCriticality <= 12 && "bg-status-high",
                    totalCriticality > 5 && totalCriticality <= 9 && "bg-status-medium",
                    totalCriticality > 0 && totalCriticality <= 5 && "bg-status-low",
                    totalCriticality === 0 && "bg-status-very-low",
                  )}
                />
                {totalCriticality > 12 && (
                  <div className="absolute inset-0 bg-status-critical/30 rounded-full animate-ping" />
                )}
              </div>
              <div className="flex-1">
                <Link
                  to={`/anomalies/${anomaly.id}`}
                  className="text-lg font-heading font-semibold hover:text-taqa-primary transition-colors line-clamp-1 group-hover:underline"
                >
                  {anomaly.description}
                </Link>
                <p className="text-muted-foreground line-clamp-2 mt-1 text-sm">
                  {anomaly.equipment as string}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                className={cn(
                  "font-bold text-xs",
                  getCriticalityColor(criticalityLevel as any),
                )}
              >
                {anomalyT.criticality}{" "}
                {totalCriticality}
              </Badge>

              <Badge
                className={cn(
                  "font-medium",
                  getStatusBadgeColor(anomaly.status),
                )}
              >
                {translateStatus(anomaly.status, t)}
              </Badge>

              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {anomalyT.availability}:{" "}
                  {Math.ceil(disponibilityScore)}
                  {anomaly.userFeedBack && anomaly.disponibility !== undefined && (
                    <span className="ml-1 text-green-600">✓</span>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {anomalyT.integrity}:{" "}
                  {Math.ceil(integrityScore)}
                  {anomaly.userFeedBack && anomaly.integrity !== undefined && (
                    <span className="ml-1 text-green-600">✓</span>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {anomalyT.safety}:{" "}
                  {Math.ceil(processSafetyScore)}
                  {anomaly.userFeedBack && anomaly.processSafety !== undefined && (
                    <span className="ml-1 text-green-600">✓</span>
                  )}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4" />
                <span className="font-medium">
                  {getEquipmentName(anomaly.equipment)}
                </span>
              </div>

              {anomaly.service && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    {anomaly.service}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDateWithLocale(
                    anomaly.detectionDate.toString(),
                    language,
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/anomalies/${anomaly.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="hover-lift modern-shadow"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t("anomalyList.view")}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 