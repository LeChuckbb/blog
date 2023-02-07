import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import { css, useTheme } from "@emotion/react";
import { themeState } from "../../recoil/atom";

const WriteViewer = ({ content }: any) => {
  const theme = useTheme();

  const viewerStyles = css`
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
      line-height: ${theme.fonts.headline.large.lineHeight};
    }

    .toastui-editor-contents h2 {
      font-size: ${theme.fonts.headline.medium.size};
      line-height: ${theme.fonts.headline.medium.lineHeight};
    }

    .toastui-editor-contents h3 {
      font-size: ${theme.fonts.headline.small.size};
      line-height: ${theme.fonts.headline.small.lineHeight};
    }

    .toastui-editor-contents p {
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

  return (
    <div css={viewerStyles}>
      <Viewer
        initialValue={content || ""}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
      />
    </div>
  );
};

export default WriteViewer;
