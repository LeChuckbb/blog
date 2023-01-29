import { Request, Response, NextFunction } from "express";

export const tryCatch =
  (controller: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(next);
    try {
      console.log("TRY CATCH Middleware");
      await controller(req, res, next);
    } catch (error) {
      console.log("TRY CATCH Middleware ERROR!");
      // 실패 시 errorHandler middleware에서 처리
      return next(error);
    }
  };
