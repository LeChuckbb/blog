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
import { deleteThumbnail, getUploadImageURL } from "../../apis/fileApi";
import axios from "axios";
import { getFileFromCF } from "../../apis/fileApi";

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
      thumbnail: prevData?.thumbnail?.name ? prevData.thumbnail.name : "",
      subTitle: prevData?.subTitle ? prevData?.subTitle : "",
      date: prevData?.date ? new Date(prevData?.date) : new Date(),
    },
  });

  const uploadThumbnailAndGetThumbnailName = async (
    thumbInput: string | FileList
  ): Promise<{ fileName: string; fileId?: string }> => {
    if (typeof thumbInput === "string") {
      const id = thumbInput !== "" ? prevData?.thumbnail?.id : "";
      // DB에 저장된 image file.
      return { fileName: thumbInput, fileId: id };
    } else {
      const formData = new FormData();
      formData.append("file", thumbInput[0]);

      // 이미지 기존의 파일명이 cloudFlare에 그대로 수록되는데, 변경할 순 없나?
      const uploadURL = await getUploadImageURL();
      const uploadResult = await axios.post(uploadURL.data, formData);
      const {
        data: {
          result: { id, filename },
        },
      } = uploadResult;

      return { fileName: filename, fileId: id };
    }
  };

  const onValidSubmit: SubmitHandler<FormInterface> = async (formInputData) => {
    console.log("onValidSubmit");
    toast.dismiss(); // toast 종료하기

    // thumbInput 1) string(이미 업로드한 썸네일이 있을 떄) 2)FileList (새로운 파일 업로드시) 3)string '' (아무것도 없을 떄)
    // thumbnail = string | file
    const { date, thumbnail: thumbInput } = formInputData;
    const { fileName, fileId } = await uploadThumbnailAndGetThumbnailName(
      thumbInput
    );

    const body: any = {
      ...formInputData,
      ...postFetchBody,
      date: dateFormatter(date),
      // * DB에는 썸네일 파일명만 저장
      thumbnail: {
        name: fileName,
        id: fileId,
      },
    };

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

    // 썸네일 Preview
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setThumbnailImage(reader.result as string); // blob
    });

    reader.readAsDataURL(file);
    register("thumbnail").onChange(event);
  };

  const handleDeleteButtonClick = async () => {
    setThumbnailImage(null);
    // DB에서 삭제하기
    await deleteThumbnail(prevData._id);
    setValue("thumbnail", "");
  };

  useEffect(() => {
    // 썸네일 Preview
    // db에 저장된 thumbnail ID를 기반으로 CF에서 이미지 가져오기
    const getFileAndSet = async () => {
      const { result, base64Image } = await getFileFromCF(
        prevData.thumbnail.id,
        "thumbnail"
      );
      setThumbnailImage(
        `data:${result?.headers["content-type"]};base64,${base64Image}`
      );
    };
    if (prevData?.thumbnail?.id) {
      getFileAndSet();
    }
  }, []);

  useEffect(() => {
    setValue(
      "urlSlug",
      postFetchBody?.title?.replaceAll(" ", "-").replaceAll("/", "")
    );
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
