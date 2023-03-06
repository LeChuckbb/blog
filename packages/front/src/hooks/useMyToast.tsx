import { toast, ToastOptions } from "react-toastify";
import useDarkMode from "./useDarkMode";

const useMyToast = () => {
  const { isDarkMode } = useDarkMode();

  const callToast = (content: string, id: string, option?: {}) => {
    const toastOptions: ToastOptions = {
      toastId: id,
      theme: isDarkMode ? "dark" : "light",
      ...option,
    };
    toast(content, toastOptions);
  };

  return { callToast };
};

export default useMyToast;
