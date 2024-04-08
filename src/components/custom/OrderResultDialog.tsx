import { FormEventHandler, forwardRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { OrderItem } from "./OrderItem";
import { QrCode, Banknote } from "lucide-react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindcssConfig from "@/../tailwind.config";
import ConfirmOrderDialog from "./ConfirmOrderDialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderResultDialogProps {
  orderItems: OrderItem[];
}

function OrderResultDialog({ orderItems }: OrderResultDialogProps) {
  const fullConfig = resolveConfig(tailwindcssConfig);
  const [open, setOpen] = useState(false);
  const [payMethod, setPaymethod] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radioRequire, setRadioRequire] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const OrderItem = ({ title, quatity, price }: OrderItem) => {
    return (
      <li className="border-b-[1px] mb-3 px-4 py-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg">
              {title} <span className="text-xs ml-2">x{quatity}</span>
            </p>
          </div>
          <p>฿ {quatity * price}</p>
        </div>
      </li>
    );
  };

  useEffect(() => {
    if (open) {
      setPaymethod("");
      setSubmitCount(0);
    }
  }, [open]);

  const openConfirmDialog = () => {
    setSubmitCount((prev) => prev + 1);
    if (!payMethod) {
      setRadioRequire(true);
      return;
    }
    setOpenConfirm(true);
  };
  const onCancelDialog = () => {
    setOpenConfirm(false);
  };
  const onConfirm = async () => {
    setOpenConfirm(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
  };
  const onCancel = async () => {
    setOpen(false);
  };

  return (
    <>
      <ConfirmOrderDialog open={openConfirm} onConfirm={onConfirm} onCancel={onCancelDialog} />
      <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogTrigger asChild>
          <Button disabled={orderItems.length === 0}>Checkout</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>
          <div className="">
            <ol>
              {orderItems.map((item) => (
                <OrderItem key={item.title} {...item} />
              ))}
            </ol>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-4xl">Total</p>
            <p className="text-4xl">฿ {orderItems.reduce((prev, nextItem) => prev + nextItem.price * nextItem.quatity, 0)}</p>
          </div>
          <div className="flex items-center justify-center">
            <RadioGroup
              value={payMethod}
              onValueChange={(e) => {
                setRadioRequire(false);
                setPaymethod(e);
              }}
              className="flex"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" className="hidden peer" />
                <Label
                  htmlFor="r1"
                  className={cn(
                    `
              border border-primary rounded-xl w-28 h-28 flex flex-col justify-center items-center text-primary cursor-pointer
              peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:bg-primary
              `,
                    radioRequire && submitCount !== 0 && "border-destructive text-destructive animate-shake"
                  )}
                >
                  <QrCode className="mb-2" width={35} height={35} />
                  <p>TRANFER</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" className="hidden peer" />
                <Label
                  htmlFor="r2"
                  className={cn(
                    `
              border border-primary rounded-xl w-28 h-28 flex flex-col justify-center items-center text-primary cursor-pointer
              peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:bg-primary
              `,
                    radioRequire && submitCount !== 0 && "border-destructive text-destructive animate-shake"
                  )}
                >
                  <Banknote className="mb-2" width={35} height={35} />
                  CASH
                </Label>
              </div>
            </RadioGroup>
          </div>
          {radioRequire && submitCount !== 0 && <p className="text-destructive animate-shake text-center">กรุณาเลือกวิธีการชำระเงิน</p>}
          <div className="flex items-center justify-between mt-6">
            <Button variant="muted" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={openConfirmDialog}>{loading ? <Loader2 className="animate-spin" /> : "Confirm"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderResultDialog;
