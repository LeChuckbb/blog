import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { apiHandler } from "../../../lib/api";
import useMongo from "../../../lib/mongo";
import { AppError } from "../../../lib/api";
import { ObjectId } from "../../../lib/mongodb";

const DeleteThumbnail: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  const { postsCollection } = await useMongo();
  const result = await postsCollection.findOneAndUpdate(
    { _id: new ObjectId(id as string) },
    {
      $unset: { thumbnail: 1 },
    }
  );
  if (result.ok !== 1 || result.value === null)
    throw new AppError("POE001", "썸네일 삭제 실패", 404);

  res.status(200).end();
};

export default apiHandler({
  DELETE: DeleteThumbnail,
});
