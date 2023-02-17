/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { useState } from "react";
import Layer from "./Layer";
import Tooltip from "./Tooltip";

type Variant = "standard" | "contained";

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  tooltip?: string;
}

// children : Icon svg component
const IconButton = ({
  children,
  variant = "standard",
  tooltip = undefined,
  onClick,
}: IconButtonProps) => {
  const [mouseHover, setMouseHover] = useState(false);
  const mouseEnterHandler = () => setMouseHover(true);
  const mouseLeaveHandler = () => setMouseHover(false);
  const { styles, themeVariant } = IconButtonStyle(mouseHover);

  return (
    <button
      css={[styles, themeVariant[variant]]}
      onClick={onClick}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <Layer>{children}</Layer>
      {/* {tooltip && <Tooltip>{tooltip}</Tooltip>} */}
      <Tooltip>{tooltip}</Tooltip>
    </button>
  );
};

const IconButtonStyle = (mouseHover: boolean) => {
  const theme = useTheme();

  const styles = css`
    width: 48px;
    height: 48px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    background-color: unset;

    #stateLayer {
      width: 40px;
      height: 40px;
      left: unset;
      opacity: 0.8;
    }
    #tooltip {
      opacity: ${mouseHover && "1"};
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

  return { styles, themeVariant };
};

export default IconButton;
