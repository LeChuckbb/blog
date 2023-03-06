import { useMutation } from "react-query";
import { updatePost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import useMyToast from "../useMyToast";

export const useUpdatePostMutation = () => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((param: any) => updatePost(param?.id, param?.body), {
    onSuccess: (result) => {
      result.data.urlSlug
        ? router.push(`/post/${result.data.urlSlug}`)
        : router.push("/");
    },
  });
};
