import { useState, createContext } from "react";

export type Variant = "outlined" | "filled";

export type ContainerProps = {
  children: React.ReactNode;
  id: string;
  getValues?: (id: string) => any;
  variant?: Variant;
  support?: boolean;
  multiline?: boolean;
  errors?: any;
};
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: any;
  registerOptions?: {};
}

export interface ContextProps {
  onFocusHandler: any;
  onChangeHandler: any;
  onBlurHandler: any;
  id: string;
  errors: any;
}

export const Context = createContext<ContextProps>({
  onFocusHandler: () => {},
  onChangeHandler: () => {},
  onBlurHandler: () => {},
  id: "",
  errors: {},
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
