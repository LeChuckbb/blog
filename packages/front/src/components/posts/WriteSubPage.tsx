import styled from "@emotion/styled";
import { SubmitHandler, useForm } from "react-hook-form";
import { RefObject } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { isAxiosError, AxiosError } from "axios";
import IconThumbnail from "../../../public/thumbnail.svg";
import { useCreatePostMutation } from "../../hooks/query/useCreatePostMutation";
import { useUpdatePostMutation } from "../../hooks/query/useUpdatePostMutation";

type Props = {
  subPageRef: RefObject<HTMLDivElement>;
  fetchBody: any;
  prevData?: any;
};

interface FormInterface {
  thumbnail: string;
  subTitle: string;
  urlSlug: string;
  date: string;
}

const onClickSubPageCancelHandler = (
  event: React.MouseEvent,
  subPageRef: RefObject<HTMLDivElement>
) => {
  event?.preventDefault(); // submit 방지
  if (subPageRef.current != null) {
    subPageRef.current.className = subPageRef.current.className.replace(
      "show",
      "hide"
    );
  }
};

const defaultDateHandler = () => {
  const date = new Date();

  return new Intl.DateTimeFormat("kr", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll(". ", "-")
    .slice(0, -1);
};

const WriteSubPage: React.FC<Props> = ({ prevData, fetchBody, subPageRef }) => {
  const { register, handleSubmit } = useForm<FormInterface>({
    defaultValues: {
      thumbnail: prevData?.thumbnail ? prevData?.thumbnail : "",
      subTitle: prevData?.subTitle ? prevData?.subTitle : "",
      date: prevData?.date ? prevData?.date : defaultDateHandler(),
    },
  });
  const router = useRouter();
  const isUpdate = router.query.slug === undefined ? false : true;
  const { mutate: createPost } = useCreatePostMutation();
  const { mutate: updatePost } = useUpdatePostMutation();

  const onValidSubmit: SubmitHandler<FormInterface> = async (data) => {
    toast.dismiss(); // toast 종료하기
    isUpdate
      ? await updatePost({
          slug: router.query.slug as string,
          body: {
            ...data,
            ...fetchBody,
          },
        })
      : await createPost({ ...data, ...fetchBody });
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
              <label htmlFor="textArea">11월 독서</label>
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
                // defaultValue={`${title?.replaceAll(" ", "-")}`}
                defaultValue={`${fetchBody?.title?.replaceAll(" ", "-")}`}
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
              <input
                type="button"
                value="취소"
                style={{
                  border: "2px solid yellow",
                  padding: "8px",
                }}
                onClick={(e) => onClickSubPageCancelHandler(e, subPageRef)}
              />
              <input type="submit" value="수정하기" />
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
  background: white;
  position: absolute;
  top: 100vh;
  transition: top 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  scale: 0;

  &.show {
    top: 0vh;
    scale: 1;
  }
`;

const Container = styled.div`
  background-color: lightgrey;
  width: 50%;
  height: 50%;
  padding: 32px;
  display: flex;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
`;

const ImageBtnLabel = styled.label`
  cursor: pointer;
  border: 2px solid navy;
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  background-color: red;
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
`;
