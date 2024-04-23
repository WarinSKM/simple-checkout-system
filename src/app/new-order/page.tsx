"use client";
import OrderItem from "@/components/custom/OrderItem";
import ProductCard, { ProductInfo } from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindcssConfig from "@/../tailwind.config";
import OrderResultDialog from "@/components/custom/OrderResultDialog";
import Link from "next/link";
import { useFireStore } from "../utils/firebase";
import { query, collection, getDocs, addDoc, updateDoc, increment, doc, getDoc, setDoc, where, orderBy } from "firebase/firestore";
import { PaymentMethod } from "../type";
import { ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface OrderItem extends ProductInfo {
  quatity: number;
}

function NewOrder() {
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const config = resolveConfig(tailwindcssConfig);
  const fireStore = useFireStore();

  const productNormal = useMemo(() => {
    return productList.filter((item) => item.product_category === "normal");
  }, [productList]);
  const productDiscount = useMemo(() => {
    return productList.filter((item) => item.product_category === "discount");
  }, [productList]);
  const productFree = useMemo(() => {
    return productList.filter((item) => item.product_category === "free");
  }, [productList]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const q = query(collection(fireStore, "products"), orderBy("product_name", "asc"));
    const docSnapShot = await getDocs(q);
    const result: ProductInfo[] = [];
    docSnapShot.forEach((doc) => {
      result.push({ ...(doc.data() as ProductInfo), product_id: doc.id });
    });
    setProductList(result);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const test = useQuery({
  //   queryKey: ["products"],
  //   queryFn: fetchProducts,
  // });

  // const productList: ProductInfo[] = [
  //   { title: "Bandana S", price: 90, imageUrl: "" },
  //   { title: "Bandana M", price: 120, imageUrl: "" },
  //   { title: "Bandana L", price: 140, imageUrl: "" },
  //   { title: "Bandana XL", price: 160, imageUrl: "" },
  //   { title: "[Free]Bandana S", price: 0, imageUrl: "" },
  //   { title: "[Free]Bandana M", price: 0, imageUrl: "" },
  //   { title: "[Free]Bandana L", price: 0, imageUrl: "" },
  //   { title: "[Free]Bandana XL", price: 0, imageUrl: "" },
  //   { title: "Shampoo Gerro", price: 440, imageUrl: "" },
  //   { title: "Serum Gerro", price: 360, imageUrl: "" },
  //   { title: "Pekko น้ำมันแซลม่อน", price: 360, imageUrl: "" },
  //   { title: "Pekko ปลากรอบ", price: 360, imageUrl: "" },
  // ];

  const [orderList, setOrderList] = useState<OrderItem[]>([]);

  const addProductToOrder = (e: ProductInfo) => {
    const orderIndex = orderList.findIndex((item) => item.product_name === e.product_name);
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
      setOrderList(tempOrderList.filter((item) => item.product_name !== orderItem.product_name));
    }
  };

  const clearOrder = () => {
    setOrderList([]);
  };

  const updateProductTotal = async (paymentMethod: PaymentMethod) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < orderList.length; i++) {
      const element = orderList[i];
      const q = query(
        collection(fireStore, "sale_total"),
        where("date", "==", today),
        where("payment_method", "==", paymentMethod),
        where("product_name", "==", element.product_name)
      );
      // doc(fireStore, "sale_total");
      // const collQ = collection(fireStore, "sale_total", element.product_brand, format(today, "yyyy-MM-dd"), paymentMethod, element.product_name);
      const tempDoc = await getDocs(q);
      if (!tempDoc.empty) {
        const docQ = doc(fireStore, "sale_total", tempDoc.docs[0].id);
        await updateDoc(docQ, {
          total_sale: increment(element.quatity),
        });
      } else {
        await addDoc(collection(fireStore, "sale_total"), {
          brand: element.product_brand,
          date: today,
          payment_method: paymentMethod,
          price: element.product_price,
          product_name: element.product_name,
          total_sale: element.quatity,
        });
      }
    }
  };

  const createOrder = async (paymentMethod: PaymentMethod) => {
    const day = new Date();
    await updateProductTotal(paymentMethod);
    const orderResult = orderList.map((item) => {
      const temp = { ...item };
      delete temp.product_id;
      return { ...temp };
    });
    await addDoc(collection(fireStore, "orders"), {
      order_create_datetime: day,
      order_payment_method: paymentMethod,
      items: orderResult,
    });

    clearOrder();
  };

  return (
    <main className="min-h-screen p-6 flex flex-col">
      <div className="col-span-full h-fit mb-5">
        <Link href="/">
          <Button variant="link" className="">
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-4 relative flex-grow">
        <Card className="">
          <CardHeader>
            <CardTitle>Product</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            {!loadingProducts ? (
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="normal">
                  <AccordionTrigger>
                    <div className="w-full flex justify-between items-center">
                      <p>Product</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productNormal.map((product, index) => (
                        <ProductCard key={index} product={product} className="mb-4" onclick={addProductToOrder} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="discount">
                  <AccordionTrigger>
                    <div className="w-full flex justify-between items-center">
                      <p>Discount</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productDiscount.map((product, index) => (
                        <ProductCard key={index} product={product} className="mb-4" onclick={addProductToOrder} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="free">
                  <AccordionTrigger>
                    <div className="w-full flex justify-between items-center">
                      <p>Free</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productFree.map((product, index) => (
                        <ProductCard key={index} product={product} className="mb-4" onclick={addProductToOrder} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Loader2 className="animate-spin" height={50} width={50} />
            )}
          </CardContent>
        </Card>
        <Card className="sticky top-3 max-h-[95vh] overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Order</CardTitle>
            <Button variant="link" onClick={clearOrder}>
              Clear Order
            </Button>
          </CardHeader>
          <ScrollArea className="w-full mb-3 border-b-2 flex-grow">
            <div className="p-6 pt-0">
              {orderList.map((product, index) => (
                <OrderItem
                  key={product.product_name + index}
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
              Total <span>฿ {orderList.reduce((prev, val) => prev + val.product_price * val.quatity, 0).toLocaleString("us-Us")}</span>
            </p>
            <OrderResultDialog orderItems={orderList} onConfirmOrder={createOrder} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default NewOrder;
