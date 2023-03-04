import styled from "@emotion/styled";
import { Chip as Tag } from "design/src/stories/Chip";
import Badge from "design/src/stories/Badge";
import { useRef } from "react";
import { useEffect } from "react";

type PostTagsType = {
  count: number;
  tags: Array<object>;
};
interface Props {
  tagsData?: PostTagsType;
  setTag: (tag: string | any) => unknown;
}

const PostTags: React.FC<Props> = ({ tagsData, setTag }) => {
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
      <Badge badgeContent={tagsData?.count}>
        <Tag color="secondary" onClick={() => onClickTagList("all")}>
          all
        </Tag>
      </Badge>
      {tagsData?.tags.map((tag: any) => {
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
  ::-webkit-scrollbar {
    width: 0;
  }
  & .badge {
    scroll-snap-align: start;
  }
`;

export default PostTags;
