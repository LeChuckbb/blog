import { useQuery } from "react-query";
import { getPostById } from "../../apis/postApi";
import { AxiosResponse } from "axios";

export const useGetPostByIdQuery = (id: string) =>
  useQuery<AxiosResponse<any, Error>>(
    ["postById", id],
    () => getPostById(id as string),
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      suspense: false,
      staleTime: 5000000,
    }
  );
