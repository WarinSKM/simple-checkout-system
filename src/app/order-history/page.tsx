import { OrderItem } from "@/components/custom/OrderItem";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import OrderDetail from "@/components/custom/OrderDetail";

export interface OrderHistoryItem {
  id: string;
  items: OrderItem[];
  createTime: string;
  paymentMethod?: string;
}

function OrderHistory() {
  const orderHistoryList: OrderHistoryItem[] = [
    {
      id: "000001",
      items: [
        { title: "badana s", price: 90, quatity: 4, imageUrl: "" },
        { title: "badana sx", price: 190, quatity: 4, imageUrl: "" },
        { title: "badana sa", price: 290, quatity: 4, imageUrl: "" },
        { title: "badana se", price: 390, quatity: 4, imageUrl: "" },
      ],
      createTime: "02/04/2567 12:22",
    },
    {
      id: "000002",
      items: [
        { title: "badana s", price: 90, quatity: 4, imageUrl: "" },
        { title: "badana sx", price: 190, quatity: 4, imageUrl: "" },
        { title: "badana sa", price: 290, quatity: 4, imageUrl: "" },
        { title: "badana se", price: 390, quatity: 4, imageUrl: "" },
      ],
      createTime: "02/04/2567 12:22",
    },
    {
      id: "000003",
      items: [
        { title: "badana s", price: 90, quatity: 4, imageUrl: "" },
        { title: "badana sx", price: 190, quatity: 4, imageUrl: "" },
        { title: "badana sa", price: 290, quatity: 4, imageUrl: "" },
        { title: "badana se", price: 390, quatity: 4, imageUrl: "" },
      ],
      createTime: "02/04/2567 12:22",
    },
    {
      id: "000004",
      items: [
        { title: "badana s", price: 90, quatity: 4, imageUrl: "" },
        { title: "badana sx", price: 190, quatity: 4, imageUrl: "" },
        { title: "badana sa", price: 290, quatity: 4, imageUrl: "" },
        { title: "badana se", price: 390, quatity: 4, imageUrl: "" },
      ],
      createTime: "02/04/2567 12:22",
    },
  ];

  return (
    <main className="min-h-screen p-6">
      <Link href="/">
        <Button variant="link" className="mb-5">Back to Home</Button>
      </Link>
      <div>
        <h1 className="text-4xl mb-4">Order History</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order No.</TableHead>
              <TableHead>Order Create Time</TableHead>
              <TableHead>Order Total Quatity</TableHead>
              <TableHead>Order Total Price</TableHead>
              <TableHead>Order Total Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderHistoryList.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.createTime}</TableCell>
                <TableCell>{item.items.reduce((prev, next) => prev + next.quatity, 0)}</TableCell>
                <TableCell>{item.items.reduce((prev, next) => prev + next.price * next.quatity, 0).toLocaleString("us-Us")}</TableCell>
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
                {orderHistoryList
                  .reduce((prev, next) => prev + next.items.reduce((prevItem, nextItem) => prevItem + nextItem.price * nextItem.quatity, 0), 0)
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
