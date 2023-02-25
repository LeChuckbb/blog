import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "html-entities";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("blog");
  console.log("API ROUTES !!");
  console.log(req.query);
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost: any = await db.collection("posts").insertOne(bodyObject);
      res.json(myPost.ops[0]);
      break;
    case "GET":
      if (req.query?.slug) {
        // getPostBySlug
        console.log("slug");
        const results = await db
          .collection("posts")
          .findOne({ urlSlug: req.query.slug });
        const resultBody = {
          ...results,
          html: decode(results?.html),
          markup: results?.markup,
        };
        res.json({ status: 200, results: resultBody });
        break;
      } else {
        console.log("else");
        const results = await db
          .collection("posts")
          .find({}, { projection: { html: 0, markup: 0 } })
          .toArray();
        res.json({ status: 200, results });
        break;
      }
  }
}
