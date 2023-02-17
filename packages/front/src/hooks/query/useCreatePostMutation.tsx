import { useMutation } from "react-query";
import { createPost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useMyToast from "../useMyToast";

export const useCreatePostMutation = () => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((body: any) => createPost(body), {
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.data?.code === "POE001") {
        callToast("중복된 URL 입니다.", "create");
      }
    },
  });
};
