import mongoose, { Document, Model, Error } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Post } from "../models/Posts";
import { encode } from "html-entities";
import { MongoError } from "mongodb";

const create =
  (model: Model<Post | any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Creating new document for " + model.modelName);

      // req.body에서 content 항목이 있으면 encode하여 DB에 저장
      const body = req?.body?.content
        ? {
            ...req.body,
            content: encode(req.body.content),
          }
        : req.body;

      const doc = new model({
        _id: new mongoose.Types.ObjectId(),
        ...body,
      });

      const result = await doc.save();
      return res.status(201).json({ result });
    } catch (error) {
      if (error instanceof Error.ValidationError) {
        console.log("Mongoose Error Here");
      } else if ((error as MongoError).code === 11000) {
        return res.status(409).json({
          message: "duplicate key error",
          error: error,
        });
      }
      return res.status(500).json({ error });
    }
  };

const getAll =
  (model: Model<Post | any>, populate?: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Getting all documents " + model.modelName);

    model
      .find<Document>({})
      .populate(populate || [])
      .then((results) => {
        console.log(results);
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
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Updating document from  " + model.modelName + " by id");

    const id = req.params.id;

    model
      .findOne<Document>({ _id: id })
      .populate(populate || [])
      .then((result) => {
        if (result) {
          result.save(req.body);

          return result.save().then((result) => {
            console.log(result);
            return res.status(200).json({ result });
          });
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

const remove =
  (model: Model<Post | any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Removing ....");
    console.log(req.params);
    const slug = req.params.slug;
    model
      .deleteOne({ urlSlug: slug })
      .then((result) => {
        if (result.deletedCount === 1) {
          console.log("delete 성공");
          return res.status(200).json({ message: "delete 성공" });
        } else {
          console.log("delete 실패");
          return res
            .status(204)
            .json({ message: "delete 실패. 없는 id입니다." });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error });
      });
  };

export default {
  create,
  getAll,
  get,
  update,
  remove,
};
