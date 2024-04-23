"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "../ui/dialog";
import { OrderItem } from "./OrderItem";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindcssConfig from "@/../tailwind.config";
import { OrderHistoryItem } from "@/app/order-history/page";

interface OrderDetailProps {
  orderItems: OrderHistoryItem;
}

function OrderDetail({ orderItems }: OrderDetailProps) {
  const fullConfig = resolveConfig(tailwindcssConfig);
  const [open, setOpen] = useState(false);

  const OrderItem = ({ product_name, quatity, product_price }: OrderItem) => {
    return (
      <li className="border-b-[1px] mb-3 px-4 py-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg">
              {product_name} <span className="text-xs ml-2">x{quatity}</span>
            </p>
          </div>
          <p>฿{quatity * product_price}</p>
        </div>
      </li>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
        <DialogTrigger asChild>
          <Button variant="link">More detail</Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>
          <div className="">
            <ol>
              {orderItems.items.map((item) => (
                <OrderItem key={item.product_name} {...item} />
              ))}
            </ol>
          </div>
          <div className="flex items-center justify-between">
            <p>Total</p>
            <p>฿{orderItems.items.reduce((prev, nextItem) => prev + nextItem.product_price * nextItem.quatity, 0)}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrderDetail;
