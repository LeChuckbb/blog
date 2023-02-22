import { useTheme } from "@emotion/react";
import { css } from "@emotion/react";

const useEditorStyles = () => {
  const theme = useTheme();

  const editorStyles = css`
    .toastui-editor-contents {
      color: ${theme.colors.neutral.onBackground};
    }

    .toastui-editor-contents h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: inherit;
      font-family: ${theme.fonts.family.plain};
      margin: 32px 0px 16px 0px;
      border-bottom: none;
    }

    .toastui-editor-contents h1 {
      font-size: ${theme.fonts.headline.large.size};
      font-weight: ${theme.fonts.headline.large.weight};
      line-height: ${theme.fonts.headline.large.lineHeight};
    }

    .toastui-editor-contents h2 {
      font-size: ${theme.fonts.headline.medium.size};
      font-weight: ${theme.fonts.headline.medium.weight};
      line-height: ${theme.fonts.headline.medium.lineHeight};
    }

    .toastui-editor-contents h3 {
      font-size: ${theme.fonts.headline.small.size};
      font-weight: ${theme.fonts.headline.small.weight};
      line-height: ${theme.fonts.headline.small.lineHeight};
    }

    .toastui-editor-contents br {
      height: 0;
    }

    .toastui-editor-contents p,
    div,
    span {
      font-family: ${theme.fonts.family.plain};
      font-size: ${theme.fonts.body.medium.size};
      color: inherit;
    }

    .toastui-editor-contents img {
      margin: 48px auto;
    }

    .toastui-editor-contents a {
      text-decoration: none;
      color: ${theme.colors.primary.primary};
    }

    .toastui-editor-contents blockquote {
      margin: 32px 0;
      border-left: 4px solid;
      border-left-color: ${theme.colors.primary.primary};
      padding: 16px 16px 16px 32px;
      background-color: ${theme.colors.neutralVariant.surfaceVariant};
      color: ${theme.colors.neutralVariant.onSurfaceVariant};
    }
  `;
  return { editorStyles };
};

export default useEditorStyles;
