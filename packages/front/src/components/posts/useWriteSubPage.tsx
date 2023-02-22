import { RefObject } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export type WriteSubPageProps = {
  subPageRef: RefObject<HTMLDivElement>;
  postFetchBody: any;
  prevData?: any;
};
export interface FormInterface {
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

  return {
    onClickSubPageCancelHandler,
    register,
    handleSubmit,
    getValues,
    watch,
    dateFormatter,
    setValue,
    control,
    errors,
    router,
    isUpdatePost,
  };
};

export default useWriteSubPage;
