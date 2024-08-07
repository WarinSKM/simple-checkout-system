import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Box, File, Package } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-24 h-screen">
      <h1 className="text-4xl mb-4">Main Menu</h1>
      <div className="grid grid-cols-2 w-96 gap-4">
        <Link href="/new-order" className="col-span-2">
          <Button variant="outline" className="h-32 w-full mb-8">
            <div className="flex flex-col justify-center items-center">
              <ShoppingCart className="mb-3" height={50} width={50} />
              <p className="text-2xl">Create Order</p>
            </div>
          </Button>
        </Link>
        <Link href="/order-history">
          <Button variant="outline" className="h-32 w-full mb-8">
            <div className="flex flex-col justify-center items-center">
              <File className="mb-3" height={50} width={50} />
              <p className="text-2xl">Order History</p>
            </div>
          </Button>
        </Link>
        <Link href="/sell-summary">
          <Button variant="outline" className="h-32 w-full mb-8">
            <div className="flex flex-col justify-center items-center">
              <File className="mb-3" height={50} width={50} />
              <p className="text-2xl">Sale Summary</p>
            </div>
          </Button>
        </Link>
        <Link href="/manage-product" className="col-span-2">
          <Button variant="outline" className="h-32 w-full mb-8">
            <div className="flex flex-col justify-center items-center">
              <Package className="mb-3" height={50} width={50} />
              <p className="text-2xl">Add product</p>
            </div>
          </Button>
        </Link>
      </div>
    </main>
  );
}
