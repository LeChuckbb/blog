import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Collection } from "mongodb";
import multer from "multer";
import nextConnect from "next-connect";

// let postsCollection: Collection;

// async function connectToDatabase() {
//   console.log("connectToDatabase IN");
//   const client = await clientPromise;
//   const db = client.db("blog");
//   postsCollection = db.collection("posts");
// }

// connectToDatabase();

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

// array(여러 파일) <-> single
// const uploadMiddleware = upload.array("theFiles");
const uploadMiddleware = upload.single("file");

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(uploadMiddleware);

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {
  console.log("UPLOAD POST");
  res.status(200).json({ message: "ok" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
