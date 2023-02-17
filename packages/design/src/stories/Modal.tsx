import styled from "@emotion/styled";
import { Button } from "./Button";

type Variant = "basic" | "full";

interface Props {
  children?: React.ReactNode;
  variant?: Variant;
}

interface ButtonProps extends Props {
  confirmHandler: () => unknown;
  content?: any;
  setModal?: any;
}

const Modal = ({ children, variant = "basic" }: Props) => {
  return (
    <Container className="Container">
      <ModalBody className="ModalBody">{children}</ModalBody>
    </Container>
  );
};

Modal.Title = ({ children }: Props) => {
  return <Title>{children}</Title>;
};

Modal.Content = ({ children }: Props) => {
  return <p>{children}</p>;
};

Modal.Buttons = ({ confirmHandler, content, setModal }: ButtonProps) => {
  return (
    <ButtonWrapper>
      <Button
        variant="text"
        onClick={() => setModal({ isOpen: false, content })}
      >
        취소
      </Button>
      <Button variant="text" onClick={confirmHandler}>
        확인
      </Button>
    </ButtonWrapper>
  );
};

const Container = styled.div`
  min-width: 456px;
  max-width: 560px;
  width: fit-content;
  position: relative;
`;

const ModalBody = styled.div`
  border-radius: 28px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background-color: ${(props) =>
    props.theme.colors.neutralVariant.surfaceVariant};
  max-height: calc(100vh - 16px);
  overflow: hidden auto;
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fonts.title.large.size};
  font-weight: ${(props) => props.theme.fonts.title.large.weight};
  line-height: ${(props) => props.theme.fonts.title.large.lineHeight};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

export default Modal;
