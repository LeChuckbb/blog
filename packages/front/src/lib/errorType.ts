export class AppError extends Error {
  errorCode: string; // POE002
  statusCode: number; // 404
  constructor(errorCode: string, message: any, statusCode: number) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
