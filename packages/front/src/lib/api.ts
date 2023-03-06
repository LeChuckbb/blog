import createHttpError from "http-errors";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { Method } from "axios";

type ApiMethodHandlers = {
  [key in Uppercase<Method>]?: NextApiHandler;
};

// Shape of the response when an error is thrown
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    err?: any; // Sent for unhandled errors reulting in 500
  };
  status?: number; // Sent for unhandled errors reulting in 500
}

export class AppError extends Error {
  errorCode: string; // POE002
  statusCode: number; // 404
  constructor(errorCode: string, message: any, statusCode: number) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

// Global Error Handler
export function errorHandler(
  err: unknown,
  res: NextApiResponse<ErrorResponse>
) {
  console.log("GLOBAL ERROR HANDLER");
  // Errors with statusCode >= 500 are should not be exposed
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.errorCode,
        message: err.message,
      },
    });
  } else if (createHttpError.isHttpError(err) && err.expose) {
    // expose -> 400번대 에러인 경우
    // Handle all errors thrown by http-errors module
    return res.status(err.statusCode).json({ error: { message: err.message } });
  } else if (err instanceof ValidationError) {
    // Handle yup validation errors
    return res.status(400).json({ error: { message: err.errors.join(", ") } });
  } else {
    // default to 500 server error
    console.error(err);
    return res.status(500).json({
      error: { message: "Internal Server Error", err },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  }
}

// acts as the entry point for any API route (HOF)
export const apiHandler = (handler: ApiMethodHandlers) => {
  return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
    try {
      const method = req.method
        ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
        : undefined;

      if (!method)
        throw new createHttpError.MethodNotAllowed(
          `No method specified on path ${req.url}!`
        );

      const methodHandler = handler[method];
      if (!methodHandler)
        throw new createHttpError.MethodNotAllowed(
          `Method ${req.method} Not Allowed on path ${req.url}!`
        );

      await methodHandler(req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  };
};
