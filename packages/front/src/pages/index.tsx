import React, { useState } from "react";
import styled from "@emotion/styled";
import WithHeader from "../layout/WithHeader";
import PostList from "../components/main/PostList";
import LocalErrorBoundary from "../hooks/\berror/LocalErrorBoundary";
import PostTags, { TagsType } from "../components/main/PostTags";
import useMongo from "../lib/mongo";

interface Props {
  tags: TagsType;
  posts: string;
}

const Home = ({ tags, posts }: Props) => {
  const [selectedTag, setSelectedTag] = useState("all");

  return (
    <Container>
      <PostTags setTag={setSelectedTag} tagsData={JSON.parse(String(tags))} />
      <LocalErrorBoundary>
        <PostList selectedTag={selectedTag} posts={JSON.parse(String(posts))} />
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

const GetPosts = async () => {
  const { postsCollection } = await useMongo();
  const posts = await postsCollection
    .find({}, { projection: { html: 0, markdown: 0 } })
    .sort({ date: -1, _id: 1 })
    .toArray();

  return posts;
};

export async function getStaticProps() {
  const tags = await GetTags();
  const posts = await GetPosts();

  return {
    props: {
      tags: JSON.stringify(tags),
      posts: JSON.stringify(posts),
    },
    revalidate: 10,
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
