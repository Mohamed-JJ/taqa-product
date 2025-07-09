import { useState, useEffect, useRef } from "react";
import { AlertTriangle, Plus, X, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import { Anomaly } from "@/types/anomaly";
import {
  useMaintenanceTranslations,
  useAnomalyStatusTranslations,
  useAnomalyTranslations,
  useCommonTranslations,
  useTranslations,
} from "@/i18n/hooks/useTranslations";
import { AnomalyFormData, ActionPlanWithoutEstimatedTime } from "./types";
import * as z from "zod";

interface PendingApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  anomaly: AnomalyFormData;
  onSubmitSuccess: () => void;
}

export const PendingApprovalDialog = ({
  isOpen,
  onClose,
  anomaly,
  onSubmitSuccess,
}: PendingApprovalDialogProps) => {
  const { updateAnomaly } = useAnomalyStore();
  const maintenanceT = useMaintenanceTranslations();
  const statusT = useAnomalyStatusTranslations();
  const anomalyT = useAnomalyTranslations();
  const commonT = useCommonTranslations();
  const { t } = useTranslations();

  const [actionPlans, setActionPlans] = useState<ActionPlanWithoutEstimatedTime[]>([
    {
      id: Date.now().toString(),
      action: "",
      responsible: "",
      pdrsAvailable: "",
      internalResources: "",
      externalResources: "",
    },
  ]);
  const [sysShutDownRequired, setSysShutDownRequired] = useState<boolean>(
    anomaly.sysShutDownRequired || false,
  );
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [showActionPlanDetails, setShowActionPlanDetails] = useState<number | null>(0);

  // Ref for each tab button to scroll into view
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Scroll the selected tab into view when showActionPlanDetails changes
  useEffect(() => {
    if (
      showActionPlanDetails !== null &&
      tabRefs.current[showActionPlanDetails]
    ) {
      tabRefs.current[showActionPlanDetails]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [showActionPlanDetails, actionPlans.length]);

  const actionPlanSchema = z.object({
    responsible: z.string().min(1, maintenanceT.responsibleRequired),
    pdrsAvailable: z.string().min(1, maintenanceT.sparepartsRequired),
    internalResources: z.string().min(1, maintenanceT.internalResourcesRequired),
    externalResources: z.string().min(1, maintenanceT.externalResourcesRequired),
    action: z.string().min(1, maintenanceT.actionDescription),
  });

  const handleOnSubmitForPendingApproval = async () => {
    try {
      if (actionPlans.length === 0) {
        toast.error(maintenanceT.pleaseAddActionPlan);
        return;
      }
      if (estimatedTime === null || isNaN(estimatedTime) || estimatedTime <= 0) {
        toast.error(t("validation.estimatedTimeRequired"));
        return;
      }

      for (const plan of actionPlans) {
        actionPlanSchema.parse(plan);
      }

      await updateAnomaly(
        anomaly as unknown as Anomaly,
        actionPlans as any,
        "TREATED",
        sysShutDownRequired,
        estimatedTime,
      );

      toast.success(maintenanceT.anomalyStatusUpdatedSuccessfully);
      onSubmitSuccess();
      onClose();
      setActionPlans([
        {
          id: Date.now().toString(),
          action: "",
          responsible: "",
          pdrsAvailable: "",
          internalResources: "",
          externalResources: "",
        },
      ]);
      setSysShutDownRequired(false);
      setEstimatedTime(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(maintenanceT.pleaseFillAllFields);
      } else {
        toast.error(commonT.error);
      }
    }
  };

  const addActionPlan = () => {
    const newActionPlan: ActionPlanWithoutEstimatedTime = {
      id: Date.now().toString(),
      action: "",
      responsible: "",
      pdrsAvailable: "",
      internalResources: "",
      externalResources: "",
    };
    setActionPlans([...actionPlans, newActionPlan]);
    setShowActionPlanDetails(actionPlans.length);
  };

  const removeActionPlan = (index: number) => {
    if (actionPlans.length === 1) {
      toast.error("At least one action plan is required");
      return;
    }
    setActionPlans(actionPlans.filter((_, i) => i !== index));
    setShowActionPlanDetails(null);
  };

  const updateActionPlan = (
    index: number,
    field: keyof ActionPlanWithoutEstimatedTime,
    value: any,
  ) => {
    const updatedPlans = [...actionPlans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setActionPlans(updatedPlans);
  };

  const getActionPlanSummary = (plan: ActionPlanWithoutEstimatedTime) => {
    if (plan.action)
      return plan.action.slice(0, 40) + (plan.action.length > 40 ? "..." : "");
    if (plan.responsible) return plan.responsible;
    return anomalyT.actionPlan;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {statusT.pendingApproval}
          </DialogTitle>
          <DialogDescription>
            {maintenanceT.configureDetailsForApproval}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* System Shutdown Section */}
          <div className="flex flex-col gap-2 p-4 border rounded-lg bg-orange-50">
            <div className="flex items-center gap-3">
              <Checkbox
                id="sysShutDownRequired"
                checked={sysShutDownRequired}
                onCheckedChange={(checked) => setSysShutDownRequired(!!checked)}
              />
              <Label htmlFor="sysShutDownRequired" className="text-sm font-medium">
                {maintenanceT.systemShutdownRequired}
              </Label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-center pl-0 sm:pl-8">
              <Label className="text-sm font-medium min-w-[120px]">
                {maintenanceT.estimatedTimeHours}
              </Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                className="max-w-[120px]"
                placeholder={maintenanceT.exampleTime}
                value={estimatedTime === null ? "" : estimatedTime}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setEstimatedTime(
                    e.target.value === "" || isNaN(value) ? null : value,
                  );
                }}
              />
            </div>
          </div>

          {/* Action Plans Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <Label className="text-sm font-medium">{anomalyT.actionPlan}</Label>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addActionPlan}
              >
                <Plus className="h-4 w-4 mr-2" />
                {maintenanceT.addActionPlan}
              </Button>
            </div>

            {/* Action Plan Tabs */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 overflow-x-auto overflow-y-hidden w-[600px] max-h-[60px]">
                {actionPlans.map((plan, idx) => (
                  <Button
                    key={plan.id}
                    ref={(el) => (tabRefs.current[idx] = el)}
                    type="button"
                    variant={showActionPlanDetails === idx ? "default" : "outline"}
                    size="sm"
                    className="rounded-full px-3"
                    onClick={() => setShowActionPlanDetails(idx)}
                  >
                    {maintenanceT.actionPlanNumber.replace(
                      "{{number}}",
                      (idx + 1).toString(),
                    )}
                  </Button>
                ))}
              </div>

              <div className="mt-2">
                {actionPlans.map((plan, index) =>
                  showActionPlanDetails === index ? (
                    <div
                      key={plan.id}
                      className="p-4 border rounded-lg space-y-4 bg-muted/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">
                          {maintenanceT.actionPlanNumber.replace(
                            "{{number}}",
                            (index + 1).toString(),
                          )}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActionPlan(index)}
                          disabled={actionPlans.length === 1}
                          title={
                            actionPlans.length === 1
                              ? "At least one action plan is required"
                              : commonT.delete
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">
                            {maintenanceT.actionDescription}
                          </Label>
                          <Textarea
                            placeholder={maintenanceT.describeDetailedAction}
                            value={plan.action}
                            onChange={(e) =>
                              updateActionPlan(index, "action", e.target.value)
                            }
                            className="min-h-[60px] resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm font-medium">
                              Service
                            </Label>
                            <Select
                              value={plan.responsible}
                              onValueChange={(value) =>
                                updateActionPlan(index, "responsible", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Service" />
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
                          <div>
                            <Label className="text-sm font-medium">
                              {anomalyT.pdrsAvailable}
                            </Label>
                            <Input
                              type="text"
                              placeholder={maintenanceT.availableSpareparts}
                              value={plan.pdrsAvailable}
                              onChange={(e) =>
                                updateActionPlan(index, "pdrsAvailable", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm font-medium">
                              {anomalyT.internalResources}
                            </Label>
                            <Input
                              type="text"
                              placeholder={anomalyT.internalResourcesPlaceholder}
                              value={plan.internalResources}
                              onChange={(e) =>
                                updateActionPlan(
                                  index,
                                  "internalResources",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              {anomalyT.externalResources}
                            </Label>
                            <Input
                              type="text"
                              placeholder={anomalyT.externalResourcesPlaceholder}
                              value={plan.externalResources}
                              onChange={(e) =>
                                updateActionPlan(
                                  index,
                                  "externalResources",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            {commonT.cancel}
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={handleOnSubmitForPendingApproval}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {commonT.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 