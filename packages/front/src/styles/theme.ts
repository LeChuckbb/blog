/* 
  768px 미만 -> Card 1개
  768 ~ 1058 -> Card 2개
  1058 ~ 1464 -> Card 3개
  1464 ~ 1920 -> Card 4개
  1920 ~ -> Card 5개
*/
const BREAK_POINTS = [768, 1058, 1464, 1920];

// export const lightTheme = {
//   colors: {
//     primary: {
//       primary: "#7447ac",
//       onPrimary: "#ffffff",
//       container: "#eedbff",
//       onContainer: "#2a0054",
//     },
//     secondary: {
//       secondary: "#655a6f",
//       onSecondary: "#ffffff",
//       container: "#ecddf7",
//       onContainer: "#20182a",
//     },
//     tertiary: {
//       tertiary: "#80515a",
//       onTertiary: "#ffffff",
//       container: "#ffd9de",
//       onContainer: "#321018",
//     },
//     error: {
//       error: "#ba1a1a",
//       onError: "#ffffff",
//       container: "#ffdad6",
//       onContainer: "#410002",
//     },
//     neutral: {
//       background: "#fffbff",
//       onBackground: "#1d1b1e",
//       surface: "#fffbff",
//       onSurface: "#1d1b1e",
//     },
//     neutralVariant: {
//       surfaceVariant: "#e8e0eb",
//       onSurfaceVariant: "#4a454e",
//       outline: "#7b757f",
//       outlineVariant: "#ccc4cf",
//     },
//   },
//   mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
// };

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
  mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
};

// export const darkTheme = {
//   colors: {
//     primary: {
//       primary: "#d9b9ff",
//       onPrimary: "#440f7b",
//       container: "#5b2d92",
//       onContainer: "#eedbff",
//     },
//     secondary: {
//       secondary: "#cfc1da",
//       onSecondary: "#352d40",
//       container: "#4c4357",
//       onContainer: "#ecddf7",
//     },
//     tertiary: {
//       tertiary: "#f2b7c0",
//       onTertiary: "#4b252d",
//       container: "#653b42",
//       onContainer: "#ffd9de",
//     },
//     error: {
//       error: "#ffb4ab",
//       onError: "#690005",
//       container: "#93000a",
//       onContainer: "#ffdad6",
//     },
//     neutral: {
//       background: "#1d1b1e",
//       onBackground: "#e7e1e5",
//       surface: "#1d1b1e",
//       onSurface: "#e7e1e5",
//     },
//     neutralVariant: {
//       surfaceVariant: "#4a454e",
//       onSurfaceVariant: "#ccc4cf",
//       outline: "#958e99",
//       outlineVariant: "#4a454e",
//     },
//   },
//   mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
// };

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
  mq: BREAK_POINTS.map((bp) => `@media (min-width:${bp}px)`),
};
