import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../lib/api";
import useMongo from "../../../lib/useMongo";
import ObjectID from "bson-objectid";

const DeleteThumbnail: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  const { postsCollection } = await useMongo();
  const result = await postsCollection.findOneAndUpdate(
    { _id: ObjectID.createFromHexString(id as string) },
    {
      $unset: { thumbnail: 1 },
    }
  );
  if (result.ok !== 1 || result.value === null)
    throw new Error("썸네일 삭제 실패");

  res.status(200).end();
};

export default apiHandler({
  DELETE: DeleteThumbnail,
});
