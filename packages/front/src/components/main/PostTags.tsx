import styled from "@emotion/styled";
import { PostTagsType } from "../../hooks/query/useGetPostTagsQuery";
import { useGetPostTagsQuery } from "../../hooks/query/useGetPostTagsQuery";
import { Chip as Tag } from "design/src/stories/Chip";
import Badge from "design/src/stories/Badge";
import { useRef } from "react";
import { useEffect } from "react";

interface Props {
  tagsData?: PostTagsType;
  setTag: (tag: string | any) => unknown;
}

const PostTags: React.FC<Props> = (props) => {
  const { setTag } = props;
  const { data } = useGetPostTagsQuery();
  const touchContainerRef = useRef<HTMLUListElement | null>(null);

  const onClickTagList = (tag: string) => {
    setTag(tag);
  };

  useEffect(() => {
    if (touchContainerRef.current) {
      let startX = 0;
      let pressed = false;

      touchContainerRef.current.addEventListener(
        "mousedown",
        (e: MouseEvent) => {
          pressed = true;
          startX = e.clientX;
          if (touchContainerRef.current !== null)
            touchContainerRef.current.style.cursor = "grabbing";
        }
      );

      touchContainerRef.current.addEventListener("mouseleave", (e) => {
        pressed = false;
      });

      touchContainerRef.current.addEventListener("mouseup", (e: MouseEvent) => {
        pressed = false;
        if (touchContainerRef.current !== null)
          touchContainerRef.current.style.cursor = "grab";
      });

      touchContainerRef.current.addEventListener(
        "mousemove",
        (e: MouseEvent) => {
          if (!pressed) return;

          if (touchContainerRef.current !== null)
            touchContainerRef.current.scrollLeft += startX - e.clientX;
        }
      );
    }
  }, []);

  return (
    <TagList ref={touchContainerRef}>
      <Badge badgeContent={data?.count}>
        <Tag color="secondary" onClick={() => onClickTagList("all")}>
          all
        </Tag>
      </Badge>
      {data?.tags?.map((tag: any) => {
        return (
          <Badge badgeContent={tag.count} key={tag._id}>
            <Tag color="secondary" onClick={() => onClickTagList(tag.name)}>
              {tag.name}
            </Tag>
          </Badge>
        );
      })}
    </TagList>
  );
};

const TagList = styled.ul`
  list-style: none;
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
  scroll-snap-type: x;
  scroll-behavior: auto;
  ::-webkit-scrollbar {
    width: 0;
  }
  & .badge {
    scroll-snap-align: start;
  }
`;

export default PostTags;
