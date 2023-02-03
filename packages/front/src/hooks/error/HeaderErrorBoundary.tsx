import { useQueryErrorResetBoundary } from "react-query";
import { isAxiosError } from "axios";
import { ErrorBoundary } from "react-error-boundary";
import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  console.log(error);
  // resetErrorBoundary -> onReset으로 전달한 것 = useQueryErrorResetBoundary

  // 현재 AUE005 한 경우밖에 없음.
  return (
    <div role="alert">
      <pre>{error?.response?.data?.message}</pre>
      <button onClick={resetErrorBoundary}>재시도</button>
    </div>
  );
};

const onErrorHandler = (error: Error, info: any) => {
  console.log(error);
  if (isAxiosError(error) && error.response?.data.code === "AUE005") {
    console.log("AUE005. do nothing");
  } else {
    throw error;
  }
};

const HeaderErrorBoundary = ({ children }: any) => {
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

export default HeaderErrorBoundary;
