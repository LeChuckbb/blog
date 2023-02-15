import styled from "@emotion/styled";
import { SubmitHandler, useForm } from "react-hook-form";
import { RefObject } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import IconThumbnail from "../../../public/thumbnail.svg";
import { useCreatePostMutation } from "../../hooks/query/useCreatePostMutation";
import { useUpdatePostMutation } from "../../hooks/query/useUpdatePostMutation";
import useWriteSubPage from "./useWriteSubPage";

type Props = {
  subPageRef: RefObject<HTMLDivElement>;
  postFetchBody: any;
  prevData?: any;
};

interface FormInterface {
  thumbnail: string;
  subTitle: string;
  urlSlug: string;
  date: string;
}

const WriteSubPage: React.FC<Props> = ({
  prevData,
  postFetchBody,
  subPageRef,
}) => {
  const {
    onClickSubPageCancelHandler,
    register,
    handleSubmit,
    router,
    isUpdatePost,
  } = useWriteSubPage(prevData);
  const { mutate: createPost } = useCreatePostMutation();
  const { mutate: updatePost } = useUpdatePostMutation();

  const onValidSubmit: SubmitHandler<FormInterface> = async (formInputData) => {
    toast.dismiss(); // toast 종료하기
    isUpdatePost
      ? await updatePost({
          slug: router.query.slug as string,
          body: {
            ...formInputData,
            tags: postFetchBody.tags,
            title: postFetchBody.title,
            content: postFetchBody.content,
          },
        })
      : await createPost({
          ...formInputData,
          tags: postFetchBody.tags,
          title: postFetchBody.title,
          content: postFetchBody.content,
        });
  };

  const onInvalidSubmit = (errors: any) => {
    errors?.urlSlug?.message &&
      toast(errors.urlSlug.message, { toastId: "urlSlug" });
    errors?.date?.message && toast(errors.date.message, { toastId: "date" });
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
      <SubPage className="SubPage hide" ref={subPageRef}>
        <Container>
          <ColumnWrapper>
            <Box>
              <label htmlFor="Thumbnail">포스트 미리보기</label>
              <Thumbnail id="Thumbnail">
                <IconThumbnail style={{ width: "auto" }} />
                <ImageBtnLabel htmlFor="file">썸네일 업로드</ImageBtnLabel>
                <input id="file" type="file" style={{ display: "none" }} />
              </Thumbnail>
            </Box>

            <Box>
              <label>썸네일 업로드</label>
              <input type="text" {...register("thumbnail")} />
            </Box>
          </ColumnWrapper>

          <VerticalLine />

          <ColumnWrapper>
            <Box>
              <label htmlFor="textArea">{prevData?.title}</label>
              <TextArea
                {...register("subTitle")}
                id="textArea"
                maxLength={150}
              />
            </Box>

            <Box>
              <label htmlFor="urlSlug">URL 설정</label>
              <input
                id="urlSlug"
                {...register("urlSlug", { required: "URL을 지정해주세요" })}
                defaultValue={`${postFetchBody?.title?.replaceAll(" ", "-")}`}
                type="text"
              />
            </Box>

            <Box>
              <label htmlFor="date">date 설정</label>
              <input
                {...register("date", { required: "날짜를 지정해주세요" })}
                type="text"
                id="date"
              />
            </Box>
            <ButtonWrapper>
              <CancelBtn
                type="button"
                value="취소"
                onClick={(e) => onClickSubPageCancelHandler(e, subPageRef)}
              />
              <ConfirmBtn
                type="submit"
                value={isUpdatePost ? "수정" : "작성"}
              />
            </ButtonWrapper>
          </ColumnWrapper>
        </Container>
      </SubPage>
      <ToastContainer />
    </form>
  );
};

export default WriteSubPage;

const SubPage = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 100vh;
  transition: top 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  scale: 0;
  background-color: ${(props) => props.theme.colors.neutral.background};

  &.show {
    top: 0vh;
    scale: 1;
  }
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.neutral.background};
  width: 768px;
  /* height: 50%; */
  padding: 32px;
  display: flex;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  gap: 8px;
`;

const ImageBtnLabel = styled.label`
  cursor: pointer;
  border: 2px solid navy;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  min-height: 300px;
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.outlineVariant};
  margin-left: 32px;
  margin-right: 32px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.div`
  width: 100%;
  min-height: 200px;
  background-color: #e9e9e9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const TextArea = styled.textarea`
  resize: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: auto;
`;

const CancelBtn = styled.input`
  border: 2px solid yellow;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.primary.primary};
  background-color: ${(props) => props.theme.colors.neutral.background};
  :hover {
    opacity: 0.9;
  }
`;

const ConfirmBtn = styled.input`
  border: none;
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.primary.primary};
  color: ${(props) => props.theme.colors.primary.onPrimary};
  cursor: pointer;
  :hover {
    opacity: 0.9;
  }
`;
