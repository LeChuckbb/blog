/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";

type Size = "small" | "medium" | "large";
type Mode = "primary" | "secondary" | "tertiary" | "error";

interface ButtonProps {
  size?: Size;
  children: React.ReactNode;
  mode?: Mode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({
  mode = "primary",
  size = "medium",
  children,
  ...props
}: ButtonProps) => {
  const { style, themes } = ButtonStyles();

  return <button css={[style, themes[mode]]}>{children}</button>;
};

const ButtonStyles = () => {
  const theme = useTheme();

  const style = css`
    outline: none;
    border: none;
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 100px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      opacity: 0.8;
    }
    &:focus {
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  const themes = {
    primary: css`
      background-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.onPrimary};
    `,
    secondary: css`
      background-color: ${theme.colors.secondary.container};
      color: ${theme.colors.secondary.onContainer};
    `,
    tertiary: css`
      background-color: ${theme.colors.tertiary.container};
      color: ${theme.colors.tertiary.onContainer};
    `,
    error: css`
      background-color: ${theme.colors.error.error};
      color: ${theme.colors.error.onError};
    `,
  };

  return { style, themes };
};
