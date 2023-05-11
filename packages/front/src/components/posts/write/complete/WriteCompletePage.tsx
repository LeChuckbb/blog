import styled from "@emotion/styled";
import { ToastContainer } from "react-toastify";
import IconThumbnail from "../../../../../public/thumbnail.svg";
import useWriteCompletePage, {
  WriteSubPageProps,
} from "./useWriteCompletePage";
import { Button, ButtonLikeLabel } from "design/src/stories/Button";
import TextField from "design/src/stories/TextField";
import MyDatePicker from "design/src/stories/DatePicker";
import Image from "next/image";

const WriteCompletePage: React.FC<WriteSubPageProps> = ({
  prevData,
  postFetchBody,
  subPageRef,
}) => {
  const {
    isUpdatePost,
    thumbnailImage,
    onClickSubPageCancelHandler,
    handleThumbnailFileChange,
    handleDeleteButtonClick,
    getHandleSubmitProps,
    getUseFormProps,
  } = useWriteCompletePage(prevData, postFetchBody);

  const { register, handleSubmit, getValues, watch, errors, control } =
    getUseFormProps();
  const { onValidSubmit, onInvalidSubmit } = getHandleSubmitProps();

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
                        accept="image/*"
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
                <Button variant="text" onClick={handleDeleteButtonClick}>
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

export default WriteCompletePage;

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
