/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Layer from "./Layer";
type Variant = "filled" | "outlined" | "text" | "elevated" | "tonal";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({
  variant = "filled",
  children,
  icon,
  type = "button",
  ...props
}: ButtonProps) => {
  const { style, themesMode } = ButtonStyles(icon);

  return (
    <button type={type} css={[style, themesMode[variant]]} {...props}>
      <Layer variant="button" />
      {children}
    </button>
  );
};

const ButtonStyles = (icon: boolean | undefined) => {
  const theme = useTheme();

  const style = css`
    height: 40px;
    position: relative;
    outline: none;
    border: none;
    cursor: pointer;
    padding: ${icon ? "0px 24px 0px 16px" : "0px 24px"};
    border-radius: 100px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    fill: ${theme.colors.primary.primary};
    gap: ${icon === true && "8px"};
    & svg {
      width: 18px;
      height: 18px;
    }
    &:disabled {
      background-color: ${theme.colors.neutralVariant.outlineVariant};
      color: ${theme.colors.neutralVariant.outline};
      fill: ${theme.colors.neutralVariant.outline};
    }
  `;

  const themesMode = {
    filled: css`
      background-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.onPrimary};
      fill: ${theme.colors.primary.onPrimary};
      &:hover {
        box-shadow: ${theme.shadow.elevation.level1};
      }
    `,
    outlined: css`
      border: 1px solid;
      background-color: ${theme.colors.neutral.background};
      border-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.primary};
      &:disabled {
        border-color: ${theme.colors.neutralVariant.outlineVariant};
        background-color: ${theme.colors.neutral.background};
      }
    `,
    text: css`
      background-color: transparent;
      color: ${theme.colors.primary.primary};
      padding: ${icon ? "0px 16px 0px 12px" : "0px 12px"};
      &:disabled {
        background-color: ${theme.colors.neutral.background};
      }
    `,
    elevated: css`
      background-color: ${theme.colors.neutral.surface};
      color: ${theme.colors.primary.primary};
      box-shadow: ${theme.shadow.elevation.level1};
      &:hover {
        box-shadow: ${theme.shadow.elevation.level2};
      }
    `,
    tonal: css`
      background-color: ${theme.colors.secondary.container};
      color: ${theme.colors.secondary.onContainer};
      &:hover {
        box-shadow: ${theme.shadow.elevation.level1};
      }
    `,
  };

  return { style, themesMode };
};
