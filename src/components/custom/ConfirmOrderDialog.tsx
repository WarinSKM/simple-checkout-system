import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface ConfirmOrderDialog {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmOrderDialog({ open, onCancel, onConfirm }: ConfirmOrderDialog) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันคำสั่งซื้อ ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button onClick={onConfirm}>ยืนยัน</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmOrderDialog;
