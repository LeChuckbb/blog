import { RefObject } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreatePostMutation } from "../../hooks/query/useCreatePostMutation";
import { useUpdatePostMutation } from "../../hooks/query/useUpdatePostMutation";
import useMyToast from "../../hooks/useMyToast";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChangeEvent } from "react";
import { useEffect } from "react";
import { uploadThumbnail } from "../../apis/postApi";

export type WriteSubPageProps = {
  subPageRef: RefObject<HTMLDivElement>;
  postFetchBody: any;
  prevData?: any;
};
interface FormInterface {
  thumbnail: string;
  subTitle: string;
  urlSlug: string;
  date: Date;
}

const onClickSubPageCancelHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
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

const dateFormatter = (date: Date) => {
  return new Intl.DateTimeFormat("kr", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll(". ", "-")
    .slice(0, -1);
};

const useWriteSubPage = (prevData: any, postFetchBody: any) => {
  const router = useRouter();
  const isUpdatePost = router.query.slug === undefined ? false : true;
  const { mutate: createPost } = useCreatePostMutation();
  const { mutate: updatePost } = useUpdatePostMutation();
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const { callToast } = useMyToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
  } = useForm<FormInterface>({
    mode: "onChange",
    defaultValues: {
      thumbnail: prevData?.thumbnail ? prevData?.thumbnail : "",
      subTitle: prevData?.subTitle ? prevData?.subTitle : "",
      date: prevData?.date ? new Date(prevData?.date) : new Date(),
    },
  });

  const onValidSubmit: SubmitHandler<FormInterface> = async (formInputData) => {
    console.log("onValidSubmit");
    toast.dismiss(); // toast 종료하기

    // thumbInput 1) string(이미 업로드한 썸네일이 있을 떄) 2)FileList (새로운 파일 업로드시) 3)string '' (아무것도 없을 떄)
    // thumbnail = string | file
    const { date, thumbnail: thumbInput } = formInputData;
    const thumbnail: any =
      typeof thumbInput === "string" ? thumbInput : thumbInput[0];
    const body: any = {
      ...formInputData,
      ...postFetchBody,
      date: dateFormatter(date),
      thumbnail: typeof thumbnail === "string" ? thumbnail : thumbnail?.name,
    };

    const formData = new FormData();
    formData.append("file", thumbnail);

    const uploadResult = await uploadThumbnail(formData);
    isUpdatePost
      ? updatePost({
          slug: router.query.slug as string,
          body,
        })
      : createPost(body);
  };

  const onInvalidSubmit = (errors: any) => {
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
      setThumbnailImage(reader.result as string); // blob
    });

    reader.readAsDataURL(file);
    register("thumbnail").onChange(event);
  };

  const handleDeleteButtonClick = () => {
    setThumbnailImage(null);
  };

  useEffect(() => {
    setValue("urlSlug", postFetchBody?.title?.replaceAll(" ", "-"));
  }, [postFetchBody]);

  useEffect(() => {
    // db의 thumbnail 파일명을 기반으로 서버 내 파일시스템에서 썸네일 불러오기
    const getFileAsBase64 = async (url: string) => {
      const response = await fetch(`/static/uploads/thumbnail/${url}`);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result
          ?.toString()
          .replace("data:", "")
          ?.replace(/^.+,/, "");
        setThumbnailImage(`data:image/png;base64,${base64data}`);
      };
    };
    if (prevData?.thumbnail) {
      getFileAsBase64(prevData?.thumbnail);
    }
  }, []);

  const getUseFormProps = ({ ...otherprops } = {}) => ({
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    control,
    errors,
    ...otherprops,
  });

  // <button {...getHandleSubmitProps({ onClick: handleBtn1Clicked })}></button>
  const getHandleSubmitProps = ({ ...otherprops } = {}) => ({
    onValidSubmit,
    onInvalidSubmit,
    ...otherprops,
  });

  return {
    thumbnailImage,
    isUpdatePost,
    onClickSubPageCancelHandler,
    getHandleSubmitProps,
    handleThumbnailFileChange,
    handleDeleteButtonClick,
    getUseFormProps,
  };
};

export default useWriteSubPage;
