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
export type PostDatas = Array<{
  id: string;
  date: string;
  title: string;
  subTitle: string;
  urlSlug: string;
  tags: Array<String>;
}>;

type Props = {
  posts: PostDatas;
};

const Home = ({ posts }: Props) => {
  const [selectedTag, setSelectedTag] = useState("all");

  return (
    <Container>
      <LocalErrorBoundary>
        <PostTags setTag={setSelectedTag} />
      </LocalErrorBoundary>
      <LocalErrorBoundary>
        <PostList selectedTag={selectedTag} posts={posts} />
      </LocalErrorBoundary>
    </Container>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <WithHeader>{page}</WithHeader>;
};

export default Home;

export async function getStaticProps() {
  let res = await fetch("http://localhost:3000/api/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let posts = await res.json();

  if (posts.status !== 200) throw new Error("SSG 포스트 불러오기 실패");

  return {
    props: { posts: posts.data },
  };
}

const Container = styled.div`
  width: 100%;
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.surfaceVariant};
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
