import { Model } from "mongoose";
import { Request, Response } from "express";
import { Post } from "../models/Posts";
import { Tags } from "../models/Tags";
import { decode } from "html-entities";

export const getPostTags =
  (model: Model<Tags>) => async (req: Request, res: Response) => {
    try {
      const result = await model.find({});
      return res.status(200).json("hi");
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
