import React, { useState } from "react";
import styled from "@emotion/styled";
import WithHeader from "../layout/WithHeader";
import PostList from "../components/main/PostList";
import LocalErrorBoundary from "../hooks/\berror/LocalErrorBoundary";
import PostTags, { TagsType } from "../components/main/PostTags";
import useMongo from "../lib/useMongo";

// const DynamicPosts = dynamic(() => import("../components/main/Posts"), {
//   ssr: false,
// });

const Home = ({ tags }: TagsType) => {
  const [selectedTag, setSelectedTag] = useState("all");

  return (
    <Container>
      <LocalErrorBoundary>
        <PostTags setTag={setSelectedTag} tagsData={JSON.parse(String(tags))} />
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

const GetTags = async () => {
  // getPostTags
  const { tagsCollection } = await useMongo();
  const tags = await tagsCollection.find({}).toArray();
  const count = await tagsCollection.countDocuments();
  return { count, tags };
};

export async function getStaticProps() {
  const tags = await GetTags();

  return {
    props: {
      tags: JSON.stringify(tags),
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
  ${(props) => props.theme.mq[3]} {
    width: 1376px;
  }
  ${(props) => props.theme.mq[4]} {
    width: 1728px;
  }
`;
