import { useInfiniteQuery } from "react-query";
import { getPostByPage } from "../../apis/postApi";
import { AxiosResponse } from "axios";

export const POST_BY_PAGE_KEY = "getPostByPage";

export interface PostByPageType {
  count: number;
  next: number | null;
  prev: number | null;
  results: [{}];
}

export const useGetPostByPageQuery = (selectedTag: string) => {
  return useInfiniteQuery<AxiosResponse<PostByPageType, Error>>(
    [POST_BY_PAGE_KEY, selectedTag],
    ({ pageParam = 1 }) => getPostByPage(pageParam, selectedTag),
    {
      // suspense: false,
      retry: 1,
      staleTime: 60000,
      getNextPageParam: (lastPage: any) => lastPage?.next ?? null,
    }
  );
};
