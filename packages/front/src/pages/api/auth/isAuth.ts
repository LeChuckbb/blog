import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import ValidateTokens from "../../../lib/validateTokenMiddleware";
import nextConnect from "next-connect";
import { apiHandler } from "../../../lib/api";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use((req, res, next) => ValidateTokens(req, res, next));

const isAuth: NextApiHandler = async (req, res) => {
  return res.status(200).end();
};

handler.get(apiHandler({ GET: isAuth }));

export default handler;
