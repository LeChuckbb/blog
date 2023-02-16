/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";

type Variant = "chip" | "button";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

// stateLayer in Material design 3
const Layer = ({ variant = "button" }: Props) => {
  const theme = useTheme();

  const style = css`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    &:hover,
    &:focus,
    &:active {
      background-color: ${theme.colors.primary.primary};
    }
    &:hover {
      opacity: ${theme.shadow.stateLayer.hover};
    }
    &:focus {
      opacity: ${theme.shadow.stateLayer.focus};
    }
    &:active {
      opacity: ${theme.shadow.stateLayer.active};
    }
  `;

  const themeVariant = {
    chip: css`
      border-radius: 8px;
    `,
    button: css`
      border-radius: 100px;
    `,
  };

  return <div id="stateLayer" css={[style, themeVariant[variant]]} />;
};

export default Layer;
