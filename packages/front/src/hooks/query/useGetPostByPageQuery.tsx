import { useInfiniteQuery } from "react-query";
import { getPostByPage } from "../../apis/postApi";
import { AxiosResponse } from "axios";

type PostByPageType = {
  count: number;
  next: number;
  prev: number;
  results: Array<object>;
};

export const useGetPostByPageQuery = (selectedTag: string) => {
  return useInfiniteQuery<AxiosResponse<PostByPageType, Error>>(
    ["getPosts", selectedTag],
    ({ pageParam = 1 }) => getPostByPage(pageParam, selectedTag),
    {
      staleTime: 300000,
      suspense: false,
      getNextPageParam: (lastPage) => {
        return lastPage.data.next === null ? null : lastPage.data.next;
      },
    }
  );
};
