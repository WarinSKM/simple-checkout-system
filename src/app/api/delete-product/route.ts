import { NextApiResponse } from "next";
import { useFireStore } from "@/app/utils/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

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
  await deleteDoc(docSnap.ref);
  return Response.json({
    message: `succuess`,
  });
}
