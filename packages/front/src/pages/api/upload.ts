import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import nextConnect from "next-connect";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

// array(여러 파일) <-> single
// const uploadMiddleware = upload.array("theFiles");
const uploadMiddleware = upload.single("file");

const handler = nextConnect();

handler.use(uploadMiddleware);

handler.post((req: NextApiRequest, res: NextApiResponse) => {
  console.log("UPLOAD POST");
  res.status(200).json({ message: "ok" });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
