import styled from "@emotion/styled";
import { useGetPostByPageQuery } from "../../hooks/query/useGetPostByPageQuery";
import Card from "design/src/stories/Card";
import ImageDefault from "../../../public/static/thumbnail/default.svg";

interface Props {
  selectedTag: string;
  images: [{ image: string; id: string }];
}

const dateFormatter = (date: string): string => {
  if (date == undefined) return "";

  const arr = date?.split("-");
  return `${arr[0]}.${arr[1]}.${arr[2]}`;
};

const PostList = ({ selectedTag, images }: Props) => {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
  } = useGetPostByPageQuery(selectedTag);

  const fetchNextHandler = () => {
    hasNextPage && fetchNextPage();
  };

  return (
    <CardContainer className="CardContainer">
      {postsData?.pages
        .map((page: any) => page.results)
        .flat()
        .map((post: any, idx: number, arr: any) => {
          const image = images.filter((item) => item?.id === post.thumbnail.id);
          return (
            <Card
              key={post._id}
              id={post._id}
              urlSlug={post.urlSlug}
              fetchNext={fetchNextHandler}
              isLastItem={arr.length - 1 === idx}
            >
              <Card.Thumbnail
                ImageDefault={ImageDefault}
                images={image[0]?.image}
              />
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
  column-gap: 16px;
  margin-bottom: 60px;
`;
