import styled from "@emotion/styled";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div role="alert">
      <pre>서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요. (global)</pre>
      <button onClick={resetErrorBoundary}>재시도</button>
    </div>
  );
};

const OnErrorHandler = (error: Error, info: any) => {
  window.location.href = "/error";
};

const GlobalErrorBoundary = ({ children }: any) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={OnErrorHandler}>
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
