import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../lib/api";
import axios from "axios";
import { AppError } from "../../../lib/api";

const getCloudFlareUpload: NextApiHandler = async (req, res) => {
  const response = await axios(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CF_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CF_TOKEN}`,
      },
    }
  );
  const uploadURL = response?.data?.result?.uploadURL;
  if (!uploadURL)
    throw new AppError("POE002", "Cloud Flare 업로드 URL 불러오기 실패", 500);

  res.status(200).json(uploadURL);
};

export default apiHandler({
  GET: getCloudFlareUpload,
});
