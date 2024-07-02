"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import Swal from "sweetalert2";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindcssConfig from "@/../tailwind.config";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ProductInfo } from "@/components/custom/ProductCard";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useFireStore } from "../utils/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formSchema = z.object({
  // username: z.string().min(2, {
  //   message: "Username must be at least 2 characters.",
  // }),
  product_brand: z.string().min(1, "Brand Require"),
  product_category: z.string().min(1, "Category Require"),
  product_name: z.string().min(1, "Name Require"),
  product_price: z.number(),
});

const DEFAULT_VALUE: z.infer<typeof formSchema> = {
  product_name: "",
  product_brand: "",
  product_category: "",
  product_price: 0,
};

function ManageProduct() {
  const config = resolveConfig(tailwindcssConfig);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUE,
  });

  const fireStore = useFireStore();
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const productLists = useMemo(() => {
    return productList.sort((a, b) => a.product_brand > b.product_brand ? 1 : -1)
  },[productList])

  const BRAND_OPTIONS = [
    { value: "Peko", label: "Peko" },
    { value: "Bebpo", label: "Bebpo" },
    { value: "Gerro", label: "Gerro" },
  ];

  const CATEGORY_OPTIONS = [
    { value: "free", label: "Free" },
    { value: "product", label: "Product" },
    { value: "discount", label: "Discount" },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการเพิ่มสินค้า",
      icon: "question",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      reverseButtons: true,
    });
    if (!isConfirmed) return;

    await axios.post("/api/create-product", values);
    Swal.fire({
      title: "สำเร็จ",
      icon: "success",
      timer: 1000,
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: config.theme.colors.destructive.DEFAULT,
    });

    fetchProducts();
  }

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const q = query(collection(fireStore, "products"), orderBy("product_name", "asc"));
    const docSnapShot = await getDocs(q);
    const result: ProductInfo[] = [];
    docSnapShot.forEach((doc) => {
      result.push({ ...(doc.data() as ProductInfo), product_id: doc.id });
    });
    setProductList(result);
    console.log(result);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-5">
      <div className="col-span-full h-fit mb-5">
        <Link href="/">
          <Button variant="link" className="">
            Back to Home
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Brand</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BRAND_OPTIONS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_OPTIONS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <Input type="number" value={field.value} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex items-center justify-between">
                  <Button type="button" variant="muted" onClick={() => form.reset(DEFAULT_VALUE)}>
                    Cancle
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Brand</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Category</TableHead>
              <TableHead>Product Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productLists.map((item) => (
              <TableRow key={item.product_id}>
                <TableCell>{item.product_brand}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.product_category}</TableCell>
                <TableCell>{item.product_price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

export default ManageProduct;
