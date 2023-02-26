import React, { Suspense, useState } from "react";
import styled from "@emotion/styled";
import WithHeader from "../layout/WithHeader";
import PostList from "../components/main/PostList";
import LocalErrorBoundary from "../hooks/\berror/LocalErrorBoundary";
import PostTags from "../components/main/PostTags";
import { getPostByPage } from "../apis/postApi";
import { dehydrate, QueryClient } from "react-query";
import { PostByPageType } from "../hooks/query/useGetPostByPageQuery";
import { AxiosResponse } from "axios";

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

const Home = () => {
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

const prefetchData = async (queryClient: QueryClient, selectedTag = "all") => {
  await queryClient.prefetchInfiniteQuery<AxiosResponse<PostByPageType, Error>>(
    ["getPostByPage", selectedTag],
    async ({ pageParam = 1 }) => getPostByPage(pageParam, selectedTag),
    {
      getNextPageParam: (lastPage: any) => {
        return lastPage.next ?? null;
      },
    }
  );
  return {
    dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
  };
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  const dehydratedState = await prefetchData(queryClient);
  return {
    props: {
      dehydratedState,
    },
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
