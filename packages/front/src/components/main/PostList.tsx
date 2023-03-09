import styled from "@emotion/styled";
import Card from "design/src/stories/Card";
import ImageDefault from "../../../public/static/thumbnail/default.svg";
import { PostSchema } from "../../types/post";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  selectedTag: string;
  posts: [PostSchema];
}

const dateFormatter = (date: string): string => {
  if (date == undefined) return "";
  const arr = date?.split("-");
  return `${arr[0]}.${arr[1]}.${arr[2]}`;
};

// 1. 전부 가져오기
const getSelectedPagePostAll = (selectedTag: string, posts: [PostSchema]) => {
  return selectedTag === "all"
    ? posts
    : posts.filter((post) => {
        return post.tags.length !== 0 ? post.tags.includes(selectedTag) : false;
      });
};

// 2. 8개만 가져오기
const getSelectedPagePostPart = (selectedTag: string, posts: [PostSchema]) => {
  if (selectedTag === "all") {
    return posts.slice(0, 8);
  } else {
    const filteredPost = posts.filter((post) => {
      return post.tags.length !== 0 ? post.tags.includes(selectedTag) : false;
    });

    return filteredPost.slice(0, 8);
  }
};

const PostList = ({ selectedTag, posts }: Props) => {
  const [currentPosts, setCurrentPosts] = useState<PostSchema[]>(
    getSelectedPagePostPart(selectedTag, posts)
  );
  const [selectedPost, setSelectedPost] = useState<PostSchema[]>(
    getSelectedPagePostAll(selectedTag, posts)
  );
  const [nextPage, setNextPage] = useState(2);
  const POSTS_PER_PAGE = 8;

  const fetchNextPage = () => {
    const start = (nextPage - 1) * POSTS_PER_PAGE;
    const end = nextPage * POSTS_PER_PAGE;
    const nextArr = selectedPost.slice(start, end);
    setCurrentPosts((prev) => [...prev, ...nextArr]);
    setNextPage((prev) => prev + 1);
  };

  useEffect(() => {
    // 1. 최초 렌더링시
    // 2. 태그가 선택될 때마다
    // -> Array를 교체하여 게시글 목록을 변경, 출력
    const filteredArray = getSelectedPagePostPart(selectedTag, posts);
    setCurrentPosts(filteredArray);
    setSelectedPost(getSelectedPagePostAll(selectedTag, posts));
    setNextPage(2);
  }, [posts, selectedTag]);

  return (
    <CardContainer className="CardContainer">
      {currentPosts?.map((post: PostSchema, idx: number, arr) => {
        return (
          <Card
            key={post._id}
            id={post._id as string}
            urlSlug={post.urlSlug}
            fetchNext={() =>
              currentPosts.length !== selectedPost.length && fetchNextPage()
            }
            isLastItem={arr.length - 1 === idx}
          >
            <Card.Thumbnail
              ImageDefault={ImageDefault}
              imageId={post?.thumbnail?.id}
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

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  column-gap: 16px;
  margin-bottom: 60px;
`;
