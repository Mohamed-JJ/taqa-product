import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, Plus } from "lucide-react";
import { Anomaly } from "@/types/anomaly";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import { toast } from "sonner";
import { useState } from "react";
import apiClient from "@/lib/api";

interface ActionPlanCardProps {
  anomaly: Anomaly;
  isLoading: boolean;
  onActionPlanClick: (actionPlan: any) => void;
  onAddActionPlanClick?: (actionPlan: any) => void; // Make optional since we'll handle it internally
  anomalyT: any;
}

export const ActionPlanCard = ({ 
  anomaly, 
  isLoading, 
  onActionPlanClick, 
  onAddActionPlanClick,
  anomalyT 
}: ActionPlanCardProps) => {
  const { updateAnomaly } = useAnomalyStore();
  const [isAddingActionPlan, setIsAddingActionPlan] = useState(false);
  const canAddActionPlan = anomaly.status === "TREATED" || anomaly.status === "traitee";

  const handleAddActionPlan = async () => {
    console.log("🚀 handleAddActionPlan called!", {
      hasCustomHandler: !!onAddActionPlanClick,
      anomalyId: anomaly.id,
      anomalyStatus: anomaly.status,
      canAddActionPlan
    });

    // If there's a custom handler provided, use it instead
    if (onAddActionPlanClick) {
      console.log("📞 Using custom handler");
      onAddActionPlanClick(anomaly.actionPlan);
      return;
    }

    console.log("🔧 Using built-in handler - starting process");
    setIsAddingActionPlan(true);
    
    try {
      // Get existing action plans to determine the next action number
      const existingActionPlans = anomaly.actionPlan || anomaly.actionPlans || [];
      const actionNumber = existingActionPlans.length + 1;

      // Create a basic action plan entry
      const newActionPlan = {
        action: `Action ${actionNumber}`,
        service: anomaly.responsibleSection || "",
        pdrsAvailable: "",
        internalResources: "",
        externalResources: "",
        createdAt: new Date().toISOString(),
      };

      // Use the existing action plans already retrieved above
      
      // Debug logging to see what we're working with
      console.log("🔍 Debugging action plan data:", {
        anomalyId: anomaly.id,
        anomalyActionPlan: anomaly.actionPlan,
        anomalyActionPlans: anomaly.actionPlans,
        existingActionPlans,
        existingCount: existingActionPlans.length,
        anomalyKeys: Object.keys(anomaly),
      });
      
      // Create the complete updated action plan array
      const updatedActionPlans = [...existingActionPlans, newActionPlan];

      // Make direct API call to ensure proper data structure
      const payload = {
        actionPlan: updatedActionPlans, // Send complete array to backend
        status: anomaly.status,
        sysShutDownRequired: anomaly.sysShutDownRequired,
      };

      console.log("🔄 Adding action plan - Full payload:", {
        anomalyId: anomaly.id,
        existingCount: existingActionPlans.length,
        newCount: updatedActionPlans.length,
        payload,
        newActionPlan
      });

      const res = await apiClient.patch(`/anomaly/${anomaly.id}`, payload);
      
      console.log("✅ Action plan added successfully:", {
        anomalyId: anomaly.id,
        responseData: res.data,
      });

      // Update the store's anomaly data
      const { setAnomaly, anomalies, anomaliesOLD } = useAnomalyStore.getState();
      const updatedAnomaly = res.data;
      
      // Update the current anomaly in store
      setAnomaly(updatedAnomaly);
      
      // Update anomalies list if it exists
      if (anomalies.length > 0) {
        useAnomalyStore.setState({
          anomalies: anomalies.map((a: any) => a.id === anomaly.id ? updatedAnomaly : a),
          anomaliesOLD: anomaliesOLD.map((a: any) => a.id === anomaly.id ? updatedAnomaly : a)
        });
      }

      toast.success("Action plan added successfully");
    } catch (error: any) {
      console.error("❌ Error adding action plan:", {
        anomalyId: anomaly.id,
        error: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      toast.error("Failed to add action plan");
    } finally {
      setIsAddingActionPlan(false);
    }
  };

  return (
    <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50 flex flex-col">
      <CardHeader className="pb-2 px-4 py-3 flex-shrink-0">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-taqa-primary" />
          {anomalyT.actionPlan}
          <Badge className="bg-taqa-primary/20 text-taqa-primary border-taqa-primary/30 font-bold text-xs">
            {anomaly.actionPlan?.length || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-4 pb-4 min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-3">
              <div className="text-center space-y-1">
                <div className="w-5 h-5 border-4 border-taqa-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-muted-foreground">
                  Loading...
                </p>
              </div>
            </div>
          ) : anomaly.actionPlan && anomaly.actionPlan.length > 0 ? (
            <div className="space-y-2">
              {anomaly.actionPlan.slice(0, 6).map((actionPlan, index) => (
                <div
                  key={actionPlan.id}
                  className="flex items-center justify-between p-2 bg-muted/20 rounded border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onActionPlanClick(actionPlan)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      Action {index + 1}
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground ml-1" />
                </div>
              ))}
              {anomaly.actionPlan.length > 6 && (
                <div className="text-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    +{anomaly.actionPlan.length - 6} {anomalyT.more || "more"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="p-2 bg-muted/20 rounded-full mx-auto mb-2 w-8 h-8 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {anomalyT.noActionPlans}
              </p>
            </div>
          )}
        </div>
        {canAddActionPlan && (
          <div className="mt-2 pt-2 border-t border-border/50 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddActionPlan}
              disabled={isAddingActionPlan}
              className="w-full hover-lift modern-shadow bg-taqa-primary/10 border-taqa-primary/30 text-taqa-primary hover:bg-taqa-primary/20 h-8 text-sm disabled:opacity-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              {isAddingActionPlan ? "Adding..." : anomalyT.addActionPlan}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 