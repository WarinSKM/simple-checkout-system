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
import { PaymentMethod } from "@/app/type";
import { ScrollArea } from "../ui/scroll-area";

interface OrderResultDialogProps {
  orderItems: OrderItem[];
  onConfirmOrder: (payMethod: PaymentMethod) => Promise<void>;
}

function OrderResultDialog({ orderItems, onConfirmOrder }: OrderResultDialogProps) {
  const fullConfig = resolveConfig(tailwindcssConfig);
  const [open, setOpen] = useState(false);
  const [payMethod, setPaymethod] = useState<PaymentMethod | "">("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radioRequire, setRadioRequire] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const OrderItem = ({ product_name, quatity, product_price }: OrderItem) => {
    return (
      <li className="border-b-[1px] mb-3 px-4 py-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg">
              {product_name} <span className="text-xs ml-2">x{quatity}</span>
            </p>
          </div>
          <p>฿ {quatity * product_price}</p>
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
    await onConfirmOrder(payMethod as PaymentMethod);
    setLoading(false);
    setOpen(false);
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
        <DialogContent className="max-h-screen">
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] md:h-[350px] lg:h-full mb-3 border-b-2 flex-grow">
            <div className="h-full">
              <ol>
                {orderItems.map((item) => (
                  <OrderItem key={item.product_name} {...item} />
                ))}
              </ol>
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between">
            <p className="text-4xl">Total</p>
            <p className="text-4xl">฿ {orderItems.reduce((prev, nextItem) => prev + nextItem.product_price * nextItem.quatity, 0)}</p>
          </div>
          <div className="flex items-center justify-center">
            <RadioGroup
              value={payMethod}
              onValueChange={(e) => {
                setRadioRequire(false);
                setPaymethod(e as PaymentMethod);
              }}
              className="flex"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="r1" className="hidden peer" />
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
                  <p>TRANSFER</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="r2" className="hidden peer" />
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
