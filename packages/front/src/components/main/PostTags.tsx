import styled from "@emotion/styled";
import { Chip as Tag } from "design/src/stories/Chip";
import Badge from "design/src/stories/Badge";
import { useRef } from "react";
import { useEffect } from "react";

interface TagType {
  _id: string;
  name: string;
  count: number;
}

export interface TagsType {
  count: number;
  tags: TagType[];
}

interface Props {
  tagsData?: TagsType;
  setTag: (tag: string) => void;
}

const PostTags = ({ tagsData, setTag }: Props) => {
  const touchContainerRef = useRef<HTMLUListElement>(null);

  const onClickTagList = (tag: string) => {
    setTag(tag);
  };

  useEffect(() => {
    if (!touchContainerRef.current) return;

    let startX = 0;
    let pressed = false;
    const touchContainer = touchContainerRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      pressed = true;
      startX = e.clientX;
      touchContainer.style.cursor = "grabbing";
    };
    const handleMouseLeave = () => {
      pressed = false;
    };
    const handleMouseUp = () => {
      pressed = false;
      touchContainer.style.cursor = "grab";
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!pressed) return;
      touchContainer.scrollLeft += startX - e.clientX;
    };

    touchContainer.addEventListener("mousedown", handleMouseDown);
    touchContainer.addEventListener("mouseleave", handleMouseLeave);
    touchContainer.addEventListener("mouseup", handleMouseUp);
    touchContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      touchContainer.removeEventListener("mousedown", handleMouseDown);
      touchContainer.removeEventListener("mouseleave", handleMouseLeave);
      touchContainer.removeEventListener("mouseup", handleMouseUp);
      touchContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, [touchContainerRef]);

  return (
    <TagList ref={touchContainerRef}>
      <Badge badgeContent={tagsData?.count}>
        <Tag color="secondary" onClick={() => onClickTagList("all")}>
          all
        </Tag>
      </Badge>
      {tagsData?.tags.map((tag: TagType) => {
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
