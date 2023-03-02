/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";

type Variant = "short" | "long";
export type Direction = "bottom" | "top";

interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  direction?: Direction;
}

const Tooltip = ({
  children,
  variant = "short",
  direction = "bottom",
  ...props
}: TooltipProps) => {
  const { styles, themeVariant, themeDirection } = TooltipStyle();
  return (
    <span
      id="tooltip"
      css={[styles, themeVariant[variant], themeDirection[direction]]}
      {...props}
    >
      {children}
    </span>
  );
};

const TooltipStyle = () => {
  const theme = useTheme();

  const styles = css`
    color: ${theme.colors.neutral.background};
    background-color: ${theme.colors.neutral.onBackground};
    padding: 5px 12px;
    border-radius: 6px;
    position: relative;
    z-index: 9999;
    transition: opacity 0.5s;
    opacity: 0;
    display: flex;
    height: fit-content;
  `;

  const themeVariant = {
    short: css`
      font-size: 11px;
    `,
    long: css`
      font-size: 14px;
      line-height: 1.2;
      padding: 14px 16px;
    `,
  };

  const themeDirection = {
    bottom: css`
      top: 80%;
    `,
    top: css`
      top: -100%;
    `,
  };

  return { styles, themeVariant, themeDirection };
};

export default Tooltip;
