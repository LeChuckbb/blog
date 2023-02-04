import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import SpinnerPacman from "../common/SpinnerPacman";
import WithHeader from "../layout/WithHeader";
import { NextPageWithLayout } from "./_app";
import PostList from "../components/main/PostList";
import LocalErrorBoundary from "../hooks/\berror/LocalErrorBoundary";
import PostTags from "../components/main/PostTags";

// const DynamicPosts = dynamic(() => import("../components/main/Posts"), {
//   ssr: false,
// });

const Home: NextPageWithLayout = () => {
  const [selectedTag, setSelectedTag] = useState("all");

  return (
    <Container>
      <LocalErrorBoundary>
        <PostTags setTag={setSelectedTag} />
      </LocalErrorBoundary>
      <LocalErrorBoundary>
        <PostList selectedTag={selectedTag} />
      </LocalErrorBoundary>
    </Container>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default Home;

const Container = styled.div`
  width: 100%;
  background-color: yellow;
  overflow-x: scroll;
  ${(props) => props.theme.mq[1]} {
    width: 1024px;
  }
  ${(props) => props.theme.mq[2]} {
    width: 1376px;
  }
  ${(props) => props.theme.mq[3]} {
    width: 1728px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`;
