import { RefObject } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormInterface {
  thumbnail: string;
  subTitle: string;
  urlSlug: string;
  date: string;
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

const useWriteSubPage = (prevData: any) => {
  const router = useRouter();
  const isUpdatePost = router.query.slug === undefined ? false : true;
  const { register, handleSubmit } = useForm<FormInterface>({
    defaultValues: {
      thumbnail: prevData?.thumbnail ? prevData?.thumbnail : "",
      subTitle: prevData?.subTitle ? prevData?.subTitle : "",
      date: prevData?.date ? prevData?.date : defaultDateHandler(),
    },
  });

  return {
    onClickSubPageCancelHandler,
    register,
    handleSubmit,
    router,
    isUpdatePost,
  };
};

export default useWriteSubPage;
