"use client";
import { OrderItem } from "@/components/custom/OrderItem";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import OrderDetail from "@/components/custom/OrderDetail";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, Timestamp, orderBy, where, QueryFieldFilterConstraint, QueryConstraint } from "firebase/firestore";
import { useFireStore } from "../utils/firebase";
import { format } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface OrderHistoryItem {
  items: OrderItem[];
  order_create_datetime: Timestamp;
  order_payment_method: "transfer" | "cash";
}

const today = new Date();
today.setHours(0, 0, 0, 0);

function OrderHistory() {
  const fireStore = useFireStore();
  const [loading, setLoading] = useState(true);
  const [orderHistoryList, setOrderHistoryList] = useState<OrderHistoryItem[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({ from: today });
  const [brand, setBrand] = useState("0");

  const fetchOrderHistory = async () => {
    setLoading(true);
    const firebase_query: QueryConstraint[] = [];
    if (date?.from) firebase_query.push(where("order_create_datetime", ">=", date?.from));
    if (date?.to) {
      const tempDateTo = addDays(date?.to, 1);
      tempDateTo.setHours(0, 0, 0, 0);
      firebase_query.push(where("order_create_datetime", "<=", tempDateTo));
    } else if (date?.from) {
      const tmr = addDays(date?.from, 1);
      tmr.setHours(0, 0, 0, 0);
      firebase_query.push(where("order_create_datetime", "<=", tmr));
    }
    firebase_query.push(orderBy("order_create_datetime", 'desc'))
    const q = query(collection(fireStore, "orders"), ...firebase_query);
    const docSnapShot = await getDocs(q);
    const result: OrderHistoryItem[] = [];
    docSnapShot.forEach((doc) => {
      result.push(doc.data() as OrderHistoryItem);
    });
    setOrderHistoryList(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [date]);

  const sellHistoryFilter = useMemo(() => {
    if (brand === "0") return orderHistoryList;
    return orderHistoryList.filter((item) =>
      item.items.find((item) => {
        console.log(item.product_brand === brand);
        return item.product_brand === brand;
      })
    );
  }, [orderHistoryList, brand]);

  const totalIncome = useMemo(() => {
    const result = sellHistoryFilter.reduce(
      (prev, nextOrder) =>
        prev + nextOrder.items.reduce((prevItemSum, nextItemSum) => prevItemSum + nextItemSum.product_price * nextItemSum.quatity, 0),
      0
    );
    return result;
  }, [sellHistoryFilter]);

  const totalTransfer = useMemo(() => {
    const result = sellHistoryFilter
      .filter((item) => item.order_payment_method === "transfer")
      .reduce(
        (prev, nextOrder) =>
          prev + nextOrder.items.reduce((prevItemSum, nextItemSum) => prevItemSum + nextItemSum.product_price * nextItemSum.quatity, 0),
        0
      );
    return result;
  }, [sellHistoryFilter]);
  const totalCash = useMemo(() => {
    const result = sellHistoryFilter
      .filter((item) => item.order_payment_method === "cash")
      .reduce(
        (prev, nextOrder) =>
          prev + nextOrder.items.reduce((prevItemSum, nextItemSum) => prevItemSum + nextItemSum.product_price * nextItemSum.quatity, 0),
        0
      );
    return result;
  }, [sellHistoryFilter]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const exportOrder = async () => {
    const csvData = [
      [
        "Order No",
        "Sales date",
        "Product Name",
        "Brand",
        "Product Category",
        "Product Price",
        "Quantity",
        "Total Price",
        "Accumulated Income",
        "Payment Method",
      ],
    ];
    let totalIncome = 0;
    for (let i = 0; i < sellHistoryFilter.length; i++) {
      const element = sellHistoryFilter[i];
      for (let j = 0; j < element.items.length; j++) {
        const temp: string[] = [(i + 1).toString(), format(element.order_create_datetime.toDate(), "dd/MM/yy")];
        const value = element.items[j];
        totalIncome += value.product_price * value.quatity;
        temp.push(value.product_name);
        temp.push(value.product_brand);
        temp.push(value.product_category);
        temp.push(value.product_price.toString());
        temp.push(value.quatity.toString());
        temp.push((value.product_price * value.quatity).toString());
        temp.push(`${totalIncome}`);
        temp.push(element.order_payment_method);
        csvData.push(temp);
      }
    }
    console.log(csvData);
    let csvContent = "";
    csvData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", objUrl);
    link.setAttribute("download", "order-history.csv");

    // const linkEl = document.querySelector("body")!.append(link)
    link.click();
  };

  return (
    <main className="min-h-screen p-6">
      <Link href="/">
        <Button variant="link" className="mb-5">
          Back to Home
        </Button>
      </Link>
      <div>
        <div className="flex justify-between">
          <h1 className="text-4xl mb-4">Order History</h1>
          <Button onClick={exportOrder}>export</Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Total</p>
            <p>$ {totalIncome.toLocaleString("us-Us")}</p>
          </div>
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Transfer Total</p>
            <p>$ {totalTransfer.toLocaleString("us-Us")}</p>
          </div>
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Cash Total</p>
            <p>$ {totalCash.toLocaleString("us-Us")}</p>
          </div>
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Total Order</p>
            <p>{sellHistoryFilter.length.toLocaleString("us-Us")}</p>
          </div>
        </div>
        <div className="border border-primary rounded-xl p-6 ">
          <div className="flex items-center">
            <div className="w-[100px]">
              <p className="mr-4">Days</p>
            </div>
            <DatePickerWithRange value={date} onChange={setDate} />
          </div>
          <div className="flex items-center mt-2">
            <div className="w-[100px]">
              <p className="mr-4">brands</p>
            </div>
            <Select value={brand} onValueChange={(e) => setBrand(e)}>
              <SelectTrigger className="w-[300px] border-foreground">
                <SelectValue placeholder="brand...."></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">brand....</SelectItem>
                <SelectItem value="Bebpo">Bebpo</SelectItem>
                <SelectItem value="Gerro">Gerro</SelectItem>
                <SelectItem value="Peko">Peko</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Create Time</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Order Total Quatity</TableHead>
              <TableHead>Order Total price</TableHead>
              <TableHead>Order Total Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellHistoryFilter.map((item) => (
              <TableRow key={item.order_create_datetime.toMillis()}>
                <TableCell>{format(item.order_create_datetime.toDate(), "dd/mm/yy HH:mm")}</TableCell>
                <TableCell>{item.order_payment_method}</TableCell>
                <TableCell>{item.items.reduce((prev, next) => prev + next.quatity, 0)}</TableCell>
                <TableCell>{item.items.reduce((prev, next) => prev + next.product_price * next.quatity, 0).toLocaleString("us-Us")}</TableCell>
                <TableCell>
                  <OrderDetail orderItems={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell>
                {sellHistoryFilter
                  .reduce(
                    (prev, next) => prev + next.items.reduce((prevItem, nextItem) => prevItem + nextItem.product_price * nextItem.quatity, 0),
                    0
                  )
                  .toLocaleString("us-Us")}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}

export default OrderHistory;
