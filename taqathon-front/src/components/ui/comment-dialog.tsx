import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, X, Plus, Trash } from "lucide-react";

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  anomalyId: string;
  anomalyTitle: string;
  onSubmit: (comment: string, author: string) => Promise<void>;
}

interface ActionStep {
  title: string;
  responsable: string;
  pdrs: string;
  internalResources: string;
  externalResources: string;
  status: string;
}

export function CommentDialog({
  isOpen,
  onClose,
  anomalyId,
  anomalyTitle,
  onSubmit,
}: CommentDialogProps) {
  const [actionSteps, setActionSteps] = useState<ActionStep[]>([
    { 
      title: "",
      responsable: "",
      pdrs: "",
      internalResources: "",
      externalResources: "",
      status: "pending"
    }
  ]);
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStep = () => {
    setActionSteps([...actionSteps, { 
      title: "",
      responsable: "",
      pdrs: "",
      internalResources: "",
      externalResources: "",
      status: "pending"
    }]);
  };

  const removeStep = (index: number) => {
    if (actionSteps.length > 1) {
      setActionSteps(actionSteps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: keyof ActionStep, value: string) => {
    const newSteps = [...actionSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setActionSteps(newSteps);
  };

  const handleSubmit = async () => {
    const isValid = actionSteps.every(step => 
      step.title.trim() && 
      step.responsable.trim() &&
      step.pdrs.trim() &&
      step.internalResources.trim() &&
      step.externalResources.trim()
    ) && author.trim();
    
    if (!isValid) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedComment = actionSteps
        .map((step, index) => 
          `Step ${index + 1}:\n` +
          `Title: ${step.title}\n` +
          `Responsable: ${step.responsable}\n` +
          `PDRs Disponible: ${step.pdrs}\n` +
          `Ressources Internes: ${step.internalResources}\n` +
          `Ressources Externes: ${step.externalResources}\n` +
          `Status: ${step.status}`
        )
        .join('\n\n');
      
      await onSubmit(formattedComment, author);
      setActionSteps([{ 
        title: "",
        responsable: "",
        pdrs: "",
        internalResources: "",
        externalResources: "",
        status: "pending"
      }]);
      setAuthor("");

      onClose();
      toast.success("Action plan added successfully");
    } catch (error) {
      toast.error("Failed to add action plan. Please try again.");
      console.error("Error adding action plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setActionSteps([{ 
        title: "",
        responsable: "",
        pdrs: "",
        internalResources: "",
        externalResources: "",
        status: "pending"
      }]);
      setAuthor("");
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 h-[100vh] z-50 flex items-center justify-center border -top-7 left-0">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

          {/* Modal */}
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-[500px] mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Add Action Plan
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an action plan to anomaly:{" "}
                  <span className="font-medium">{anomalyTitle}</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="px-6 py-2 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                <Label htmlFor="author">Plan Author</Label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="min-h-[20px] border outline-none w-full p-2 rounded-md"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-4">
                {actionSteps.map((step, index) => (
                  <div key={index} className="space-y-2 border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <Label>Step {index + 1}</Label>
                      {actionSteps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(index)}
                          className="h-8 w-8"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Action Title"
                        value={step.title}
                        onChange={(e) => updateStep(index, "title", e.target.value)}
                        className="min-h-[20px] border outline-none w-full p-2 rounded-md"
                        disabled={isSubmitting}
                      />
                      <input
                        type="text"
                        placeholder="Responsable"
                        value={step.responsable}
                        onChange={(e) => updateStep(index, "responsable", e.target.value)}
                        className="min-h-[20px] border outline-none w-full p-2 rounded-md"
                        disabled={isSubmitting}
                      />
                      <Textarea
                        placeholder="PDRs Disponible..."
                        value={step.pdrs}
                        onChange={(e) => updateStep(index, "pdrs", e.target.value)}
                        className="min-h-[60px] resize-none"
                        disabled={isSubmitting}
                      />
                      <Textarea
                        placeholder="Ressources Internes..."
                        value={step.internalResources}
                        onChange={(e) => updateStep(index, "internalResources", e.target.value)}
                        className="min-h-[60px] resize-none"
                        disabled={isSubmitting}
                      />
                      <Textarea
                        placeholder="Ressources Externes..."
                        value={step.externalResources}
                        onChange={(e) => updateStep(index, "externalResources", e.target.value)}
                        className="min-h-[60px] resize-none"
                        disabled={isSubmitting}
                      />
                      <select
                        value={step.status}
                        onChange={(e) => updateStep(index, "status", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addStep}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-6 border-t mt-auto">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !actionSteps.every(step => 
                  step.title.trim() && 
                  step.responsable.trim() &&
                  step.pdrs.trim() &&
                  step.internalResources.trim() &&
                  step.externalResources.trim()
                ) || !author.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Adding..." : "Add Action Plan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
