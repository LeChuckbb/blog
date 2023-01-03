import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

const WriteViewer = ({ content }: any) => {
  console.log(content);
  return (
    <Viewer
      initialValue={content || ""}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
    />
  );
};

export default WriteViewer;
