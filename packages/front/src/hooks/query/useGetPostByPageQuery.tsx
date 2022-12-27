import { useInfiniteQuery } from "react-query";
import { getPostByPage } from "../../apis/postApi";
import { AxiosResponse } from "axios";

type PostByPageType = {
  count: number;
  next: number;
  prev: number;
  results: Array<object>;
};

export const useGetPostByPageQuery = () =>
  useInfiniteQuery<AxiosResponse<PostByPageType, Error>>(
    ["getPosts"],
    ({ pageParam = 1 }) => getPostByPage(pageParam),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        return lastPage.data.next === null ? null : lastPage.data.next + 1;
      },
    }
  );
