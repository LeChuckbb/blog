import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import useEditorStyles from "./useEditorStyles";
import styled from "@emotion/styled";
import IconArrowUp from "../../../public/icons/arrow_upward.svg";
import { useEffect, useRef } from "react";
import useTOCIntersectionObservation from "design/src/hooks/useTOCIntersectionObservation";

const WriteViewer = ({
  html,
  setObserverEntries,
  setAnchorClickHandler,
}: any) => {
  const { editorStyles } = useEditorStyles();
  const ref = useRef<HTMLDivElement | null>(null);
  const { entry, anchorOnClickHandler, mouseWheelActiveRef, anchorClickedRef } =
    useTOCIntersectionObservation(ref, {});

  const FAB = () => {
    return (
      <FABContainer>
        <IconArrowUp />
      </FABContainer>
    );
  };

  // 25분
  useEffect(() => {
    setObserverEntries(entry);
    setAnchorClickHandler(() => anchorOnClickHandler);
  }, [entry, anchorOnClickHandler]);

  return (
    <div css={editorStyles} ref={ref}>
      <Viewer
        initialValue={html || ""}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
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
              { type: "closeTag", tagName: "iframe", outerNewLine: false },
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
