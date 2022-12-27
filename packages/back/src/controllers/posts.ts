import { Model } from "mongoose";
import { Request, Response } from "express";
import { Post } from "../models/Posts";

const PAGE_SIZE = 8;

export const getPostByPage =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      const count = await model.count({});
      const page = Number(req.query.page);
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
