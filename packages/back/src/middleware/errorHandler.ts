import { Request, Response } from "express";
import { AppError } from "../util/types";
import { MongoServerError } from "mongodb";

const errorHandler = (error: Error, req: Request, res: Response, next: any) => {
  console.log("Error Handlder Middleware !@!@");
  if (error instanceof AppError) {
    console.log("App Error!");
    return res.status(error.statusCode).json({
      code: error.errorCode,
      message: error.message,
      accessToken: error.accessToken,
    });
  } else if (error.name === "MongoServerError") {
    const mongoError = error as MongoServerError;
    if (mongoError.code === 11000) {
      // createPost시 중복된 slug가 입력될 경우 발생
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
