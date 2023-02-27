import { useMutation } from "react-query";
import { updatePost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import useMyToast from "../useMyToast";

export const useUpdatePostMutation = () => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((param: any) => updatePost(param?.slug, param?.body), {
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      if (
        isAxiosError(error) &&
        error.response?.data?.error?.code === "POE002"
      ) {
        callToast("업데이트 실패. 존재하지 않는 slug 입니다.", "update");
      }
    },
  });
};
