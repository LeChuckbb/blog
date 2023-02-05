// You are also able to use a 3rd party theme this way:
import { theme } from "./styles/theme";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: {
        primary: string;
        onPrimary: string;
        container: string;
        onContainer: string;
      };
      secondary: {
        secondary: string;
        onSecondary: string;
        container: string;
        onContainer: string;
      };
      tertiary: {
        tertiary: string;
        onTertiary: string;
        container: string;
        onContainer: string;
      };
      error: {
        error: string;
        onError: string;
        container: string;
        onContainer: string;
      };
      neutral: {
        background: string;
        onBackground: string;
        surface: string;
        onSurface: string;
      };
      neutralVariant: {
        surfaceVariant: string;
        onSurfaceVariant: string;
        outline: string;
        outlineVariant: string;
      };
    };
    mq: string[];
  }
}
