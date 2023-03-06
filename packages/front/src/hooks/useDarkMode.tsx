import { useEffect } from "react";
import { lightTheme, darkTheme } from "design/src/styles/theme";
import { useRecoilState } from "recoil";
import { themeState } from "../recoil/atom";

type ThemeType = typeof lightTheme | typeof darkTheme;

const useDarkMode = (): { isDarkMode: boolean; toggleDarkMode: () => void } => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(themeState);

  const setMode = (mode: ThemeType) => {
    window.localStorage.setItem(
      "isDarkMode",
      mode === darkTheme ? "true" : "false"
    );
    setIsDarkMode(mode === darkTheme);
  };

  const toggleDarkMode = () => {
    setMode(isDarkMode ? lightTheme : darkTheme);
  };

  /*
    마운트시 localStorage에서 isDarkMode 값 탐색
    새로고침시 다크모드 또는 라이트모드를 적용시켜준다.
  */
  useEffect(() => {
    const localTheme = window.localStorage.getItem("isDarkMode");
    if (localTheme === "true") {
      setIsDarkMode(true);
    } else if (localTheme === "false") {
      setIsDarkMode(false);
    }
  }, [setIsDarkMode]);

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;
