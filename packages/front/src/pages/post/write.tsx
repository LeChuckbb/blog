import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";

import { Chip as TagChip } from "design/src/stories/Chip";
import Tooltip from "design/src/stories/Tooltip";
import { Button } from "design/src/stories/Button";

import useWrite, {
  FormInterface,
  WriteProps,
} from "../../components/posts/write/useWrite";
import WrtieCompletePage from "../../components/posts/write/complete/WriteCompletePage";
import IconArrowPrev from "../../../public/icons/arrow_back.svg";
import { AppError } from "../../lib/api";
import LocalErrorBoundary from "../../hooks/\berror/LocalErrorBoundary";
import { NextSeo } from "next-seo";
import mongo from "../../lib/mongo";
import { ObjectId } from "mongodb";

const NoSsrEditor = dynamic(
  () => import("../../components/posts/write/WriteEditor"),
  {
    ssr: false,
  }
);

// const Write = ({ data }: WriteProps) => {
const Write = (props) => {
  const data = JSON.parse(props.data);
  const {
    editorRef,
    tagsArray,
    onValidSubmit,
    onInvalidSubmit,
    onClickRemoveTagHandler,
    isTagInputFocusIn,
    getWriteSubPageProps,
    getTagInputProps,
  } = useWrite(data);
  const { register, handleSubmit } = useForm<FormInterface>();
  const router = useRouter();
  const content = data?.markdown;

  return (
    <Container>
      <NextSeo noindex={true} nofollow={true} />
      <LocalErrorBoundary>
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
                type="text"
                placeholder="태그를 입력하세요"
                autoComplete="off"
                {...register("tag")}
                {...getTagInputProps()}
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
        <WrtieCompletePage prevData={data} {...getWriteSubPageProps()} />
      </LocalErrorBoundary>
    </Container>
  );
};

// post/write?slug=xxx (UPDATE)
// query slug?=가 있으면 data fetch (query가 있어야 하기 때문에 SSG로 전환이 불가.)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (!id) return { props: { data: null } };

  const { postsCollection } = await mongo();
  const data = await postsCollection.findOne({
    _id: new ObjectId(id as string),
  });

  if (!data) throw new AppError("POE005", "게시글 조회 실패", 404);

  return {
    props: { data: JSON.stringify(data) },
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

export default Write;
