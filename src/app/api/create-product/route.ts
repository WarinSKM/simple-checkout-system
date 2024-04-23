import { NextApiResponse } from "next";
import { useFireStore } from "@/app/utils/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function POST(req: Request, res: NextApiResponse) {
    const fireStore = useFireStore()
    const data = await req.json();

   await addDoc(collection(fireStore, "products"), data)
  return Response.json({
    message: `succuess`,
  });
}
