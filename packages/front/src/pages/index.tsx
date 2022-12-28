import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import SpinnerPacman from "../common/SpinnerPacman";
import PostList from "../components/main/PostList";
// const DynamicPosts = dynamic(() => import("../components/main/Posts"), {
//   ssr: false,
// });

const ErrorFallbackUI = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div>
    <p> 에러: {error.message} </p>
    <button onClick={() => resetErrorBoundary()}>다시 시도</button>
  </div>
);

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackUI}>
      <Suspense>
        {/* <DynamicPosts /> */}
        <PostList />
      </Suspense>
    </ErrorBoundary>
  );
}
