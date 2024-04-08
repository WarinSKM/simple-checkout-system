import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

function SellSummary() {
  const sellHistory = [
    {
      title: "Bandana S",
      quatity: 100,
      originalPrice: 90,
    },
    {
      title: "Bandana M",
      quatity: 100,
      originalPrice: 120,
    },
    {
      title: "Bandana L",
      quatity: 100,
      originalPrice: 140,
    },
    {
      title: "Bandana XL",
      quatity: 100,
      originalPrice: 160,
    },
    {
      title: "[Free]Bandana S",
      quatity: 100,
      originalPrice: 0,
    },
  ];

  return (
    <main className="p-6">
      <Link href="/">
        <Button className="mb-5" variant="link">
          Back to Home
        </Button>
      </Link>
      <h1 className="text-4xl">Sell Summary</h1>
      <div>
        <div className="my-4 border border-foreground grid grid-cols-2 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="w-[100px]">
              <p className="mr-4">Days</p>
            </div>
            <Select defaultValue="0">
              <SelectTrigger className="w-[200px] border-foreground">
                <SelectValue placeholder="Day...."></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Day....</SelectItem>
                <SelectItem value="1">Day 1</SelectItem>
                <SelectItem value="2">Day 2</SelectItem>
                <SelectItem value="3">Day 3</SelectItem>
                <SelectItem value="4">Day 4</SelectItem>
                <SelectItem value="5">Day 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center mt-2">
            <div className="w-[100px]">
              <p className="mr-4">brands</p>
            </div>
            <Select>
              <SelectTrigger className="w-[200px] border-foreground">
                <SelectValue placeholder="brand...."></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">brand....</SelectItem>
                <SelectItem value="Beppo">Beppo</SelectItem>
                <SelectItem value="Gerro">Gerro</SelectItem>
                <SelectItem value="Pekko">Pekko</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Sold</TableHead>
              <TableHead>Totol income</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellHistory.map((item) => (
              <TableRow key={item.title}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.quatity}</TableCell>
                <TableCell>{(item.originalPrice * item.quatity).toLocaleString("us-Us")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                <p className="text-2xl">Total</p>
              </TableCell>
              <TableCell className="text-2xl">{sellHistory.reduce((prev, nextVal) => prev + nextVal.originalPrice * nextVal.quatity, 0)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}

export default SellSummary;
