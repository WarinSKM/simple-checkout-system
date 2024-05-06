import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Brand, ProductCategory } from "@/app/type";
import Image from "next/image";

export interface ProductInfo {
  product_id?: string;
  product_brand: Brand;
  product_name: string;
  product_price: number;
  product_category: ProductCategory;
}

interface ProductCardProps {
  className?: string;
  product: ProductInfo;
  onclick: (val: ProductInfo) => void;
}

function ProductCard({ className, product, onclick }: ProductCardProps) {
  return (
    <Card
      onClick={() => {
        onclick(product);
      }}
      className={cn("cursor-pointer", className)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center">
        <div className="w-24 h-24 ">
          <Image src={`/image/${product.product_brand.toLowerCase()}.jpg`} alt="logo-brand" width={96} height={96}/>
        </div>
        <div>
          <CardTitle className="text-lg my-4">{product.product_name}</CardTitle>
          <CardDescription>{product.product_price} บาท</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
