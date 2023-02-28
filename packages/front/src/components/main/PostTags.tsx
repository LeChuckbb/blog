import styled from "@emotion/styled";
import { PostTagsType } from "../../hooks/query/useGetPostTagsQuery";
import { useGetPostTagsQuery } from "../../hooks/query/useGetPostTagsQuery";
import { Chip as Tag } from "design/src/stories/Chip";
import Badge from "design/src/stories/Badge";

interface Props {
  tagsData?: PostTagsType;
  setTag: (tag: string | any) => unknown;
}

const PostTags: React.FC<Props> = (props) => {
  const { setTag } = props;
  const { data } = useGetPostTagsQuery();

  const onClickTagList = (tag: string) => {
    setTag(tag);
  };

  return (
    <TagList>
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
  width: 100%;
  max-width: 100vw;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export default PostTags;
