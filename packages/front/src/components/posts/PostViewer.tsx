import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-sql";
import "@toast-ui/editor/dist/toastui-editor.css";
import useEditorStyles from "./useEditorStyles";
import { useEffect, useRef } from "react";
import { useState } from "react";

interface Props {
  html: string;
  setObserverEntry: any;
}

const PostViewer = ({ html, setObserverEntry }: Props) => {
  const { editorStyles } = useEditorStyles();
  const [parseHtml, setParseHtml] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);
  const HEADER_OFFSET_Y = 64;

  useEffect(() => {
    Prism.highlightAll();
    setParseHtml(html);
  }, []);

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
    <div css={editorStyles}>
      <div
        ref={ref}
        className="toastui-editor-contents"
        dangerouslySetInnerHTML={{ __html: parseHtml }}
      ></div>
    </div>
  );
};

export default PostViewer;
