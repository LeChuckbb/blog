import React, { Suspense, useState } from "react";
import styled from "@emotion/styled";
import WithHeader from "../layout/WithHeader";
import PostList from "../components/main/PostList";
import LocalErrorBoundary from "../hooks/\berror/LocalErrorBoundary";
import PostTags from "../components/main/PostTags";
import { dehydrate, QueryClient } from "react-query";
import {
  PostByPageType,
  POST_BY_PAGE_KEY,
} from "../hooks/query/useGetPostByPageQuery";
import { PostTagsType, POST_TAG_KEY } from "../hooks/query/useGetPostTagsQuery";
import useMongo from "../lib/useMongo";

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

const Home = ({ dehydratedState }: any) => {
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
  // getPostByPage
  await queryClient.prefetchInfiniteQuery<PostByPageType, Error>(
    [POST_BY_PAGE_KEY, selectedTag],
    async ({ pageParam = 1 }) => {
      const PAGE_SIZE = 8;
      const { postsCollection } = await useMongo();

      const count =
        selectedTag === "all"
          ? await postsCollection.count({})
          : await postsCollection.count({ tags: selectedTag });
      const page = Number(pageParam);
      const IS_NEXT_PAGE_EXIST = count - page * PAGE_SIZE <= 0 ? null : true;
      const next = !IS_NEXT_PAGE_EXIST ? IS_NEXT_PAGE_EXIST : page + 1;
      const prev = page === 1 ? null : page - 1;

      const results =
        selectedTag === "all"
          ? await postsCollection
              .find({}, { projection: { html: 0, markup: 0 } })
              .sort({ date: -1 })
              .skip(PAGE_SIZE * (page - 1))
              .limit(PAGE_SIZE)
              .toArray()
          : await postsCollection
              .find(
                { tags: selectedTag },
                { projection: { html: 0, markup: 0 } }
              )
              .sort({ date: -1 })
              .skip(PAGE_SIZE * (page - 1))
              .limit(PAGE_SIZE)
              .toArray();

      // results.forEach((post) => {
      //   // 1. post.thumbnail.id에 접근
      //   // 2. id를 바탕으로 아마지 요청 URL 생성
      // });

      return { count, next, prev, results };
    },
    {
      getNextPageParam: (lastPage: any) => {
        return lastPage.next ?? null;
      },
    }
  );

  // getPostTags
  await queryClient.prefetchQuery<PostTagsType, Error>(
    [POST_TAG_KEY],
    async () => {
      const { tagsCollection } = await useMongo();
      const tags = await tagsCollection.find({}).toArray();
      const count = await tagsCollection.countDocuments();
      return { count, tags };
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
