import mongoose, { Document, Model, modelNames } from "mongoose";
import { NextFunction, Request, Response } from "express";

const PAGE_SIZE = 8;

export const getPostByPage =
  (model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await model.count({});
      const page = Number(req.query.page);
      // count - (page * PAGE_SIZE) <= 0(음수)이면, 다음 페이지가 없는 것.
      const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
      const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page;
      const prev = page === 1 ? null : page - 1;

      const results = await model
        .find({})
        .skip(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE);

      return res.status(200).json({
        count,
        next,
        prev,
        results,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };

export const hi = "1";
