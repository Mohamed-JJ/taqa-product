import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Brain,
  Lightbulb,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Download,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Archive,
  Star,
  Award,
  BarChart3,
  Upload,
  Paperclip,
  File,
} from "lucide-react";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import {
  ReturnOfExperience,
  Anomaly,
  MaintenanceWindow,
} from "@/types/anomaly";
import { toast } from "sonner";
import { format } from "date-fns";
import apiClient from "@/lib/api";
import { log } from "console";

interface RexFormData {
  maintenanceWindowId: string;
  anomalyIds: string[];
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
  tags: string;
  attachments: File[];
}

interface RexFile {
  id: number;
  description: string;
  rexFilePath: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  anomaly?: {
    id: number;
    description: string;
    equipment: string;
    equipementDescription: string;
    service: string;
    system: string;
    status: string;
    criticality: number;
    processSafety: number;
    integrity: number;
    disponibility: number;
    detectionDate: string;
    sysShutDownRequired: boolean;
  };
}

const CreateRexDialog = ({
  onRexCreated,
}: {
  onRexCreated: (rex: ReturnOfExperience) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { maintenanceWindows } = useMaintenanceStore();
  const { anomalies } = useAnomalyStore();

  const [formData, setFormData] = useState<RexFormData>({
    maintenanceWindowId: "",
    anomalyIds: [],
    summary: "",
    rootCause: "",
    correctionAction: "",
    preventiveAction: "",
    lessonsLearned: "",
    recommendations: "",
    impact: "medium",
    category: "technical",
    tags: "",
    attachments: [],
  });

  const completedWindows = maintenanceWindows.filter(
    (window) =>
      window.status === "completed" ||
      new Date(window.scheduleEnd) < new Date(),
  );

  const selectedWindowAnomalies = formData.maintenanceWindowId
    ? completedWindows
        .find((w) => w.id === formData.maintenanceWindowId)
        ?.anomalies?.filter(
          (a) => a.status === "CLOSED" || a.status === "TREATED",
        ) || []
    : [];

  const handleSubmit = async () => {
    if (
      !formData.maintenanceWindowId ||
      !formData.summary ||
      !formData.rootCause
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const newRex: ReturnOfExperience = {
        id: Date.now().toString(),
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

      onRexCreated(newRex);
      toast.success("REX created successfully!");
      setIsOpen(false);
      setFormData({
        maintenanceWindowId: "",
        anomalyIds: [],
        summary: "",
        rootCause: "",
        correctionAction: "",
        preventiveAction: "",
        lessonsLearned: "",
        recommendations: "",
        impact: "medium",
        category: "technical",
        tags: "",
        attachments: [],
      });
    } catch (error) {
      toast.error("Failed to create REX");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-white/30 text-white hover:text-white hover:bg-white/20 bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create REX
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Create Return of Experience
          </DialogTitle>
          <DialogDescription>
            Document lessons learned and recommendations from maintenance
            activities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Maintenance Window Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Maintenance Window *</Label>
            <Select
              value={formData.maintenanceWindowId}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  maintenanceWindowId: value,
                  anomalyIds: [],
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select completed maintenance window" />
              </SelectTrigger>
              <SelectContent>
                {completedWindows.map((window) => (
                  <SelectItem key={window.id} value={window.id}>
                    {window.title} -{" "}
                    {format(new Date(window.scheduleEnd), "MMM dd, yyyy")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Related Anomalies */}
          {selectedWindowAnomalies.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Related Anomalies</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                {selectedWindowAnomalies.map((anomaly) => (
                  <label
                    key={anomaly.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.anomalyIds.includes(
                        anomaly.id.toString(),
                      )}
                      onChange={(e) => {
                        const anomalyId = anomaly.id.toString();
                        setFormData({
                          ...formData,
                          anomalyIds: e.target.checked
                            ? [...formData.anomalyIds, anomalyId]
                            : formData.anomalyIds.filter(
                                (id) => id !== anomalyId,
                              ),
                        });
                      }}
                    />
                    <span>
                      {anomaly.equipment} -{" "}
                      {anomaly.description.substring(0, 50)}...
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
            <Label className="text-sm font-medium">Executive Summary *</Label>
            <Textarea
              placeholder="Brief overview of the maintenance activity and key outcomes..."
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Root Cause */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Root Cause Analysis *</Label>
            <Textarea
              placeholder="What caused the issue? Deep dive into underlying factors..."
              value={formData.rootCause}
              onChange={(e) =>
                setFormData({ ...formData, rootCause: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Corrective Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Corrective Actions Taken
            </Label>
            <Textarea
              placeholder="What actions were taken to fix the immediate problem..."
              value={formData.correctionAction}
              onChange={(e) =>
                setFormData({ ...formData, correctionAction: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Preventive Actions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preventive Actions</Label>
            <Textarea
              placeholder="What measures will prevent similar issues in the future..."
              value={formData.preventiveAction}
              onChange={(e) =>
                setFormData({ ...formData, preventiveAction: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Lessons Learned */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Lessons Learned</Label>
            <Textarea
              placeholder="Key insights and knowledge gained from this experience..."
              value={formData.lessonsLearned}
              onChange={(e) =>
                setFormData({ ...formData, lessonsLearned: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recommendations</Label>
            <Textarea
              placeholder="Recommendations for future improvements and best practices..."
              value={formData.recommendations}
              onChange={(e) =>
                setFormData({ ...formData, recommendations: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <Input
              placeholder="maintenance, safety, equipment, procedure (comma-separated)"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Attachments</Label>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({ ...formData, attachments: files });
              }}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
            </p>
            {formData.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Selected Files:
                </Label>
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/20 rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newAttachments = formData.attachments.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({
                          ...formData,
                          attachments: newAttachments,
                        });
                      }}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="border-white/30 text-white hover:text-white hover:bg-white/20 bg-transparent"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create REX"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RexCard = ({
  rex,
  onView,
  rexFiles,
  onPreviewFile,
}: {
  rex: ReturnOfExperience;
  onView: (rex: ReturnOfExperience) => void;
  rexFiles: RexFile[];
  onPreviewFile: (file: RexFile) => void;
}) => {
  const attachedFiles = rexFiles.filter((file) => `rex_${file.id}` === rex.id);

  return (
    <Card className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl  transition-all duration-300 overflow-hidden">
      {/* Header with gradient accent */}
      <div className="h-2 bg-[#003D55]"></div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                REX-{rex.id.slice(-4)}
              </Badge>
              {attachedFiles.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-50 border-purple-200 text-purple-700"
                >
                  <Paperclip className="h-3 w-3 mr-1" />
                  {attachedFiles.length} file
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {rex.summary}
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {rex.createdBy}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(rex.createdAt, "MMM dd, yyyy")}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Anomaly Details */}
        {attachedFiles.length > 0 && attachedFiles[0].anomaly && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Related Anomaly
            </Label>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        attachedFiles[0].anomaly.status === "CLOSED"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-yellow-50 border-yellow-200 text-yellow-700"
                      }`}
                    >
                      {attachedFiles[0].anomaly.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                    >
                      {attachedFiles[0].anomaly.service}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {attachedFiles[0].anomaly.equipementDescription} -{" "}
                    {attachedFiles[0].anomaly.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>
                        Criticality:{" "}
                        {attachedFiles[0].anomaly.criticality.toFixed(1)}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>
                        Safety: {attachedFiles[0].anomaly.processSafety}
                      </span>
                    </div>
                    {attachedFiles[0].anomaly.sysShutDownRequired && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-red-600">
                          <Clock className="h-3 w-3" />
                          <span>Shutdown Required</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attachments Preview */}
        {attachedFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Attachments
            </Label>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {attachedFiles.slice(0, 2).map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <File className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    <span className="truncate font-medium">
                      {file.fileName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewFile(file)}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                      title="Preview file"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `${import.meta.env.VITE_BACKEND_URL}/${rexFiles.anomaly.id}`,
                          "_blank",
                        )
                      }
                      className="h-6 w-6 p-0 hover:bg-green-100"
                      title="Download file"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {attachedFiles.length > 2 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{attachedFiles.length - 2} more files
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RexDetailsDialog = ({
  rex,
  isOpen,
  onClose,
  rexFiles,
  onPreviewFile,
}: {
  rex: ReturnOfExperience | null;
  isOpen: boolean;
  onClose: () => void;
  rexFiles: RexFile[];
  onPreviewFile: (file: RexFile) => void;
}) => {
  if (!rex) return null;

  const attachedFiles = rexFiles.filter((file) => `rex_${file.id}` === rex.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            REX-{rex.id.slice(-4)} Details
            {attachedFiles.length > 0 && (
              <Badge variant="outline" className="ml-2">
                <Paperclip className="h-3 w-3 mr-1" />
                {attachedFiles.length} file{attachedFiles.length > 1 ? "s" : ""}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Created by {rex.createdBy} on{" "}
            {format(rex.createdAt, "MMMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Executive Summary
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {rex.summary}
            </p>
          </div>

          {/* Anomaly Details Section */}
          {attachedFiles.length > 0 && attachedFiles[0].anomaly && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Related Anomaly Details
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Equipment
                    </Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {attachedFiles[0].anomaly.equipementDescription}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Service
                    </Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {attachedFiles[0].anomaly.service}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        attachedFiles[0].anomaly.status === "CLOSED"
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-yellow-100 border-yellow-300 text-yellow-800"
                      }`}
                    >
                      {attachedFiles[0].anomaly.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Detection Date
                    </Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {format(
                        new Date(attachedFiles[0].anomaly.detectionDate),
                        "MMM dd, yyyy",
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <p className="text-sm text-gray-900 mt-1 bg-white p-3 rounded border">
                    {attachedFiles[0].anomaly.description}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <Label className="text-xs font-medium text-gray-600">
                      Criticality
                    </Label>
                    <p className="text-lg font-semibold text-red-600">
                      {attachedFiles[0].anomaly.criticality.toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs font-medium text-gray-600">
                      Process Safety
                    </Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {attachedFiles[0].anomaly.processSafety}
                    </p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs font-medium text-gray-600">
                      Integrity
                    </Label>
                    <p className="text-lg font-semibold text-green-600">
                      {attachedFiles[0].anomaly.integrity}
                    </p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs font-medium text-gray-600">
                      Availability
                    </Label>
                    <p className="text-lg font-semibold text-purple-600">
                      {attachedFiles[0].anomaly.disponibility}
                    </p>
                  </div>
                </div>

                {attachedFiles[0].anomaly.sysShutDownRequired && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        System Shutdown Required
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Root Cause Analysis
            </h3>
            <p className="text-gray-700 bg-red-50 p-4 rounded-lg">
              {rex.rootCause}
            </p>
          </div>

          {rex.correctionAction && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Corrective Actions
              </h3>
              <p className="text-gray-700 bg-green-50 p-4 rounded-lg">
                {rex.correctionAction}
              </p>
            </div>
          )}

          {rex.preventiveAction && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Preventive Actions
              </h3>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                {rex.preventiveAction}
              </p>
            </div>
          )}

          {rex.lessonsLearned && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Lessons Learned
              </h3>
              <p className="text-gray-700 bg-amber-50 p-4 rounded-lg">
                {rex.lessonsLearned}
              </p>
            </div>
          )}

          {rex.recommendations && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                Recommendations
              </h3>
              <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
                {rex.recommendations}
              </p>
            </div>
          )}

          {/* Attachments Section */}
          {attachedFiles.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-gray-500" />
                Attachments ({attachedFiles.length})
              </h3>
              <div className="space-y-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <File className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{file.fileName}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>PDF Document</span>
                          <span>•</span>
                          <span>
                            Uploaded{" "}
                            {format(new Date(file.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPreviewFile(file)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:text-white hover:bg-white/20 bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export REX
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RexFilePreviewDialog = ({
  file,
  isOpen,
  onClose,
}: {
  file: RexFile | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [previewContent, setPreviewContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (file && isOpen) {
      fetchPreviewContent();
    }
  }, [file, isOpen]);

  const fetchPreviewContent = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const response = await apiClient.get(`/attachements/rex/${file.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPreviewContent(response.data || "Preview not available");
      } else {
        setError("Failed to load file preview");
      }
    } catch (error: any) {
      console.error("Failed to fetch file preview:", error);
      if (error.response?.status === 401) {
        setError("Unauthorized access. Please check your login status.");
      } else {
        setError("Failed to load file preview");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <File className="h-5 w-5 text-blue-600" />
            {file.fileName}
          </DialogTitle>
          <DialogDescription>
            REX File Preview • Uploaded{" "}
            {format(new Date(file.createdAt), "MMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Description:</span>
                <p className="mt-1">{file.description}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">File Path:</span>
                <p className="mt-1 text-xs text-gray-500 break-all">
                  {file.rexFilePath}
                </p>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="border rounded-lg p-4 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading preview...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <AlertTriangle className="h-12 w-12 text-red-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">
                  Preview Not Available
                </h3>
                <p className="text-gray-600 text-sm">{error}</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  File Content Preview:
                </h4>
                <div className="bg-white border rounded p-4 text-sm text-gray-700 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {previewContent || "No preview content available"}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Rex = () => {
  const [rexRecords, setRexRecords] = useState<ReturnOfExperience[]>([]);
  const [rexFiles, setRexFiles] = useState<RexFile[]>([]);
  const [selectedRex, setSelectedRex] = useState<ReturnOfExperience | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RexFile | null>(null);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("records");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  const { maintenanceWindows, getMaintenanceWindows } = useMaintenanceStore();
  const { getAnomalies } = useAnomalyStore();

  useEffect(() => {
    getMaintenanceWindows();
    getAnomalies();
  }, []);

  useEffect(() => {
    fetchRexFiles();
  }, [page, limit]);

  const fetchRexFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const response = await apiClient.get("/attachements/rex", {
        params: {
          page,
          limit,
        },
      });

      if (response.data.success) {
        setRexFiles(response.data.data);
        setTotalFiles(response.data.total || response.data.data.length);

        // Create REX records from the files
        const rexRecordsFromFiles = response.data.data.map((file: RexFile) => ({
          id: `rex_${file.id}`,
          summary: file.description,
          rootCause: "Analysis from maintenance documentation",
          correctionAction: "Actions documented in attached files",
          preventiveAction: "Preventive measures recommended",
          lessonsLearned: "Lessons captured from maintenance activity",
          recommendations: "See attached documentation for details",
          attachments: [],
          createdBy: "System",
          createdAt: new Date(file.createdAt),
        }));
        setRexRecords(rexRecordsFromFiles);
      }
    } catch (error) {
      console.error("Failed to fetch REX files:", error);
      toast.error("Failed to load REX records");
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleRexCreated = (rex: ReturnOfExperience) => {
    setRexRecords([rex, ...rexRecords]);
  };

  const handleViewRex = (rex: ReturnOfExperience) => {
    setSelectedRex(rex);
    setIsDetailsOpen(true);
  };

  const handlePreviewFile = (file: RexFile) => {
    setSelectedFile(file);
    setIsFilePreviewOpen(true);
  };

  const filteredRexRecords = rexRecords.filter((rex) => {
    const matchesSearch =
      rex.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rex.rootCause.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const completedWindows = maintenanceWindows.filter(
    (window) =>
      window.status === "completed" ||
      new Date(window.scheduleEnd) < new Date(),
  );

  const stats = {
    totalRex: rexRecords.length,
    completedWindows: completedWindows.length,
    rexCoverage:
      completedWindows.length > 0
        ? (rexRecords.length / completedWindows.length) * 100
        : 0,
    avgImpact: rexRecords.length > 0 ? "Medium" : "N/A",
  };

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 py-8 space-y-8">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#003D55] rounded-3xl"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Lightbulb className="h-3 w-3 text-yellow-900" />
                    </div>
                  </div>
                  <div>
                    <div className="text-white/90 text-sm font-medium uppercase tracking-wider">
                      Knowledge Management
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mt-1">
                      Return of Experience
                    </h1>
                  </div>
                </div>
                <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                  Transform maintenance insights into actionable knowledge.
                  Capture lessons learned, analyze root causes, and build a
                  comprehensive knowledge base for continuous improvement.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => fetchRexFiles()}
                  disabled={isLoadingFiles}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  {isLoadingFiles ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total REX Records
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {rexRecords.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  Knowledge captured
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Attachments
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {rexFiles.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Paperclip className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <FileText className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600 font-medium">
                  Files available
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Completed Windows
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedWindows.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600 font-medium">
                  Ready for REX
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Coverage Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {completedWindows.length > 0
                      ? Math.round(
                          (rexRecords.length / completedWindows.length) * 100,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <BarChart3 className="h-4 w-4 text-indigo-500 mr-1" />
                <span className="text-sm text-indigo-600 font-medium">
                  Documentation rate
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="records" className="space-y-6 mt-8">
            {/* REX Records List */}
            <div className="space-y-4">
              {isLoadingFiles ? (
                <Card>
                  <CardContent className="text-center py-16">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading REX records...</p>
                  </CardContent>
                </Card>
              ) : filteredRexRecords.length > 0 ? (
                <>
                  {filteredRexRecords.map((rex) => (
                    <RexCard
                      key={rex.id}
                      rex={rex}
                      onView={handleViewRex}
                      onPreviewFile={handlePreviewFile}
                      rexFiles={rexFiles}
                    />
                  ))}

                  {/* Pagination Controls */}
                  {totalFiles > limit && (
                    <Card>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Showing {(page - 1) * limit + 1} to{" "}
                            {Math.min(page * limit, totalFiles)} of {totalFiles}{" "}
                            records
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage(Math.max(1, page - 1))}
                              disabled={page === 1}
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                              Page {page} of {Math.ceil(totalFiles / limit)}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage(page + 1)}
                              disabled={page >= Math.ceil(totalFiles / limit)}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-16">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No REX Records Found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {rexRecords.length === 0
                        ? "Start documenting maintenance experiences to build your knowledge base"
                        : "No records match your search criteria"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  REX Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive analytics for trends, patterns, and insights
                    from REX data
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  REX Opportunities
                </CardTitle>
                <CardDescription>
                  Completed maintenance windows without REX documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedWindows.length > 0 ? (
                  <div className="space-y-3">
                    {completedWindows.slice(0, 5).map((window) => (
                      <div
                        key={window.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{window.title}</h4>
                          <p className="text-sm text-gray-600">
                            Completed on{" "}
                            {format(
                              new Date(window.scheduleEnd),
                              "MMM dd, yyyy",
                            )}
                            • {window.anomalies?.length || 0} anomalies
                            addressed
                          </p>
                        </div>
                        <CreateRexDialog onRexCreated={handleRexCreated} />
                      </div>
                    ))}
                    {completedWindows.length > 5 && (
                      <p className="text-sm text-gray-500 text-center mt-4">
                        And {completedWindows.length - 5} more opportunities...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No Opportunities Yet
                    </h3>
                    <p className="text-gray-600">
                      Complete some maintenance windows to start creating REX
                      records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* REX File Preview Dialog */}
        <RexFilePreviewDialog
          file={selectedFile}
          isOpen={isFilePreviewOpen}
          onClose={() => setIsFilePreviewOpen(false)}
        />
      </div>
    </div>
  );
};

export default Rex;
