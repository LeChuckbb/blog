import styled from "@emotion/styled";
import { SubmitHandler, useForm } from "react-hook-form";
import { RefObject } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { createPost, updatePost } from "../../apis/postApi";
import { useRouter } from "next/router";
import { isAxiosError, AxiosError } from "axios";

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

  console.log(prevData);
  console.log(fetchBody);

  const onValidSubmit: SubmitHandler<FormInterface> = async (data) => {
    try {
      console.log("ON VALID");
      console.log(data);
      // toast 종료하기
      toast.dismiss();
      // POST API 호출하기
      const res = isUpdate
        ? await updatePost(router.query.slug as string, {
            ...data,
            ...fetchBody,
          })
        : await createPost({ ...data, ...fetchBody });
      console.log(res);
      if (res.status === 200 || 201) {
        router.push("/");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        console.log((err as AxiosError).response?.status);
        (err as AxiosError).response?.status === 409 &&
          toast("중복된 URL 입니다", { toastId: "duplicate" });
      }
    }
  };

  const onInvalidSubmit = (errors: any) => {
    console.log(errors);
    console.log(errors.urlSlug.message);
    errors?.urlSlug?.message &&
      toast(errors.urlSlug.message, { toastId: "urlSlug" });
    errors?.date?.message && toast(errors.date.message, { toastId: "date" });
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
      <SubPage className="SubPage hide" ref={subPageRef}>
        <div
          style={{
            backgroundColor: "lightgrey",
            width: "50%",
            height: "50%",
            padding: "32px",
          }}
        >
          <p>포스트 미리보기</p>
          <div>
            <button>썸네일 업로드</button>
            <input type="text" {...register("thumbnail")} />
          </div>

          <p>11월 독서</p>
          <textarea {...register("subTitle")} />

          <p>URL 설정</p>
          <input
            {...register("urlSlug", { required: "URL을 지정해주세요" })}
            // defaultValue={`${title?.replaceAll(" ", "-")}`}
            defaultValue={`${fetchBody?.title?.replaceAll(" ", "-")}`}
            type="text"
          />

          <p>date 설정</p>
          <input
            {...register("date", { required: "날짜를 지정해주세요" })}
            type="text"
          />

          <div>
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
          </div>
        </div>
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

  &.show {
    top: 0vh;
  }
`;
