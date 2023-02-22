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
  ref?: any;
  registerOptions?: {};
}

export interface ContextProps {
  onFocusHandler: any;
  onChangeHandler: any;
  onBlurHandler: any;
  setPopulatedIfDateNull: any;
  id: string;
  errors: any;
}

export const Context = createContext<ContextProps>({
  onFocusHandler: () => {},
  onChangeHandler: () => {},
  onBlurHandler: () => {},
  setPopulatedIfDateNull: () => {},
  id: "",
  errors: {},
});

const useTextField = (id: any, getValues: any) => {
  const [isInputPopulated, setIsInputPopulated] = useState(
    getValues && getValues(id) !== "" ? true : false
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value !== ""
      ? setIsInputPopulated(true)
      : setIsInputPopulated(false);
  };
  const onFocusHandler = () => setIsInputFocused(true);
  const onBlurHandler = () => setIsInputFocused(false);

  const setPopulatedIfDateNull = () => {
    if (getValues("date") === null) setIsInputPopulated(false);
    else setIsInputPopulated(true);
  };

  return {
    onChangeHandler,
    onFocusHandler,
    onBlurHandler,
    setPopulatedIfDateNull,
    isInputPopulated,
    isInputFocused,
  };
};

export default useTextField;
