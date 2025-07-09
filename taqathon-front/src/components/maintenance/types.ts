import * as z from "zod";

// Schemas
export const anomalySchema = z.object({
  id: z.number().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  criticality: z.number().min(0, "Criticality is required"),
  disponibility: z.number().min(0, "Disponibility is required"),
  predictedDisponibility: z
    .number()
    .min(0, "Predicted disponibility is required"),
  predictedIntegrity: z.number().min(0, "Predicted integrity is required"),
  predictedProcessSafety: z
    .number()
    .min(0, "Predicted process safety is required"),
  integrity: z.number().min(0, "Integrity is required"),
  processSafety: z.number().min(0, "Process safety is required"),
  equipment: z.string().min(1, "Equipment is required"),
  detectionDate: z.string().min(1, "Detection date is required"),
  status: z.string().min(1, "Status is required"),
  maintenanceWindowId: z.number().min(1, "Maintenance window ID is required"),
  createdAt: z.string().min(1, "Created at is required"),
  updatedAt: z.string().min(1, "Updated at is required"),
  tags: z.string().min(1, "Tags is required"),
  sysShutDownRequired: z.boolean(),
  estimatedTime: z.number().min(1, "Estimated time is required"),
});

export const maintenanceWindowSchema = z.object({
  title: z.string().min(1, "Title is required"),
  scheduleStart: z.string().min(1, "Start date is required"),
  scheduleEnd: z.string().min(1, "End date is required"),
  anomalies: z.array(anomalySchema).optional(),
  type: z.string().optional(),
});

// Type definitions
export type AnomalyFormData = z.infer<typeof anomalySchema>;

export type MaintenanceWindowFormData = z.infer<typeof maintenanceWindowSchema>;

export type ActionPlan = {
  id: string;
  action: string;
  estimatedTime: number | null;
  responsible: string;
  pdrsAvailable: string;
  internalResources: string;
  externalResources: string;
};

export type ActionPlanWithoutEstimatedTime = Omit<ActionPlan, "estimatedTime">;

// Status helper function
export const getStatus = (window: MaintenanceWindowFormData) => {
  const now = new Date();
  const startDate = new Date(window.scheduleStart);
  const endDate = new Date(window.scheduleEnd);

  if (now >= startDate && now <= endDate) {
    return "in-progress";
  } else if (now > endDate) {
    return "completed";
  } else {
    return "scheduled";
  }
};
