import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import SpinnerPacman from "../common/SpinnerPacman";
import PostList from "../components/main/PostList";
import WithHeader from "../layout/WithHeader";
import { NextPageWithLayout } from "./_app";

// const DynamicPosts = dynamic(() => import("../components/main/Posts"), {
//   ssr: false,
// });

const ErrorFallbackUI = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div>
    <p> 에러: {error.message} </p>
    <button onClick={() => resetErrorBoundary()}>다시 시도</button>
  </div>
);

const Home: NextPageWithLayout = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackUI}>
      <Suspense>
        {/* <DynamicPosts /> */}
        <PostList />
      </Suspense>
    </ErrorBoundary>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default Home;
