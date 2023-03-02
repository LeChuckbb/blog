/* 
  768px 미만 -> Card 1개
  768 ~ 1058 -> Card 2개
  1058 ~ 1464 -> Card 3개
  1464 ~ 1920 -> Card 4개
  1920 ~ -> Card 5개
*/
const BREAK_POINTS = [768, 1058, 1240, 1464, 1920];

export const lightTheme = {
  colors: {
    primary: {
      primary: "#5252b6",
      onPrimary: "#ffffff",
      container: "#e2dfff",
      onContainer: "#0b006b",
    },
    secondary: {
      secondary: "#5d5c72",
      onSecondary: "#ffffff",
      container: "#e2e0f9",
      onContainer: "#1a1a2c",
    },
    tertiary: {
      tertiary: "#795369",
      onTertiary: "#ffffff",
      container: "#ffd8eb",
      onContainer: "#2f1124",
    },
    error: {
      error: "#ba1a1a",
      onError: "#ffffff",
      container: "#ffdad6",
      onContainer: "#410002",
    },
    neutral: {
      background: "#fffbff",
      onBackground: "#1c1b1f",
      surface: "#fffbff",
      onSurface: "#1c1b1f",
    },
    neutralVariant: {
      surfaceVariant: "#e4e1ec",
      onSurfaceVariant: "#47464f",
      outline: "#777680",
      outlineVariant: "#c8c5d0",
    },
  },
  fonts: {
    family: {
      brand: ["Do Hyeon", "Sunflower"].join(","),
      plain: [
        "system-ui",
        "-apple-system",
        "Noto Sans KR",
        "Nanum Gothic",
      ].join(","),
    },
    display: {
      large: {
        size: "61px",
        weight: "400",
        lineHeight: "64px",
        letterSpacing: "-0.25px",
      },
      medium: {
        size: "57px",
        weight: "400",
        lineHeight: "52px",
        letterSpacing: "0px",
      },
      small: {
        size: "45px",
        weight: "400",
        lineHeight: "44px",
        letterSpacing: "0px",
      },
    },
    headline: {
      large: {
        size: "36px",
        weight: "500",
        lineHeight: "40px",
        letterSpacing: "0px",
      },
      medium: {
        size: "28px",
        weight: "500",
        lineHeight: "32px",
        letterSpacing: "0px",
      },
      small: {
        size: "24px",
        weight: "500",
        lineHeight: "28px",
        letterSpacing: "0px",
      },
    },
    title: {
      large: {
        size: "28px",
        weight: "400",
        lineHeight: "28px",
        letterSpacing: "0px",
      },
      medium: {
        size: "24px",
        weight: "500",
        lineHeight: "24px",
        letterSpacing: "0.15px",
      },
      small: {
        size: "18px",
        weight: "500",
        lineHeight: "20px",
        letterSpacing: "0.10px",
      },
    },
    body: {
      large: {
        size: "20px",
        weight: "400",
        lineHeight: "24px",
        letterSpacing: "0.50px",
      },
      medium: {
        size: "18px",
        weight: "400",
        lineHeight: "20px",
        letterSpacing: "0.25px",
      },
      small: {
        size: "16px",
        weight: "400",
        lineHeight: "20px",
        letterSpacing: "0.40px",
      },
    },
    label: {
      large: {
        size: "14px",
        weight: "500",
        lineHeight: "20px",
        letterSpacing: "0.10px",
      },
      medium: {
        size: "12px",
        weight: "500",
        lineHeight: "16px",
        letterSpacing: "0.50px",
      },
      small: {
        size: "11px",
        weight: "500",
        lineHeight: "16px",
        letterSpacing: "0.50px",
      },
    },
  },
  shadow: {
    elevation: {
      level1:
        "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
      level2:
        "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
      level3:
        "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
      level4:
        "0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)",
      level5:
        "0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)",
    },
    stateLayer: {
      hover: "0.08",
      focus: "0.12",
      active: "0.12",
    },
  },
  mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
};

export const darkTheme = {
  colors: {
    primary: {
      primary: "#c1c1ff",
      onPrimary: "#221e86",
      container: "#3a399d",
      onContainer: "#e2dfff",
    },
    secondary: {
      secondary: "#c6c4dd",
      onSecondary: "#2f2f42",
      container: "#454559",
      onContainer: "#e2e0f9",
    },
    tertiary: {
      tertiary: "#e9b9d2",
      onTertiary: "#46263a",
      container: "#5f3c51",
      onContainer: "#ffd8eb",
    },
    error: {
      error: "#ffb4ab",
      onError: "#690005",
      container: "#93000a",
      onContainer: "#ffdad6",
    },
    neutral: {
      background: "#1c1b1f",
      onBackground: "#e5e1e6",
      surface: "#1c1b1f",
      onSurface: "#e5e1e6",
    },
    neutralVariant: {
      surfaceVariant: "#47464f",
      onSurfaceVariant: "#c8c5d0",
      outline: "#918f9a",
      outlineVariant: "#47454f",
    },
  },
  fonts: {
    family: {
      brand: ["Do Hyeon", "Sunflower"].join(","),
      plain: ["-apple-system", "Noto Sans KR", "Nanum Gothic"].join(","),
    },
    display: {
      large: {
        size: "61px",
        weight: "400",
        lineHeight: "64px",
        letterSpacing: "-0.25px",
      },
      medium: {
        size: "57px",
        weight: "400px",
        lineHeight: "52px",
        letterSpacing: "0px",
      },
      small: {
        size: "45px",
        weight: "400",
        lineHeight: "44px",
        letterSpacing: "0px",
      },
    },
    headline: {
      large: {
        size: "38px",
        weight: "400",
        lineHeight: "40px",
        letterSpacing: "0px",
      },
      medium: {
        size: "32px",
        weight: "400",
        lineHeight: "36px",
        letterSpacing: "0px",
      },
      small: {
        size: "28px",
        weight: "400",
        lineHeight: "32px",
        letterSpacing: "0px",
      },
    },
    title: {
      large: {
        size: "28px",
        weight: "400",
        lineHeight: "28px",
        letterSpacing: "0px",
      },
      medium: {
        size: "24px",
        weight: "500",
        lineHeight: "24px",
        letterSpacing: "0.15px",
      },
      small: {
        size: "18px",
        weight: "500",
        lineHeight: "20px",
        letterSpacing: "0.10px",
      },
    },
    body: {
      large: {
        size: "20px",
        weight: "400",
        lineHeight: "24px",
        letterSpacing: "0.50px",
      },
      medium: {
        size: "18px",
        weight: "400",
        lineHeight: "20px",
        letterSpacing: "0.25px",
      },
      small: {
        size: "16px",
        weight: "400",
        lineHeight: "16px",
        letterSpacing: "0.40px",
      },
    },
    label: {
      large: {
        size: "14px",
        weight: "500",
        lineHeight: "20px",
        letterSpacing: "0.10px",
      },
      medium: {
        size: "12px",
        weight: "500",
        lineHeight: "16px",
        letterSpacing: "0.50px",
      },
      small: {
        size: "11px",
        weight: "500",
        lineHeight: "16px",
        letterSpacing: "0.50px",
      },
    },
  },
  shadow: {
    elevation: {
      level1:
        "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)",
      level2:
        "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)",
      level3:
        "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
      level4:
        "0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)",
      level5:
        "0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)",
    },
    stateLayer: {
      hover: "0.08",
      focus: "0.12",
      active: "0.12",
    },
  },
  mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
};
