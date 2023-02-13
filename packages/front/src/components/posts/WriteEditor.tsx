import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { Editor } from "@toast-ui/react-editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "prismjs/themes/prism.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { useRecoilState } from "recoil";
import { themeState } from "../../recoil/atom";
import useEditorStyles from "./useEditorStyles";
interface Props {
  content: string;
  editorRef: React.MutableRefObject<any>;
}

const WrtieEditor = ({ content = "", editorRef }: Props) => {
  const toolbarItems = [
    ["heading", "bold", "italic", "strike"],
    ["hr"],
    ["ul", "ol", "task"],
    ["table", "link"],
    ["image"],
    ["code"],
    ["scrollSync"],
  ];
  const [isDarkMode, _] = useRecoilState(themeState);
  const { editorStyles } = useEditorStyles();

  return (
    <>
      {editorRef && (
        <div css={editorStyles}>
          <Editor
            ref={editorRef}
            initialValue={content || ""} // 글 수정 시 사용
            initialEditType="markdown" // wysiwyg & markdown
            previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"} // tab, vertical
            hideModeSwitch={true}
            height={"calc(100vh - 64px - 178px)"}
            theme={isDarkMode ? "dark" : ""} // '' & 'dark'
            usageStatistics={false}
            toolbarItems={toolbarItems}
            useCommandShortcut={true}
            plugins={[
              colorSyntax,
              [codeSyntaxHighlight, { highlighter: Prism }],
            ]}
            placeholder="Good day to write!"
            customHTMLRenderer={{
              iframe(node: any) {
                return [
                  {
                    type: "openTag",
                    tagName: "iframe",
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: "html", content: node.childrenHTML },
                  {
                    type: "closeTag",
                    tagName: "iframe",
                    outerNewLine: false,
                  },
                ];
              },
              heading(node: any, { entering, getChildrenText }) {
                const tagName = `h${node.level}`;

                if (entering) {
                  return {
                    type: "openTag",
                    tagName,
                    classNames: [`tocAnchor`],
                    attributes: {
                      // id: getChildrenText(node).trim().replace(/\s+/g, "-"),
                      id: getChildrenText(node).trim(),
                    },
                  };
                }
                return { type: "closeTag", tagName };
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default WrtieEditor;
