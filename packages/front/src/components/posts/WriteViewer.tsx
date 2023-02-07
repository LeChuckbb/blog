import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import useEditorStyles from "./useEditorStyles";
import styled from "@emotion/styled";
import IconArrowUp from "../../../public/icons/arrow_upward.svg";

const WriteViewer = ({ content }: any) => {
  const { editorStyles } = useEditorStyles();

  const FAB = () => {
    return (
      <FABContainer>
        <IconArrowUp />
      </FABContainer>
    );
  };

  return (
    <div css={editorStyles}>
      <Viewer
        initialValue={content || ""}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
      />
      {/* <FAB /> */}
    </div>
  );
};

export default WriteViewer;

const FABContainer = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15),
    0px 1px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  background: ${(props) => props.theme.colors.primary.primary};
  fill: ${(props) => props.theme.colors.primary.onPrimary};
`;
