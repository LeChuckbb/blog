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
    fonts: {
      family: {
        brand: string;
        plain: string;
      };
      display: {
        large: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        medium: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        small: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
      };
      headline: {
        large: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        medium: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        small: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
      };
      title: {
        large: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        medium: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        small: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
      };
      body: {
        large: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        medium: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        small: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
      };
      label: {
        large: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        medium: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
        small: {
          size: string;
          weight: string;
          lineHeight: string;
          letterSpacing: string;
        };
      };
    };
    mq: string[];
  }
}
