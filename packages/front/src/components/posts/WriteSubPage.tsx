import styled from "@emotion/styled";
import { SubmitHandler, useForm } from "react-hook-form";
import { RefObject } from "react";
import { ToastContainer, toast } from "react-toastify";
import IconThumbnail from "../../../public/thumbnail.svg";
import { useCreatePostMutation } from "../../hooks/query/useCreatePostMutation";
import { useUpdatePostMutation } from "../../hooks/query/useUpdatePostMutation";
import useWriteSubPage from "./useWriteSubPage";
import useMyToast from "../../hooks/useMyToast";
import { Button } from "design/src/stories/Button";
import TextField from "design/src/stories/TextField";

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
    getValues,
    errors,
    router,
    isUpdatePost,
  } = useWriteSubPage(prevData);
  const { mutate: createPost } = useCreatePostMutation();
  const { mutate: updatePost } = useUpdatePostMutation();
  const { callToast } = useMyToast();

  console.log(errors);

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
    console.log("onInvalid");
    console.log(errors);
    errors?.urlSlug?.message && callToast(errors.urlSlug.message, "urlSlug");
    errors?.date?.message && callToast(errors.date.message, "date");
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

            <TextField id="thumbnail" getValues={getValues}>
              <TextField.InputBox>
                <TextField.Input register={register} />
                <TextField.Label label="Thumbnail" />
              </TextField.InputBox>
            </TextField>
          </ColumnWrapper>
          <VerticalLine />
          <ColumnWrapper>
            {/* textArea, count, maxLength */}
            <TextField id="subTitle" getValues={getValues}>
              <TextField.InputBox>
                <TextField.Input
                  register={register}
                  registerOptions={{ maxLength: 150 }}
                />
                <TextField.Label label="Sub Title" />
              </TextField.InputBox>
              <TextField.SupportBox>{errors}</TextField.SupportBox>
            </TextField>

            <TextField id="urlSlug" getValues={getValues}>
              <TextField.InputBox>
                <TextField.Input
                  defaultValue={`${postFetchBody?.title?.replaceAll(" ", "-")}`}
                  register={register}
                  registerOptions={{ required: "URL Slug를 입력해주세요" }}
                />
                <TextField.Label label="URL Slug" />
              </TextField.InputBox>
            </TextField>

            <TextField id="date" getValues={getValues}>
              <TextField.InputBox>
                <TextField.Input
                  register={register}
                  registerOptions={{ required: "Date 를 입력해주세요" }}
                />
                <TextField.Label label="Date" />
              </TextField.InputBox>
            </TextField>

            <ButtonWrapper>
              <Button
                variant="outlined"
                onClick={(e) => onClickSubPageCancelHandler(e, subPageRef)}
              >
                취소
              </Button>
              <Button type="submit">{isUpdatePost ? "수정" : "작성"}</Button>
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
