import type { NextApiHandler } from "next";
import { apiHandler } from "../../lib/api";
import useMongo from "../../lib/mongo";

const Tags: NextApiHandler = async (req, res) => {
  const { tagsCollection } = await useMongo();
  const tags = await tagsCollection.find({}).toArray();
  const count = await tagsCollection.countDocuments();
  res.status(200).json({ count, tags });
};

export default apiHandler({
  GET: Tags,
});
