import { useMutation } from "react-query";
import { createPost } from "../../apis/postApi";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import useMyToast from "../useMyToast";
import { PostSchema } from "../../types/post";

export const useCreatePostMutation = () => {
  const router = useRouter();
  const { callToast } = useMyToast();

  return useMutation((body: PostSchema) => createPost(body), {
    onSuccess: (result) => {
      result.data.urlSlug
        ? router.push(`/post/${result.data.urlSlug}`)
        : router.push("/");
    },
  });
};
