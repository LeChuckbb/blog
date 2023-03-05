import { useInfiniteQuery } from "react-query";
import { getPostByPage } from "../../apis/postApi";
import { AxiosResponse } from "axios";

export const POST_BY_PAGE_KEY = "getPostByPage";

export type PostByPageType = {
  count: number;
  next: number | null;
  prev: number | null;
  results: Array<object>;
};

export const useGetPostByPageQuery = (selectedTag: string) => {
  return useInfiniteQuery<AxiosResponse<PostByPageType, Error>>(
    [POST_BY_PAGE_KEY, selectedTag],
    ({ pageParam = 1 }) => {
      return getPostByPage(pageParam, selectedTag);
    },
    {
      suspense: false,
      useErrorBoundary: true,
      getNextPageParam: (lastPage: any) => lastPage?.next ?? null,
    }
  );
};
