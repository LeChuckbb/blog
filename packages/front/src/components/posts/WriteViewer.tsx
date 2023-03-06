import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import useEditorStyles from "./useEditorStyles";
import { useEffect, useRef } from "react";

type WriteViewerProps = {
  content: string;
  setObserverEntry: any;
};

const WriteViewer = ({ content, setObserverEntry }: WriteViewerProps) => {
  const { editorStyles } = useEditorStyles();
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);
  const HEADER_OFFSET_Y = 64;

  useEffect(() => {
    const ToCHandleScroll = () => {
      if (ref.current !== null) {
        let aboveHeaderUrl: string | null = null;
        const currentOffsetY = window.pageYOffset;
        const headerElements = ref.current.querySelectorAll(
          "h1,h2,h3"
        ) as NodeListOf<HTMLHeadingElement>;

        headerElements.forEach((elem) => {
          const { top } = elem.getBoundingClientRect();
          const elemTop = top + currentOffsetY;
          const isLast = elem === headerElements[headerElements.length - 1];
          if (currentOffsetY < elemTop - HEADER_OFFSET_Y) {
            // 아직 지나치지 않은 헤더들.
            aboveHeaderUrl
              ? setObserverEntry(aboveHeaderUrl)
              : setObserverEntry("");
          } else {
            // 헤더가 최상단에 도착하면 여기서 Set
            // top이 -가 되면 여기 출력됨. -가 된다는 건 이미 지나친 스크롤을 의미
            isLast
              ? setObserverEntry(elem.innerText)
              : (aboveHeaderUrl = elem.innerText);
          }
        });
      }
    };

    const throttleScroll = () => {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          ToCHandleScroll();
          timeoutRef.current = null;
        }, 300);
      }
    };
    window.addEventListener("scroll", throttleScroll);
    return () => {
      window.removeEventListener("scroll", throttleScroll);
    };
  }, [setObserverEntry]);

  return (
    <div css={editorStyles} ref={ref} className="WriterViewer">
      <Viewer
        initialValue={content || ""}
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
                  id: getChildrenText(node).trim(),
                },
              };
            }
            return { type: "closeTag", tagName };
          },
        }}
      />
    </div>
  );
};

export default WriteViewer;
