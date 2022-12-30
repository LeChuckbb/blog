import { useState, useRef, FormEvent, MouseEvent } from "react";

const useWrite = () => {
  const [tag, setTag] = useState("");
  const [tagsArray, setTagsArray] = useState(Array<string>);
  const ref = useRef<any>(null);

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

  const onSubmitHandler = (event: FormEvent) => {
    try {
      event.preventDefault();
      console.log("submit!!!");
      // 본문을 markdown으로 저장
      const editorIns = ref?.current?.getInstance();
      const contentMark = editorIns.getMarkdown();

      if (contentMark?.length === 0) {
        throw new Error("본문 내용을 입력해주세요.");
      }
      console.log(contentMark);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickRemoveTagHandler = (clickedIdx: number) => {
    const result = tagsArray.filter((el, index) => index !== clickedIdx);
    setTagsArray(result);
  };

  return {
    ref,
    tagsArray,
    tag,
    setTag,
    onKeyDownHandler,
    onSubmitHandler,
    onClickRemoveTagHandler,
  };
};

export default useWrite;
