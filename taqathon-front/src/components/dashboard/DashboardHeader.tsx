import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardTranslations } from "@/i18n/hooks/useTranslations";

export const DashboardHeader = () => {
  const dashboardT = useDashboardTranslations();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-taqa-primary via-taqa-blue to-taqa-secondary p-8 text-white">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-xl font-bold mb-2">
              {dashboardT.welcomeTitle}
            </h1>
            <p className="text-md text-white/80 max-w-2xl">
              {dashboardT.welcomeDescription}
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/anomalies/create">
                <Plus className="h-5 w-5 mr-2" />
                {dashboardT.reportAnomaly}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/anomalies">
                <Eye className="h-5 w-5 mr-2" />
                {dashboardT.viewAll}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
    </div>
  );
}; 