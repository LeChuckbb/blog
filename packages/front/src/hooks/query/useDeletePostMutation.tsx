import { useMutation } from "react-query";
import { deletePost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import useMyToast from "../useMyToast";

export const useDeletePostMutation = (content: any, setModal: any) => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((slug: string) => deletePost(slug), {
    onSuccess: () => {
      router.push("/");
      setModal({ isOpen: false, content });
    },
    onError: (error) => {
      setModal({ isOpen: false, content });
      if (
        isAxiosError(error) &&
        error.response?.data?.error?.code === "POE002"
      ) {
        callToast("삭제에 실패했습니다.", "delete");
      }
    },
  });
};
