import mongoose, { Document, Model } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Post } from "../models/Posts";

const getAll =
  (model: Model<Post | any>, populate?: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Getting all documents " + model.modelName);

    model
      .find<Document>({})
      .populate(populate || [])
      .then((results) => {
        return res.status(200).json({ results });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error });
      });
  };

export default {
  getAll,
};
