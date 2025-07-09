import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  Lightbulb,
  Star,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  MaintenanceWindow,
  ReturnOfExperience,
  Anomaly,
} from "@/types/anomaly";

interface RexIntegrationProps {
  maintenanceWindow: MaintenanceWindow;
  isCompleted?: boolean;
  onRexCreated?: (rex: ReturnOfExperience) => void;
}

interface QuickRexFormData {
  summary: string;
  rootCause: string;
  correctionAction: string;
  preventiveAction: string;
  lessonsLearned: string;
  recommendations: string;
  impact: "low" | "medium" | "high" | "critical";
  category:
    | "technical"
    | "procedural"
    | "organizational"
    | "safety"
    | "quality";
}

const QuickRexDialog = ({
  maintenanceWindow,
  onRexCreated,
}: {
  maintenanceWindow: MaintenanceWindow;
  onRexCreated?: (rex: ReturnOfExperience) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<QuickRexFormData>({
    summary: "",
    rootCause: "",
    correctionAction: "",
    preventiveAction: "",
    lessonsLearned: "",
    recommendations: "",
    impact: "medium",
    category: "technical",
  });

  const resolvedAnomalies =
    maintenanceWindow.anomalies?.filter(
      (a) => a.status === "CLOSED" || a.status === "TREATED",
    ) || [];

  const handleSubmit = async () => {
    if (!formData.summary || !formData.rootCause) {
      toast.error("Please fill in the summary and root cause analysis");
      return;
    }

    setIsSubmitting(true);
    try {
      const newRex: ReturnOfExperience = {
        id: `rex_${Date.now()}`,
        summary: formData.summary,
        rootCause: formData.rootCause,
        correctionAction: formData.correctionAction,
        preventiveAction: formData.preventiveAction,
        lessonsLearned: formData.lessonsLearned,
        recommendations: formData.recommendations,
        attachments: [],
        createdBy: "Current User", // In real app, get from auth
        createdAt: new Date(),
      };

      // In a real application, this would be an API call
      onRexCreated?.(newRex);
      toast.success("REX created successfully!");
      setIsOpen(false);

      // Reset form
      setFormData({
        summary: "",
        rootCause: "",
        correctionAction: "",
        preventiveAction: "",
        lessonsLearned: "",
        recommendations: "",
        impact: "medium",
        category: "technical",
      });
    } catch (error) {
      toast.error("Failed to create REX");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFullRex = () => {
    navigate("/rex?source=maintenance&windowId=" + maintenanceWindow.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200"
        >
          <Brain className="h-4 w-4 mr-2" />
          Create REX Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Quick REX Creation
          </DialogTitle>
          <DialogDescription>
            Document key learnings from {maintenanceWindow.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Maintenance Context */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Maintenance Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Window:</span>
                <span className="font-medium">{maintenanceWindow.title}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Period:</span>
                <span>
                  {format(new Date(maintenanceWindow.scheduleStart), "MMM dd")}{" "}
                  -{" "}
                  {format(
                    new Date(maintenanceWindow.scheduleEnd),
                    "MMM dd, yyyy",
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Anomalies Resolved:</span>
                <Badge variant="secondary">{resolvedAnomalies.length}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Impact Level */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Impact Level</Label>
              <Select
                value={formData.impact}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, impact: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="critical">Critical Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="procedural">Procedural</SelectItem>
                  <SelectItem value="organizational">Organizational</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Executive Summary *
            </Label>
            <Textarea
              placeholder="Brief overview of the maintenance activity and key outcomes..."
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="min-h-[60px]"
            />
          </div>

          {/* Root Cause */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Root Cause Analysis *
            </Label>
            <Textarea
              placeholder="What caused the issues? Key factors identified..."
              value={formData.rootCause}
              onChange={(e) =>
                setFormData({ ...formData, rootCause: e.target.value })
              }
              className="min-h-[60px]"
            />
          </div>

          {/* Actions Taken */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Actions Taken
            </Label>
            <Textarea
              placeholder="What corrective actions were implemented..."
              value={formData.correctionAction}
              onChange={(e) =>
                setFormData({ ...formData, correctionAction: e.target.value })
              }
              className="min-h-[60px]"
            />
          </div>

          {/* Lessons Learned */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Key Lessons Learned
            </Label>
            <Textarea
              placeholder="What knowledge was gained from this experience..."
              value={formData.lessonsLearned}
              onChange={(e) =>
                setFormData({ ...formData, lessonsLearned: e.target.value })
              }
              className="min-h-[60px]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleCreateFullRex}
            className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Create Full REX
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Creating..." : "Create Quick REX"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RexSummaryCard = ({
  rexCount,
  lastRexDate,
}: {
  rexCount: number;
  lastRexDate?: Date;
}) => {
  const navigate = useNavigate();

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
          <BookOpen className="h-4 w-4" />
          Knowledge Capture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-700">REX Records:</span>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            {rexCount}
          </Badge>
        </div>
        {lastRexDate && (
          <div className="flex items-center justify-between text-xs text-blue-600">
            <span>Last REX:</span>
            <span>{format(lastRexDate, "MMM dd, yyyy")}</span>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/rex")}
          className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
        >
          <ArrowRight className="h-3 w-3 mr-2" />
          View All REX
        </Button>
      </CardContent>
    </Card>
  );
};

const RexOpportunityBanner = ({
  maintenanceWindow,
}: {
  maintenanceWindow: MaintenanceWindow;
}) => {
  const isCompleted =
    maintenanceWindow.status === "completed" ||
    new Date(maintenanceWindow.scheduleEnd) < new Date();

  const hasSignificantAnomalies =
    maintenanceWindow.anomalies && maintenanceWindow.anomalies.length > 0;

  if (!isCompleted || !hasSignificantAnomalies) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 border-l-4 border-l-amber-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Lightbulb className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-amber-800 mb-1">
              REX Opportunity Identified
            </h4>
            <p className="text-sm text-amber-700 mb-3">
              This completed maintenance window addressed{" "}
              {maintenanceWindow.anomalies.length} anomalies. Consider
              documenting lessons learned for future reference.
            </p>
            <QuickRexDialog maintenanceWindow={maintenanceWindow} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RexIntegration = ({
  maintenanceWindow,
  isCompleted = false,
  onRexCreated,
}: RexIntegrationProps) => {
  // This would come from a REX store/API in a real application
  const [rexRecords] = useState<ReturnOfExperience[]>([]);

  const windowRexRecords = rexRecords.filter(
    (rex) =>
      rex.summary.includes(maintenanceWindow.title) ||
      rex.id.includes(maintenanceWindow.id || ""),
  );

  const lastRexDate =
    windowRexRecords.length > 0
      ? windowRexRecords[windowRexRecords.length - 1].createdAt
      : undefined;

  return (
    <div className="space-y-4">
      {/* REX Opportunity Banner for completed windows */}
      <RexOpportunityBanner maintenanceWindow={maintenanceWindow} />

      {/* REX Summary */}
      <RexSummaryCard
        rexCount={windowRexRecords.length}
        lastRexDate={lastRexDate}
      />

      {/* REX Creation Actions */}
      {isCompleted && (
        <div className="space-y-2">
          <QuickRexDialog
            maintenanceWindow={maintenanceWindow}
            onRexCreated={onRexCreated}
          />
        </div>
      )}
    </div>
  );
};

export default RexIntegration;
