import { Card, CardContent, CardDescription } from "../ui/card";
import { ProductInfo } from "./ProductCard";
import { Separator } from "../ui/separator";
import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";

interface OrderItemprops {
  className?: string;
  product: OrderItem;
  onAdd: () => void;
  onMinus: () => void;
  onRemove: () => void;
}

export interface OrderItem extends ProductInfo {
  quatity: number;
}

function OrderItem({ className, product, onAdd, onMinus, onRemove }: OrderItemprops) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <CardDescription>{product.product_name}</CardDescription>
          <CardDescription>฿ {product.product_price * product.quatity}</CardDescription>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Button variant="ghost" className="group w-12 h-12" size="icon" onClick={onMinus}>
              <div className="w-10 h-10 rounded-full border group-hover:border-primary-foreground border-foreground text-foreborder-foreground flex justify-center items-center">
                <Minus width={15} height={15} />
              </div>
            </Button>
            <p className="mx-2">{product.quatity}</p>
            <Button variant="ghost" className="group w-12 h-12" size="icon" onClick={onAdd}>
              <div className="w-10 h-10 rounded-full border group-hover:border-primary-foreground border-foreground text-foborder-foreground flex justify-center items-center">
                <Plus width={15} height={15} />
              </div>
            </Button>
          </div>
          <Button variant="ghost" className="group w-12 h-12 hover:bg-destructive hover:text-destructive-foreground" size="icon" onClick={onRemove}>
            <div className="w-10 h-10 rounded-full border group-hover:border-destructive-foreground border-foreground text-foborder-foreground flex justify-center items-center">
              <Trash width={15} height={15} />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderItem;
