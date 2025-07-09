import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import {
  useCreateAnomalyTranslations,
  useCommonTranslations,
} from "@/i18n/hooks/useTranslations";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";

// Zod schema for manual anomaly entry

const anomalySchema = z.object({
  equipment: z.string().min(1, "Numéro d'équipement requis"),
  system: z.string().min(1, "Système requis"),
  description: z.string().min(1, "Description requise"),
  detectionDate: z.string().min(1, "Date de détection requise"),
  equipementDescription: z
    .string()
    .min(1, "Description de l'équipement requise"),
  service: z.enum(["MC", "MM", "MD", "CT", "EL"]),
});

const FormError = ({ error }: { error: string }) => {
  return (
    <div className="min-h-[15px]">
      <p className="text-xs text-red-500">{error}</p>
    </div>
  );
};

type AnomalyFormValues = z.infer<typeof anomalySchema>;

// Manual anomaly form component
function ManualAnomalyForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AnomalyFormValues>({
    resolver: zodResolver(anomalySchema),
  });

  const t = useCreateAnomalyTranslations();
  const commonT = useCommonTranslations();
  const { addAnomaly } = useAnomalyStore();
  const onSubmit = async (data: AnomalyFormValues) => {
    try {
      // You can replace this with your actual API call
      await addAnomaly({
        ...data,
        detectionDate: new Date(data.detectionDate).toISOString(),
      });
      toast.success("Anomalie ajoutée avec succès !");
      reset();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'anomalie.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Numéro d'équipement</Label>
        <Input
          {...register("equipment")}
          placeholder="Saisir le numéro d'équipement"
          className="bg-background/50"
        />
        <FormError error={errors.equipment?.message || ""} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Système</Label>
        <Input
          {...register("system")}
          placeholder="Saisir le système"
          className="bg-background/50"
        />
        <FormError error={errors.system?.message || ""} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Décrire l'anomalie"
          className="bg-background/50 min-h-[100px] resize-none"
        />
        <FormError error={errors.description?.message || ""} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Service</Label>
        <Controller
          name="service"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MC">MC</SelectItem>
                <SelectItem value="MM">MM</SelectItem>
                <SelectItem value="MD">MD</SelectItem>
                <SelectItem value="CT">CT</SelectItem>
                <SelectItem value="EL">EL</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FormError error={errors.service?.message || ""} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Date de détection de l'anomalie
        </Label>
        <Input
          {...register("detectionDate")}
          type="date"
          className="bg-background/50"
        />
        <FormError error={errors.detectionDate?.message || ""} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Description de l'équipement
        </Label>
        <Textarea
          {...register("equipementDescription")}
          placeholder="Décrire l'équipement"
          className="bg-background/50 min-h-[80px] resize-none"
        />
        <FormError error={errors.equipementDescription?.message || ""} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            {"Enregistrement..."}
          </>
        ) : (
          commonT.save || "Enregistrer"
        )}
      </Button>
    </form>
  );
}

const CreateAnomaly = () => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0); // 0: upload, 1: analysis, 2: assessment
  const t = useCreateAnomalyTranslations();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    if (e.target.files.length > 1) {
      toast.error("Veuillez sélectionner un seul fichier");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/vnd.ms-excel" &&
      file.type !== "text/csv"
    ) {
      toast.error("Veuillez sélectionner un fichier xlsx, xls ou csv");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 10MB");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setCurrentStep(0);

    const simulateProgress = (
      startProgress: number,
      targetProgress: number,
      duration: number,
    ) => {
      return new Promise<void>((resolve) => {
        const steps = 20;
        const stepProgress = (targetProgress - startProgress) / steps;
        const stepDuration = duration / steps;

        let currentProgress = startProgress;
        const interval = setInterval(() => {
          currentProgress += stepProgress;
          if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(interval);
            setUploadProgress(currentProgress);
            resolve();
          } else {
            setUploadProgress(currentProgress);
          }
        }, stepDuration);
      });
    };

    try {
      setCurrentStep(0);
      await simulateProgress(0, 30, 2000);

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        "/anomaly/anomaly-file-submission",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response);

      setCurrentStep(1);
      await simulateProgress(30, 70, 3000);

      setCurrentStep(2);
      await simulateProgress(70, 100, 2000);

      toast(
        response.status === 201
          ? "File processed successfully! Redirecting to anomalies..."
          : "File upload failed",
      );

      setTimeout(() => {
        navigate("/anomalies");
      }, 1000);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("File upload failed");
      setIsLoading(false);
    }
  };

  const upLoadAnomalies = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-taqa-primary to-taqa-secondary rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-taqa-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {t.processingYourFile}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t.aiAnalyzingData}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  currentStep >= 0
                    ? "bg-muted/30 border-border/50"
                    : "bg-muted/20 border-border/30"
                }`}
              >
                {currentStep > 0 ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                ) : currentStep === 0 ? (
                  <Loader2 className="h-4 w-4 animate-spin text-taqa-primary" />
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= 0
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.fileUpload}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentStep > 0
                      ? t.fileReceivedSuccessfully
                      : t.uploadingYourFile}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  currentStep >= 1
                    ? "bg-muted/30 border-border/50"
                    : "bg-muted/20 border-border/30"
                }`}
              >
                {currentStep > 1 ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                ) : currentStep === 1 ? (
                  <Loader2 className="h-4 w-4 animate-spin text-taqa-primary" />
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= 1
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.aiAnalysis}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentStep > 1
                      ? t.analysisCompleted
                      : t.classifyingAnomalyPatterns}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  currentStep >= 2
                    ? "bg-muted/30 border-border/50"
                    : "bg-muted/20 border-border/30"
                }`}
              >
                {uploadProgress >= 100 ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                ) : currentStep === 2 ? (
                  <Loader2 className="h-4 w-4 animate-spin text-taqa-primary" />
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground/30 rounded-full" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= 2
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.criticalityAssessment}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {uploadProgress >= 100
                      ? t.assessmentCompleted
                      : t.predictingSeverityLevels}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{uploadProgress >= 100 ? t.complete : t.processing}</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-taqa-primary via-taqa-blue to-taqa-secondary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="text-center space-y-2">
            {currentStep === 0 && (
              <p className="text-sm text-muted-foreground">
                {t.fileUploadInProgress}
              </p>
            )}
            {currentStep === 1 && (
              <p className="text-sm text-muted-foreground">
                {t.aiAnalysisInProgress}
              </p>
            )}
            {currentStep === 2 && (
              <p className="text-sm text-muted-foreground">
                {t.classificationAndPredictionInProgress}
              </p>
            )}
            {uploadProgress >= 100 && (
              <p className="text-sm text-green-600 font-medium">
                {t.processingCompleted}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-lg bg-[#003D55] p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white hover:text-white hover:bg-white/10"
              >
                <Link to="/anomalies">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t.backToAnomalies}
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6 bg-white/30" />
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div className="text-white">{t.industrialAnomalyManagement}</div>
            </div>
            <h1 className="text-lg lg:text-xl font-bold mb-4 text-white truncate">
              {t.reportNewAnomaly}
            </h1>
            <div className="text-white/90 text-sm">{t.documentAndClassify}</div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={upLoadAnomalies}
              className="border-white/30 text-white hover:text-white hover:bg-white/20 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.uploadFile}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* File Upload Section */}
        <Card className="relative overflow-hidden hover-lift modern-shadow-lg  border-border/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-taqa-primary/10 to-taqa-secondary/10 rounded-full -translate-y-16 translate-x-16" />

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-heading">
              <div className="p-2 bg-blue-300 rounded-xl shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              {t.fileUploadAndAnalysis}
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              {t.uploadTechnicalDocumentation}
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-taqa-primary/50 transition-colors group cursor-pointer"
              onClick={upLoadAnomalies}
            >
              <div className="p-4 bg-taqa-primary/10 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-taqa-primary/20 transition-colors">
                <Plus className="h-8 w-8 text-taqa-primary mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t.uploadTechnicalFile}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.dragAndDropOrClick}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">
                  xlsx
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  xls
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  csv
                </Badge>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={imageRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
        {/* Manual Entry Section */}
        <ManualAnomalyForm />
      </div>
    </div>
  );
};

export default CreateAnomaly;
