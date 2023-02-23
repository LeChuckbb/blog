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

  const handleDeleteButtonClick = () => {
    setThumbnailImage(null);
  };

  useEffect(() => {
    setValue("urlSlug", postFetchBody?.title?.replaceAll(" ", "-"));
  }, [postFetchBody]);

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
