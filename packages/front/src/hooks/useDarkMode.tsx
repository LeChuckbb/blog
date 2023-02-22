import { useEffect } from "react";
import { lightTheme, darkTheme } from "design/src/styles/theme";
import { useRecoilState } from "recoil";
import { themeState } from "../recoil/atom";

type themeType = typeof lightTheme | typeof darkTheme;

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(themeState);

  const setMode = (mode: themeType) => {
    if (mode === lightTheme) {
      window.localStorage.setItem("isDarkMode", "false");
      setIsDarkMode(false);
    } else {
      window.localStorage.setItem("isDarkMode", "true");
      setIsDarkMode(true);
    }
  };

  const toggleDarkMode = () => {
    isDarkMode ? setMode(lightTheme) : setMode(darkTheme);
  };

  /*
    마운트시 localStorage에서 isDarkMode 값 탐색
    새로고침시 다크모드 또는 라이트모드를 적용시켜준다.
  */
  useEffect(() => {
    const localTheme = window.localStorage.getItem("isDarkMode");
    if (localTheme != null) {
      if (localTheme === "true") {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    }
  }, []);

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;
