/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";

type Variant = "short" | "long";

interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const Tooltip = ({ children, variant = "short", ...props }: TooltipProps) => {
  const { styles, themeVariant } = TooltipStyle();
  return (
    <span id="tooltip" css={[styles, themeVariant[variant]]} {...props}>
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
    top: 80%;
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

  return { styles, themeVariant };
};

export default Tooltip;
