import { NextApiResponse } from "next";
import { useFireStore } from "@/app/utils/firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { ProductInfo } from "@/components/custom/ProductCard";

export async function POST(req: Request, res: NextApiResponse) {
  const fireStore = useFireStore();
  const data = await req.json();
  //   const
  //   const q = query(collection(fireStore, "products"), where(firebase.firestore.FieldPath.documentId(), "==", data.product_id));
  const docRef = doc(fireStore, "products", data.product_id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return Response.json({
      message: `fail`,
    });
  }
  const updateData = {
    product_brand: data.product_brand,
    product_category: data.product_category,
    product_name: data.product_name,
    product_price: data.product_price,
  };
  await updateDoc(docSnap.ref, updateData);
  return Response.json({
    message: `succuess`,
  });
}
