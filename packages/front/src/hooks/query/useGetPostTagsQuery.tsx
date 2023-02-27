import { useQuery } from "react-query";
import { getPostTags } from "../../apis/postApi";
import { AxiosResponse } from "axios";

export type PostTagsType = {
  count: number;
  tags: Array<object>;
};

export const useGetPostTagsQuery = () =>
  useQuery<AxiosResponse<PostTagsType, Error>>(
    ["getPostTags"],
    () => getPostTags(),
    {
      useErrorBoundary: true,
      suspense: false,
      retry: false,
    }
  );
