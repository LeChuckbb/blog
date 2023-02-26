import styled from "@emotion/styled";
import { useGetPostByPageQuery } from "../../hooks/query/useGetPostByPageQuery";
import Card from "design/src/stories/Card";

interface Props {
  selectedTag: string;
}

const dateFormatter = (date: string): string => {
  if (date == undefined) return "";

  const arr = date?.split("-");
  return `${arr[0]}.${arr[1]}.${arr[2]}`;
};

const PostList = ({ selectedTag }: Props) => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
  } = useGetPostByPageQuery(selectedTag);

  return (
    <CardContainer className="CardContainer">
      {postsData?.pages
        .map((page: any) => page.results)
        .flat()
        .map((post: any, idx: number, arr: any) => {
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
                <Card.Date>{dateFormatter(post?.date)}</Card.Date>
              </Card.SecondSection>
              <Card.ThirdSection>
                <Card.Tags>{post.tags}</Card.Tags>
              </Card.ThirdSection>
            </Card>
          );
        })}
    </CardContainer>
  );
};

export default PostList;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  /* height: calc(100vh - 66px - 64px); */
`;
