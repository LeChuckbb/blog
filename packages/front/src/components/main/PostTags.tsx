import styled from "@emotion/styled";

const PostTags: React.FC = () => {
  return (
    <Tag>
      <TagLI>전체보기</TagLI>
      <TagLI>node.js</TagLI>
      <TagLI>CSS</TagLI>
      <TagLI>AWS</TagLI>
      <TagLI>MySQL</TagLI>
      <TagLI>Sass</TagLI>
      <TagLI>Production</TagLI>
      <TagLI>Server</TagLI>
      <TagLI>HTTP</TagLI>
      <TagLI>React</TagLI>
      <TagLI>EC2</TagLI>
      <TagLI>Redux</TagLI>
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

export default PostTags;
