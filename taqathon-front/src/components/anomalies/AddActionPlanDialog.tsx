import { useState } from "react";
import { useAnomalyTranslations, useCommonTranslations } from "@/i18n/hooks/useTranslations";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddActionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anomalyId?: number;
}

export const AddActionPlanDialog = ({ open, onOpenChange, anomalyId }: AddActionPlanDialogProps) => {
  const anomalyT = useAnomalyTranslations();
  const commonT = useCommonTranslations();
  const { anomaly, updateAnomaly } = useAnomalyStore();
  
  const [actionPlanForm, setActionPlanForm] = useState({
    service: "",
    pdrsAvailable: "",
    internalResources: "",
    externalResources: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!anomaly) {
      toast.error("No anomaly selected");
      return;
    }

    if (!actionPlanForm.service) {
      toast.error("Métier selection is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get existing action plans to determine the next action number
      const existingActionPlans = anomaly.actionPlan || anomaly.actionPlans || [];
      const actionNumber = existingActionPlans.length + 1;

      // Create the new action plan object
      const newActionPlan = {
        action: `Action ${actionNumber}`,
        service: actionPlanForm.service,
        pdrsAvailable: actionPlanForm.pdrsAvailable,
        internalResources: actionPlanForm.internalResources,
        externalResources: actionPlanForm.externalResources,
        createdAt: new Date().toISOString(),
      };

      // Append the new action plan to existing ones
      const updatedActionPlans = [...existingActionPlans, newActionPlan];

      console.log("🔄 AddActionPlanDialog - Appending action plan:", {
        anomalyId: anomaly.id,
        existingCount: existingActionPlans.length,
        newCount: updatedActionPlans.length,
        existingActionPlans,
        newActionPlan,
        updatedActionPlans
      });

      // Make direct API call to ensure proper data structure
      const payload = {
        actionPlan: updatedActionPlans, // Send complete array to backend
        status: anomaly.status,
        sysShutDownRequired: anomaly.sysShutDownRequired,
      };

      const res = await apiClient.patch(`/anomaly/${anomaly.id}`, payload);
      
      console.log("✅ AddActionPlanDialog - Action plan added successfully:", {
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
      onOpenChange(false);
      
      // Reset form
      setActionPlanForm({
        service: "",
        pdrsAvailable: "",
        internalResources: "",
        externalResources: "",
      });
    } catch (error) {
      console.error("Error adding action plan:", error);
      toast.error("Failed to add action plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{anomalyT.addActionPlan}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service">Métier</Label>
            <Select 
              value={actionPlanForm.service}
              onValueChange={(value) => setActionPlanForm({...actionPlanForm, service: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Métier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MC">MC</SelectItem>
                <SelectItem value="MM">MM</SelectItem>
                <SelectItem value="MD">MD</SelectItem>
                <SelectItem value="CT">CT</SelectItem>
                <SelectItem value="EL">EL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdrsAvailable">{anomalyT.pdrsAvailable}</Label>
            <Input
              id="pdrsAvailable"
              value={actionPlanForm.pdrsAvailable}
              onChange={(e) => setActionPlanForm({...actionPlanForm, pdrsAvailable: e.target.value})}
              placeholder={anomalyT.pdrsPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalResources">{anomalyT.internalResources}</Label>
            <Input
              id="internalResources"
              value={actionPlanForm.internalResources}
              onChange={(e) => setActionPlanForm({...actionPlanForm, internalResources: e.target.value})}
              placeholder={anomalyT.internalResourcesPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalResources">{anomalyT.externalResources}</Label>
            <Input
              id="externalResources"
              value={actionPlanForm.externalResources}
              onChange={(e) => setActionPlanForm({...actionPlanForm, externalResources: e.target.value})}
              placeholder={anomalyT.externalResourcesPlaceholder}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {commonT.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : commonT.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 