import { Link } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnomalyListHeaderProps {
  listT: any;
  t: any;
}

export const AnomalyListHeader = ({ listT, t }: AnomalyListHeaderProps) => {
  return (
    <div className="rounded-lg bg-[#003D55] p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="text-white">
              {listT.industrialAnomalyManagement}
            </div>
          </div>
          <h1 className="text-lg lg:text-xl font-bold mb-4 text-white truncate">
            {t("navigation.anomalies")}
          </h1>
          <div className="text-white/90">
            {t("anomalyList.manageAndTrack")}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            asChild
            className="border-white/30 text-white hover:text-white hover:bg-white/20 bg-transparent"
          >
            <Link to="/anomalies/create">
              <Plus className="h-4 w-4 mr-2" />
              {t("anomalyList.reportNewAnomaly")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}; 