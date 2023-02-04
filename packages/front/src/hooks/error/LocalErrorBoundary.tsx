import { useQueryErrorResetBoundary } from "react-query";
import { isAxiosError } from "axios";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  console.log(error);
  // resetErrorBoundary -> onReset으로 전달한 것 = useQueryErrorResetBoundary

  const customErrorMessage = error?.response?.data?.message;

  return (
    <div role="alert">
      <pre>{customErrorMessage ? customErrorMessage : error?.message}</pre>
      <button onClick={resetErrorBoundary}>재시도</button>
    </div>
  );
};

const onErrorHandler = (error: Error, info: any) => {
  console.log(error);
  console.log(isAxiosError(error) && error?.response?.status);
  // if (isAxiosError(error) && error.response?.status !== 500) {
  if (isAxiosError(error)) {
    console.log("axios Error.");
    if (error.code === "ERR_NETWORK") {
      window.location.href = "/error/network";
    }
  } else {
    // axios Error가 아닌 경우.. global로 위임
    throw error;
  }
};

const LocalErrorBoundary = ({ children }: any) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onErrorHandler}
      onReset={reset}
    >
      {children}
    </ErrorBoundary>
  );
};

export default LocalErrorBoundary;
