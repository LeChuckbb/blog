import styled from "@emotion/styled";
import { PostTagsType } from "../../hooks/query/useGetPostTagsQuery";
import { useGetPostTagsQuery } from "../../hooks/query/useGetPostTagsQuery";

interface Props {
  tagsData?: PostTagsType;
  setTag: (tag: string | any) => unknown;
}

const PostTags: React.FC<Props> = (props) => {
  const { setTag } = props;
  const { data } = useGetPostTagsQuery();
  const tagsData = data?.data as PostTagsType;

  const onClickTagList = (tag: string) => {
    setTag(tag);
  };

  return (
    <Tag>
      <TagLI onClick={() => onClickTagList("all")}>
        all
        <Count>{tagsData?.count}</Count>
      </TagLI>
      {tagsData?.tags.map((tag: any) => {
        return (
          <TagLI key={tag._id} onClick={() => onClickTagList(tag.name)}>
            {tag.name}
            <Count>{tag.count}</Count>
          </TagLI>
        );
      })}
    </Tag>
  );
};

const Tag = styled.ul`
  list-style: none;
  display: flex;
  gap: 8px;
  padding: 16px;
  width: 100%;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TagLI = styled.li`
  display: flex;
  gap: 4px;
  border: 1px solid black;
  border-radius: 12px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.3s;
  :hover {
    color: red;
    background-color: aliceblue;
  }
`;

const Count = styled.span`
  color: red;
`;

export default PostTags;
