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
