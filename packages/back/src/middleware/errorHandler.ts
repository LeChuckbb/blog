import { Request, Response } from "express";
import { AppError } from "../util/types";
import { MongoServerError } from "mongodb";

const errorHandler = (error: Error, req: Request, res: Response, next: any) => {
  console.log("Error Handlder !@!@");
  // console.log(error);
  if (error instanceof AppError) {
    console.log("App Error!");
    return res
      .status(error.statusCode)
      .json({ code: error.errorCode, message: error.message });
  } else if (error.name === "MongoServerError") {
    const mongoError = error as MongoServerError;
    if (mongoError.code === 11000) {
      return res.status(409).json({
        message: "duplicate key error",
        code: "POE001",
        error: mongoError,
      });
    }
  }
  return res.status(500).send(error.message);
};

module.exports = errorHandler;
