import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("blog");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost: any = await db.collection("posts").insertOne(bodyObject);
      res.json(myPost.ops[0]);
      break;
    case "GET":
      const allPosts = await db
        .collection("posts")
        .find({}, { projection: { html: 0, markup: 0 } })
        .toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}
