import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-sql";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

import { useRecoilState } from "recoil";
import { themeState } from "../../../recoil/atom";
import useEditorStyles from "../useEditorStyles";
import { useEffect } from "react";
import { getUploadImageURL } from "../../../apis/fileApi";
import axios from "axios";
interface Props {
  content?: string;
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

  useEffect(() => {
    // 게시글에 이미지 붙여넣기 시 CF 서버에 업로드하는 addImageBlobHook
    const uploadImage = async (blob: string, callback: any) => {
      let formData = new FormData();
      formData.append("file", blob);

      const uploadURL = await getUploadImageURL();
      const uploadResult = await axios.post(uploadURL.data, formData);
      const url = `${process.env.NEXT_PUBLIC_CF_RECEIVE_URL}/${uploadResult.data.result.id}/post`;
      callback(url, "image");
    };

    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.removeHook("addImageBlobHook");
      editor.addHook("addImageBlobHook", uploadImage);
    }
  }, [editorRef]);

  return (
    <>
      {editorRef && (
        <div css={editorStyles}>
          <Editor
            ref={editorRef}
            initialValue={content || ""} // 글 수정 시 사용
            initialEditType="markdown" // wysiwyg & markdown
            previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"} // tab, vertical
            height={"calc(100vh - 64px - 178px)"}
            theme={isDarkMode ? "dark" : ""} // '' & 'dark'
            toolbarItems={toolbarItems}
            hideModeSwitch={true}
            usageStatistics={false}
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
