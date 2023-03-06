import { useMutation } from "react-query";
import { deletePost } from "../../apis/postApi";
import { useRouter } from "next/router";
import useMyToast from "../useMyToast";

export const useDeletePostMutation = (content: any, setModal: any) => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((id: string) => deletePost(id), {
    onSuccess: () => {
      router.push("/");
      setModal({ isOpen: false, content });
    },
    onError: () => {
      setModal({ isOpen: false });
    },
  });
};
