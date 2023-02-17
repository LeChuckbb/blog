/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";

type Variant = "small" | "large";
type Color = "tertiary" | "error" | "errorContainer";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  badgeContent: number;
  variant?: Variant;
  color?: Color;
}

/*
 * children : 뱃지가 달려있을 아이콘
 */
const Badge = ({
  variant = "large",
  color = "error",
  children,
  badgeContent,
  ...props
}: BadgeProps) => {
  const { style, themeColor } = BadgeStyle();

  return (
    <span
      css={{
        display: "flex",
        position: "relative",
        minWidth: "16px",
        minHeight: "16px",
      }}
    >
      {children}
      <span css={[style, themeColor[color]]}>{badgeContent}</span>
    </span>
  );
};

const BadgeStyle = () => {
  const theme = useTheme();

  const style = css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    min-width: 16px;
    height: 16px;
    padding: 4px;
    font-size: 11px;
    line-height: 16px;
    box-sizing: border-box;
    position: absolute;
    right: 0px;
    top: -4px;
  `;

  const themeColor = {
    tertiary: css`
      background-color: ${theme.colors.tertiary.container};
      color: ${theme.colors.tertiary.onContainer};
    `,
    error: css`
      background-color: ${theme.colors.error.error};
      color: ${theme.colors.error.onError};
    `,
    errorContainer: css`
      background-color: ${theme.colors.error.container};
      color: ${theme.colors.error.onContainer};
    `,
  };

  return { style, themeColor };
};

export default Badge;
