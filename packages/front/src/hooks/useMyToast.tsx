import { toast } from "react-toastify";
import useDarkMode from "./useDarkMode";

const useMyToast = () => {
  const { isDarkMode } = useDarkMode();

  const callToast = (content: string, id: string, option?: {}) => {
    toast(content, {
      toastId: id,
      theme: isDarkMode ? "dark" : "light",
      ...option,
    });
  };

  return { callToast };
};

export default useMyToast;
