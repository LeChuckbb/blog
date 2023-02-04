import { useMutation } from "react-query";
import { createPost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const useCreatePostMutation = () => {
  const router = useRouter();

  return useMutation((body) => createPost(body), {
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.data?.code === "POE001") {
        toast("중복된 URL 입니다", { toastId: "create" });
      }
    },
  });
};
