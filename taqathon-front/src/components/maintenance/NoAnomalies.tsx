import { AlertCircle } from "lucide-react";
import { useMaintenanceTranslations } from "@/i18n/hooks/useTranslations";

export const NoAnomalies = () => {
  const maintenanceT = useMaintenanceTranslations();

  return (
    <div className="text-center py-1 text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="h-4 w-4" />
        </div>
        <p className="text-sm">{maintenanceT.noAnomaliesAssigned}</p>
      </div>
    </div>
  );
}; 