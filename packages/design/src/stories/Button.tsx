/** @jsxImportSource @emotion/react */
import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { ReactComponentElement } from "react";

// type Size = "small" | "medium" | "large";
// type Priority = "primary" | "secondary" | "tertiary" | "error";
type Mode = "filled" | "outlined" | "text" | "elevated" | "tonal";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // children: React.ReactNode;
  mode?: Mode;
  icon?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({
  mode = "filled",
  children,
  icon,
  ...props
}: ButtonProps) => {
  const { style, themesMode } = ButtonStyles(icon);

  return (
    <button css={[style, themesMode[mode]]} {...props}>
      <Layer id="stateLayer" />
      {children}
    </button>
  );
};

const ButtonStyles = (icon: boolean | undefined) => {
  const theme = useTheme();

  const style = css`
    position: relative;
    outline: none;
    border: none;
    cursor: pointer;
    padding: ${icon ? "10px 24px 10px 16px" : "10px 24px"};
    border-radius: 100px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${icon && "8px"};
    &:hover,
    &:focus,
    &:active {
      & #stateLayer {
        background-color: ${theme.colors.primary.primary};
      }
    }
    &:hover {
      & #stateLayer {
        opacity: ${theme.shadow.stateLayer.hover};
      }
    }
    &:focus {
      & #stateLayer {
        opacity: ${theme.shadow.stateLayer.focus};
      }
    }
    &:active {
      & #stateLayer {
        opacity: ${theme.shadow.stateLayer.active};
      }
    }
    &:disabled {
      background-color: ${theme.colors.neutralVariant.outlineVariant};
      color: ${theme.colors.neutralVariant.outline};
    }
  `;

  const themesMode = {
    filled: css`
      background-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.onPrimary};
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

const Layer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100px;
`;
