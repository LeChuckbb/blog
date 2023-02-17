import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import useWrite from "../../hooks/useWrite";
import { useForm } from "react-hook-form";
import WriteSubPage from "../../components/posts/WriteSubPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { GetServerSideProps } from "next";
import { getPostBySlug } from "../../apis/postApi";
import { useRouter } from "next/router";
import IconArrowPrev from "../../../public/icons/arrow_back.svg";
import { useState } from "react";
import { Button } from "design/src/stories/Button";
import { Chip as TagChip } from "design/src/stories/Chip";
import Tooltip from "design/src/stories/Tooltip";

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

interface Props {
  data?: any;
}

const write = ({ data }: Props) => {
  const {
    editorRef,
    subPageRef,
    tagsArray,
    tag,
    postFetchBody,
    setTag,
    onKeyDownHandler,
    onValidSubmit,
    onInvalidSubmit,
    onClickRemoveTagHandler,
  } = useWrite(data);
  const { register, handleSubmit } = useForm<FormInterface>();
  const router = useRouter();
  const content = data?.content?.markup;
  const [isTagInputFocusIn, setIsTagInputFocusIn] = useState(false);

  const onTagFocusHandler = () => setIsTagInputFocusIn(true);
  const onTagFocusOutHandler = () => setIsTagInputFocusIn(false);
  return (
    <Container>
      <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <TitleWrapper>
          <TitleInput
            {...register("title", { required: "제목을 입력해주세요" })}
            type="text"
            placeholder="제목을 입력하세요"
            defaultValue={data?.title}
          />
          <TagsWrapper>
            <TagList>
              {tagsArray?.map((el, idx) => (
                <TagChip
                  variant="input"
                  onClick={() => onClickRemoveTagHandler(idx)}
                  key={idx}
                >
                  {el}
                </TagChip>
              ))}
            </TagList>
            <TagInput
              {...register("tag")}
              type="text"
              value={tag}
              placeholder="태그를 입력하세요"
              onChange={(event) => setTag(event.target.value)}
              onKeyDown={onKeyDownHandler}
              autoComplete="off"
              onFocus={onTagFocusHandler}
              onBlur={onTagFocusOutHandler}
            />
            {isTagInputFocusIn && (
              <Tooltip
                variant="long"
                css={{ position: "absolute", opacity: 1, bottom: "-16px" }}
              >
                엔터를 입력하여 태그를 등록해주세요. <br />
                등록된 태그를 클릭하면 삭제됩니다.
              </Tooltip>
            )}
          </TagsWrapper>
        </TitleWrapper>
        <NoSsrEditor content={content} editorRef={editorRef} />
        <BottomButtonWrapper>
          <Button icon variant="outlined" onClick={() => router.back()}>
            <IconArrowPrev width={18} height={18} />
            나가기
          </Button>
          <Button type="submit">출간하기</Button>
        </BottomButtonWrapper>
        <ToastContainer />
      </form>
      <WriteSubPage
        prevData={data}
        postFetchBody={postFetchBody}
        subPageRef={subPageRef}
      />
    </Container>
  );
};

// post/write?slug=xxx (UPDATE)
// query slug?=가 있으면 data fetch
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (Object.values(query).length === 0) return { props: { data: null } };
  // 실패시 에러 처리 요망
  const res = await getPostBySlug(query.slug as string);

  return {
    props: { data: res.data },
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px;
  position: relative;
`;

const TitleInput = styled.input`
  height: 66px;
  display: block;
  resize: none;
  width: 100%;
  line-height: 1.5;
  font-size: 42px;
  border: none;
  background: ${(props) => props.theme.colors.neutral.background};
  color: ${(props) => props.theme.colors.primary.onContainer};
  border-radius: 4px;
  transition: outline 0.1s, outline-color 0.1s;
  :focus-visible {
    outline: solid 2px;
    outline-color: ${(props) => props.theme.colors.primary.container};
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  gap: 4px;
  height: 40px;
  overflow: hidden;
  align-items: center;
`;

const TagList = styled.ul`
  display: flex;
  gap: 4px;
`;

const TagInput = styled.input`
  font-size: 20px;
  flex-grow: 1;
  border: none;
  border-radius: 4px;
  background: ${(props) => props.theme.colors.neutral.background};
  color: ${(props) => props.theme.colors.primary.onContainer};
  transition: outline 0.1s, outline-color 0.1s;
  :focus-visible {
    outline-color: ${(props) => props.theme.colors.primary.container};
  }
`;

const BottomButtonWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 8px;
`;

export default write;
