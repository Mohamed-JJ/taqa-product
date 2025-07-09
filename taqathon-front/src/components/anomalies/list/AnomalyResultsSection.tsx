import { Link } from "react-router-dom";
import { Loader2, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anomaly } from "@/types/anomaly";
import { AnomalyCard } from "./AnomalyCard";

interface AnomalyResultsSectionProps {
  loading: boolean;
  anomalies: Anomaly[];
  anomaliesOLD: Anomaly[];
  getCriticalityFromTotal: (total: number) => string;
  getEquipmentName: (equipment: string | any) => string;
  formatDateWithLocale: (date: string, locale: string) => string;
  translateStatus: (status: string, t: any) => string;
  anomalyT: any;
  commonT: any;
  t: any;
  language: string;
  extraData: any;
}

export const AnomalyResultsSection = ({
  loading,
  anomalies,
  anomaliesOLD,
  getCriticalityFromTotal,
  getEquipmentName,
  formatDateWithLocale,
  translateStatus,
  anomalyT,
  commonT,
  t,
  language,
  extraData,
}: AnomalyResultsSectionProps) => {
  // Loading state
  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">{commonT.loading}</span>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Results Summary */}
      <div className="text-sm text-muted-foreground font-medium">
        {t("common.showing", {
          current: anomalies.length,
          total: extraData?.total || anomalies.length,
          fallback: `Showing ${anomalies.length} of ${extraData?.total || anomalies.length} anomalies`,
        })}
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        {anomalies.map((anomaly: Anomaly, index) => (
          <AnomalyCard
            key={anomaly.id}
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
        ))}

        {/* Empty State */}
        {anomalies.length === 0 && (
          <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
            <CardContent className="text-center py-16">
              <div className="relative">
                <div className="p-6 bg-muted/20 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {t("anomalyList.noAnomaliesFound", {
                    fallback: "No anomalies found",
                  })}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {t("anomalyList.tryAdjustingFilters", {
                    fallback: "Try adjusting your search criteria or filters",
                  })}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="btn-modern hover-lift modern-shadow"
                >
                  <Link to="/anomalies/create">
                    <Plus className="h-5 w-5 mr-2" />
                    {t("anomalyList.reportNewAnomaly")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}; 