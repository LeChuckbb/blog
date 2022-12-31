import React, {
  useState,
  useRef,
  FormEvent,
  MouseEvent,
  MutableRefObject,
} from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { FormInterface } from "../pages/post/write";

const useWrite = () => {
  const [tag, setTag] = useState("");
  const [tagsArray, setTagsArray] = useState(Array<string>);
  const editorRef = useRef<any>(null);
  const subPageRef = useRef<HTMLDivElement>(null);

  const onKeyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // 한글(복합문자) 입력시 끝 문자 이벤트가 한 번 더 발생하는 문제 방지
      if (event.nativeEvent.isComposing === false) {
        event.preventDefault(); // submit 방지
        setTagsArray((prev) => {
          // Set로 만들어서 배열 내 중복을 제거한 뒤 다시 배열로 반환
          const set = new Set([...prev, tag]);
          return Array.from(set);
        });
        setTag("");
      }
    }
  };

  const onValidSubmit: SubmitHandler<FormInterface> = (data: any) => {
    try {
      // toast 종료하기
      toast.dismiss();
      // data set하여 subPage로 props로 전달하기
      console.log("submit!!!");
      console.log(data);

      if (subPageRef.current != null) {
        subPageRef.current.className = subPageRef.current.className.replace(
          "hide",
          "show"
        );
      }
      data.title === "" && toast("제목을 입력해주세요", { toastId: "title" });
      // 본문을 markdown으로 저장
      const editorIns = editorRef?.current?.getInstance();
      const contentMark = editorIns.getMarkdown();
      const contentHTML = editorIns.getHTML();

      if (contentMark?.length === 0) {
        throw new Error("본문 내용을 입력해주세요.");
      }

      console.log(contentMark);
      console.log(contentHTML);
    } catch (error) {
      console.log(error);
    }
  };

  const onInvalidSubmit = (errors: any) => {
    errors.title.message && toast(errors.title.message, { toastId: "title" });
  };

  const onClickRemoveTagHandler = (clickedIdx: number) => {
    const result = tagsArray.filter((el, index) => index !== clickedIdx);
    setTagsArray(result);
  };

  return {
    editorRef,
    subPageRef,
    tagsArray,
    tag,
    setTag,
    onKeyDownHandler,
    onValidSubmit,
    onInvalidSubmit,
    onClickRemoveTagHandler,
  };
};

export default useWrite;
