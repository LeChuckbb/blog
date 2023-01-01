import { useQuery } from "react-query";
import { getPostById } from "../../apis/postApi";
import { AxiosResponse } from "axios";

// type PostByPageType = {
//   count: number;
//   next: number;
//   prev: number;
//   results: Array<object>;
// };

type PostByIdType = {};

export const useGetPostByIdQuery = (id: string) =>
  useQuery<AxiosResponse<any, Error>>(
    ["postById"],
    () => getPostById(id as string),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      suspense: false,
    }
  );
