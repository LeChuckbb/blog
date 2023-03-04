import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../lib/api";
import axios from "axios";

const getCloudFlareUpload: NextApiHandler = async (req, res) => {
  const imageResponse = await axios(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CF_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CF_TOKEN}`,
      },
    }
  );

  const {
    data: {
      result: { uploadURL },
    },
  } = imageResponse;

  res.status(200).json(uploadURL);
};

export default apiHandler({
  GET: getCloudFlareUpload,
});
