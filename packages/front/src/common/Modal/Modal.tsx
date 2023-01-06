import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { modalState } from "./ModalSetter";

interface Props {
  children?: React.ReactNode;
}

interface ButtonProps extends Props {
  confirmHandler: () => unknown;
}

const Modal = ({ children }: Props) => {
  return (
    <Container>
      <ModalBody>{children}</ModalBody>
    </Container>
  );
};

Modal.Title = ({ children }: Props) => {
  return <Title>{children}</Title>;
};

Modal.Content = ({ children }: Props) => {
  return <p style={{ marginBottom: "32px" }}>{children}</p>;
};

Modal.Buttons = ({ confirmHandler }: ButtonProps) => {
  const [{ isOpen, content }, setModal] = useRecoilState(modalState);

  return (
    <ButtonWrapper>
      <button onClick={() => setModal({ isOpen: false, content })}>취소</button>
      <button onClick={confirmHandler} style={{ color: "green" }}>
        확인
      </button>
    </ButtonWrapper>
  );
};

const Container = styled.div({
  maxWidth: "456px",
  position: "relative",
  width: "100%",
});

const ModalBody = styled.div({
  borderRadius: "8px",
  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
  background: "#fff",
  maxHeight: "calc(100vh - 16px)",
  overflow: "hidden auto",
  position: "relative",
  paddingBlock: "32px",
  paddingInline: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

export default Modal;
