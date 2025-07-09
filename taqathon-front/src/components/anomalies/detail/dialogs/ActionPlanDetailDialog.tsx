import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

interface ActionPlanDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionPlan: any | null;
  anomalyT: any;
  commonT: any;
  t: any;
}

export const ActionPlanDetailDialog = ({
  open,
  onOpenChange,
  actionPlan,
  anomalyT,
  commonT,
  t
}: ActionPlanDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-taqa-primary" />
            {t("anomaly.actionPlanDetails") || "Action Plan Details"}
          </DialogTitle>
          <DialogDescription>
            {t("anomaly.actionPlanDetailsDescription") || "View detailed information about this action plan"}
          </DialogDescription>
        </DialogHeader>

        {actionPlan && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <Label className="text-sm font-medium text-muted-foreground block mb-2">
                {t("anomaly.actionDescription") || "Action Description"}
              </Label>
              <p className="text-sm leading-relaxed">{actionPlan.action}</p>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <Label className="text-sm font-medium text-muted-foreground block mb-2">
                Service
              </Label>
              <p className="text-sm">{actionPlan.responsible}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                <Label className="text-sm font-medium text-muted-foreground block mb-2">
                  {anomalyT.pdrsAvailable}
                </Label>
                <p className="text-sm">{actionPlan.pdrsAvailable}</p>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                <Label className="text-sm font-medium text-muted-foreground block mb-2">
                  {anomalyT.internalResources}
                </Label>
                <p className="text-sm">{actionPlan.internalResources}</p>
              </div>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <Label className="text-sm font-medium text-muted-foreground block mb-2">
                {anomalyT.externalResources}
              </Label>
              <p className="text-sm">{actionPlan.externalResources}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {commonT.close || "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 