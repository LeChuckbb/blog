import { useMutation, useQuery } from "react-query";
import { deletePost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const useDeletePostMutation = (content: any, setModal: any) => {
  const router = useRouter();

  return useMutation((slug: string) => deletePost(slug), {
    onSuccess: () => {
      router.push("/");
      setModal({ isOpen: false, content });
    },
    onError: (error) => {
      setModal({ isOpen: false, content });
      if (isAxiosError(error) && error.response?.data?.code === "POE002") {
        toast("삭제에 실패했습니다.", { toastId: "delete" });
      }
    },
  });
};
