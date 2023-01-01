import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import useWrite from "../../hooks/useWrite";
import { useForm } from "react-hook-form";
import WriteSubPage from "../../components/posts/WriteSubPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const NoSsrEditor = dynamic(
  () => import("../../components/posts/WriteEditor"),
  {
    ssr: false,
  }
);

export interface FormInterface {
  title: string;
  tag: Array<string>;
  content: string;
}

const write: React.FC = () => {
  const {
    editorRef,
    subPageRef,
    tagsArray,
    tag,
    fetchBody,
    setTag,
    onKeyDownHandler,
    onValidSubmit,
    onInvalidSubmit,
    onClickRemoveTagHandler,
  } = useWrite();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInterface>();

  return (
    <Container>
      <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <TitleWrapper>
          <TitleInput
            {...register("title", { required: "제목을 입력해주세요" })}
            type="text"
            placeholder="제목을 입력하세요"
          />
          <TagsWrapper>
            {tagsArray?.map((el, idx) => (
              <Tag onClick={() => onClickRemoveTagHandler(idx)} key={idx}>
                {el}
              </Tag>
            ))}
            <TagInput
              type="text"
              {...register("tag")}
              value={tag}
              placeholder="태그를 입력하세요"
              onChange={(event) => setTag(event.target.value)}
              onKeyDown={onKeyDownHandler}
            />
          </TagsWrapper>
        </TitleWrapper>
        <NoSsrEditor content="" editorRef={editorRef} />
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
        <ToastContainer />
      </form>
      <WriteSubPage fetchBody={fetchBody} subPageRef={subPageRef} />
    </Container>
  );
};

// -----------------------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleWrapper = styled.div`
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
