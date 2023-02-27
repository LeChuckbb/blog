// Shape of the response when an error is thrown
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    err?: any; // Sent for unhandled errors reulting in 500
  };
  status?: number; // Sent for unhandled errors reulting in 500
}
