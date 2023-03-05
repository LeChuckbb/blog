import { useMutation } from "react-query";
import { createPost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import useMyToast from "../useMyToast";

export const useCreatePostMutation = () => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((body: any) => createPost(body), {
    onSuccess: (result) => {
      result.data.urlSlug
        ? router.push(`/post/${result.data.urlSlug}`)
        : router.push("/");
    },
    onError: (error) => {
      if (
        isAxiosError(error) &&
        error.response?.data?.error?.code === "POE001"
      ) {
        callToast("중복된 URL 입니다.", "create");
      }
    },
  });
};
