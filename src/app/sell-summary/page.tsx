"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PaymentMethod } from "../type";
import { QrCode, Banknote } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useEffect, useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { useFireStore } from "../utils/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

interface SaleSummaryItem {
  product_name: string;
  total_sale: number;
  price: number;
  payment_method: PaymentMethod;
  brand: string;
  date: Timestamp;
}

function SellSummary() {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [sellHistory, setSellHistory] = useState<SaleSummaryItem[]>([]);

  const fireStore = useFireStore();

  const fetchTotalSale = async () => {
    setLoading(true);
    const q = query(collection(fireStore, "sale_total"), orderBy("product_name", "asc"));
    const docSnapShot = await getDocs(q);
    const result: SaleSummaryItem[] = [];
    docSnapShot.forEach((doc) => {
      result.push(doc.data() as SaleSummaryItem);
    });
    setSellHistory(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalSale();
  }, []);

  return (
    <main className="p-6">
      <Link href="/">
        <Button className="mb-5" variant="link">
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl">Sale Summary</h1>
      <div>
        <div className="my-4 border border-foreground grid grid-cols-2 p-6 rounded-lg">
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
            <Select>
              <SelectTrigger className="w-[300px] border-foreground">
                <SelectValue placeholder="brand...."></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">brand....</SelectItem>
                <SelectItem value="Beppo">Bebpo</SelectItem>
                <SelectItem value="Gerro">Gerro</SelectItem>
                <SelectItem value="Pekko">Peko</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center mt-2">
            <div className="w-[100px]">
              <p className="mr-4">Payment Method</p>
            </div>
            <Select>
              <SelectTrigger className="w-[200px] border-foreground">
                <SelectValue placeholder="Payment Method...."></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Payment Method....</SelectItem>
                <SelectItem value="tranfer">tranfer</SelectItem>
                <SelectItem value="cash">cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Product Sold</TableHead>
              <TableHead>Totol income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellHistory.map((item) => (
              <TableRow key={item.product_name + item.payment_method}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <p className="block w-14">{item.payment_method}</p>
                    {item.payment_method === "tranfer" ? <QrCode /> : <Banknote />}
                  </div>
                </TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.total_sale}</TableCell>
                <TableCell>{(item.price * item.total_sale).toLocaleString("us-Us")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <p className="text-2xl">Total</p>
              </TableCell>
              <TableCell className="text-2xl">{sellHistory.reduce((prev, nextVal) => prev + nextVal.price * nextVal.total_sale, 0)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}

export default SellSummary;
