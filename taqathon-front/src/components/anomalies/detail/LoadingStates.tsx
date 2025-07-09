import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Loading anomaly details..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="text-muted-foreground">{message}</span>
      </div>
    </div>
  );
};

interface AnomalyNotFoundProps {
  onBackClick: () => void;
  title?: string;
  message?: string;
  backButtonText?: string;
}

export const AnomalyNotFound = ({ 
  onBackClick, 
  title = "Anomaly Not Found",
  message = "The requested anomaly could not be found.",
  backButtonText = "Back to Anomalies"
}: AnomalyNotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <XCircle className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
      <Button onClick={onBackClick} variant="outline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {backButtonText}
      </Button>
    </div>
  );
};

interface StatusUpdateOverlayProps {
  isVisible: boolean;
}

export const StatusUpdateOverlay = ({ isVisible }: StatusUpdateOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[400px] h-[150px] p-6 shadow-2xl flex flex-col items-center gap-4 border border-gray-200">
        <div className="relative">
          <div className="w-10 h-10 border-4 border-taqa-primary/20 border-t-taqa-primary rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-10 h-10 border-4 border-transparent border-r-taqa-secondary rounded-full animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Updating Status
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we update the anomaly status...
          </p>
        </div>
      </div>
    </div>
  );
}; 