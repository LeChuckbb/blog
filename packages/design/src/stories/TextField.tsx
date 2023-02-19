/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext } from "react";
import useTextField, {
  TextFieldProps,
  ContextProps,
  Context,
} from "../hooks/useTextField";

/* TextField 8가지 상태
  1. Enabled (Empty)
  2. Focused (Empty) 라벨 up / 라벨, 보더하단 색상 primary로 변경
  3. Hovered (Empty)
  4. Disabled (Empty)
  
  1. Enabled (Populated) 라벨 up
  2. Focused (Populated) 라벨 up / 라벨, 보더하단 색상 primary로 변경
  3. Hovered (Populated) 라벨 up
  4. Disabled (Populated) 라벨 up

  6가지 에러 상태
  1. Enabled (Empty) 라벨, 보더하단, 헬퍼텍스트 색상 error로 변경
  2. Focused (Empty) 라벨 up / 라벨, 보더하단, 헬퍼텍스트 색상 변경
  3. Hovered (Empty) 헬퍼텍스트 색상 변경

  1. Enabled (Populated) 라벨 up / 라벨, 보더하단, 헬퍼텍스트 색상 변경
  2. Focused (Populated) 라벨 up / 라벨, 보더하단, 헬퍼텍스트 색상 변경
  3. Hovered (Populated) 라벨 up / 헬퍼텍스트 색상 변경
*/

const TextField = ({ children }: any) => {
  const {
    onChangeHandler,
    onFocusHandler,
    onBlurHandler,
    inputRef,
    isInputPopulated,
    isInputFocused,
  } = useTextField();

  console.log(`populated : ${isInputPopulated}`);
  console.log(`Focused : ${isInputFocused}`);

  return (
    <Context.Provider
      value={{
        onChangeHandler,
        onFocusHandler,
        onBlurHandler,
        inputRef,
      }}
    >
      <Container
        className="Container"
        isInputPopulated={isInputPopulated}
        isInputFocused={isInputFocused}
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
  children,
  variant = "filled",
  type = "text",
  id,
  registerOptions,
  register,
  ...props
}: TextFieldProps) => {
  const { onFocusHandler, onChangeHandler, onBlurHandler, inputRef } =
    useContext<ContextProps>(Context);
  const { ref } = register(id);
  console.log(ref);
  console.log(ref.current);

  return (
    <Input
      id={id}
      type={type}
      autoComplete="new-password"
      onChange={onChangeHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      ref={inputRef}
      {...(register && register(id, registerOptions))}
      {...props}
    ></Input>
  );
};

TextField.Label = ({ label, inputId }: any) => {
  return <Label htmlFor={inputId}>{label}</Label>;
};

TextField.SupportBox = () => {
  return (
    <SupportBox>
      <HelperText>helper</HelperText>
      <Counter>5/20</Counter>
    </SupportBox>
  );
};

export default TextField;

const Container = styled.div<{
  isInputPopulated: boolean;
  isInputFocused: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  & .Box {
    border-bottom-width: ${(props) => (props.isInputFocused ? "2px" : "1px")};
    border-bottom-color: ${(props) =>
      props.isInputPopulated || props.isInputFocused
        ? props.theme.colors.primary.primary
        : ""};
  }
  & label {
    color: ${(props) =>
      props.isInputFocused ? props.theme.colors.primary.primary : ""};
  }

  /* 
    1. 인풋이 포커스되어있는 경우
    2. 인풋이 valid하고, text가 차 있는 경우 (labelUp)
  */
  & input:focus + label {
    transform: translate(0px, -12px);
    font-size: 12px;
  }
  & input + label {
    transform: ${(props) => props.isInputPopulated && "translate(0px, -12px)"};
    font-size: ${(props) => props.isInputPopulated && "12px"};
  }
`;

const Box = styled.div`
  box-sizing: border-box;
  position: relative;
  height: 56px;
  padding: 8px 16px; // with icon => 8px 12px
  border-radius: 4px 4px 0px 0px;
  border-bottom: 1px solid;
  border-bottom-color: ${(props) =>
    props.theme.colors.neutralVariant
      .onSurfaceVariant}; // enabled시 primary 변경
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.surfaceVariant};
`;

const Label = styled.label`
  position: absolute;
  top: 20px;
  left: 16px;
  font-size: 16px;
  color: ${(props) =>
    props.theme.colors.neutralVariant
      .onSurfaceVariant}; // enabled시 primary로 변경
  transition: transform 0.2s cubic-bezier(0, 0, 0.2, 1) 0ms,
    font-size 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
`;

const Input = styled.input`
  border: none;
  background-color: inherit;
  margin-top: 20px;
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

const SupportBox = styled.div`
  margin: 0;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 0px 16px;
`;

const HelperText = styled.p`
  margin: 0;
`;

const Counter = styled.p`
  margin: 0;
`;
