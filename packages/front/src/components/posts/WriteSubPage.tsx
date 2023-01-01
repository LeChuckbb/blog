import styled from "@emotion/styled";
import { SubmitHandler, useForm } from "react-hook-form";
import { RefObject } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { createPost } from "../../apis/postApi";
import { useRouter } from "next/router";

const onClickSubPageCancelHandler = (
  event: React.MouseEvent,
  subPageRef: RefObject<HTMLDivElement>
) => {
  event?.preventDefault(); // submit 방지
  if (subPageRef.current != null) {
    console.log(subPageRef);
    console.log(subPageRef.current);
    console.log(subPageRef.current.className);
    subPageRef.current.className = subPageRef.current.className.replace(
      "show",
      "hide"
    );
  }
};

type Props = {
  subPageRef: RefObject<HTMLDivElement>;
  fetchBody: any;
};

interface FormInterface {
  thumbnail: string;
  subTitle: string;
  urlSlug: string;
  date: string;
}

const WriteSubPage: React.FC<Props> = ({ fetchBody, subPageRef }) => {
  const { register, handleSubmit, formState } = useForm<FormInterface>();
  const router = useRouter();

  const onValidSubmit: SubmitHandler<FormInterface> = async (data) => {
    // toast 종료하기
    toast.dismiss();
    // POST API 호출하기
    console.log("SubPage 서브밋");
    console.log(data);

    const res = await createPost({ ...data, ...fetchBody });
    if (res.status === 201) {
      router.push("/");
    }
  };

  const onInvalidSubmit = (errors: any) => {
    errors.urlSlug.message &&
      toast(errors.urlSlug.message, { toastId: "urlSlug" });
    errors.date.message && toast(errors.date.message, { toastId: "date" });
  };

  console.log(fetchBody);
  console.log(`/${fetchBody?.title?.replaceAll(" ", "-")}`);

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
          <textarea
            {...register("subTitle")}
            defaultValue="생계형 개발자, SI에서 살아남기"
          ></textarea>

          <p>URL 설정</p>
          <input
            {...register("urlSlug", { required: "URL을 지정해주세요" })}
            defaultValue={`/${fetchBody?.title?.replaceAll(" ", "-")}`}
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
                color: "white",
                padding: "16px",
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
  transform: scale(0);

  &.show {
    transform: scale(1);
    top: 0vh;
  }
`;
