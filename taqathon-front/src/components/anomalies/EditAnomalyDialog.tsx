import { useEffect } from "react";
import { useAnomalyTranslations, useCommonTranslations } from "@/i18n/hooks/useTranslations";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import { Anomaly } from "@/types/anomaly";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const editAnomalySchema = z.object({
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  equipment: z.string().min(1, "Equipment is required"),
  system: z.string().min(1, "System is required"),
  service: z.string().optional(),
  status: z.enum(["IN_PROGRESS", "TREATED", "CLOSED"], {
    required_error: "Please select a status",
  }),
  estimatedTime: z.number()
    .min(0, "Estimated time cannot be negative")
    .max(1000, "Estimated time cannot exceed 1000 hours")
    .optional(),
  sysShutDownRequired: z.boolean(),
});

type EditAnomalyFormData = z.infer<typeof editAnomalySchema>;

interface EditAnomalyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anomaly: Anomaly | null;
}

export const EditAnomalyDialog = ({ open, onOpenChange, anomaly }: EditAnomalyDialogProps) => {
  const anomalyT = useAnomalyTranslations();
  const commonT = useCommonTranslations();
  const { editAnomaly, getAnomalyById } = useAnomalyStore();

  // Helper function to normalize status values
  const normalizeStatus = (status: string): "IN_PROGRESS" | "TREATED" | "CLOSED" => {
    const statusMap: Record<string, "IN_PROGRESS" | "TREATED" | "CLOSED"> = {
      "open": "IN_PROGRESS",
      "in-progress": "IN_PROGRESS",
      "IN_PROGRESS": "IN_PROGRESS",
      "traitee": "TREATED", 
      "TREATED": "TREATED",
      "cloture": "CLOSED",
      "closed": "CLOSED",
      "CLOSED": "CLOSED"
    };
    return statusMap[status] || "IN_PROGRESS";
  };

  // Get allowed status options based on current status (no backward progression)
  const getAllowedStatuses = (currentStatus: string) => {
    const normalized = normalizeStatus(currentStatus);
    switch (normalized) {
      case "IN_PROGRESS":
        return ["IN_PROGRESS", "TREATED", "CLOSED"];
      case "TREATED":
        return ["TREATED", "CLOSED"];
      case "CLOSED":
        return ["CLOSED"];
      default:
        return ["IN_PROGRESS", "TREATED", "CLOSED"];
    }
  };

  const form = useForm<EditAnomalyFormData>({
    resolver: zodResolver(editAnomalySchema),
    defaultValues: {
      description: "",
      equipment: "",
      system: "",
      service: "",
      status: "IN_PROGRESS",
      estimatedTime: 0,
      sysShutDownRequired: false,
    }
  });

  useEffect(() => {
    if (anomaly) {
      const equipmentName = typeof anomaly.equipment === 'string' 
        ? anomaly.equipment 
        : anomaly.equipment?.name || '';
        
      form.reset({
        description: anomaly.description,
        equipment: equipmentName,
        system: anomaly.system,
        service: anomaly.service || "",
        status: normalizeStatus(anomaly.status),
        estimatedTime: anomaly.estimatedTime || 0,
        sysShutDownRequired: anomaly.sysShutDownRequired || false,
      });
    }
  }, [anomaly, form.reset]);

  const onSubmit = async (data: EditAnomalyFormData) => {
    if (!anomaly) {
      toast.error("No anomaly selected");
      return;
    }

    try {
      // Call the new editAnomaly function with form data
      await editAnomaly(anomaly.id, {
        description: data.description,
        equipment: data.equipment,
        system: data.system,
        service: data.service,
        status: data.status,
        sysShutDownRequired: data.sysShutDownRequired,
        estimatedTime: data.estimatedTime,
      });

      // Refresh the anomaly data
      if (anomaly.id) {
        await getAnomalyById(anomaly.id.toString());
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update anomaly:", error);
      // Error handling is done in the store function
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{anomalyT.editAnomaly}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{anomalyT.equipment}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter equipment name..." className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="system"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">System</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter system..." className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Service</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select service..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MC">MC</SelectItem>
                          <SelectItem value="MM">MM</SelectItem>
                          <SelectItem value="MD">MD</SelectItem>
                          <SelectItem value="CT">CT</SelectItem>
                          <SelectItem value="EL">EL</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{anomalyT.description}</FormLabel>
                    <FormControl>
                      <Textarea {...field} maxLength={1000} rows={4} className="resize-none" placeholder="Enter detailed description..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimatedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">{anomalyT.estimatedTime} (hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                          placeholder="Enter estimated time..."
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">{anomalyT.status}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={anomalyT.selectStatus} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAllowedStatuses(anomaly?.status || "IN_PROGRESS").map((status) => (
                            <SelectItem key={status} value={status}>
                              {status === "IN_PROGRESS" && anomalyT.statusOpen}
                              {status === "TREATED" && anomalyT.statusInProgress}
                              {status === "CLOSED" && anomalyT.statusResolved}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sysShutDownRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg bg-orange-50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">{anomalyT.systemShutdownRequired}</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
                className="px-6"
              >
                {commonT.cancel}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="px-6">
                {form.formState.isSubmitting ? "Saving..." : commonT.save}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};