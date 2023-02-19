import { useRef, useState, createContext, useEffect } from "react";

type Variant = "filled" | "outlined";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  register?: any;
  registerOptions?: {};
}

export interface ContextProps {
  onFocusHandler: any;
  onChangeHandler: any;
  onBlurHandler: any;
  inputRef: any;
}

export const Context = createContext<ContextProps>({
  onFocusHandler: () => {},
  onChangeHandler: () => {},
  onBlurHandler: () => {},
  inputRef: null,
});

const useTextField = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputPopulated, setIsInputPopulated] = useState(
    inputRef?.current?.value != undefined && inputRef?.current?.value != ""
      ? true
      : false
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

  console.log(inputRef);
  console.log(inputRef?.current);
  console.log(inputRef?.current?.value);
  console.log(isInputPopulated);

  useEffect(() => {
    console.log(inputRef?.current);
    console.log(inputRef?.current?.value);
    if (inputRef.current) {
      inputRef.current.value === ""
        ? setIsInputPopulated(false)
        : setIsInputPopulated(true);
    }
  }, [inputRef]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    event.target.value !== ""
      ? setIsInputPopulated(true)
      : setIsInputPopulated(false);
  const onFocusHandler = () => setIsInputFocused(true);
  const onBlurHandler = () => setIsInputFocused(false);

  return {
    onChangeHandler,
    onFocusHandler,
    onBlurHandler,
    inputRef,
    isInputPopulated,
    isInputFocused,
  };
};

export default useTextField;
