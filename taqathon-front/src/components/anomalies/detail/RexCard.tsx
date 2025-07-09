import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Download, Upload } from "lucide-react";
import { Anomaly } from "@/types/anomaly";

interface RexCardProps {
  anomaly: Anomaly;
  onRexUploadClick: () => void;
  anomalyT: any;
}

export const RexCard = ({ anomaly, onRexUploadClick, anomalyT }: RexCardProps) => {
  const isAnomalyClosed = anomaly.status === "cloture" || anomaly.status === "CLOSED";
  const isAnomalyTreated = anomaly.status === "traitee" || anomaly.status === "TREATED";
  
  // Show REX card when status is treated or closed
  if (!isAnomalyClosed && !isAnomalyTreated) return null;

  const handleDownload = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const downloadUrl = `${backendUrl}/attachements/rex/${anomaly.id}`;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `REX_Document_${anomaly.id}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="hover-lift modern-shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50 flex flex-col">
      <CardHeader className="pb-2 px-4 py-3 flex-shrink-0">
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <FileText className="h-4 w-4 text-taqa-primary" />
          {anomalyT.rex}
          <Badge className="bg-taqa-primary/20 text-taqa-primary border-taqa-primary/30 font-bold text-xs">
            {anomaly.rex || anomaly.rexFilePath ? 1 : 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-4 pb-4 min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0">
          {anomaly.rex ? (
            <div className="space-y-1">
              <div className="p-1 bg-muted/20 rounded border border-border/50">
                <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                  {anomalyT.summary}
                </label>
                <p className="text-xs line-clamp-1">{anomaly.rex.summary}</p>
              </div>
              <div className="p-1 bg-muted/20 rounded border border-border/50">
                <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                  {anomalyT.rootCause}
                </label>
                <p className="text-xs line-clamp-1">{anomaly.rex.rootCause}</p>
              </div>
              <div className="p-1 bg-muted/20 rounded border border-border/50">
                <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                  {anomalyT.correctionAction}
                </label>
                <p className="text-xs line-clamp-1">{anomaly.rex.correctionAction}</p>
              </div>
              <div className="p-1 bg-muted/20 rounded border border-border/50">
                <label className="text-xs font-medium text-muted-foreground block mb-0.5">
                  {anomalyT.preventiveAction}
                </label>
                <p className="text-xs line-clamp-1">{anomaly.rex.preventiveAction}</p>
              </div>
            </div>
          ) : anomaly.rexFilePath ? (
            <div className="p-2 bg-taqa-green/10 rounded border border-taqa-green/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-taqa-green/20 rounded">
                    <CheckCircle className="h-3 w-3 text-taqa-green" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-foreground">REX Document</h4>
                    <p className="text-xs text-muted-foreground">Uploaded</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover-lift h-5 w-5 p-0"
                  onClick={handleDownload}
                  title="Download document"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="p-2 bg-muted/20 rounded-full mx-auto mb-2 w-8 h-8 flex items-center justify-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {anomalyT.noRex}
              </p>
            </div>
          )}
        </div>
        {!anomaly.rex && !anomaly.rexFilePath && (
          <div className="mt-2 pt-2 border-t border-border/50 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onRexUploadClick}
              className="w-full hover-lift modern-shadow bg-taqa-orange/10 border-taqa-orange/30 text-taqa-orange hover:bg-taqa-orange/20 h-8 text-sm"
            >
              <Upload className="h-3 w-3 mr-1" />
              {anomalyT.uploadRex}
              {isAnomalyTreated && (
                <span className="ml-1 text-xs">(Required to close)</span>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 