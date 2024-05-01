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

export interface OrderHistoryItem {
  items: OrderItem[];
  order_create_datetime: Timestamp;
  order_payment_method: "tranfer" | "cash";
}

const today = new Date();
today.setHours(0, 0, 0, 0);

function OrderHistory() {
  const fireStore = useFireStore();
  const [loading, setLoading] = useState(true);
  const [orderHistoryList, setOrderHistoryList] = useState<OrderHistoryItem[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({ from: today });

  const fetchOrderHistory = async () => {
    setLoading(true);
    const firebase_query: QueryConstraint[] = [];
    if (date?.from) firebase_query.push(where("order_create_datetime", ">=", date?.from));
    if (date?.to){
      const tempDateTo = addDays(date?.to, 1)
      tempDateTo.setHours(0,0,0,0)
       firebase_query.push(where("order_create_datetime", "<=", tempDateTo));
      }
    else if (date?.from) {
      const tmr = addDays(date?.from, 1);
      tmr.setHours(0, 0, 0, 0);
      firebase_query.push(where("order_create_datetime", "<=", tmr));
    }
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

  const totalIncome = useMemo(() => {
    const result = orderHistoryList.reduce(
      (prev, nextOrder) =>
        prev + nextOrder.items.reduce((prevItemSum, nextItemSum) => prevItemSum + nextItemSum.product_price * nextItemSum.quatity, 0),
      0
    );
    return result;
  }, [orderHistoryList]);

  const totalTranfer = useMemo(() => {
    const result = orderHistoryList
      .filter((item) => item.order_payment_method === "tranfer")
      .reduce(
        (prev, nextOrder) =>
          prev + nextOrder.items.reduce((prevItemSum, nextItemSum) => prevItemSum + nextItemSum.product_price * nextItemSum.quatity, 0),
        0
      );
    return result;
  }, [orderHistoryList]);
  const totalCash = useMemo(() => {
    const result = orderHistoryList
      .filter((item) => item.order_payment_method === "cash")
      .reduce(
        (prev, nextOrder) =>
          prev + nextOrder.items.reduce((prevItemSum, nextItemSum) => prevItemSum + nextItemSum.product_price * nextItemSum.quatity, 0),
        0
      );
    return result;
  }, [orderHistoryList]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <Link href="/">
        <Button variant="link" className="mb-5">
          Back to Home
        </Button>
      </Link>
      <div>
        <h1 className="text-4xl mb-4">Order History</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Total</p>
            <p>$ {totalIncome.toLocaleString("us-Us")}</p>
          </div>
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Tranfer Total</p>
            <p>$ {totalTranfer.toLocaleString("us-Us")}</p>
          </div>
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Cash Total</p>
            <p>$ {totalCash.toLocaleString("us-Us")}</p>
          </div>
          <div className="border border-primary rounded-xl p-4 text-2lx">
            <p>Total Order</p>
            <p>{orderHistoryList.length.toLocaleString("us-Us")}</p>
          </div>
        </div>
        <div className="border border-primary rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-[100px]">
              <p className="mr-4">Days</p>
            </div>
            <DatePickerWithRange value={date} onChange={setDate} />
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
            {orderHistoryList.map((item) => (
              <TableRow key={item.order_create_datetime.toMillis()}>
                <TableCell>{format(item.order_create_datetime.toDate(), "dd/mm/yy hh:mm")}</TableCell>
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
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell>
                {orderHistoryList
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
