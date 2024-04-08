"use client";
import OrderItem from "@/components/custom/OrderItem";
import ProductCard, { ProductInfo } from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import Swal from "sweetalert2";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindcssConfig from "@/../tailwind.config";
import OrderResultDialog from "@/components/custom/OrderResultDialog";
import Link from "next/link";

interface OrderItem extends ProductInfo {
  quatity: number;
}

function NewOrder() {
  const config = resolveConfig(tailwindcssConfig);

  const productList: ProductInfo[] = [
    { title: "Bandana S", price: 90, imageUrl: "" },
    { title: "Bandana M", price: 120, imageUrl: "" },
    { title: "Bandana L", price: 140, imageUrl: "" },
    { title: "Bandana XL", price: 160, imageUrl: "" },
    { title: "[Free]Bandana S", price: 0, imageUrl: "" },
    { title: "[Free]Bandana M", price: 0, imageUrl: "" },
    { title: "[Free]Bandana L", price: 0, imageUrl: "" },
    { title: "[Free]Bandana XL", price: 0, imageUrl: "" },
    { title: "Shampoo Gerro", price: 440, imageUrl: "" },
    { title: "Serum Gerro", price: 360, imageUrl: "" },
    { title: "Pekko น้ำมันแซลม่อน", price: 360, imageUrl: "" },
    { title: "Pekko ปลากรอบ", price: 360, imageUrl: "" },
  ];

  const [orderList, setOrderList] = useState<OrderItem[]>([]);

  const addProductToOrder = (e: ProductInfo) => {
    const orderIndex = orderList.findIndex((item) => item.title === e.title);
    if (orderIndex !== -1) {
      onAddOrder(orderList[orderIndex], orderIndex);
      return;
    }
    setOrderList((prev) => [...prev, { ...e, quatity: 1 }]);
  };

  const onAddOrder = (orderItem: OrderItem, index: number) => {
    const tempOrder: OrderItem = { ...orderItem, quatity: orderItem.quatity + 1 };
    const tempOrderList = [...orderList];
    tempOrderList[index] = tempOrder;
    setOrderList(tempOrderList);
  };

  const onMinusOrder = async (orderItem: OrderItem, index: number) => {
    if (orderItem.quatity - 1 === 0) {
      onRemove(orderItem, index);
    } else {
      const tempOrder: OrderItem = { ...orderItem, quatity: orderItem.quatity - 1 };
      const tempOrderList = [...orderList];
      tempOrderList[index] = tempOrder;
      setOrderList(tempOrderList);
    }
  };

  const onRemove = async (orderItem: OrderItem, index: number) => {
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการลบออกจากคำสั่งซื้อ",
      icon: "question",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      reverseButtons: true,
    });
    if (isConfirmed) {
      const tempOrderList = [...orderList];
      setOrderList(tempOrderList.filter((item) => item.title !== orderItem.title));
    }
  };

  const clearOrder = () => {
    setOrderList([]);
  };

  return (
    <main className="min-h-screen grid grid-cols-[2fr_1fr] p-6 gap-4 relative">
      <div className="col-span-2">
        <Link href="/">
          <Button variant="link" className="mb-5">
            Back to Home
          </Button>
        </Link>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle>Product</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productList.map((product, index) => (
              <ProductCard key={index} product={product} className="mb-4" onclick={addProductToOrder} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="sticky top-3 max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Order</CardTitle>
          <Button variant="link" onClick={clearOrder}>
            Clear Order
          </Button>
        </CardHeader>
        <ScrollArea className="h-[calc(95vh-94px-68px)] w-full mb-3 border-b-2">
          <div className="p-6 pt-0">
            {orderList.map((product, index) => (
              <OrderItem
                key={product.title}
                product={product}
                onAdd={() => onAddOrder(product, index)}
                onMinus={() => onMinusOrder(product, index)}
                onRemove={() => onRemove(product, index)}
                className="mb-4"
              />
            ))}
          </div>
        </ScrollArea>
        <CardFooter className="flex justify-between pb-4">
          <p className="text-3xl">
            Total <span>฿ {orderList.reduce((prev, val) => prev + val.price * val.quatity, 0).toLocaleString("us-Us")}</span>
          </p>
          <OrderResultDialog orderItems={orderList} />
        </CardFooter>
      </Card>
    </main>
  );
}

export default NewOrder;
