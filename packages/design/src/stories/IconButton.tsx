/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Layer from "./Layer";
import Tooltip from "./Tooltip";
import { Direction } from "./Tooltip";

type Variant = "standard" | "contained";
export type Size = "small" | "medium";

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  tooltip?: string;
  direction?: Direction;
  size?: Size;
}

// children : Icon svg component
const IconButton = ({
  children,
  variant = "standard",
  tooltip = undefined,
  size = "medium",
  direction = "bottom",
  onClick,
}: IconButtonProps) => {
  const { styles, themeVariant, themeSize } = IconButtonStyle(size);

  return (
    <button
      css={[styles, themeVariant[variant], themeSize[size]]}
      onClick={onClick}
      type="button"
    >
      <Layer>{children}</Layer>
      {tooltip && <Tooltip direction={direction}>{tooltip}</Tooltip>}
    </button>
  );
};

const IconButtonStyle = (size: Size) => {
  const theme = useTheme();

  const styles = css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    background-color: unset;

    #stateLayer {
      width: ${size === "medium" ? "40px" : "28px"};
      height: ${size === "medium" ? "40px" : "28px"};
      left: unset;
      opacity: 0.8;
    }
    @media (hover: hover) and (pointer: fine) {
      & :hover #tooltip {
        opacity: 1;
      }
    }
    svg {
      width: 24px;
      height: 24px;
    }
  `;

  const themeVariant = {
    standard: css`
      fill: ${theme.colors.primary.onPrimary};
      &:hover {
        #stateLayer {
          fill: ${theme.colors.primary.primary};
          background-color: ${theme.colors.neutral.surface};
        }
      }
    `,
    contained: css`
      fill: ${theme.colors.primary.onPrimary};
      #stateLayer {
        background-color: ${theme.colors.primary.primary};
      }
      &:hover {
        #stateLayer {
          fill: ${theme.colors.primary.onContainer};
          background-color: ${theme.colors.neutral.surface};
        }
      }
    `,
  };

  const themeSize = {
    small: css`
      width: 28px;
      height: 28px;
    `,
    medium: css`
      width: 48px;
      height: 48px;
    `,
  };

  return { styles, themeVariant, themeSize };
};

export default IconButton;
