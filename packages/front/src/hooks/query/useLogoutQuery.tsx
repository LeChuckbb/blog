import { useQuery, useQueryClient } from "react-query";
import { logoutAPI } from "../../apis/authApi";
import { AxiosResponse } from "axios";
import { IS_AUTH_QUERYKEY } from "./useIsAuthQuery";

export const LOGOUT_QUERYKEY = "logout";

export const useLogoutQuery = () => {
  return useQuery<AxiosResponse<any, Error>>(
    [LOGOUT_QUERYKEY],
    () => logoutAPI(),
    {
      retry: false,
      cacheTime: 0,
      enabled: false,
      suspense: false,
      useErrorBoundary: true,
      onSuccess: () => {
        window.sessionStorage.removeItem("isLogin");
      },
    }
  );
};
