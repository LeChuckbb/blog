import { Request, Response } from "express";

export const tryCatch =
  (controller: any) => async (req: Request, res: Response, next: any) => {
    try {
      console.log("TRY CATCH");
      await controller(req, res);
    } catch (error) {
      console.log("TRY CATCH ERROR!");
      // 실패 시 errorHandler middleware에서 처리
      return next(error);
    }
  };
