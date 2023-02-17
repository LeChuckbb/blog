/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Layer from "./Layer";

type Variant = "standard" | "contained";

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

// children : Icon svg component
const IconButton = ({
  children,
  variant = "standard",
  onClick,
}: IconButtonProps) => {
  const { styles, themeVariant } = IconButtonStyle();

  return (
    <button css={[styles, themeVariant[variant]]} onClick={onClick}>
      <Layer>{children}</Layer>
    </button>
  );
};

const IconButtonStyle = () => {
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
