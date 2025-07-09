import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Upload } from "lucide-react";
import { RexForm } from "../../../../hooks/useAnomalyDetails";

interface RexUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rexForm: RexForm;
  setRexForm: (form: RexForm) => void;
  onSubmit: () => void;
  onDownloadTemplate: () => void;
  anomalyT: any;
  commonT: any;
}

export const RexUploadDialog = ({
  open,
  onOpenChange,
  rexForm,
  setRexForm,
  onSubmit,
  onDownloadTemplate,
  anomalyT,
  commonT
}: RexUploadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-taqa-primary" />
            {anomalyT.uploadRexTitle}
          </DialogTitle>
          <DialogDescription>
            {anomalyT.uploadRexDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="rex-attachments">{anomalyT.rexAttachmentsLabel}</Label>
            <Input
              id="rex-attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const validFiles: File[] = [];
                const maxSizeInMB = 10;
                const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
                
                // Validate file types and sizes
                for (const file of files) {
                  // Check file type
                  const allowedTypes = [
                    'text/plain',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  ];
                  
                  const fileExtension = file.name.toLowerCase().split('.').pop();
                  const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];
                  
                  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
                    alert(`Invalid file type: ${file.name}. Only text documents are allowed.`);
                    continue;
                  }
                  
                  // Check file size
                  if (file.size > maxSizeInBytes) {
                    alert(`File too large: ${file.name}. Maximum size is ${maxSizeInMB}MB.`);
                    continue;
                  }
                  
                  validFiles.push(file);
                }
                
                setRexForm({ ...rexForm, attachments: validFiles });
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Accepted formats: PDF, DOC, DOCX, TXT (Max 10MB each)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {commonT.cancel}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!rexForm.attachments || rexForm.attachments.length === 0}
            >
              <Upload className="h-4 w-4 mr-2" />
              {anomalyT.uploadRex}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 