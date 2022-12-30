import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import useWrite from "../../hooks/useWrite";

const NoSsrEditor = dynamic(
  () => import("../../components/posts/WriteEditor"),
  {
    ssr: false,
  }
);

const write: React.FC = () => {
  const {
    ref,
    tagsArray,
    tag,
    setTag,
    onKeyDownHandler,
    onSubmitHandler,
    onClickRemoveTagHandler,
  } = useWrite();

  return (
    <Container>
      <form onSubmit={onSubmitHandler}>
        <Header>
          <TitleInput type="text" placeholder="제목을 입력하세요" />
          <TagsWrapper>
            {tagsArray?.map((el, idx) => (
              <Tag onClick={() => onClickRemoveTagHandler(idx)} key={idx}>
                {el}
              </Tag>
            ))}
            <TagInput
              type="text"
              value={tag}
              placeholder="태그를 입력하세요"
              onChange={(event) => setTag(event.target.value)}
              onKeyDown={onKeyDownHandler}
            />
          </TagsWrapper>
        </Header>
        <NoSsrEditor content="" editorRef={ref} />
        <ButtonWrapper>
          <input
            type="button"
            value="나가기"
            style={{
              flex: "1 1 30%",
              backgroundColor: "green",
            }}
          />
          <input
            type="submit"
            value="출간하기"
            style={{
              flex: "1 1 70%",
              backgroundColor: "khaki",
            }}
          />
        </ButtonWrapper>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px;
`;

const TitleInput = styled.input`
  height: 66px;
  display: block;
  resize: none;
  width: 100%;
  line-height: 1.5;
  font-size: 42px;
  border: none;
`;

const TagsWrapper = styled.div`
  display: flex;
  gap: 4px;
  /* flex-wrap: wrap; */
`;

const Tag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 16px;
  background-color: aqua;
  cursor: pointer;
  :hover {
    opacity: 0.7;
    transition: opacity 0.1s;
  }
`;

const TagInput = styled.input`
  font-size: 20px;
  width: 100%;
  border: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  height: 40px;
`;

export default write;
