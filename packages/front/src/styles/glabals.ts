import { css, Theme } from "@emotion/react";

export const GlobalStyles = (theme: Theme) => css`
  /* reset css 적용 */
  body {
    background: ${theme.colors.neutral.background};
    color: ${theme.colors.neutral.onBackground};
  }
`;

export default GlobalStyles;
