import { useQueryErrorResetBoundary } from "react-query";
import { AxiosError, isAxiosError } from "axios";
import { ErrorBoundary } from "react-error-boundary";
import { AppError } from "../../lib/api";
import styled from "@emotion/styled";
import { Button } from "design/src/stories/Button";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  console.log(error);
  // resetErrorBoundary -> onReset으로 전달한 것 = useQueryErrorResetBoundary

  const customErrorMessage = error?.response?.data?.error?.message;

  return (
    <Container role="alert">
      <pre>{customErrorMessage ? customErrorMessage : error?.message}</pre>
      <Button variant="elevated" onClick={resetErrorBoundary}>재시도</Button>
    </Container>
  );
};

const onErrorHandler = (error: Error) => {
  console.log(error);

  if (error instanceof AxiosError<AppError>) {
      console.log("App Error!");
      if (error.response?.data.error.code === "AUE005") {
        console.log("AUE005");
      } else if (error.response?.data.error.code === 'POE002'){
        console.log('POE002')
      }
  }else {
    throw Error(error.message);
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`