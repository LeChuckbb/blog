/* eslint-disable react-hooks/rules-of-hooks */
import styled from "@emotion/styled";
import { useContext } from "react";
import useTextField, {
  InputProps,
  ContextProps,
  Context,
  ContainerProps,
  Variant,
} from "../hooks/useTextField";

const TextField = ({
  children,
  id,
  getValues,
  support = false,
  multiline = false,
  variant = "filled",
  errors,
}: ContainerProps) => {
  const {
    onChangeHandler,
    onFocusHandler,
    onBlurHandler,
    isInputPopulated,
    isInputFocused,
  } = useTextField(id, getValues);

  console.log(id);
  console.log(isInputPopulated);
  console.log(getValues && getValues(id));

  return (
    <Context.Provider
      value={{
        onChangeHandler,
        onFocusHandler,
        onBlurHandler,
        errors,
        id,
      }}
    >
      <Container
        className="Container"
        isInputPopulated={isInputPopulated}
        isInputFocused={isInputFocused}
        support={support}
        variant={variant}
        errors={errors}
        multiline={multiline}
      >
        {children}
      </Container>
    </Context.Provider>
  );
};

TextField.InputBox = ({ children }: any) => {
  return <Box className="Box">{children}</Box>;
};

TextField.Input = ({
  type = "text",
  registerOptions,
  register,
  ref,
  onChange,
  ...props
}: InputProps) => {
  const { onFocusHandler, onChangeHandler, onBlurHandler, id } =
    useContext<ContextProps>(Context);

  // datePicker용 onChange + common onChagneHanlder
  const ChangeHanlder = (event: any) => {
    onChangeHandler(event);
    onChange && onChange(event);
  };

  return (
    <Input
      type={type}
      id={id}
      autoComplete="new-password"
      onFocus={onFocusHandler}
      onChange={register === undefined && ChangeHanlder}
      {...(register &&
        register(id, {
          onChange: onChange ? onChange : onChangeHandler,
          onBlur: onBlurHandler,
          ...registerOptions,
        }))}
      ref={ref}
      {...props}
    ></Input>
  );
};

TextField.Area = ({ register, registerOptions, ...props }: any) => {
  const { id, onChangeHandler, onBlurHandler } =
    useContext<ContextProps>(Context);
  return (
    <TextArea
      {...(register &&
        register(id, {
          onChange: onChangeHandler,
          onBlur: onBlurHandler,
          ...registerOptions,
        }))}
      {...props}
    />
  );
};

TextField.Label = ({ label }: any) => {
  const { id } = useContext<ContextProps>(Context);

  return <Label htmlFor={id}>{label}</Label>;
};

TextField.SupportBox = ({ watch }: any) => {
  const { id, errors } = useContext<ContextProps>(Context);
  const num = watch(id)?.length;

  return (
    <SupportBox>
      <HelperText>{errors?.message}</HelperText>
      <Counter>{num}/150</Counter>
    </SupportBox>
  );
};

export default TextField;

const Container = styled.div<{
  isInputPopulated: boolean;
  isInputFocused: boolean;
  variant: Variant;
  support: boolean;
  multiline: boolean;
  errors: any;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: ${(props) => props.support && "24px"};
  height: ${(props) => (props.multiline ? "auto" : "56px")};

  & .Box {
    padding: ${(props) => (props.multiline ? "16px" : "8px 16px")};
    border: ${(props) => props.variant === "outlined" && "1px solid"};
    border-bottom: ${(props) => props.variant === "filled" && "1px solid"};
    border-color: ${(props) =>
      props.errors !== undefined
        ? props.theme.colors.error.error
        : props.isInputPopulated || props.isInputFocused
        ? props.theme.colors.primary.primary
        : props.theme.colors.neutralVariant.outline};
    border-width: ${(props) => (props.isInputFocused ? "2px" : "1px")};

    background-color: ${(props) =>
      props.variant === "filled"
        ? props.theme.colors.neutralVariant.surfaceVariant
        : props.theme.colors.neutral.background};
  }
  & label {
    color: ${(props) =>
      props.errors != undefined
        ? props.theme.colors.error.error
        : props.isInputFocused
        ? props.theme.colors.primary.primary
        : ""};
    background-color: ${(props) =>
      props.variant === "outlined" && props.theme.colors.neutral.background};
    padding: ${(props) => props.variant === "outlined" && "0px 4px"};
  }
  & input {
    margin-top: ${(props) => (props.variant === "filled" ? "16px" : "8px")};
  }
  & input:focus + label,
  & textarea:focus + label {
    transform: ${(props) =>
      props.variant === "filled"
        ? "translate(0px, -12px)"
        : "translate(0px, -26px)"};
    font-size: 12px;
  }
  & input + label,
  & textarea + label {
    transform: ${(props) =>
      props.isInputPopulated
        ? props.variant === "filled"
          ? "translate(0px, -12px)"
          : "translate(0px, -26px)"
        : ""};
    font-size: ${(props) => props.isInputPopulated && "12px"};
  }
`;

const Box = styled.div`
  box-sizing: border-box;
  position: relative;
  border-radius: 4px 4px 0px 0px;
  height: 100%;
  min-height: 56px;
`;

const Label = styled.label`
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 16px;
  letter-spacing: 0.4px;
  color: ${(props) =>
    props.theme.colors.neutralVariant
      .onSurfaceVariant}; // enabled시 primary로 변경
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1) 0ms;
`;

const Input = styled.input`
  border: none;
  background-color: inherit;
  color: ${(props) => props.theme.colors.neutral.onSurface} !important;
  outline: none;
  font-size: 16px;
  :valid:focus + label {
    color: ${(props) => props.theme.colors.primary.primary};
  }
  :invalid + label {
    color: ${(props) => props.theme.colors.error.error};
  }
`;

const TextArea = styled.textarea`
  border: none;
  background: none;
  width: 100%;
  resize: none;
  outline: none;
  display: flex;
  min-height: 92px;
  height: 100%;
`;

const SupportBox = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 0px 16px;
`;

const HelperText = styled.p`
  margin: 0;
  letter-spacing: 0.4px;
  color: ${(props) => props.theme.colors.error.error};
`;

const Counter = styled.p`
  margin: 0;
`;
