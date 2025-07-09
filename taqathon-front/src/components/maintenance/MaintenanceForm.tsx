import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useMaintenanceTranslations } from "@/i18n/hooks/useTranslations";
import { MaintenanceWindowFormData, maintenanceWindowSchema } from "./types";

interface MaintenanceFormProps {
  buttonText: string;
  data: MaintenanceWindowFormData | null;
  id: string | null;
}

export const MaintenanceForm = ({
  buttonText,
  data,
  id,
}: MaintenanceFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addNewMaintenanceWindow, updateMaintenanceWindow } =
    useMaintenanceStore();
  const maintenanceT = useMaintenanceTranslations();

  const formatDateForInput = (date: Date | string) => {
    if (typeof date === "string") {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const defaultValues = {
    title: data?.title || "",
    scheduleStart: data?.scheduleStart
      ? formatDateForInput(data.scheduleStart)
      : "",
    scheduleEnd: data?.scheduleEnd ? formatDateForInput(data.scheduleEnd) : "",
    type: data?.type || "MINOR",
  };

  const form = useForm<MaintenanceWindowFormData>({
    resolver: zodResolver(maintenanceWindowSchema),
    defaultValues,
  });

  // Reset form when data changes (for editing existing windows)
  useEffect(() => {
    if (data && isDialogOpen) {
      form.reset({
        title: data.title || "",
        scheduleStart: data.scheduleStart
          ? formatDateForInput(data.scheduleStart)
          : "",
        scheduleEnd: data.scheduleEnd
          ? formatDateForInput(data.scheduleEnd)
          : "",
        type: data.type || "MINOR",
      });
    } else if (!data && isDialogOpen) {
      form.reset({
        title: "",
        scheduleStart: "",
        scheduleEnd: "",
        type: "MINOR",
      });
    }
  }, [data, isDialogOpen, form]);

  const onSubmit = (newData: MaintenanceWindowFormData) => {
    if (new Date(newData.scheduleStart) >= new Date(newData.scheduleEnd)) {
      toast.error(maintenanceT.startDateRequired);
      return;
    }

    const startDate = new Date(newData.scheduleStart);
    const endDate = new Date(newData.scheduleEnd);
    const timeDifference =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    if (timeDifference < 2) {
      toast.error(maintenanceT.minimumDuration);
      return;
    }

    const newMaintenanceWindow = {
      title: newData.title,
      scheduleStart: newData.scheduleStart,
      scheduleEnd: newData.scheduleEnd,
      anomalies: id && data ? data.anomalies : [],
      type: newData.type || "MINOR",
    };

    id && data
      ? updateMaintenanceWindow(id, newMaintenanceWindow)
      : addNewMaintenanceWindow(newMaintenanceWindow);
    form.reset();
    setIsDialogOpen(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="border-white/30 text-white hover:text-white hover:bg-[#003D55]/20 bg-[#003D55]"
          variant="outline"
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{maintenanceT.createMaintenanceWindow}</DialogTitle>
          <DialogDescription>
            {maintenanceT.addNewMaintenanceWindow}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{maintenanceT.windowTitle}</FormLabel>
                  <FormControl>
                    <Input placeholder={maintenanceT.enterTitle} {...field} />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shutdown Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shutdown type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MINOR">MINOR</SelectItem>
                        <SelectItem value="MAJOR">MAJOR</SelectItem>
                        <SelectItem value="SEVENDAYS">SEVENDAYS</SelectItem>
                        <SelectItem value="FORCED">FORCED</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduleStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{maintenanceT.startDate}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduleEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{maintenanceT.endDate}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {maintenanceT.cancel}
              </Button>
              <Button type="submit">{maintenanceT.createWindow}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
