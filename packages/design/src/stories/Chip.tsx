/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Layer from "./Layer";

type Variant = "filter" | "input";
type Color = "primary" | "secondary" | "background";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLLIElement> {
  variant?: Variant;
  color?: Color;
}

export const Chip = ({
  children,
  variant = "filter",
  color = "primary",
  ...props
}: ButtonProps) => {
  const { style, themeColor } = ChipStyle(variant);

  return (
    <li css={[style, themeColor[color]]} {...props}>
      <Layer variant="chip" />
      {children}
    </li>
  );
};

const ChipStyle = (variant: Variant) => {
  const theme = useTheme();

  const style = css`
    height: 32px;
    position: relative;
    border: 1px solid;
    border-color: ${theme.colors.neutralVariant.outline};
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: ${variant === "filter" ? "0px 8px" : "0px 12px"};
    cursor: pointer;
    & svg {
      width: 18px;
      height: 18px;
    }
  `;

  const themeColor = {
    primary: css`
      background-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.onPrimary};
      fill: ${theme.colors.primary.onPrimary};
    `,
    secondary: css`
      background-color: ${theme.colors.secondary.container};
      color: ${theme.colors.secondary.onContainer};
      fill: ${theme.colors.secondary.onContainer};
    `,
    background: css`
      background-color: ${theme.colors.neutral.background};
      color: ${theme.colors.neutral.onBackground};
      border-color: ${theme.colors.neutral.onBackground};
    `,
  };

  return { style, themeColor };
};
