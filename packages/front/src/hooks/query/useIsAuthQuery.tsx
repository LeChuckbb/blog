import { useQuery } from "react-query";
import { isAuthorized } from "../../apis/authApi";
import { AxiosResponse } from "axios";

export const IS_AUTH_QUERYKEY = "isAuth";

export const useIsAuthQuery = () =>
  useQuery<AxiosResponse<any, Error>>(
    [IS_AUTH_QUERYKEY],
    () => isAuthorized(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
      // useErrorBoundary: true,
      suspense: false,
    }
  );
