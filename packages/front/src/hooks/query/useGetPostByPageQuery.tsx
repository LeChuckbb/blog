import { useInfiniteQuery } from "react-query";
import { getPostByPage } from "../../apis/postApi";
import { AxiosResponse } from "axios";

export type PostByPageType = {
  count: number;
  next: number;
  prev: number;
  results: Array<object>;
};

export const useGetPostByPageQuery = (selectedTag: string) => {
  return useInfiniteQuery<AxiosResponse<PostByPageType, Error>>(
    ["getPostByPage", selectedTag],
    ({ pageParam = 1 }) => getPostByPage(pageParam, selectedTag),
    {
      staleTime: 300000,
      suspense: false,
      useErrorBoundary: true,
      retry: false,
      getNextPageParam: (lastPage: any) => lastPage?.next ?? null,
    }
  );
};
