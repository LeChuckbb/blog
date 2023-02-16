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
  // const content = data?.content && NodeHtmlMarkdown.translate(data?.content);
  const [isTagInputFocusIn, setIsTagInputFocusIn] = useState(false);

  const onTagFocusHandler = () => {
    setIsTagInputFocusIn(true);
  };

  const onTagFocusOutHandler = () => {
    setIsTagInputFocusIn(false);
  };

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
            {tagsArray?.map((el, idx) => (
              <Tag onClick={() => onClickRemoveTagHandler(idx)} key={idx}>
                {el}
              </Tag>
            ))}
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
              <TagTooltip>
                엔터를 입력하여 태그를 등록해주세요. <br />
                등록된 태그를 클릭하면 삭제됩니다.
              </TagTooltip>
            )}
          </TagsWrapper>
        </TitleWrapper>
        <NoSsrEditor content={content} editorRef={editorRef} />
        <BottomButtonWrapper>
          <LeftButtonSection
            onClick={() => router.back()}
            css={(theme) => ({
              fill: theme.colors.neutral.onBackground,
            })}
          >
            <IconArrowPrev />
            <ExitButton type="button" value="나가기" />
          </LeftButtonSection>
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
`;

const Tag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};
  cursor: pointer;
  :hover {
    opacity: 0.7;
    transition: opacity 0.1s;
  }
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

const TagTooltip = styled.div`
  position: absolute;
  background: ${(props) => props.theme.colors.primary.container};
  color: ${(props) => props.theme.colors.primary.onContainer};
  bottom: -32px;
  font-size: 14px;
  line-height: 1.2;
  z-index: 9999;
  padding: 14px 16px;
  border-radius: 4px;
`;

const BottomButtonWrapper = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 8px;
`;

const LeftButtonSection = styled.div`
  display: flex;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  :hover {
    background: ${(props) => props.theme.colors.neutralVariant.surfaceVariant};
  }
`;

const ExitButton = styled.input`
  background: none;
  border: none;
  line-height: 1.6;
  cursor: inherit;
  color: ${(props) => props.theme.colors.neutral.onBackground};
  fill: inherit;
  border-radius: 4px;
`;

const CreateNewPostButton = styled.input`
  background: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};
  padding: 8px;
  border: none;
  cursor: pointer;
  :hover {
    opacity: 0.9;
  }
`;

export default write;
