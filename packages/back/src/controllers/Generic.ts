import mongoose, { Document, Model, Error } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Post } from "../models/Posts";
import { encode } from "html-entities";
import { MongoError } from "mongodb";

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

const get =
  (model: Model<Post | any>, populate?: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Getting document from  " + model.modelName + " by id");

    const id = req.params.id;

    model
      .findOne<Document>({ _id: id })
      .populate(populate || [])
      .then((result) => {
        if (result) {
          console.log(result);
          return res.status(200).json({ result });
        } else {
          console.log("Not Found");
          return res.status(404).json({ message: "Not Found" });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error });
      });
  };

const update =
  (model: Model<Post | any>, populate?: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Updating document from  " + model.modelName + " by slug");
    const slug = req.params.slug;
    const body = req.body;

    try {
      const result = await model.updateOne(
        { urlSlug: slug },
        {
          $set: {
            thumbnail: body.thumbnail,
            urlSlug: body.urlSlug,
            title: body.title,
            subTitle: body.subTitle,
            date: body.date,
            content: body.content,
            tags: body.tags,
          },
        }
      );
      return res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

export default {
  getAll,
  get,
  update,
};
