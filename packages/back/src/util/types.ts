import { AxiosError } from "axios";

// interface MyAxiosResponse {
//   code: string;
//   message: string;
//   raw: AxiosError;
// }

// export class MyError extends Error {
//   response: MyAxiosResponse;
//   constructor(message: string, response: MyAxiosResponse) {
//     super(message);
//     this.response = response;
//   }
// }

export class AppError extends Error {
  errorCode: string; // POE002
  statusCode: number; // 404
  accessToken?: string;
  constructor(
    errorCode: string,
    message: any,
    statusCode: number,
    accessToken?: string
  ) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.accessToken = accessToken;
  }
}
