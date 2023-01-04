import { Model } from "mongoose";
import { Request, Response } from "express";
import { Post } from "../models/Posts";
import { decode } from "html-entities";

const PAGE_SIZE = 8;

export const getPostByPage =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      const count = await model.count({});
      const page = Number(req.query.page);
      const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
      const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page;
      const prev = page === 1 ? null : page - 1;

      // find에서 content는 제외
      const results = await model
        .find({}, { content: 0 })
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

export const getPostById =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      const id = req.query.id;
      const results = await model.findOne(
        { _id: id },
        { thumbnail: 0, tags: 0, subTitle: 0 }
      );
      const resultObj = results?.toObject();
      const resultBody = {
        ...resultObj,
        content: decode(results?.content),
      };

      return res.status(200).json(resultBody);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };

export const getPostBySlug =
  (model: Model<Post>) => async (req: Request, res: Response) => {
    try {
      console.log("*** getPostBySlug *** ");
      console.log(req.query);

      const results = await model.findOne({ urlSlug: req.query.slug });
      const resultObj = results?.toObject();
      const resultBody = {
        ...resultObj,
        content: decode(results?.content),
      };

      return res.status(200).json(resultBody);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
