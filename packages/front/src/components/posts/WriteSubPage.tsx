import styled from "@emotion/styled";
import { SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import IconThumbnail from "../../../public/thumbnail.svg";
import { useCreatePostMutation } from "../../hooks/query/useCreatePostMutation";
import { useUpdatePostMutation } from "../../hooks/query/useUpdatePostMutation";
import useWriteSubPage, {
  FormInterface,
  WriteSubPageProps,
} from "./useWriteSubPage";
import useMyToast from "../../hooks/useMyToast";
import { Button, ButtonLikeLabel } from "design/src/stories/Button";
import TextField from "design/src/stories/TextField";
import MyDatePicker from "design/src/stories/DatePicker";
import { useEffect } from "react";
import { ChangeEvent } from "react";
import { useState } from "react";
import Image from "next/image";

const WriteSubPage: React.FC<WriteSubPageProps> = ({
  prevData,
  postFetchBody,
  subPageRef,
}) => {
  const {
    onClickSubPageCancelHandler,
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    errors,
    router,
    control,
    isUpdatePost,
    dateFormatter,
  } = useWriteSubPage(prevData, postFetchBody);
  const { mutate: createPost } = useCreatePostMutation();
  const { mutate: updatePost } = useUpdatePostMutation();
  const { callToast } = useMyToast();
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);

  const onValidSubmit: SubmitHandler<FormInterface> = async (formInputData) => {
    toast.dismiss(); // toast 종료하기
    const { date, thumbnail } = formInputData;
    const file = thumbnail[0];
    const body: any = {
      ...formInputData,
      tags: postFetchBody.tags,
      title: postFetchBody.title,
      html: postFetchBody.content.html,
      markup: postFetchBody.content.markup,
      date: dateFormatter(date),
      thumbnail: file,
    };

    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          formData.append(key, item);
        }
      } else {
        formData.append(key, value as string);
      }
    }

    isUpdatePost
      ? await updatePost({
          slug: router.query.slug as string,
          body,
        })
      : await createPost(formData);
  };

  const onInvalidSubmit = (errors: any) => {
    console.log("onInvalid");
    console.log(errors);
    errors?.urlSlug?.message && callToast(errors.urlSlug.message, "urlSlug");
    errors?.date?.message && callToast(errors.date.message, "date");
    errors?.subTitle?.type === "maxLength" &&
      callToast(errors.subTitle.message, "subTitle");
  };

  const handleThumbnailFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setThumbnailImage(reader.result as string);
    });

    reader.readAsDataURL(file);
    register("thumbnail").onChange(event);
  };

  useEffect(() => {
    setValue("urlSlug", postFetchBody?.title?.replaceAll(" ", "-"));
  }, [postFetchBody]);

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
    >
      <SubPage className="SubPage hide" ref={subPageRef}>
        <Container>
          <ColumnWrapper style={{ gap: "12px" }}>
            <Box>
              <label htmlFor="thumb_container">포스트 미리보기</label>
              <Thumbnail id="thumb_container">
                {thumbnailImage ? (
                  <Image
                    src={thumbnailImage}
                    width={320}
                    height={225}
                    alt="thumbnail"
                  />
                ) : (
                  <>
                    <IconThumbnail style={{ width: "auto" }} />
                    <ButtonLikeLabel variant="tonal" htmlFor="thumbnail">
                      썸네일 업로드
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/jpg, image/png, image/jpeg"
                        style={{ display: "none" }}
                        {...register("thumbnail")}
                        onChange={handleThumbnailFileChange}
                      />
                    </ButtonLikeLabel>
                  </>
                )}
              </Thumbnail>
            </Box>
            {thumbnailImage && (
              <ThumbButtonWrapper>
                <Button variant="text" onClick={() => setThumbnailImage(null)}>
                  삭제
                </Button>
              </ThumbButtonWrapper>
            )}
          </ColumnWrapper>
          <VerticalLine />
          <ColumnWrapper>
            <TextField
              id="subTitle"
              getValues={getValues}
              variant="outlined"
              support
              multiline
              errors={errors?.subTitle}
            >
              <TextField.InputBox>
                <TextField.Area
                  register={register}
                  registerOptions={{
                    maxLength: { value: 150, message: "Max length is 150" },
                  }}
                />
                <TextField.Label label="Sub Title" />
              </TextField.InputBox>
              <TextField.SupportBox watch={watch} />
            </TextField>
            <TextField id="urlSlug" getValues={getValues} variant="outlined">
              <TextField.InputBox>
                <TextField.Input
                  defaultValue={`${postFetchBody?.title?.replaceAll(" ", "-")}`}
                  register={register}
                  registerOptions={{ required: "URL Slug를 입력해주세요" }}
                />
                <TextField.Label label="URL Slug" />
              </TextField.InputBox>
            </TextField>
            <MyDatePicker id="date" getValues={getValues} control={control} />
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
  padding: 32px;
  display: flex;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  gap: 16px;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  min-height: 350px;
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.outlineVariant};
  margin-left: 32px;
  margin-right: 32px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 18px;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 225px;
  background-color: #e9e9e9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
`;
const ThumbButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: auto;
`;
