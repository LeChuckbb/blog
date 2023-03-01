import { useMutation } from "react-query";
import { loginAPI } from "../../apis/authApi";
import { isAxiosError } from "axios";
import useMyToast from "../useMyToast";

export const useLoginMutation = () => {
  const { callToast } = useMyToast();

  return useMutation((body: any) => loginAPI(body), {
    onSuccess: (result) => {
      window.location.href = "/";
    },
    onError: (error) => {
      console.log("onError in useLoginMutation");
      if (isAxiosError(error)) {
        if (error.response?.data?.error?.code === "AUE001")
          callToast("잘못된 ID입니다.", "id");
        else if (error.response?.data?.error?.code === "AUE002")
          callToast("잘못된 패스워드입니다.", "password");
      }
    },
  });
};
