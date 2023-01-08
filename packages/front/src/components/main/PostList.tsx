import styled from "@emotion/styled";
import { useGetPostByPageQuery } from "../../hooks/query/useGetPostByPageQuery";
import { useGetPostTagsQuery } from "../../hooks/query/useGetPostTagsQuery";
import Card from "../Card";
import PostTags from "./PostTags";
import { useEffect, useState } from "react";

const dateFormatter = (date: string): string => {
  const arr = date.split("-");
  return `${arr[0]}년 ${arr[1]}월 ${arr[2]}일`;
};

const PostList: React.FC = () => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
  } = useGetPostByPageQuery();
  const { data: tagsData } = useGetPostTagsQuery();

  // const [cards, setCards] = useState();

  // useEffect(() => {
  //   setCards(postsData)
  // },[])
  return (
    <Container>
      <PostTags tagsData={tagsData?.data} />
      <CardContainer>
        {postsData?.pages
          .map((page: any) => page.data.results)
          .flat()
          .map((post: any, idx: number, arr) => {
            return (
              <Card
                key={post._id}
                id={post._id}
                urlSlug={post.urlSlug}
                fetchNext={() => hasNextPage && fetchNextPage()}
                isLastItem={arr.length - 1 === idx}
              >
                <Card.Thumbnail img={post.thumbnail} />
                <Card.SecondSection>
                  <Card.TitleWrapper>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.SubTitle>{post.subTitle}</Card.SubTitle>
                  </Card.TitleWrapper>
                  <Card.Date>{dateFormatter(post.date)}</Card.Date>
                </Card.SecondSection>
                <Card.ThirdSection>
                  <Card.Tags>{post.tags}</Card.Tags>
                </Card.ThirdSection>
              </Card>
            );
          })}
      </CardContainer>
    </Container>
  );
};

export default PostList;

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
