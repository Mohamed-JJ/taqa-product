import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { Anomaly } from "@/types/anomaly";

interface MaintenanceWindowCardProps {
  anomaly: Anomaly;
  anomalyT: any;
}

export const MaintenanceWindowCard = ({ anomaly, anomalyT }: MaintenanceWindowCardProps) => {
  if (!anomaly.maintenanceWindow) return null;

  return (
    <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50">
      <CardHeader className="pb-2 px-4 py-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <Wrench className="h-4 w-4 text-taqa-primary" />
          {anomalyT.maintenanceWindow}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="p-3 bg-taqa-blue/10 rounded border border-taqa-blue/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {anomalyT.windowId}
            </span>
            <span className="text-sm font-mono font-bold">
              #{anomaly.maintenanceWindow}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 