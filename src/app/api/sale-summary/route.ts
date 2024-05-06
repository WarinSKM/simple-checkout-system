import { NextApiRequest, NextApiResponse } from "next";
import { useFireStore } from "@/app/utils/firebase";
import { addDoc, collection, getDocs, query, QueryConstraint, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { addDays } from "date-fns";
import { SaleSummaryItem } from "@/app/sell-summary/page";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";

interface SaleSummary extends SaleSummaryItem {
  date: Date;
}

export async function GET(req: NextRequest) {
  const fireStore = useFireStore();
  let date_from_params = req.nextUrl.searchParams.get("date_from");
  let date_to_params = req.nextUrl.searchParams.get("date_to");
  const brand = req.nextUrl.searchParams.get("brand");
  let date_from: Date | null = null;
  let date_to: Date | null = null;
  if (date_from_params) date_from = new Date(date_from_params);
  if (date_to_params) date_to = new Date(date_to_params);
  const queryParams: QueryConstraint[] = [];
  if (brand !== "0") queryParams.push(where("brand", "==", brand));
  if (date_from) {
    queryParams.push(where("date", ">=", date_from));
  }
  if (date_to) {
    const tempDateTo = addDays(date_to, 1);
    tempDateTo.setHours(0, 0, 0, 0);
    queryParams.push(where("date", "<=", tempDateTo));
  } else if (date_from) {
    const tmr = addDays(date_from, 1);
    tmr.setHours(0, 0, 0, 0);
    queryParams.push(where("date", "<=", tmr));
  }
  // queryParams.push(orderBy("product_name", "asc"))
  const q = query(collection(fireStore, "sale_total"), ...queryParams);
  const docSnapShot = await getDocs(q);
  const result: SaleSummary[] = [];
  docSnapShot.forEach((doc) => {
    result.push({ ...doc.data(), date: doc.data().date.toDate() } as SaleSummary);
  });
  return Response.json(result);
}

// export async function POST(req: NextRequest, res: NextResponse) {
//   const fireStore = useFireStore();
//   let date_from_params = req.nextUrl.searchParams.get("date_from");
//   let date_to_params = req.nextUrl.searchParams.get("date_to");
//   const brand = req.nextUrl.searchParams.get("brand");
//   const paymentMethod = req.nextUrl.searchParams.get("paymentMethod");
//   let date_from: Date | null = null;
//   let date_to: Date | null = null;
//   if (date_from_params) date_from = new Date(date_from_params);
//   if (date_to_params) date_to = new Date(date_to_params);
//   const queryParams: QueryConstraint[] = [];
//   if (brand !== "0") queryParams.push(where("brand", "==", brand));
//   if (paymentMethod !== "0") queryParams.push(where("payment_method", "==", paymentMethod));
//   if (date_from) {
//     queryParams.push(where("date", ">=", date_from));
//   }
//   if (date_to) {
//     const tempDateTo = addDays(date_to, 1);
//     tempDateTo.setHours(0, 0, 0, 0);
//     queryParams.push(where("date", "<=", tempDateTo));
//   } else if (date_from) {
//     const tmr = addDays(date_from, 1);
//     tmr.setHours(0, 0, 0, 0);
//     queryParams.push(where("date", "<=", tmr));
//   }
//   // queryParams.push(orderBy("product_name", "asc"))
//   const q = query(collection(fireStore, "sale_total"), ...queryParams);
//   const docSnapShot = await getDocs(q);
//   const result: SaleSummary[] = [];
//   docSnapShot.forEach((doc) => {
//     result.push({ ...doc.data(), date: doc.data().date.toDate() } as SaleSummary);
//   });
//   console.log(res);
//   //   res.headers.append("Content-Type", "text/csv")
//   //   res.headers.append("Content-Disposition", 'attachment; filename="export.csv"');

//   // Create CSV writer
//   const csvWriter = createObjectCsvWriter({
//     path: "export.csv",
//     header: [
//       { id: "product_name", title: "Product list" },
//       { id: "date", title: "Sales date" },
//       { id: "quantity", title: "Quantity" },
//       { id: "pricePerUnit", title: "Price per unit" },
//       { id: "totalPrice", title: "Total price" },
//       { id: "accumulatedIncome", title: "Accumulated Income" },
//       { id: "paymentMethod", title: "Payment Type" },
//     ],
//   });
//   const accumulatedIncome = 0;
//   const data = result.map((item) => ({
//     product_name: item.product_name,
//     date: item.date,
//     quantity: item.total_sale,
//     pricePerUnit: item.price,
//     totalPrice: item.price * item.total_sale,
//     accumulatedIncome: accumulatedIncome + item.price * item.total_sale,
//     paymentMethod: item.payment_method,
//   }));

//   // Write data to CSV
//   await csvWriter.writeRecords(data);

//   // Stream CSV file to response
//   //   const fileStream = fs.readFileSync("export.csv");
//   return new Promise((res, rej) => {
//     fs.readFile("export.csv", (err, data) => {
//       if (err) rej(new Response(null, { status: 500, statusText: "not ok" }));

//       res(
//         new Response(data, {
//           headers: {
//             "Content-Type": "text/csv",
//             "Content-Disposition": 'attachment; filename="export.csv"',
//           },
//         })
//       );
//     });
//   });
// }

// date_from
// date_to
// brand
// paymentMethod
