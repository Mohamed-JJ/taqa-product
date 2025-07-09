import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Settings, TrendingUp, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricsForm } from "../../../../hooks/useAnomalyDetails";
import { Anomaly } from "@/types/anomaly";

interface MetricsFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anomaly: Anomaly;
  metricsForm: MetricsForm;
  setMetricsForm: (form: MetricsForm) => void;
  onSubmit: () => void;
  getCriticalityFromScore: (score: number) => string;
}

export const MetricsFeedbackDialog = ({
  open,
  onOpenChange,
  anomaly,
  metricsForm,
  setMetricsForm,
  onSubmit,
  getCriticalityFromScore
}: MetricsFeedbackDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-taqa-primary" />
            AI Metrics Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve our AI model by providing feedback on the predicted metrics. Your input will be used to enhance future predictions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="safety-feedback" className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-status-critical" />
                Safety Level
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {anomaly.processSafety ? "Current:" : "AI:"}
                </span>
                <Badge variant="outline" className={`text-xs ${anomaly.processSafety ? 'bg-taqa-primary/10 text-taqa-primary border-taqa-primary/30' : ''}`}>
                  {anomaly.processSafety || Math.min(5, Math.max(1, Math.ceil(anomaly.predictedProcessSafety) || 1))}
                </Badge>
                {anomaly.processSafety && (
                  <span className="text-xs text-taqa-primary font-medium">User Updated</span>
                )}
              </div>
              <Input
                id="safety-feedback"
                type="number"
                min="1"
                max="5"
                value={metricsForm.processSafety}
                onChange={(e) =>
                  setMetricsForm({
                    ...metricsForm,
                    processSafety: Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                  })
                }
                placeholder="Your assessment (1-5)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability-feedback" className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-taqa-green" />
                Availability
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {anomaly.disponibility ? "Current:" : "AI:"}
                </span>
                <Badge variant="outline" className={`text-xs ${anomaly.disponibility ? 'bg-taqa-primary/10 text-taqa-primary border-taqa-primary/30' : ''}`}>
                  {anomaly.disponibility || Math.min(5, Math.max(1, Math.ceil(anomaly.predictedDisponibility) || 1))}
                </Badge>
                {anomaly.disponibility && (
                  <span className="text-xs text-taqa-primary font-medium">User Updated</span>
                )}
              </div>
              <Input
                id="availability-feedback"
                type="number"
                min="1"
                max="5"
                value={metricsForm.disponibility}
                onChange={(e) =>
                  setMetricsForm({
                    ...metricsForm,
                    disponibility: Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                  })
                }
                placeholder="Your assessment (1-5)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="integrity-feedback" className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-taqa-orange" />
                Integrity
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {anomaly.integrity ? "Current:" : "AI:"}
                </span>
                <Badge variant="outline" className={`text-xs ${anomaly.integrity ? 'bg-taqa-primary/10 text-taqa-primary border-taqa-primary/30' : ''}`}>
                  {anomaly.integrity || Math.min(5, Math.max(1, Math.ceil(anomaly.predictedIntegrity) || 1))}
                </Badge>
                {anomaly.integrity && (
                  <span className="text-xs text-taqa-primary font-medium">User Updated</span>
                )}
              </div>
              <Input
                id="integrity-feedback"
                type="number"
                min="1"
                max="5"
                value={metricsForm.integrity}
                onChange={(e) =>
                  setMetricsForm({
                    ...metricsForm,
                    integrity: Math.min(5, Math.max(1, parseInt(e.target.value) || 1))
                  })
                }
                placeholder="Your assessment (1-5)"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Criticality Level</span>
                <Badge
                  className={cn(
                    "font-bold text-white px-3 py-1 text-sm",
                    {
                      "bg-red-600": getCriticalityFromScore(metricsForm.processSafety + metricsForm.disponibility + metricsForm.integrity) === "critical",
                      "bg-red-500": getCriticalityFromScore(metricsForm.processSafety + metricsForm.disponibility + metricsForm.integrity) === "high",
                      "bg-yellow-500": getCriticalityFromScore(metricsForm.processSafety + metricsForm.disponibility + metricsForm.integrity) === "medium",
                      "bg-blue-500": getCriticalityFromScore(metricsForm.processSafety + metricsForm.disponibility + metricsForm.integrity) === "low",
                      "bg-green-500": getCriticalityFromScore(metricsForm.processSafety + metricsForm.disponibility + metricsForm.integrity) === "very-low"
                    }
                  )}
                >
                  {metricsForm.processSafety + metricsForm.disponibility + metricsForm.integrity}/15
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Safety ({metricsForm.processSafety}) + Availability ({metricsForm.disponibility}) + Integrity ({metricsForm.integrity}) = Total Score
              </div>
            </div>
          </div>

          <div className="bg-taqa-blue/10 p-4 rounded-lg border border-taqa-blue/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-taqa-blue/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-taqa-blue" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  How this helps
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your feedback will be used to retrain our AI model, making future predictions more accurate for similar anomalies. This contributes to better maintenance planning and risk assessment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-taqa-primary hover:bg-taqa-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 