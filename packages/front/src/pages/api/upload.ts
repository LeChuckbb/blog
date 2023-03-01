import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import nextConnect from "next-connect";
import { apiHandler } from "../../lib/api";

export interface CustomNextApiRequest extends NextApiRequest {
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const type = req.query.type || req.params.type;
      if (type === "thumbnail") {
        cb(null, "./public/static/uploads/thumbnail");
      } else if (type === "image") {
        cb(null, "./public/static/uploads/images");
      }
    },
    filename: (req, file, cb) => {
      const fileArr = file.originalname.split(".");
      return cb(null, `${fileArr[0]}${Date.now()}.${fileArr[1]}`);
    },
  }),
});

const uploadMiddleware = upload.single("file");

const handler = nextConnect();

handler.use(uploadMiddleware);

const uploadFunc: NextApiHandler = (req: CustomNextApiRequest, res) => {
  const file = req?.file || "";
  res.status(200).json({ file });
};

handler.post(apiHandler({ POST: uploadFunc }));

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
