import { useTheme } from "@emotion/react";
import { css } from "@emotion/react";

const useEditorStyles = () => {
  const theme = useTheme();

  const editorStyles = css`
    /* .toastui-editor-contents {
      color: ${theme.colors.neutral.onBackground};
    } */
    .toastui-editor-contents {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: ${theme.colors.neutral.onBackground};
        font-family: ${theme.fonts.family.plain};
        margin: 32px 0px 16px 0px;
        border-bottom: none;
      }
    }

    .toastui-editor-contents h1 {
      margin-top: 40px;
      font-size: ${theme.fonts.headline.large.size};
      font-weight: ${theme.fonts.headline.large.weight};
      line-height: ${theme.fonts.headline.large.lineHeight};
    }

    .toastui-editor-contents h2 {
      margin-top: 24px;
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
      font-size: ${theme.fonts.body.small.size};
      /* letter-spacing: ${theme.fonts.body.small.letterSpacing}; */
      color: inherit;
    }

    .toastui-editor-contents p {
      margin: 18px 0;
    }

    .toastui-editor-contents img {
      margin: 48px auto;
    }

    .toastui-editor-contents a {
      text-decoration: none;
      color: ${theme.colors.primary.primary};
    }

    .toastui-editor-contents ol {
      color: ${theme.colors.neutralVariant.onSurfaceVariant};
      margin: 24px 0px;
    }

    .toastui-editor-contents table {
      color: ${theme.colors.neutral.onBackground};
    }
    .toastui-editor-contents thead > tr > th {
      background-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.onPrimary};
    }

    .toastui-editor-contents table th,
    .toastui-editor-contents table td {
      border-color: ${theme.colors.neutralVariant.outline};
    }

    .toastui-editor-contents ul > li::before {
      background-color: ${theme.colors.neutral.onBackground};
      margin-top: 10px;
      width: 6px;
      height: 6px;
    }
    .toastui-editor-contents ol > li::before {
      color: ${theme.colors.primary.primary};
    }

    .toastui-editor-contents li {
      color: ${theme.colors.neutral.onBackground};
    }

    .toastui-editor-contents blockquote {
      margin: 16px 0;
      border-left: 4px solid;
      border-left-color: ${theme.colors.primary.primary};
      padding: 16px 16px 16px 32px;
      background-color: ${theme.colors.neutralVariant.surfaceVariant};
      color: ${theme.colors.neutralVariant.onSurfaceVariant};
      & * {
        /* font-style: italic; */
        /* font-family: ${theme.fonts.family.brand}; */
      }
    }

    .toastui-editor-contents pre {
      background-color: ${theme.colors.neutral.onBackground};
      color: ${theme.colors.neutral.background};
      border-radius: 12px;
      position: relative;
      & * {
        text-shadow: none !important;
        font-size: 16px;
      }
    }

    .toastui-editor-contents code[data-backticks] {
      border: 1.5px solid;
      border-color: ${theme.colors.primary.container};
      border-radius: 4px;
      background-color: ${theme.colors.neutral.background};
      color: ${theme.colors.primary.primary};
      font-weight: 500;
      font-size: 15px;
    }

    .toastui-editor-contents code[data-language]::before {
      content: attr(data-language);
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 13px;
      padding: 2px 4px;
      border-radius: 4px;
      background-color: ${theme.colors.primary.primary};
      color: ${theme.colors.primary.onPrimary};
      padding: 4px 8px;
      border-radius: 4px;
      line-height: 18px;
      font-weight: bold;
      font-family: ${theme.fonts.family.plain};
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
      background-color: unset;
    }
  `;
  return { editorStyles };
};

export default useEditorStyles;
