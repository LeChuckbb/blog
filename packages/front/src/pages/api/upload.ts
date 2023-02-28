import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import nextConnect from "next-connect";
import { apiHandler } from "../../lib/api";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const type = req.query.type || req.params.type;
      console.log(req.query.type);
      console.log(file);
      if (type === "thumbnail") {
        cb(null, "./public/static/uploads/thumbnail");
      } else if (type === "image") {
        cb(null, "./public/static/uploads/images");
      }
    },
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const uploadMiddleware = upload.single("file");

const handler = nextConnect();

handler.use(uploadMiddleware);

const uploadFunc: NextApiHandler = (req, res) => {
  console.log("UPLOAD POST");
  res.status(200).json({ message: "ok" });
};

handler.post(apiHandler({ POST: uploadFunc }));

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
