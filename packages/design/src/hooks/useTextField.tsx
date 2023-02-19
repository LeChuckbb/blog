import { useState, createContext } from "react";

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
  id: string;
}

export const Context = createContext<ContextProps>({
  onFocusHandler: () => {},
  onChangeHandler: () => {},
  onBlurHandler: () => {},
  id: "",
});

const useTextField = (id: any, getValues: any) => {
  const [isInputPopulated, setIsInputPopulated] = useState(
    getValues && getValues(id) != "" ? true : false
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

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
    isInputPopulated,
    isInputFocused,
  };
};

export default useTextField;
