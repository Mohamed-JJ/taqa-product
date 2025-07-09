import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, AlertTriangle, Building2, Settings, Pencil, CheckCircle, Clock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { Anomaly } from "@/types/anomaly";

interface AnomalyDetailHeaderProps {
  anomaly: Anomaly;
  states: { [key: string]: string };
  criticalityScore: number;
  criticalityLevel: string;
  onBackClick: () => void;
  onEditClick: () => void;
  onStatusUpdate: () => void;
  getStatusButtonText: (status: string) => string;
  getStatusButtonColor: (status: string) => string;
  isStatusUpdating: boolean;
  anomalyT: any;
  commonT: any;
}

export const AnomalyDetailHeader = ({
  anomaly,
  states,
  criticalityScore,
  criticalityLevel,
  onBackClick,
  onEditClick,
  onStatusUpdate,
  getStatusButtonText,
  getStatusButtonColor,
  isStatusUpdating,
  anomalyT,
  commonT,
}: AnomalyDetailHeaderProps) => {
  const isAnomalyClosed = anomaly.status === "cloture" || anomaly.status === "CLOSED";

  return (
    <div className="rounded-lg bg-[#003D55] p-4 md:p-6">
      <div className="space-y-4">
        {/* Navigation and ID */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-white hover:text-white hover:bg-white/10 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {anomalyT.backToAnomalies}
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div className="text-white font-medium">
                {anomalyT.anomalyDetailsNumber.replace('{{id}}', anomaly.id.toString())}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight trancate">
            {anomaly.description}
          </h1>
        </div>
          
        {/* Enhanced Service and System Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <Building2 className="h-4 w-4 text-white flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/70 font-medium uppercase tracking-wide">Service</div>
              <div className="text-white font-bold text-base sm:text-lg truncate">
                {anomaly.service || "Non assigné"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <Settings className="h-4 w-4 text-white flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/70 font-medium uppercase tracking-wide">Système</div>
              <div className="text-white font-bold text-base sm:text-lg truncate">
                {anomaly.system}
              </div>
            </div>
          </div>
        </div>
          
        {/* Equipment and Estimated Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
            <Wrench className="h-4 w-4 text-white flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/70 font-medium uppercase tracking-wide mb-2">Equipement</div>
              <p className="text-white leading-relaxed text-sm sm:text-base">
                {anomaly.equipment as string}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
            <Clock className="h-4 w-4 text-white flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-white/70 font-medium uppercase tracking-wide">Temps Estimé</div>
              <div className="text-white font-bold text-base sm:text-lg truncate">
                {anomaly.estimatedTime ? `${anomaly.estimatedTime}h` : "Non défini"}
              </div>
            </div>
          </div>
        </div>
          
        {/* Status and Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Badge
                className={cn(
                  "font-bold text-white px-4 py-2 text-sm sm:text-base rounded-full shadow-lg backdrop-blur-sm border-0",
                  {
                    "bg-blue-500/90 hover:bg-blue-600/90": anomaly.status === "IN_PROGRESS" || anomaly.status === "in-progress",
                    "bg-orange-500/90 hover:bg-orange-600/90": anomaly.status === "TREATED" || anomaly.status === "traitee", 
                    "bg-green-500/90 hover:bg-green-600/90": anomaly.status === "CLOSED" || anomaly.status === "cloture",
                    "bg-gray-500/90 hover:bg-gray-600/90": !["IN_PROGRESS", "in-progress", "TREATED", "traitee", "CLOSED", "cloture"].includes(anomaly.status)
                  }
                )}
              >
                Status : {states[anomaly.status]}
              </Badge>
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse opacity-30"></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={onEditClick}
                    disabled={isAnomalyClosed}
                    className={
                      isAnomalyClosed
                        ? "border-white/20 text-white/50 bg-transparent cursor-not-allowed opacity-60 flex-shrink-0"
                        : "border-white/30 text-white hover:text-white hover:bg-white/20 bg-transparent flex-shrink-0"
                    }
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    {commonT.edit}
                  </Button>
                </TooltipTrigger>
                {isAnomalyClosed && (
                  <TooltipContent>
                    <p>Cannot edit anomaly - Status is closed</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  {isAnomalyClosed ? (
                    <Button
                      variant="secondary"
                      disabled
                      className="bg-green-600 text-white cursor-not-allowed opacity-90 hover:bg-green-600 flex-shrink-0"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Anomalie Fermée
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={onStatusUpdate}
                      disabled={isStatusUpdating}
                      className={`${getStatusButtonColor(anomaly.status)} flex-shrink-0`}
                    >
                      {isStatusUpdating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {isStatusUpdating ? "Updating..." : getStatusButtonText(anomaly.status)}
                    </Button>
                  )}
                </TooltipTrigger>
                {isAnomalyClosed && (
                  <TooltipContent>
                    <p>Cannot update status - Anomaly is already closed</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}; 