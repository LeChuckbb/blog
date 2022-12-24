import mongoose, { Document, Model, modelNames } from "mongoose";
import { NextFunction, Request, Response } from "express";

const create =
  (model: Model<any>) => (req: Request, res: Response, next: NextFunction) => {
    console.log("Creating new document for " + model.modelName);

    const doc = new model({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });

    return doc
      .save()
      .then((result: any) => res.status(201).json({ result }))
      .catch((error: any) => res.status(500).json({ error }));
  };

const getAll =
  (model: Model<any>, populate?: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Getting all documents " + model.modelName);

    model
      .find<Document>({})
      // .populate(populate || [])
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
  (model: Model<any>, populate?: string[]) =>
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
  (model: Model<any>, populate?: string[]) =>
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
  (model: Model<any>) =>
  (req: Request, res: Response, next: NextFunction) => {};

export default {
  create,
  getAll,
  get,
  update,
  remove,
};
