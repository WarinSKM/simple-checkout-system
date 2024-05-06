"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { QrCode, Banknote } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useEffect, useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { useFireStore } from "../utils/firebase";
import { collection, getDocs, orderBy, query, QueryConstraint, Timestamp, where } from "firebase/firestore";
import { addDays, format } from "date-fns";
import { createObjectCsvWriter } from "csv-writer";
import axios from "axios";

export interface SaleSummaryItem {
  product_name: string;
  total_sale: number;
  price: number;
  brand: string;
  date: Date;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

function SellSummary() {
  const [date, setDate] = useState<DateRange | undefined>({ from: today });
  const [loading, setLoading] = useState(true);
  const [sellHistory, setSellHistory] = useState<SaleSummaryItem[]>([]);
  const [brand, setBrand] = useState("0");

  const fetchTotalSale = async () => {
    setLoading(true);
    const res = await axios.get("/api/sale-summary", { params: { date_from: date?.from, date_to: date?.to, brand } });
    setSellHistory(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalSale();
  }, []);
  useEffect(() => {
    fetchTotalSale();
  }, [brand, date]);

  const createCSV = async () => {
    const csvData = [["Product name", "Sales date", "Quantity", "Price per unit", "Total price", "Accumulated Income"]];
    let accumulatedIncome = 0;
    for (let i = 0; i < sellHistory.length; i++) {
      const element = sellHistory[i];
      accumulatedIncome = accumulatedIncome + element.total_sale * element.price;
      const temp = [
        element.product_name,
        format(element.date, "dd/MM/yy"),
        element.total_sale.toString(),
        element.price.toString(),
        (element.total_sale * element.price).toString(),
        accumulatedIncome.toString(),
      ];
      csvData.push(temp);
    }
    let csvContent = "";
    csvData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", objUrl);
    link.setAttribute("download", "sale-summary.csv");

    // const linkEl = document.querySelector("body")!.append(link)
    link.click();
  };

  return (
    <main className="p-6">
      <Link href="/">
        <Button className="mb-5" variant="link">
          Back to Home
        </Button>
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Sale Summary</h1>
        <Button onClick={createCSV}>Export</Button>
      </div>
      <div>
        <div className="my-4 border border-foreground grid grid-cols-1 md:grid-cols-2 p-6 rounded-lg">
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
              <TableHead>Product Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Product Sold</TableHead>
              <TableHead>Totol income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellHistory.map((item) => (
              <TableRow key={item.product_name}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{format(item.date, "dd/MM/yy")}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.total_sale}</TableCell>
                <TableCell>{(item.price * item.total_sale).toLocaleString("us-Us")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
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
