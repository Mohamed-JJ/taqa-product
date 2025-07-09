import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

interface RexReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadNowClick: () => void;
}

export const RexReminderDialog = ({
  open,
  onOpenChange,
  onUploadNowClick
}: RexReminderDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-taqa-orange" />
            REX Upload Required
          </DialogTitle>
          <DialogDescription>
            This anomaly is closed but doesn't have a Return of Experience (REX) document. Please upload the REX to complete the documentation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Remind me later
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onUploadNowClick();
            }}
            className="bg-taqa-orange hover:bg-taqa-orange/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload REX now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 