import React, { useState, useRef, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { FormInterface } from "../pages/post/write";
import useMyToast from "./useMyToast";

interface Body {
  title: string;
  tags: string[];
  html: any;
  markdown: any;
}

const useWrite = (data: any) => {
  const [tag, setTag] = useState("");
  const [isTagInputFocusIn, setIsTagInputFocusIn] = useState(false);
  const [tagsArray, setTagsArray] = useState(Array<string>);
  const [postFetchBody, setPostFetchBody] = useState<Body>({
    title: "",
    tags: [],
    html: "",
    markdown: "",
  });
  const editorRef = useRef<any>(null);
  const subPageRef = useRef<HTMLDivElement>(null);
  const { callToast } = useMyToast();

  useEffect(() => {
    if (data?.tags != undefined) setTagsArray(data?.tags);
  }, []);

  const onKeyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // 한글(복합문자) 입력시 끝 문자 이벤트가 한 번 더 발생하는 문제 방지
      if (event.nativeEvent.isComposing === false) {
        event.preventDefault(); // submit 방지
        setTagsArray((prev: any) => {
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
      // 본문을 markdown으로 저장
      const editorIns = editorRef?.current?.getInstance();
      const contentMark = editorIns.getMarkdown();
      const contentHTML = editorIns.getHTML();

      if (contentMark?.length === 0) {
        // subpage로 이동하지 말아야 함.
        callToast('본문 내용을 입력해주세요.', 'content')
        throw new Error("본문 내용을 입력해주세요.");
      }

      if (subPageRef.current != null) {
        subPageRef.current.className = subPageRef.current.className.replace(
          "hide",
          "show"
        );
      }

      setPostFetchBody({
        title: data.title,
        tags: tagsArray,
        html: contentHTML,
        markdown: contentMark,
      });
    } catch (error) {
      console.log(error);
      console.log("onValidSubmit Error");
    }
  };

  const onInvalidSubmit = (errors: any) => {
    errors.title.message && callToast(errors.title.message, 'title');
  };

  const onClickRemoveTagHandler = (clickedIdx: number) => {
    const result = tagsArray.filter(
      (_: any, index: any) => index !== clickedIdx
    );
    setTagsArray(result);
  };

  const getTagInputProps =({...otherProps} ={}) => ({
    value: tag,
    onKeyDown: onKeyDownHandler,
    onFocus: () => setIsTagInputFocusIn(true),
    onBlur: () => setIsTagInputFocusIn(false),
    onChange: (event:any) => setTag(event?.target.value),
    ...otherProps
  })

  const getWriteSubPageProps = () => ({
    postFetchBody,
    subPageRef,
  })

  return {
    editorRef,
    tagsArray,
    isTagInputFocusIn,
    onValidSubmit,
    onInvalidSubmit,
    onClickRemoveTagHandler,
    getTagInputProps,
    getWriteSubPageProps,
  };
};

export default useWrite;
