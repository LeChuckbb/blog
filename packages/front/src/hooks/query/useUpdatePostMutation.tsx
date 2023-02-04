import { useMutation } from "react-query";
import { updatePost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const useUpdatePostMutation = () => {
  const router = useRouter();

  return useMutation((param: any) => updatePost(param?.slug, param?.body), {
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.data?.code === "POE002") {
        toast("수정 실패. 존재하지 않는 slug 입니다.", { toastId: "update" });
      }
    },
  });
};
