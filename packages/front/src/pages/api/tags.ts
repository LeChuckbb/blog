import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Collection } from "mongodb";

let tagsCollection: Collection;

async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("blog");
  tagsCollection = db.collection("tags");
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();
  switch (req.method) {
    case "GET":
      const tags = await tagsCollection.find({}).toArray();
      const count = await tagsCollection.countDocuments();
      res.json({ count, tags });
      break;
    default:
      break;
  }
};
