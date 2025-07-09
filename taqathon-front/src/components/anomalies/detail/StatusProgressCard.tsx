import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Activity, Wrench, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Anomaly } from "@/types/anomaly";

interface StatusProgressCardProps {
  anomaly: Anomaly;
  formatDate: (date: string | Date) => string;
  anomalyT: any;
  timeT: any;
  t: any;
}

export const StatusProgressCard = ({ 
  anomaly, 
  formatDate, 
  anomalyT, 
  timeT, 
  t 
}: StatusProgressCardProps) => {
  return (
    <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50 flex flex-col">
      <CardHeader className="pb-2 px-4 py-3">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-taqa-primary" />
          {anomalyT.statusAndProgress}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4 flex-1">
        {/* Status Cards */}
        <div className="space-y-2">
          {/* Created Card */}
          <div className="flex items-center p-2 bg-taqa-blue/10 rounded border border-taqa-blue/20">
            <div className="w-6 h-6 rounded-full bg-taqa-blue flex items-center justify-center mr-2">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-taqa-blue">{timeT.created}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(anomaly.detectionDate)}
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-taqa-blue"></div>
          </div>

          {/* In Progress Card */}
          <div className={cn(
            "flex items-center p-2 rounded border transition-all duration-300",
            (anomaly.status === "in-progress" || 
             anomaly.status === "TREATED" || anomaly.status === "traitee" ||
             anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
            ? "bg-taqa-orange/10 border-taqa-orange/20" 
            : "bg-muted/10 border-muted/20"
          )}>
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300",
              (anomaly.status === "in-progress" || 
               anomaly.status === "TREATED" || anomaly.status === "traitee" ||
               anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
              ? "bg-taqa-orange text-white" 
              : "bg-muted/50 text-muted-foreground"
            )}>
              <Activity className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-xs font-medium",
                  (anomaly.status === "in-progress" || 
                   anomaly.status === "TREATED" || anomaly.status === "traitee" ||
                   anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
                  ? "text-taqa-orange" 
                  : "text-muted-foreground"
                )}>
                  {t("time.inProgress") || "In Progress"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(anomaly.createdAt)}
                </span>
              </div>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              (anomaly.status === "in-progress" || 
               anomaly.status === "TREATED" || anomaly.status === "traitee" ||
               anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
              ? "bg-taqa-orange" 
              : "bg-muted/50"
            )}></div>
          </div>

          {/* Treated Card */}
          <div className={cn(
            "flex items-center p-2 rounded border transition-all duration-300",
            (anomaly.status === "TREATED" || anomaly.status === "traitee" ||
             anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
            ? "bg-taqa-secondary/10 border-taqa-secondary/20" 
            : "bg-muted/10 border-muted/20"
          )}>
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300",
              (anomaly.status === "TREATED" || anomaly.status === "traitee" ||
               anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
              ? "bg-taqa-secondary text-white" 
              : "bg-muted/50 text-muted-foreground"
            )}>
              <Wrench className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-xs font-medium",
                  (anomaly.status === "TREATED" || anomaly.status === "traitee" ||
                   anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
                  ? "text-taqa-secondary" 
                  : "text-muted-foreground"
                )}>
                  {t("time.treated") || "Treated"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {anomaly.treatedAt ? formatDate(anomaly.treatedAt) : "—"}
                </span>
              </div>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              (anomaly.status === "TREATED" || anomaly.status === "traitee" ||
               anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
              ? "bg-taqa-secondary" 
              : "bg-muted/50"
            )}></div>
          </div>

          {/* Closed Card */}
          <div className={cn(
            "flex items-center p-2 rounded border transition-all duration-300",
            (anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
            ? "bg-taqa-green/10 border-taqa-green/20" 
            : "bg-muted/10 border-muted/20"
          )}>
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-all duration-300",
              (anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
              ? "bg-taqa-green text-white" 
              : "bg-muted/50 text-muted-foreground"
            )}>
              <CheckCircle className="h-3 w-3" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-xs font-medium",
                  (anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
                  ? "text-taqa-green" 
                  : "text-muted-foreground"
                )}>
                  {t("time.closed") || "Closed"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {anomaly.closedAt ? formatDate(anomaly.closedAt) : "—"}
                </span>
              </div>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              (anomaly.status === "CLOSED" || anomaly.status === "cloture" || anomaly.status === "closed")
              ? "bg-taqa-green" 
              : "bg-muted/50"
            )}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 