import mongoose, { Document, Model, modelNames } from "mongoose";
import { NextFunction, Request, Response } from "express";

const PAGE_SIZE = 8;

export const getPostByPage =
  (model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await model.count({});
      const page = Number(req.query.page);
      const results = await model
        .find({})
        .skip(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE);

      // next page가 존재하는지 여부 파악하는 QUERY

      return res.status(200).json({ count, next: page, prev: null, results });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };

export const hi = "1";
