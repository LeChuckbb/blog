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
import useMongo from "../lib/useMongo";
import { getFileFromCF } from "../apis/fileApi";

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

const Home = ({ dehydratedState, tags, images }: any) => {
  const [selectedTag, setSelectedTag] = useState("all");
  console.log(dehydratedState);

  return (
    <Container>
      <LocalErrorBoundary>
        <PostTags setTag={setSelectedTag} tagsData={JSON.parse(tags)} />
      </LocalErrorBoundary>
      <LocalErrorBoundary>
        <PostList selectedTag={selectedTag} images={JSON.parse(images)} />
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
              .find({}, { projection: { html: 0, markdown: 0 } })
              .sort({ date: -1 })
              .skip(PAGE_SIZE * (page - 1))
              .limit(PAGE_SIZE)
              .toArray()
          : await postsCollection
              .find(
                { tags: selectedTag },
                { projection: { html: 0, markdown: 0 } }
              )
              .sort({ date: -1 })
              .skip(PAGE_SIZE * (page - 1))
              .limit(PAGE_SIZE)
              .toArray();
      return { count, next, prev, results };
    },
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

const getImages = async () => {
  const { postsCollection } = await useMongo();
  const posts = await postsCollection
    .find({}, { projection: { thumbnail: 1 } })
    .sort({ date: -1 })
    .toArray();

  const images = await Promise.all(
    posts.map(async (post) => {
      const id = post?.thumbnail?.id;
      if (id === undefined || id === "") return null;

      const { result, base64Image } = await getFileFromCF(id, "thumbnail");
      const image = `data:${result?.headers["content-type"]};base64,${base64Image}`;
      return { image, id };
    })
  );

  return images;
};

const getTags = async () => {
  // getPostTags
  const { tagsCollection } = await useMongo();
  const tags = await tagsCollection.find({}).toArray();
  const count = await tagsCollection.countDocuments();
  return { count, tags };
};

export async function getStaticProps() {
  const images = await getImages();
  const tags = await getTags();
  const queryClient = new QueryClient();
  const dehydratedState = await prefetchData(queryClient);

  return {
    props: {
      dehydratedState,
      tags: JSON.stringify(tags),
      images: JSON.stringify(images),
    },
    revalidate: 60,
  };
}

const Container = styled.div`
  width: 100%;
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.surfaceVariant};
  ${(props) => props.theme.mq[1]} {
    width: 1024px;
  }
  ${(props) => props.theme.mq[3]} {
    width: 1376px;
  }
  ${(props) => props.theme.mq[4]} {
    width: 1728px;
  }
`;
