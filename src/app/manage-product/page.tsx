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
import { Edit, Trash } from "lucide-react";

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
  const [edit, setEdit] = useState(false);
  const [currId, setCurrId] = useState<string | undefined>();

  const productLists = useMemo(() => {
    return productList.sort((a, b) => (a.product_brand > b.product_brand ? 1 : -1));
  }, [productList]);

  const BRAND_OPTIONS = [
    { value: "Peko", label: "Peko" },
    { value: "Bebpo", label: "Bebpo" },
    { value: "Gerro", label: "Gerro" },
    { value: "Gerro_treat", label: "Gerro treat" },
    { value: "Gerro_toy", label: "Gerro toy" },
  ];

  const CATEGORY_OPTIONS = [
    { value: "free", label: "Free" },
    { value: "product", label: "Product" },
    { value: "discount", label: "Discount" },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (edit) {
      await editProduct(values);
    } else {
      await createProduct(values);
    }
    setEdit(false);
    setCurrId(undefined);
    form.reset();
    fetchProducts();
  }

  const editProduct = async (values: z.infer<typeof formSchema>) => {
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการแก้ไขสินค้า",
      icon: "question",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      reverseButtons: true,
    });
    if (!isConfirmed) return;

    const body = { ...values, product_id: currId };

    const res = await axios.post("/api/update-product", body);
    if (res.data.message !== "fail") {
      Swal.fire({
        title: "สำเร็จ",
        icon: "success",
        timer: 1000,
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      });
    } else {
      Swal.fire({
        title: "ไม่สำเร็จ",
        icon: "error",
        timer: 1000,
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      });
    }
  };

  const createProduct = async (values: z.infer<typeof formSchema>) => {
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
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const q = query(collection(fireStore, "products"), orderBy("product_name", "asc"));
    const docSnapShot = await getDocs(q);
    const result: ProductInfo[] = [];
    docSnapShot.forEach((doc) => {
      result.push({ ...(doc.data() as ProductInfo), product_id: doc.id });
    });
    setProductList(result);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    setEdit(true);
    setCurrId(id);
    const currProduct = productLists.find((item) => item.product_id === id);
    form.setValue("product_brand", currProduct?.product_brand!);
    form.setValue("product_category", currProduct?.product_category!);
    form.setValue("product_name", currProduct?.product_name!);
    form.setValue("product_price", currProduct?.product_price!);
  };

  const handleCancel = () => {
    form.reset(DEFAULT_VALUE);
    setEdit(false);
    setCurrId(undefined);
  };

  const handleDelete = async (id: string) => {
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการลบสินค้า",
      icon: "question",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      showCancelButton: true,
      confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      reverseButtons: true,
    });
    if (!isConfirmed) return;

    const res = await axios.post("/api/delete-product", { product_id: id });
    if (res.data.message !== "fail") {
      Swal.fire({
        title: "สำเร็จ",
        icon: "success",
        timer: 1000,
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      });
    } else {
      Swal.fire({
        title: "ไม่สำเร็จ",
        icon: "error",
        timer: 1000,
        confirmButtonText: "ยืนยัน",
        confirmButtonColor: config.theme.colors.destructive.DEFAULT,
      });
    }
    fetchProducts();
  };

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
          <CardTitle>{edit ? "Edit Product" : "Add Product"}</CardTitle>
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
                  <Button type="button" variant="muted" onClick={handleCancel}>
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
              <TableHead>Product ID</TableHead>
              <TableHead>Product Brand</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Category</TableHead>
              <TableHead>Product Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productLists.map((item) => (
              <TableRow key={item.product_id}>
                <TableCell>{item.product_id}</TableCell>
                <TableCell>{item.product_brand}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.product_category}</TableCell>
                <TableCell>{item.product_price.toLocaleString()}</TableCell>
                <TableCell className="space-x-1">
                  <Button
                    className="bg-yellow-200 hover:bg-yellow-200/20 text-black hover:text-black/20"
                    onClick={() => handleEdit(item.product_id!)}
                  >
                    <Edit />
                  </Button>
                  <Button className="bg-red-400 hover:bg-red-400/20" onClick={() => handleDelete(item.product_id!)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}

export default ManageProduct;
