import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface RexDocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anomalyId: string | number;
  anomalyT: any;
}

export const RexDocumentViewer = ({
  open,
  onOpenChange,
  anomalyId,
  anomalyT
}: RexDocumentViewerProps) => {
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [documentType, setDocumentType] = useState<string>("");

  useEffect(() => {
    if (open && anomalyId) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${backendUrl}/attachements/rex/${anomalyId}`;
      setDocumentUrl(url);
      setIsLoading(true);
      setError("");
      
      // Try to determine document type
      fetch(url, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            const contentType = response.headers.get('content-type') || '';
            setDocumentType(contentType);
            setError("");
          } else {
            setError("Document not found or failed to load");
          }
        })
        .catch(() => {
          setError("Failed to load document");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, anomalyId]);

  const handleDownload = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const downloadUrl = `${backendUrl}/attachements/rex/${anomalyId}`;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `REX_Document_${anomalyId}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const url = `${backendUrl}/attachements/rex/${anomalyId}`;
    window.open(url, '_blank');
  };

  const renderDocumentContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-taqa-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Document Not Available</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Try Download
            </Button>
          </div>
        </div>
      );
    }

    // For PDF files, use iframe
    if (documentType.includes('pdf')) {
      return (
        <div className="h-96 w-full">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0 rounded"
            title="REX Document"
          />
        </div>
      );
    }

    // For text files, try to fetch and display content
    if (documentType.includes('text')) {
      return (
        <div className="h-96 w-full">
          <iframe
            src={documentUrl}
            className="w-full h-full border-0 rounded bg-white p-4"
            title="REX Document"
          />
        </div>
      );
    }

    // For other document types, show preview option
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="h-16 w-16 text-taqa-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
          <p className="text-muted-foreground mb-4">
            This document type cannot be previewed directly in the browser.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleOpenExternal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-taqa-primary" />
            REX Document Viewer
          </DialogTitle>
          <DialogDescription>
            Viewing REX document for anomaly #{anomalyId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document viewer area */}
          {renderDocumentContent()}
          
          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleOpenExternal} variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 