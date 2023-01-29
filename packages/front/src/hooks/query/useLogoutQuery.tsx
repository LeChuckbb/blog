import { useQuery, useQueryClient } from "react-query";
import { logoutAPI } from "../../apis/authApi";
import { AxiosResponse } from "axios";
import { IS_AUTH_QUERYKEY } from "./useIsAuthQuery";

export const LOGOUT_QUERYKEY = "logout";

export const useLogoutQuery = () => {
  const queryClient = useQueryClient();

  return useQuery<AxiosResponse<any, Error>>(
    [LOGOUT_QUERYKEY],
    () => logoutAPI(),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0,
      enabled: false,
      // useErrorBoundary: true,
      suspense: false,
      onSuccess: () => queryClient.invalidateQueries(IS_AUTH_QUERYKEY),
    }
  );
};
