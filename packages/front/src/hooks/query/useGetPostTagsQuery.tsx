import { useQuery } from "react-query";
import { getPostTags } from "../../apis/postApi";
import { AxiosResponse } from "axios";

export const POST_TAG_KEY = "getPostTags";

export type PostTagsType = {
  count: number;
  tags: Array<object>;
};

export const useGetPostTagsQuery = () =>
  useQuery<PostTagsType, Error>([POST_TAG_KEY], () => getPostTags(), {
    useErrorBoundary: true,
    suspense: false,
    retry: false,
  });
